import express from "express";
import { getMessages } from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.get('/:roomId',getMessages);

export default messageRouter