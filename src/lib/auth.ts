import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export interface SessionData {
    userId: string;
    email: string;
    name: string;
}

// Generate CSRF token
export function generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

// Get session from cookies
export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
        return null;
    }

    try {
        const session = JSON.parse(sessionCookie.value);
        return session;
    } catch {
        return null;
    }
}

// Set session in cookies
export async function setSession(sessionData: SessionData): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

// Clear session
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

// Verify CSRF token
export function verifyCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken;
}

// Middleware to check authentication
export async function requireAuth(request: NextRequest): Promise<SessionData> {
    const session = await getSession();

    if (!session) {
        throw new Error("Authentication required");
    }

    return session;
}
