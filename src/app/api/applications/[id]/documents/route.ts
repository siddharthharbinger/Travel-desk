import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import { validateMagicBytes, UPLOAD_DIR, calculateReadinessScore, REQUIRED_DOCUMENTS } from "@/lib/prescreening";
import { FlagSeverity, DocumentStatus } from "@prisma/client";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

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

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
        interviewSessions: { include: { answers: true } },
        flags: { where: { resolved: false } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Role check: Owner or CSR/Admin
    if (application.userId !== session.userId && session.role !== "CSR" && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as string) || "OTHER";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // 1. Size Check (<= 10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10 MB size limit. Please upload an optimized file under 10 MB." },
        { status: 400 }
      );
    }

    // 2. Magic Bytes Content Inspection
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const magicResult = validateMagicBytes(buffer);

    if (!magicResult.valid || !magicResult.detectedType) {
      return NextResponse.json(
        { error: magicResult.error || "File content does not match allowed types (PDF, PNG, JPEG)." },
        { status: 400 }
      );
    }

    // 3. Isolated Storage outside /public
    const appUploadDir = path.join(UPLOAD_DIR, id);
    if (!fs.existsSync(/*turbopackIgnore: true*/ appUploadDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ appUploadDir, { recursive: true });
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}_${sanitizedFileName}`;
    const filePath = path.join(appUploadDir, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    // 4. Save in Database
    const docRecord = await prisma.document.create({
      data: {
        applicationId: id,
        documentType,
        originalFilename: file.name,
        sanitizedFilename: sanitizedFileName,
        filePath,
        fileSizeBytes: file.size,
        mimeType: magicResult.detectedType,
        magicBytesVerified: true,
        status: DocumentStatus.UPLOADED,
      },
    });

    // 5. Recalculate Readiness Score
    const allQuestions = await prisma.question.findMany({
      where: {
        OR: [
          { visaType: application.visaType },
          { visaType: "ALL" },
        ],
        isActive: true,
      },
    });

    const activeSession = application.interviewSessions[0];
    const answeredCount = activeSession?.answers?.length || 0;
    const requiredDocsList = REQUIRED_DOCUMENTS[application.visaType] || REQUIRED_DOCUMENTS.DEFAULT;
    const updatedDocsCount = application.documents.length + 1;

    const criticalFlags = application.flags.filter((f: { severity: FlagSeverity }) => f.severity === FlagSeverity.CRITICAL).length;
    const warningFlags = application.flags.filter((f: { severity: FlagSeverity }) => f.severity === FlagSeverity.WARNING).length;

    const readiness = calculateReadinessScore(
      allQuestions.filter((q) => q.isMandatory).length,
      answeredCount,
      requiredDocsList.length,
      updatedDocsCount,
      criticalFlags,
      warningFlags
    );

    await prisma.application.update({
      where: { id },
      data: {
        readinessScore: readiness.score,
        readinessDetails: readiness.formulaDetails,
      },
    });

    await logAuditEvent({
      actorId: session.userId,
      applicationId: id,
      action: "DOCUMENT_UPLOADED",
      details: {
        documentId: docRecord.id,
        fileName: file.name,
        fileSize: file.size,
        mimeType: magicResult.detectedType,
      },
    });

    return NextResponse.json({
      success: true,
      document: docRecord,
      readinessScore: readiness.score,
    });
  } catch (err) {
    console.error("Error uploading document:", err);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
