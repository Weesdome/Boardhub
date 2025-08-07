"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
    card: {
        _id: string;
        title: string;
        description?: string;
        order: number;
    };
    onUpdateCard: (title: string, description?: string) => void;
    onDeleteCard: () => void;
    isDragging?: boolean;
}

export function Card({ card, onUpdateCard, onDeleteCard, isDragging = false }: CardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || "");
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isCardDragging,
    } = useSortable({
        id: card._id,
        data: {
            type: "card",
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isCardDragging ? 0.5 : 1,
    };

    const handleTitleSubmit = () => {
        if (title.trim() && (title !== card.title || description !== (card.description || ""))) {
            onUpdateCard(title.trim(), description.trim() || undefined);
        }
        setIsEditing(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleTitleSubmit();
        } else if (e.key === "Escape") {
            setTitle(card.title);
            setDescription(card.description || "");
            setIsEditing(false);
        }
    };

    const handleDeleteCard = () => {
        if (confirm("Are you sure you want to delete this card?")) {
            onDeleteCard();
        }
        setShowMenu(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-card rounded-lg shadow-sm border border-border p-3 cursor-pointer hover:shadow-md transition-all duration-200 ${isDragging ? "opacity-50" : ""}`}
            {...attributes}
            {...listeners}
        >
            {isEditing ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        className="w-full px-2 py-1 text-sm font-medium bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        placeholder="Card title"
                        autoFocus
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        className="w-full px-2 py-1 text-xs bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                        placeholder="Add a description..."
                        rows={2}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleTitleSubmit}
                            className="px-2 py-1 text-xs bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setTitle(card.title);
                                setDescription(card.description || "");
                                setIsEditing(false);
                            }}
                            className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <div onClick={() => setIsEditing(true)}>
                        <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                            {card.title}
                        </h4>
                        {card.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {card.description}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded"
                    >
                        <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>

                    {showMenu && (
                        <div className="absolute top-6 right-0 z-10 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[100px]">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-3 py-1 text-xs text-foreground hover:bg-accent flex items-center"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCard();
                                }}
                                className="w-full text-left px-3 py-1 text-xs text-destructive hover:bg-destructive/10 flex items-center"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}

