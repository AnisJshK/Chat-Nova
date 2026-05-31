import express from "express";
import { getMessages } from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.get('/:roomId/messages',getMessages);

export default messageRouter