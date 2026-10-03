import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || (session.role !== "CSR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden: CSR or Admin role required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { decisionType, notes } = body;

    if (!decisionType || !notes) {
      return NextResponse.json({ error: "decisionType and notes are required." }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    let newStatus: ApplicationStatus = application.status;
    let notificationTitle = "";
    let notificationMsg = "";

    if (decisionType === "VERIFIED") {
      newStatus = ApplicationStatus.VERIFIED;
      notificationTitle = "Pre-Screening Dossier Verified";
      notificationMsg = `Case ${application.caseNumber} has been verified by Corporate Travel Operations. Proceeding to official consular appointment scheduling.`;
    } else if (decisionType === "MORE_INFO_REQUESTED") {
      newStatus = ApplicationStatus.MORE_INFO_REQUESTED;
      notificationTitle = "Action Required: Additional Information Requested";
      notificationMsg = `CSR reviewed case ${application.caseNumber}: "${notes}". Please upload the requested documentation or update your interview responses.`;
    } else if (decisionType === "ESCALATED") {
      newStatus = ApplicationStatus.ESCALATED;
      notificationTitle = "Case Escalated for Legal / Policy Review";
      notificationMsg = `Case ${application.caseNumber} has been escalated for specialized compliance review: "${notes}".`;
    }

    // 1. Create CaseDecision
    const decision = await prisma.caseDecision.create({
      data: {
        applicationId: id,
        actorId: session.userId,
        action: decisionType,
        notes,
        previousStatus: application.status,
        newStatus,
      },
    });

    // 2. Update Application Status & Assigned CSR
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: newStatus,
        assignedCsrId: session.userId,
      },
    });

    // 3. Create Notification for Applicant
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: notificationTitle,
        message: notificationMsg,
        linkUrl: `/dashboard?caseId=${application.id}`,
      },
    });

    // 4. Log Audit Event
    await logAuditEvent({
      actorId: session.userId,
      targetUserId: application.userId,
      applicationId: id,
      action: "CSR_CASE_DECISION",
      details: {
        decisionId: decision.id,
        decisionType,
        previousStatus: application.status,
        newStatus,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      decision,
      application: updatedApplication,
    });
  } catch (err) {
    console.error("Error creating case decision:", err);
    return NextResponse.json({ error: "Failed to record case decision" }, { status: 500 });
  }
}
