import { Schema, model, Document } from "mongoose";
import { createdAt } from "./schemaHooks";

export interface ITodo extends Document {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  owner: string;
  viewers: string[];
  createdAt: number;
  comments: string[];
}
export const todoSchema: Schema<ITodo> = new Schema<ITodo>(
  {
    id: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // ****             ****
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Number,
      index: true,
    },
  },
  {
    id: true,
    _id: true,
  }
);

createdAt(todoSchema);

export default model<ITodo>("Todo", todoSchema);
