// models/message.ts
import mongoose, { Schema, Document } from "mongoose";

// Define an explicit interface for TypeScript support
export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId | string;
  senderId: string;
  senderName: string; // <-- CRUCIAL: Add this field definition
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    senderId: {
      type: String, // Clerk string ID
      required: true,
    },
    senderName: {
      type: String, // <-- CRUCIAL: Add this to your database schema map
      required: true,
      default: "Anonymous"
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Prevent model recompilation errors during hot-reloads
const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;