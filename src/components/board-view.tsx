"use client";

import { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { List } from "./list";
import { Card } from "./card";
import { CreateListButton } from "./create-list-button";
import { LoadingSpinner } from "./loading-spinner";

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

interface BoardViewProps {
    board: Board;
    onBoardUpdate: (board: Board) => void;
    onRefresh: () => Promise<void>;
}

export function BoardView({ board, onBoardUpdate, onRefresh }: BoardViewProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [creatingCards, setCreatingCards] = useState<Set<string>>(new Set());
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeCard = board.lists.flatMap(list => list.cards).find(card => card._id === activeId);
        const overList = board.lists.find(list => list._id === overId);
        const overCard = board.lists.flatMap(list => list.cards).find(card => card._id === overId);

        // Only handle card movements during drag over for real-time feedback
        if (activeCard && (overList || overCard)) {
            const sourceList = board.lists.find(list =>
                list.cards.some(card => card._id === activeId)
            );

            if (sourceList) {
                // Moving to a list (including empty lists)
                if (overList) {
                    const targetList = board.lists.find(list => list._id === overId);
                    if (targetList && sourceList._id !== targetList._id) {
                        const cardToMove = sourceList.cards.find(card => card._id === activeId);
                        if (cardToMove) {
                            const newSourceCards = sourceList.cards.filter(card => card._id !== activeId);
                            const newTargetCards = [...targetList.cards, { ...cardToMove, order: targetList.cards.length }];

                            const newLists = board.lists.map(list => {
                                if (list._id === sourceList._id) {
                                    return { ...list, cards: newSourceCards };
                                }
                                if (list._id === targetList._id) {
                                    return { ...list, cards: newTargetCards };
                                }
                                return list;
                            });

                            const updatedBoard = { ...board, lists: newLists };
                            onBoardUpdate(updatedBoard);
                        }
                    }
                }
                // Moving over a card for precise positioning
                else if (overCard) {
                    const targetList = board.lists.find(list =>
                        list.cards.some(card => card._id === overId)
                    );

                    if (targetList && sourceList._id !== targetList._id) {
                        const cardToMove = sourceList.cards.find(card => card._id === activeId);
                        if (cardToMove) {
                            const newSourceCards = sourceList.cards.filter(card => card._id !== activeId);
                            const targetCardIndex = targetList.cards.findIndex(card => card._id === overId);
                            const newTargetCards = [...targetList.cards];
                            newTargetCards.splice(targetCardIndex, 0, { ...cardToMove, order: targetCardIndex });

                            // Update order numbers for cards after the insertion point
                            for (let i = targetCardIndex + 1; i < newTargetCards.length; i++) {
                                newTargetCards[i] = { ...newTargetCards[i], order: i };
                            }

                            const newLists = board.lists.map(list => {
                                if (list._id === sourceList._id) {
                                    return { ...list, cards: newSourceCards };
                                }
                                if (list._id === targetList._id) {
                                    return { ...list, cards: newTargetCards };
                                }
                                return list;
                            });

                            const updatedBoard = { ...board, lists: newLists };
                            onBoardUpdate(updatedBoard);
                        }
                    }
                }
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeList = board.lists.find(list => list._id === activeId);
        const overList = board.lists.find(list => list._id === overId);
        const activeCard = board.lists.flatMap(list => list.cards).find(card => card._id === activeId);
        const overCard = board.lists.flatMap(list => list.cards).find(card => card._id === overId);

        // Reordering lists
        if (activeList && overList) {
            const oldIndex = board.lists.findIndex(list => list._id === activeId);
            const newIndex = board.lists.findIndex(list => list._id === overId);

            const newLists = arrayMove(board.lists, oldIndex, newIndex);
            const updatedBoard = { ...board, lists: newLists };
            onBoardUpdate(updatedBoard);
            updateBoardOrder(updatedBoard);
        }
        // Moving cards between lists (including to empty lists)
        else if (activeCard && overList) {
            const sourceList = board.lists.find(list =>
                list.cards.some(card => card._id === activeId)
            );
            const targetList = board.lists.find(list => list._id === overId);

            if (sourceList && targetList) {
                const cardToMove = sourceList.cards.find(card => card._id === activeId);
                if (cardToMove) {
                    const newSourceCards = sourceList.cards.filter(card => card._id !== activeId);
                    const newTargetCards = [...targetList.cards, { ...cardToMove, order: targetList.cards.length }];

                    const newLists = board.lists.map(list => {
                        if (list._id === sourceList._id) {
                            return { ...list, cards: newSourceCards };
                        }
                        if (list._id === targetList._id) {
                            return { ...list, cards: newTargetCards };
                        }
                        return list;
                    });

                    const updatedBoard = { ...board, lists: newLists };
                    onBoardUpdate(updatedBoard);
                    updateBoardOrder(updatedBoard);
                }
            }
        }
        // Moving cards over other cards (for precise positioning)
        else if (activeCard && overCard) {
            const sourceList = board.lists.find(list =>
                list.cards.some(card => card._id === activeId)
            );
            const targetList = board.lists.find(list =>
                list.cards.some(card => card._id === overId)
            );

            if (sourceList && targetList) {
                const cardToMove = sourceList.cards.find(card => card._id === activeId);
                if (cardToMove) {
                    // If moving within the same list
                    if (sourceList._id === targetList._id) {
                        const oldIndex = sourceList.cards.findIndex(card => card._id === activeId);
                        const newIndex = sourceList.cards.findIndex(card => card._id === overId);

                        const newCards = arrayMove(sourceList.cards, oldIndex, newIndex);
                        const newLists = board.lists.map(list =>
                            list._id === sourceList._id ? { ...list, cards: newCards } : list
                        );

                        const updatedBoard = { ...board, lists: newLists };
                        onBoardUpdate(updatedBoard);
                        updateBoardOrder(updatedBoard);
                    }
                    // If moving between different lists
                    else {
                        const newSourceCards = sourceList.cards.filter(card => card._id !== activeId);
                        const targetCardIndex = targetList.cards.findIndex(card => card._id === overId);
                        const newTargetCards = [...targetList.cards];
                        newTargetCards.splice(targetCardIndex, 0, { ...cardToMove, order: targetCardIndex });

                        // Update order numbers for cards after the insertion point
                        for (let i = targetCardIndex + 1; i < newTargetCards.length; i++) {
                            newTargetCards[i] = { ...newTargetCards[i], order: i };
                        }

                        const newLists = board.lists.map(list => {
                            if (list._id === sourceList._id) {
                                return { ...list, cards: newSourceCards };
                            }
                            if (list._id === targetList._id) {
                                return { ...list, cards: newTargetCards };
                            }
                            return list;
                        });

                        const updatedBoard = { ...board, lists: newLists };
                        onBoardUpdate(updatedBoard);
                        updateBoardOrder(updatedBoard);
                    }
                }
            }
        }
    };

    const updateBoardOrder = async (updatedBoard: Board) => {
        try {
            await fetch(`/api/boards/${board._id}/reorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lists: updatedBoard.lists }),
            });
        } catch (error) {
            console.error("Failed to update board order:", error);
        }
    };

    const handleCreateList = async (title: string) => {
        setIsCreatingList(true);
        try {
            const response = await fetch(`/api/boards/${board._id}/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                throw new Error("Failed to create list");
            }

            const data = await response.json();
            const newList = {
                _id: data.list._id,
                title: data.list.title,
                order: data.list.order,
                cards: [],
            };

            const updatedBoard = {
                ...board,
                lists: [...board.lists, newList],
            };
            onBoardUpdate(updatedBoard);
            // Refresh the board to ensure everything is synchronized
            setTimeout(async () => {
                await onRefresh();
            }, 100);
        } catch (error) {
            console.error("Failed to create list:", error);
        } finally {
            setIsCreatingList(false);
        }
    };

    const handleUpdateList = async (listId: string, title: string) => {
        try {
            const response = await fetch(`/api/boards/${board._id}/lists/${listId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                throw new Error("Failed to update list");
            }

            const updatedBoard = {
                ...board,
                lists: board.lists.map(list =>
                    list._id === listId ? { ...list, title } : list
                ),
            };
            onBoardUpdate(updatedBoard);
        } catch (error) {
            console.error("Failed to update list:", error);
        }
    };

    const handleDeleteList = async (listId: string) => {
        try {
            const response = await fetch(`/api/boards/${board._id}/lists/${listId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete list");
            }

            const updatedBoard = {
                ...board,
                lists: board.lists.filter(list => list._id !== listId),
            };
            onBoardUpdate(updatedBoard);
        } catch (error) {
            console.error("Failed to delete list:", error);
        }
    };

    const handleCreateCard = async (listId: string, title: string, description?: string) => {
        setCreatingCards(prev => new Set(prev).add(listId));
        try {
            const response = await fetch(`/api/boards/${board._id}/lists/${listId}/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to create card");
            }

            const data = await response.json();
            const newCard = {
                _id: data.card._id,
                title: data.card.title,
                description: data.card.description,
                order: data.card.order,
            };

            const updatedBoard = {
                ...board,
                lists: board.lists.map(list =>
                    list._id === listId
                        ? { ...list, cards: [...list.cards, newCard] }
                        : list
                ),
            };
            onBoardUpdate(updatedBoard);
            // Refresh the board to ensure everything is synchronized
            setTimeout(async () => {
                await onRefresh();
            }, 100);
        } catch (error) {
            console.error("Failed to create card:", error);
        } finally {
            setCreatingCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(listId);
                return newSet;
            });
        }
    };

    const handleUpdateCard = async (listId: string, cardId: string, title: string, description?: string) => {
        try {
            const response = await fetch(`/api/boards/${board._id}/lists/${listId}/cards/${cardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to update card");
            }

            const updatedBoard = {
                ...board,
                lists: board.lists.map(list =>
                    list._id === listId
                        ? {
                            ...list,
                            cards: list.cards.map(card =>
                                card._id === cardId ? { ...card, title, description } : card
                            ),
                        }
                        : list
                ),
            };
            onBoardUpdate(updatedBoard);
        } catch (error) {
            console.error("Failed to update card:", error);
        }
    };

    const handleDeleteCard = async (listId: string, cardId: string) => {
        try {
            const response = await fetch(`/api/boards/${board._id}/lists/${listId}/cards/${cardId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete card");
            }

            const updatedBoard = {
                ...board,
                lists: board.lists.map(list =>
                    list._id === listId
                        ? { ...list, cards: list.cards.filter(card => card._id !== cardId) }
                        : list
                ),
            };
            onBoardUpdate(updatedBoard);
        } catch (error) {
            console.error("Failed to delete card:", error);
        }
    };

    const getActiveItem = () => {
        if (!activeId) return null;

        const activeList = board.lists.find(list => list._id === activeId);
        if (activeList) return { type: "list", data: activeList };

        const activeCard = board.lists.flatMap(list => list.cards).find(card => card._id === activeId);
        if (activeCard) return { type: "card", data: activeCard };

        return null;
    };

    const activeItem = getActiveItem();

    return (
        <div className="flex-1 overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 p-4 min-h-full">
                    <SortableContext
                        items={board.lists.map(list => list._id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {board.lists.map((list) => (
                            <List
                                key={list._id}
                                list={list}
                                onUpdateList={handleUpdateList}
                                onDeleteList={handleDeleteList}
                                onCreateCard={handleCreateCard}
                                onUpdateCard={handleUpdateCard}
                                onDeleteCard={handleDeleteCard}
                                isCreatingCard={creatingCards.has(list._id)}
                            />
                        ))}
                    </SortableContext>

                    <CreateListButton onCreateList={handleCreateList} isCreating={isCreatingList} />
                </div>

                <DragOverlay>
                    {activeItem ? (
                        activeItem.type === "list" ? (
                            <List
                                list={activeItem.data}
                                onUpdateList={() => { }}
                                onDeleteList={() => { }}
                                onCreateCard={() => { }}
                                onUpdateCard={() => { }}
                                onDeleteCard={() => { }}
                                isDragging
                            />
                        ) : (
                            <Card
                                card={activeItem.data}
                                onUpdateCard={() => { }}
                                onDeleteCard={() => { }}
                                isDragging
                            />
                        )
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

