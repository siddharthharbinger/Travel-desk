import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "traveldesk-super-secret-key-at-least-32-chars-long-2026"
);

export const SESSION_COOKIE_NAME = "traveldesk_session";
export const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in ms
export const IS_COOKIE_SECURE = 
  process.env.NODE_ENV === "production" && 
  process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") === true;

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  mustChangePassword?: boolean;
  lastActive: number;
}

// 1. Company Domain Check (@harbingergroup.com)
export function validateCompanyEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith("@harbingergroup.com");
}

// 2. Password Strength Check (At least 10 chars, strength score 0-4)
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  message?: string;
} {
  if (!password || password.length < 10) {
    return {
      valid: false,
      score: Math.min(1, Math.floor((password?.length || 0) / 3)),
      message: "Password must be at least 10 characters long.",
    };
  }

  let score = 1;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return {
    valid: score >= 2,
    score,
    message: score >= 2 ? undefined : "Include numbers, uppercase letters, or special characters.",
  };
}

// 3. Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 4. Session Token Signing & Verification
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const session = payload as unknown as SessionPayload;

    // Check idle timeout (30 minutes)
    const now = Date.now();
    if (session.lastActive && now - session.lastActive > IDLE_TIMEOUT_MS) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// 5. In-Memory Rate Limiter (5 attempts per 15 mins)
interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(key: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const record = loginRateLimitMap.get(key);
  if (!record) {
    loginRateLimitMap.set(key, { attempts: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (now - record.firstAttemptAt > windowMs) {
    // Reset window
    loginRateLimitMap.set(key, { attempts: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (record.attempts >= maxAttempts) {
    const remainingMs = windowMs - (now - record.firstAttemptAt);
    const waitMinutes = Math.ceil(remainingMs / 60000);
    return { allowed: false, waitMinutes };
  }

  record.attempts += 1;
  return { allowed: true };
}

export function resetLoginRateLimit(key: string): void {
  loginRateLimitMap.delete(key);
}

// 6. Get Current User Server Helper
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    // Check database to ensure user is active and exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// 7. Audit Log Helper
export async function logAuditEvent({
  actorId,
  targetUserId,
  applicationId,
  action,
  details,
  ipAddress,
  userAgent,
}: {
  actorId?: string | null;
  targetUserId?: string | null;
  applicationId?: string | null;
  action: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId ?? null,
        targetUserId: targetUserId ?? null,
        applicationId: applicationId ?? null,
        action,
        details: details ? JSON.stringify(details) : null,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to log audit event:", err);
  }
}
