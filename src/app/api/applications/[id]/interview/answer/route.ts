import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import { 
  evaluateAnswerFlag, 
  calculateReadinessScore, 
  REQUIRED_DOCUMENTS 
} from "@/lib/prescreening";
import { FlagSeverity, ApplicationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { questionId, answerValue } = body;

    if (!questionId || answerValue === undefined || answerValue === null) {
      return NextResponse.json({ error: "questionId and answerValue are required." }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        interviewSessions: { orderBy: { createdAt: "desc" }, take: 1 },
        documents: true,
        flags: { where: { resolved: false } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Access check: Owner or CSR/Admin
    if (application.userId !== session.userId && session.role !== "CSR" && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let interviewSession = application.interviewSessions[0];
    if (!interviewSession) {
      interviewSession = await prisma.interviewSession.create({
        data: {
          applicationId: id,
          visaType: application.visaType,
        },
      });
    }

    // Find question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 1. Evaluate deterministic flag
    const flagResult = evaluateAnswerFlag(
      question.key,
      String(answerValue),
      application.departureDate,
      application.returnDate
    );

    // Upsert or create InterviewAnswer
    const existingAnswer = await prisma.interviewAnswer.findFirst({
      where: {
        sessionId: interviewSession.id,
        questionId: question.id,
      },
    });

    let answer;
    if (existingAnswer) {
      answer = await prisma.interviewAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          answerValue: String(answerValue),
          questionKey: question.key,
          questionText: question.questionText,
          isSkipped: false,
        },
      });
    } else {
      answer = await prisma.interviewAnswer.create({
        data: {
          sessionId: interviewSession.id,
          questionId: question.id,
          questionKey: question.key,
          questionText: question.questionText,
          answerValue: String(answerValue),
          isSkipped: false,
        },
      });
    }

    // 2. Handle CaseFlag in database
    if (flagResult.hasFlag && flagResult.code && flagResult.severity && flagResult.message) {
      // Check if flag already exists
      const existingFlag = await prisma.caseFlag.findFirst({
        where: {
          applicationId: id,
          code: flagResult.code,
          resolved: false,
        },
      });

      if (!existingFlag) {
        await prisma.caseFlag.create({
          data: {
            applicationId: id,
            sessionId: interviewSession.id,
            flagType: "STATUTORY_RULE",
            code: flagResult.code,
            severity: flagResult.severity,
            message: flagResult.message,
            resolved: false,
          },
        });
      }
    } else {
      // If user corrected answer, resolve flags related to this question
      if (question.key === "schengen_purpose" || question.key === "usb1_purpose") {
        await prisma.caseFlag.updateMany({
          where: {
            applicationId: id,
            code: "FLAG_PERMIT_MISMATCH",
            resolved: false,
          },
          data: { resolved: true, resolvedAt: new Date() },
        });
      } else if (question.key === "schengen_duration_days") {
        await prisma.caseFlag.updateMany({
          where: {
            applicationId: id,
            code: "FLAG_EXCESSIVE_DURATION_SCHENGEN",
            resolved: false,
          },
          data: { resolved: true, resolvedAt: new Date() },
        });
      }
    }

    // 3. Recalculate readiness score
    const allQuestions = await prisma.question.findMany({
      where: {
        OR: [
          { visaType: application.visaType },
          { visaType: "ALL" },
        ],
        isActive: true,
      },
    });

    const allAnswers = await prisma.interviewAnswer.findMany({
      where: { sessionId: interviewSession.id },
    });

    const activeFlags = await prisma.caseFlag.findMany({
      where: { applicationId: id, resolved: false },
    });

    const criticalFlags = activeFlags.filter((f: { severity: FlagSeverity }) => f.severity === FlagSeverity.CRITICAL).length;
    const warningFlags = activeFlags.filter((f: { severity: FlagSeverity }) => f.severity === FlagSeverity.WARNING).length;

    const requiredDocsList = REQUIRED_DOCUMENTS[application.visaType] || REQUIRED_DOCUMENTS.DEFAULT;
    const uploadedDocs = application.documents.length;

    const mandatoryQuestions = allQuestions.filter((q) => q.isMandatory);
    const answeredMandatory = mandatoryQuestions.filter((mq) =>
      allAnswers.some((a) => a.questionId === mq.id && a.answerValue)
    ).length;

    const readiness = calculateReadinessScore(
      mandatoryQuestions.length,
      answeredMandatory,
      requiredDocsList.length,
      uploadedDocs,
      criticalFlags,
      warningFlags
    );

    // Update application readiness score & status
    const newStatus = application.status === ApplicationStatus.DRAFT 
      ? ApplicationStatus.INTERVIEW_IN_PROGRESS 
      : application.status;

    await prisma.application.update({
      where: { id },
      data: {
        readinessScore: readiness.score,
        readinessDetails: readiness.formulaDetails,
        status: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      answer,
      flag: flagResult,
      readinessScore: readiness.score,
      readinessDetails: readiness.formulaDetails,
    });
  } catch (err) {
    console.error("Error saving interview answer:", err);
    return NextResponse.json({ error: "Failed to record interview answer" }, { status: 500 });
  }
}
