import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// PUT - Update list title
export async function PUT(
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

        const { title } = await request.json();
        const resolvedParams = await params;

        if (!title) {
            return NextResponse.json(
                { error: "List title is required" },
                { status: 400 }
            );
        }

        const board = await Board.findOneAndUpdate(
            {
                _id: resolvedParams.id,
                userId: session.userId,
                "lists._id": resolvedParams.listId,
            },
            {
                $set: {
                    "lists.$.title": title,
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

        return NextResponse.json(board);
    } catch (error: any) {
        console.error("Update list error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a list
export async function DELETE(
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

        const resolvedParams = await params;

        const board = await Board.findOneAndUpdate(
            {
                _id: resolvedParams.id,
                userId: session.userId,
            },
            {
                $pull: {
                    lists: { _id: resolvedParams.listId },
                },
            },
            { new: true }
        );

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "List deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete list error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

