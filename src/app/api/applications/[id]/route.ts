import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

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

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        assignedCsr: { select: { id: true, name: true, email: true } },
        interviewSessions: {
          include: {
            answers: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        flags: {
          orderBy: { createdAt: "asc" },
        },
        decisions: {
          include: {
            actor: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          include: {
            actor: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Role check: Only owner or CSR/Admin can view
    const isOwner = application.userId === session.userId;
    const isStaff = session.role === "CSR" || session.role === "ADMIN";

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Forbidden: Access restricted to case owner or authorized staff" }, { status: 403 });
    }

    // Fetch relevant question bank items for this visa type
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { visaType: application.visaType },
          { visaType: "ALL" },
        ],
        isActive: true,
      },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({ application, questions });
  } catch (err) {
    console.error("Error fetching application details:", err);
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
  }
}
