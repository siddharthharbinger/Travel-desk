import { NextResponse } from "next/server";
import { getCurrentUser, SESSION_COOKIE_NAME, logAuditEvent } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user) {
      await logAuditEvent({
        actorId: user.id,
        action: "USER_LOGOUT",
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: true });
  }
}
