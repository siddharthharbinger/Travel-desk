import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import fs from "fs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        application: { select: { id: true, userId: true, caseNumber: true } },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Access check: Application owner or CSR/Admin
    const isOwner = document.application.userId === session.userId;
    const isStaff = session.role === "CSR" || session.role === "ADMIN";

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to download this document." },
        { status: 403 }
      );
    }

    // Verify file exists on disk
    if (!fs.existsSync(/*turbopackIgnore: true*/ document.filePath)) {
      return NextResponse.json(
        { error: "File not found on storage volume." },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.promises.readFile(document.filePath);

    await logAuditEvent({
      actorId: session.userId,
      applicationId: document.application.id,
      action: "DOCUMENT_DOWNLOADED",
      details: {
        documentId: document.id,
        fileName: document.originalFilename,
      },
    });

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", document.mimeType || "application/octet-stream");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(document.originalFilename)}"`
    );
    response.headers.set("Content-Length", document.fileSizeBytes.toString());

    return response;
  } catch (err) {
    console.error("Error downloading document:", err);
    return NextResponse.json({ error: "Failed to download document" }, { status: 500 });
  }
}
