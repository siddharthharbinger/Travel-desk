import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding TravelDesk database...");

  // 1. Seed Demo Accounts
  const customerEmail = (process.env.DEMO_CUSTOMER_EMAIL || "customer@harbingergroup.com").toLowerCase();
  const customerPass = process.env.DEMO_CUSTOMER_PASSWORD || "DemoCustomer2026!";

  const csrEmail = (process.env.DEMO_CSR_EMAIL || "csr@harbingergroup.com").toLowerCase();
  const csrPass = process.env.DEMO_CSR_PASSWORD || "DemoCSR2026!";

  const adminEmail = (process.env.DEMO_ADMIN_EMAIL || "admin@harbingergroup.com").toLowerCase();
  const adminPass = process.env.DEMO_ADMIN_PASSWORD || "DemoAdmin2026!";

  const [customerHash, csrHash, adminHash] = await Promise.all([
    bcrypt.hash(customerPass, 10),
    bcrypt.hash(csrPass, 10),
    bcrypt.hash(adminPass, 10),
  ]);

  const demoCustomer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: customerHash,
      name: "Demo Customer",
      role: Role.CUSTOMER,
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      email: customerEmail,
      passwordHash: customerHash,
      name: "Demo Customer",
      role: Role.CUSTOMER,
      isActive: true,
      mustChangePassword: false,
    },
  });

  const demoCsr = await prisma.user.upsert({
    where: { email: csrEmail },
    update: {
      passwordHash: csrHash,
      name: "Demo CSR",
      role: Role.CSR,
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      email: csrEmail,
      passwordHash: csrHash,
      name: "Demo CSR",
      role: Role.CSR,
      isActive: true,
      mustChangePassword: false,
    },
  });

  const demoAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      name: "Demo Admin",
      role: Role.ADMIN,
      isActive: true,
      mustChangePassword: false,
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: "Demo Admin",
      role: Role.ADMIN,
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log(`Seeded demo accounts:
  - Customer: ${demoCustomer.email}
  - CSR:      ${demoCsr.email}
  - Admin:    ${demoAdmin.email}`);

  // 2. Seed Starter Question Bank
  const questionsFilePath = path.join(process.cwd(), "src", "data", "question-bank.json");
  if (fs.existsSync(questionsFilePath)) {
    const questionsRaw = fs.readFileSync(questionsFilePath, "utf-8");
    const questionsData = JSON.parse(questionsRaw);

    for (const q of questionsData) {
      await prisma.question.upsert({
        where: { key: q.key },
        update: {
          visaType: q.visaType,
          stepCategory: q.stepCategory,
          orderIndex: q.orderIndex,
          questionText: q.questionText,
          helpText: q.helpText,
          responseType: q.responseType,
          options: q.options,
          isMandatory: q.isMandatory ?? true,
          flagTriggerRule: q.flagTriggerRule,
          isActive: true,
        },
        create: {
          key: q.key,
          visaType: q.visaType,
          stepCategory: q.stepCategory,
          orderIndex: q.orderIndex,
          questionText: q.questionText,
          helpText: q.helpText,
          responseType: q.responseType,
          options: q.options,
          isMandatory: q.isMandatory ?? true,
          flagTriggerRule: q.flagTriggerRule,
          isActive: true,
        },
      });
    }
    console.log(`Seeded ${questionsData.length} starter questions (Starter set, pending CSR team approval).`);
  }

  // 3. Optional Demo Cases (OFF by default, gated by SEED_DEMO_CASES=true)
  if (process.env.SEED_DEMO_CASES === "true") {
    console.log("SEED_DEMO_CASES=true detected. Seeding tagged demo applications...");
    const existingApp = await prisma.application.findFirst({
      where: { userId: demoCustomer.id },
    });

    if (!existingApp) {
      const today = new Date();
      const departure = new Date(today);
      departure.setDate(departure.getDate() + 14);
      const returnDate = new Date(departure);
      returnDate.setDate(returnDate.getDate() + 14);

      const demoApp = await prisma.application.create({
        data: {
          caseNumber: "TD-DEMO-001",
          userId: demoCustomer.id,
          assignedCsrId: demoCsr.id,
          visaType: "SCHENGEN_BUSINESS",
          destinationCountry: "Germany",
          travelPurpose: "Client Consultations & Contract Negotiations",
          departureDate: departure,
          returnDate: returnDate,
          status: "IN_REVIEW",
          readinessScore: 75,
          readinessDetails: JSON.stringify({
            mandatoryQuestionsAnswered: 4,
            totalMandatoryQuestions: 4,
            requiredDocsReceived: 2,
            totalRequiredDocs: 4,
            calculation: "50% (Questions) + 25% (Documents) = 75%",
          }),
        },
      });

      // Add a warning flag
      await prisma.caseFlag.create({
        data: {
          applicationId: demoApp.id,
          flagType: "DISCLOSURE",
          severity: "WARNING",
          code: "FLAG_PRIOR_REFUSAL",
          message: "Applicant reported prior visa refusal in 2023. Explanation document submitted for CSR review.",
          resolved: false,
        },
      });

      console.log(`Created demo application: ${demoApp.caseNumber}`);
    }
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
