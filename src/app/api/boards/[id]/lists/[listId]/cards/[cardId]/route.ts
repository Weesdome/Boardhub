import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// PUT - Update card title/description
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; listId: string; cardId: string } }
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

        const board = await Board.findOneAndUpdate(
            {
                _id: resolvedParams.id,
                userId: session.userId,
                "lists._id": resolvedParams.listId,
                "lists.cards._id": resolvedParams.cardId,
            },
            {
                $set: {
                    "lists.$.cards.$[card].title": title,
                    "lists.$.cards.$[card].description": description,
                },
            },
            {
                new: true,
                arrayFilters: [{ "card._id": resolvedParams.cardId }],
            }
        );

        if (!board) {
            return NextResponse.json(
                { error: "Board, list, or card not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(board);
    } catch (error: any) {
        console.error("Update card error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a card
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; listId: string; cardId: string } }
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

        const resolvedParams = await params;

        const board = await Board.findOneAndUpdate(
            {
                _id: resolvedParams.id,
                userId: session.userId,
                "lists._id": resolvedParams.listId,
            },
            {
                $pull: {
                    "lists.$.cards": { _id: resolvedParams.cardId },
                },
            },
            { new: true }
        );

        if (!board) {
            return NextResponse.json(
                { error: "Board or list not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Card deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete card error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

