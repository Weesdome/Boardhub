import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// POST - Add a new card to a list
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string; listId: string } }
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

        const { title, description } = await request.json();
        const resolvedParams = await params;

        if (!title) {
            return NextResponse.json(
                { error: "Card title is required" },
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

        const list = board.lists.id(resolvedParams.listId);
        if (!list) {
            return NextResponse.json(
                { error: "List not found" },
                { status: 404 }
            );
        }

        // Get the highest order number and add 1
        const maxOrder = list.cards.length > 0
            ? Math.max(...list.cards.map(card => card.order))
            : -1;

        const newCard = {
            title,
            description,
            order: maxOrder + 1,
        };

        list.cards.push(newCard);
        await board.save();

        return NextResponse.json(
            { message: "Card created successfully", card: newCard },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create card error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
