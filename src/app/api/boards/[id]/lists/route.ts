import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// POST - Add a new list to a board
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

        const { title } = await request.json();
        const resolvedParams = await params;

        if (!title) {
            return NextResponse.json(
                { error: "List title is required" },
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

        // Get the highest order number and add 1
        const maxOrder = board.lists.length > 0
            ? Math.max(...board.lists.map(list => list.order))
            : -1;

        const newList = {
            title,
            order: maxOrder + 1,
            cards: [],
        };

        board.lists.push(newList);
        await board.save();

        return NextResponse.json(
            { message: "List created successfully", list: newList },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create list error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
