import { Request, Response } from "express";
import Message from "../models/message.js";

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        // 1. Fetch messages matching the roomId parameter
        // REMOVED: .populate() because senderId holds an external Clerk String ID, not a local Mongoose ObjectId reference.
        const messages = await Message.find({ roomId })
            .sort({ createdAt: 1 }); // Oldest messages first, matching chat flow timeline layouts

        // 2. FIXED: Wrapped inside an object matching the payload key your frontend expects!
        return res.status(200).json({
            success: true,
            messages // This matches data.messages on your FE
        });

    } catch (error: any) {
        console.error("Error inside getMessages controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};