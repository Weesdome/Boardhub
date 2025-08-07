"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { BoardCard } from "@/components/board-card";
import { CreateBoardModal } from "@/components/create-board-modal";
import { BoardSkeleton } from "@/components/board-skeleton";

interface Board {
    _id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await fetch("/api/boards");
            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                throw new Error("Failed to fetch boards");
            }
            const data = await response.json();
            setBoards(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBoard = async (title: string, description: string) => {
        try {
            const response = await fetch("/api/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to create board");
            }

            const data = await response.json();
            setBoards([data.board, ...boards]);
            setShowCreateModal(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateBoard = async (boardId: string, title: string, description: string) => {
        try {
            const response = await fetch(`/api/boards/${boardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to update board");
            }

            const updatedBoard = await response.json();
            setBoards(boards.map(board =>
                board._id === boardId ? updatedBoard : board
            ));
            setEditingBoard(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        if (!confirm("Are you sure you want to delete this board?")) {
            return;
        }

        try {
            const response = await fetch(`/api/boards/${boardId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete board");
            }

            setBoards(boards.filter(board => board._id !== boardId));
        } catch (err: any) {
            setError(err.message);
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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Boards
                        </h1>
                        <ThemeToggle />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <BoardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            My Boards
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Organize your work and collaborate with your team
                        </p>
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

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 backdrop-blur-sm">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Create Board Button */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Create New Board
                    </button>
                </div>

                {/* Boards Grid */}
                {boards.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg
                                className="w-12 h-12 text-purple-600 dark:text-purple-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            No boards yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Create your first board to get started with organizing your work
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Create Your First Board
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {boards.map((board) => (
                            <BoardCard
                                key={board._id}
                                board={board}
                                onEdit={() => setEditingBoard(board)}
                                onDelete={() => handleDeleteBoard(board._id)}
                                onClick={() => router.push(`/board/${board._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Board Modal */}
            {showCreateModal && (
                <CreateBoardModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateBoard}
                />
            )}

            {/* Edit Board Modal */}
            {editingBoard && (
                <CreateBoardModal
                    board={editingBoard}
                    onClose={() => setEditingBoard(null)}
                    onSubmit={(title, description) => handleUpdateBoard(editingBoard._id, title, description)}
                />
            )}
        </div>
    );
}
