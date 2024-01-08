import { Schema, model, SchemaTypes } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: "string",
    },
    receviedId: SchemaTypes.ObjectId,
    senderId: SchemaTypes.ObjectId,
  },
  { timestamps: true }
);

export const messageModel = model("Message", messageSchema);
