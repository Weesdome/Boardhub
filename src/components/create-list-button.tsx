"use client";

import { useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

interface CreateListButtonProps {
    onCreateList: (title: string) => void;
    isCreating?: boolean;
}

export function CreateListButton({ onCreateList, isCreating: isCreatingFromProps = false }: CreateListButtonProps) {
    const [isCreatingLocal, setIsCreatingLocal] = useState(false);
    const [title, setTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreateList(title.trim());
            setTitle("");
            setIsCreatingLocal(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        } else if (e.key === "Escape") {
            setTitle("");
            setIsCreatingLocal(false);
        }
    };

    if (isCreatingLocal) {
        return (
            <div className="w-80 flex-shrink-0">
                <div className="bg-muted rounded-lg p-4">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                if (!title.trim()) {
                                    setIsCreatingLocal(false);
                                }
                            }}
                            className="w-full px-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                            placeholder="Enter list title..."
                            autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                type="submit"
                                className="px-3 py-1 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors"
                            >
                                Add List
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTitle("");
                                    setIsCreatingLocal(false);
                                }}
                                className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 flex-shrink-0">
            <button
                onClick={() => setIsCreatingLocal(true)}
                disabled={isCreatingFromProps}
                className="w-full h-12 bg-muted hover:bg-accent border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isCreatingFromProps ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                )}
                {isCreatingFromProps ? "Creating..." : "Add another list"}
            </button>
        </div>
    );
}

