import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, logAuditEvent } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";
import { calculateReadinessScore, REQUIRED_DOCUMENTS } from "@/lib/prescreening-rules";

// GET /api/applications - List applications for current user or CSR/Admin
export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const isStaff = session.role === "CSR" || session.role === "ADMIN";

    const whereClause: any = isStaff ? {} : { userId: session.userId };
    if (statusParam && statusParam !== "ALL") {
      whereClause.status = statusParam as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedCsr: { select: { id: true, name: true, email: true } },
        documents: { select: { id: true, documentType: true, originalFilename: true, status: true } },
        flags: { select: { id: true, code: true, severity: true, message: true, resolved: true } },
        decisions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications - Create new travel application
export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      visaType = "SCHENGEN_BUSINESS", 
      destinationCountry = "Germany", 
      travelPurpose = "Commercial Meetings",
      departureDate,
      returnDate
    } = body;

    // Generate unique corporate case number HB-2026-XXXX
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const caseNumber = `HB-2026-${randomHex}`;

    const depDate = departureDate ? new Date(departureDate) : null;
    const retDate = returnDate ? new Date(returnDate) : null;

    // Calculate initial readiness score
    const requiredDocsList = REQUIRED_DOCUMENTS[visaType] || REQUIRED_DOCUMENTS.DEFAULT;
    const initialScore = calculateReadinessScore(4, 0, requiredDocsList.length, 0, 0, 0);

    const application = await prisma.application.create({
      data: {
        caseNumber,
        userId: session.userId,
        visaType,
        destinationCountry,
        travelPurpose,
        departureDate: depDate,
        returnDate: retDate,
        status: ApplicationStatus.DRAFT,
        readinessScore: initialScore.score,
        readinessDetails: initialScore.formulaDetails,
        interviewSessions: {
          create: {
            visaType,
            isCompleted: false,
          },
        },
      },
      include: {
        interviewSessions: true,
      },
    });

    await logAuditEvent({
      actorId: session.userId,
      applicationId: application.id,
      action: "APPLICATION_CREATED",
      details: { caseNumber, visaType, destinationCountry },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("Error creating application:", err);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
