import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// GET - Fetch user's boards
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();

        const boards = await Board.find({ userId: session.userId })
            .select("title description createdAt updatedAt")
            .sort({ createdAt: -1 });

        return NextResponse.json(boards);
    } catch (error: any) {
        console.error("Fetch boards error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new board
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { title, description } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "Board title is required" },
                { status: 400 }
            );
        }

        const board = new Board({
            title,
            description,
            userId: session.userId,
            lists: [],
        });

        await board.save();

        return NextResponse.json(
            { message: "Board created successfully", board },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create board error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
