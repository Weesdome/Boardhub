import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        await clearSession();

        return NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
