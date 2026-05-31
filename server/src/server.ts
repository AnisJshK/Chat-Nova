import http from "http";
import express from "express";
import dotenv from "dotenv";
import "dotenv/config"
import connectDB from "./config/db.js";

import userRouter from "./routes/UserRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import messageRouter from "./routes/MessageRoutes.js";

import { initializeSocket } from "./sockets/index.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

app.use(express.json());

await connectDB();

app.use(clerkMiddleware())

app.use("/api/webhooks", webhookRouter);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRoutes);
app.use("/api/rooms", messageRouter);

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server + Socket.IO running on port ${PORT}`
  );
});