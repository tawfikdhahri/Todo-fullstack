import { Schema, model, Document } from "mongoose";
import { createdAt } from "./schemaHooks";

export interface IComment extends Document {
  id: string;
  content: string;
  completed: boolean;
  author: any;
}
export const commentSchema: Schema<IComment> = new Schema<IComment>(
  {
    id: String,
    content: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

createdAt(commentSchema);

export default model<IComment>("Comment", commentSchema);
