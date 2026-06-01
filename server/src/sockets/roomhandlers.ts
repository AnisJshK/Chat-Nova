import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socketEvents.js";
import Room from "../models/room.js";
import Message from "../models/message.js";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {
    try {
      console.log(`📡 Attempting to join room. RoomID received:`, roomId);
      socket.join(roomId);
      console.log(`🟢 Success: ${socket.id} joined room ${roomId}`);
    } catch (err) {
      console.error("🔥 CRASH IN JOIN_ROOM HANDLER:", err);
    }
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) => {
    try {
      socket.leave(roomId);
      console.log(`👤 ${socket.id} left room ${roomId}`);
    } catch (err) {
      console.error("🔥 CRASH IN LEAVE_ROOM HANDLER:", err);
    }
  });

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
    try {
      console.log("👉 RAW WEBSOCKET INCOMING DATA:", data);

      let payload = typeof data === "string" ? JSON.parse(data) : data;
      if (Array.isArray(payload)) payload = payload[0];

      console.log("🎯 PARSED PAYLOAD TARGET OBJECT:", payload);

      const { roomId, senderId, senderName, content, clientId } = payload || {};

      if (!roomId || !senderId || !content) {
        console.log("❌ Execution stopped: Payload properties are missing!", { roomId, senderId, content });
        return;
      }

      // Save to database
      const messageDocument = await Message.create({
        roomId,
        senderId,
        senderName: senderName || "Anonymous",
        content,
      });

      // Update room preview metadata
      await Room.findByIdAndUpdate(roomId, {
        lastMessageAt: new Date(),
        lastMessage: {
          content,
          senderName: senderName || "Anonymous",
          createdAt: messageDocument.createdAt,
        },
      });

      // Serialize and attach clientId so frontend can swap optimistic message
      const cleanMessage = messageDocument.toJSON();

      // Broadcast to everyone in the room (including sender)
      io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
        message: { ...cleanMessage, clientId },
      });

      console.log("💾 Real-time message safely written to DB and broadcasted!");
    } catch (error) {
      console.error("🔥 CRASH IN SEND_MESSAGE HANDLER:", error);
    }
  });
};