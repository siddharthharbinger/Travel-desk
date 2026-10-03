import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  validateCompanyEmail, 
  verifyPassword, 
  signSessionToken, 
  SESSION_COOKIE_NAME, 
  SESSION_MAX_AGE,
  IS_COOKIE_SECURE,
  checkLoginRateLimit,
  resetLoginRateLimit,
  logAuditEvent
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Company Domain Check (@harbingergroup.com)
    if (!validateCompanyEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Access is restricted to @harbingergroup.com corporate email addresses." },
        { status: 400 }
      );
    }

    // 2. Rate Limiting Check (per email & IP)
    const rateLimitKey = `${cleanEmail}:${ip}`;
    const rateLimit = checkLoginRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Too many failed attempts. Please wait ${rateLimit.waitMinutes} minutes before trying again.` 
        },
        { status: 429 }
      );
    }

    // 3. User Lookup
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Generic error to avoid exposing account existence
    const genericAuthError = "Invalid credentials or account is not authorized. Please contact your administrator.";

    if (!user || !user.isActive) {
      await logAuditEvent({
        action: "USER_LOGIN_FAILED",
        details: { email: cleanEmail, reason: !user ? "USER_NOT_FOUND" : "ACCOUNT_DEACTIVATED" },
        ipAddress: ip,
        userAgent,
      });
      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { 
          error: `Too many attempts, try again in ${waitMinutes} minutes.`,
          isLocked: true 
        },
        { status: 423 }
      );
    }

    // 4. Password Verification
    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      const newAttempts = user.failedLoginAttempts + 1;
      const isNowLocked = newAttempts >= 5;
      const lockDate = isNowLocked ? new Date(Date.now() + 15 * 60 * 1000) : user.lockedUntil;

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          failedLoginAttempts: newAttempts,
          lockedUntil: lockDate,
        },
      });

      await logAuditEvent({
        actorId: user.id,
        action: "USER_LOGIN_FAILED",
        details: { email: cleanEmail, reason: isNowLocked ? "ACCOUNT_LOCKED" : "INVALID_PASSWORD" },
        ipAddress: ip,
        userAgent,
      });

      if (isNowLocked) {
        return NextResponse.json(
          {
            error: "Too many attempts, try again in 15 minutes.",
            isLocked: true,
          },
          { status: 423 }
        );
      }

      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    // 5. Success - Reset rate limit & update user
    resetLoginRateLimit(rateLimitKey);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    // 6. Sign Session JWT
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      lastActive: Date.now(),
    });

    await logAuditEvent({
      actorId: user.id,
      action: "USER_LOGIN_SUCCESS",
      details: { role: user.role },
      ipAddress: ip,
      userAgent,
    });

    // Set HTTP-only Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
      redirectUrl: user.mustChangePassword
        ? "/change-password"
        : user.role === "CSR" || user.role === "ADMIN"
        ? "/review"
        : "/dashboard",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: IS_COOKIE_SECURE,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
