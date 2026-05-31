import http from 'http'
import { Server } from "socket.io";
import { registerRoomHandlers } from "./roomhandlers.js";

let io: Server;

export const initializeSocket = (
  server: http.Server
) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      `🟢 Connected: ${socket.id}`
    );

    registerRoomHandlers(
      io,
      socket
    );

    socket.on("disconnect", () => {

      console.log(
        `🔴 Disconnected: ${socket.id}`
      );

    });

  });
};

export const getIO = () => io;