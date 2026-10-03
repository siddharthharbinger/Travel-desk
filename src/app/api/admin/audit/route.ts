import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const auditLogs = await prisma.auditLog.findMany({
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
        targetUser: { select: { id: true, name: true, email: true, role: true } },
        application: { select: { id: true, caseNumber: true, visaType: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ auditLogs });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    return NextResponse.json({ error: "Failed to fetch audit trail" }, { status: 500 });
  }
}
