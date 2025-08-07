import mongoose from "mongoose";

export interface ICard {
    _id: string;
    title: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IList {
    _id: string;
    title: string;
    order: number;
    cards: ICard[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IBoard extends mongoose.Document {
    title: string;
    description?: string;
    userId: mongoose.Types.ObjectId;
    lists: IList[];
    createdAt: Date;
    updatedAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
    {
        title: {
            type: String,
            required: [true, "Card title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const listSchema = new mongoose.Schema<IList>(
    {
        title: {
            type: String,
            required: [true, "List title is required"],
            trim: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        cards: [cardSchema],
    },
    {
        timestamps: true,
    }
);

const boardSchema = new mongoose.Schema<IBoard>(
    {
        title: {
            type: String,
            required: [true, "Board title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lists: [listSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Board || mongoose.model<IBoard>("Board", boardSchema);

