import { Request, Response } from "express";
import { roomMemberModel } from "../models/roomMember.js";
import Room from "../models/room.js";

export const getUserRooms =  async(req:Request,res:Response) =>{
    try {
         const userId = req.params.userId;

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
        const userId = req.user.id;

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