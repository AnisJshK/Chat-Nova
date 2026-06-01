import { Request, Response } from "express";
import { roomMemberModel } from "../models/roomMember.js";
import mongoose from "mongoose"; // 1. CRUCIAL: Make sure to import mongoose
import Room from "../models/room.js";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export const getUserRooms =  async(req:Request,res:Response) =>{
    try {
         const userId = (req as any).user?.id;
         if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized: Missing user context"
            })
         }

    const memberShips = await roomMemberModel.find({userId}).populate("roomId");

    const rooms = memberShips.map((member)=>member.roomId);

    res.status(200).json({
        success:true,
        rooms
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"failed to fetch rooms"
        })
    }
}

export const createRoom = async(req:Request,res:Response) => {
    try {
        const {name,isGroup} = req.body;
        const userId = (req as any).user?.id;

        if(!userId){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }

        const room = await Room.create({
            name,
            isGroup,
            createdBy:userId,
        })

        await roomMemberModel.create({
            userId,
            roomId:room._id,
        })
        res.status(201).json(room)

    } catch (error:any) {
        console.error(error);
        res.status(500).json({
            message:"Failed to create room"
        })
    }
}

// backend controller adjustment
export const joinRoom = async (req: Request, res: Response) => {
    try {
        // 1. Force TypeScript to know roomId is definitely a string
        const roomId = req.params.roomId as string;
        const userId = (req as any).user?.id;

        // Extra guard: if for some crazy reason roomId is missing or an array runtime leak happens
        if (!roomId || typeof roomId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid room parameter structure."
            });
        }

        // 2. TypeScript will now compile this cleanly!
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Malformed Room Hex Identity Key structure." 
            });
        }
        
        // ✅ No more overload assignment mismatch errors here either
        const mongoRoomId = new mongoose.Types.ObjectId(roomId);

        const targetRoom = await Room.findById(mongoRoomId);
        if (!targetRoom) {
            return res.status(404).json({ success: false, message: "Room registry key not found" });
        }

        const existingMember = await roomMemberModel.findOne({ userId, roomId: mongoRoomId });
        if (!existingMember) {
            await roomMemberModel.create({ userId, roomId: mongoRoomId });
        }

        return res.status(200).json({ 
            success: true, 
            room: targetRoom 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal error" });
    }
};