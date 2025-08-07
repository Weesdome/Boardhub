"use client";

import { useState } from "react";
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "./card";
import { CreateCardButton } from "./create-card-button";

interface ListProps {
    list: {
        _id: string;
        title: string;
        order: number;
        cards: Array<{
            _id: string;
            title: string;
            description?: string;
            order: number;
        }>;
    };
    onUpdateList: (listId: string, title: string) => void;
    onDeleteList: (listId: string) => void;
    onCreateCard: (listId: string, title: string, description?: string) => void;
    onUpdateCard: (listId: string, cardId: string, title: string, description?: string) => void;
    onDeleteCard: (listId: string, cardId: string) => void;
    isDragging?: boolean;
    isCreatingCard?: boolean;
}

export function List({
    list,
    onUpdateList,
    onDeleteList,
    onCreateCard,
    onUpdateCard,
    onDeleteCard,
    isDragging = false,
    isCreatingCard = false,
}: ListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(list.title);
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isListDragging,
    } = useSortable({
        id: list._id,
        data: {
            type: "list",
            list,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isListDragging ? 0.5 : 1,
    };

    const handleTitleSubmit = () => {
        if (title.trim() && title !== list.title) {
            onUpdateList(list._id, title.trim());
        }
        setIsEditing(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleTitleSubmit();
        } else if (e.key === "Escape") {
            setTitle(list.title);
            setIsEditing(false);
        }
    };

    const handleDeleteList = () => {
        if (confirm("Are you sure you want to delete this list? This will also delete all cards in it.")) {
            onDeleteList(list._id);
        }
        setShowMenu(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`w-80 flex-shrink-0 ${isDragging ? "opacity-50" : ""}`}
        >
            <div className="bg-muted rounded-lg p-4">
                {/* List Header */}
                <div className="flex items-center justify-between mb-4" {...attributes} {...listeners}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={handleTitleKeyDown}
                            className="flex-1 px-2 py-1 text-sm font-semibold bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="flex-1 text-sm font-semibold text-foreground cursor-pointer hover:bg-accent px-2 py-1 rounded"
                            onClick={() => setIsEditing(true)}
                        >
                            {list.title}
                        </h3>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-muted-foreground hover:text-foreground p-1 rounded"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 z-10 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[120px]">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteList}
                                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[100px]">
                    <SortableContext items={list.cards.map(card => card._id)} strategy={verticalListSortingStrategy}>
                        {list.cards.map((card) => (
                            <Card
                                key={card._id}
                                card={card}
                                onUpdateCard={(title, description) => onUpdateCard(list._id, card._id, title, description)}
                                onDeleteCard={() => onDeleteCard(list._id, card._id)}
                            />
                        ))}
                    </SortableContext>
                </div>

                {/* Create Card Button */}
                <div className="mt-4">
                    <CreateCardButton
                        onCreateCard={(title, description) => onCreateCard(list._id, title, description)}
                        isCreating={isCreatingCard}
                    />
                </div>
            </div>

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

