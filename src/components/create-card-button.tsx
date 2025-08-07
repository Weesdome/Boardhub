"use client";

import { useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

interface CreateCardButtonProps {
    onCreateCard: (title: string, description?: string) => void;
    isCreating?: boolean;
}

export function CreateCardButton({ onCreateCard, isCreating: isCreatingFromProps = false }: CreateCardButtonProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreateCard(title.trim(), description.trim() || undefined);
            setTitle("");
            setDescription("");
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        } else if (e.key === "Escape") {
            setTitle("");
            setDescription("");
            setIsCreating(false);
        }
    };

    if (isCreating) {
        return (
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Enter a title for this card..."
                    autoFocus
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                    placeholder="Add a more detailed description..."
                    rows={2}
                />
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors"
                    >
                        Add Card
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTitle("");
                            setDescription("");
                            setIsCreating(false);
                        }}
                        className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    return (
        <button
            onClick={() => setIsCreating(true)}
            disabled={isCreatingFromProps}
            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isCreatingFromProps ? (
                <LoadingSpinner size="sm" className="mr-2" />
            ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )}
            {isCreatingFromProps ? "Creating..." : "Add a card"}
        </button>
    );
}

