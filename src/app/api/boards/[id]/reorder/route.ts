import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// POST - Reorder lists and cards
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { lists } = await request.json();
        const resolvedParams = await params;

        if (!lists || !Array.isArray(lists)) {
            return NextResponse.json(
                { error: "Lists array is required" },
                { status: 400 }
            );
        }

        const board = await Board.findOne({
            _id: resolvedParams.id,
            userId: session.userId,
        });

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        // Update the entire lists array with new order
        board.lists = lists;
        await board.save();

        return NextResponse.json(
            { message: "Board reordered successfully", board },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Reorder error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

