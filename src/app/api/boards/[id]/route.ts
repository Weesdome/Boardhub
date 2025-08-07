import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Board from "@/models/Board";
import { getSession } from "@/lib/auth";

// GET - Fetch a specific board with lists and cards
export async function GET(
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

        const resolvedParams = await params;
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

        return NextResponse.json(board);
    } catch (error: any) {
        console.error("Fetch board error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update board title/description
export async function PUT(
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

        const { title, description } = await request.json();
        const resolvedParams = await params;

        const board = await Board.findOneAndUpdate(
            {
                _id: resolvedParams.id,
                userId: session.userId,
            },
            { title, description },
            { new: true }
        );

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(board);
    } catch (error: any) {
        console.error("Update board error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a board
export async function DELETE(
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

        const resolvedParams = await params;
        const board = await Board.findOneAndDelete({
            _id: resolvedParams.id,
            userId: session.userId,
        });

        if (!board) {
            return NextResponse.json(
                { error: "Board not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Board deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete board error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
