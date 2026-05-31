import { Request, Response } from "express";
import  Message  from "../models/message.js";

export const getMessages = async(req:Request,res:Response) => {
    try {
        const {roomId} = req.params;
        const message = await Message.find({
            roomId,
        }).populate(
            "senderId",
            "username profilePicture"
        ).sort({
            createdAt:1
        });
        res.status(200).json(message)
    } catch (error:any) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}