import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: String,
      ref: "User",
    },

    lastMessageAt: {
      content:{type:String,default:""},
      senderName:{type:String,default:""},
      createdAt:{type:Date,default:Date.now}
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;