import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import { ApplicationStatus, Role } from "@prisma/client";

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
        user: true,
        interviewSessions: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.userId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update status to SUBMITTED
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.SUBMITTED,
      },
    });

    // Mark interview session completed
    if (application.interviewSessions[0]) {
      await prisma.interviewSession.update({
        where: { id: application.interviewSessions[0].id },
        data: { isCompleted: true },
      });
    }

    // 1. Create applicant notification
    await prisma.notification.create({
      data: {
        userId: session.userId,
        title: "Application Submitted for CSR Review",
        message: `Your pre-screening dossier for case ${application.caseNumber} has been received. Our CSR team is conducting regulatory verification.`,
        linkUrl: `/dashboard?caseId=${application.id}`,
      },
    });

    // 2. Notify active CSRs
    const activeCsrs = await prisma.user.findMany({
      where: { role: Role.CSR, isActive: true },
    });

    for (const csr of activeCsrs) {
      await prisma.notification.create({
        data: {
          userId: csr.id,
          title: "New Case Received for Review",
          message: `Case ${application.caseNumber} (${application.visaType}) submitted by ${session.name}.`,
          linkUrl: `/review?caseId=${application.id}`,
        },
      });
    }

    // 3. Audit log
    await logAuditEvent({
      actorId: session.userId,
      applicationId: id,
      action: "APPLICATION_SUBMITTED",
      details: { caseNumber: application.caseNumber },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (err) {
    console.error("Error submitting application:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
