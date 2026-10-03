import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  getCurrentUser, 
  verifyPassword, 
  hashPassword, 
  validatePasswordStrength,
  signSessionToken, 
  SESSION_COOKIE_NAME, 
  SESSION_MAX_AGE,
  IS_COOKIE_SECURE,
  logAuditEvent 
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json({ error: "New password is required." }, { status: 400 });
    }

    // 1. Password Policy Check (Min 10 chars, strength check)
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json(
        { error: strength.message || "Password does not meet corporate security standards." },
        { status: 400 }
      );
    }

    // 2. Fetch full user to verify current password (unless mustChangePassword was forced from temporary creation)
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (currentPassword) {
      const match = await verifyPassword(currentPassword, fullUser.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    // 3. Hash & Update
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    // 4. Update Session Token (mustChangePassword cleared)
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: false,
      lastActive: Date.now(),
    });

    await logAuditEvent({
      actorId: user.id,
      targetUserId: user.id,
      action: "PASSWORD_CHANGED",
      details: { forcedChangeResolved: fullUser.mustChangePassword },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully.",
      redirectUrl: user.role === "CSR" || user.role === "ADMIN" ? "/review" : "/dashboard",
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
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
