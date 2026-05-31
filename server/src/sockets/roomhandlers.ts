import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socketEvents.js";
import Room from "../models/room.js";
import Message from "../models/message.js";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {
    try {
      console.log(`📡 Attempting to join room. RoomID received:`, roomId);

      // If roomId is undefined or wrong, socket.join() won't crash, but let's be safe
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

  // Notice we remove the curly braces around the arguments so they treat parameters individually
  // 💡 Wrap the arguments in curly braces {} to cleanly destructure the object properties
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: any) => {
  try {
    console.log("👉 RAW WEBSOCKET INCOMING DATA:", data);

    // 1. If data is a string, parse it! If it's already an object, use it as-is.
    let payload = typeof data === "string" ? JSON.parse(data) : data;
    
    // 2. Double safety if it wrapped in an array container
    if (Array.isArray(payload)) {
      payload = payload[0];
    }

    console.log("🎯 PARSED PAYLOAD TARGET OBJECT:", payload);

    const { roomId, senderId, content } = payload || {};

    // 3. Fallback check
    if (!roomId || !senderId || !content) {
       console.log("❌ Execution stopped: Payload properties are missing!", { roomId, senderId, content });
       return;
    }

    // 4. Save to Database
    const message = await Message.create({
      roomId,
      senderId,
      content,
    });

    await Room.findByIdAndUpdate(roomId, {
      lastMessageAt: new Date(),
    });

    // 5. Broadcast back out to the room
    io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
    console.log("💾 Real-time message safely written to DB and broadcasted!");

  } catch (error) {
    console.error("🔥 CRASH IN SEND_MESSAGE HANDLER:", error);
  }
});
};
