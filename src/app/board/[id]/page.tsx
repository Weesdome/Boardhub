"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { BoardView } from "@/components/board-view";
import { BoardSkeleton } from "@/components/board-skeleton";

interface Board {
    _id: string;
    title: string;
    description?: string;
    lists: Array<{
        _id: string;
        title: string;
        order: number;
        cards: Array<{
            _id: string;
            title: string;
            description?: string;
            order: number;
        }>;
    }>;
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const loadBoard = async () => {
            const resolvedParams = await params;
            await fetchBoard(resolvedParams.id);
        };
        loadBoard();
    }, [params]);

    const fetchBoard = async (boardId: string) => {
        try {
            const response = await fetch(`/api/boards/${boardId}`);
            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                if (response.status === 404) {
                    router.push("/dashboard");
                    return;
                }
                throw new Error("Failed to fetch board");
            }
            const data = await response.json();
            setBoard(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshBoard = async () => {
        if (board) {
            await fetchBoard(board._id);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="flex justify-between items-center p-4 border-b border-border bg-card/80 backdrop-blur-sm">
                    <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg w-48 animate-pulse"></div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg w-16 animate-pulse"></div>
                    </div>
                </div>
                <div className="p-4">
                    <BoardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Error Loading Board
                    </h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Board Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        The board you're looking for doesn't exist or you don't have access to it.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">
                                {board.title}
                            </h1>
                            {board.description && (
                                <p className="text-sm text-muted-foreground">
                                    {board.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Board Content */}
            <BoardView board={board} onBoardUpdate={setBoard} onRefresh={refreshBoard} />
        </div>
    );
}
