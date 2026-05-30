import { Request, Response } from "express";
import { User } from "../models/user.js";

export const getcurrentUser = async(req:Request,res:Response) => {
    try {
        const clerkId = (req as any).clerkId;
        
        const user = await User.findOne({clerkId});
        
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        
        return res.json({
            success:true,
            user
        })

    } catch (error:any) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const getAllUsers = async(req:Request,res:Response) =>{
   try {
         const clerkId = (req as any).clerkId;
    const currentUser = await User.findOne({clerkId});
    if(!currentUser){
        return res.status(404).json({
            success:false,
            message:"User not Found"
        })
    }

    const users = await User.find({
        _id:{$ne:currentUser._id},
    });
   
    return res.status(200).json({
        success:true,
        users
    })
   } catch (error:any) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"Interal Server error"
    })
   }
}

export const getUserById = async(req:Request,res:Response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id).select(
           "-__v"
        );
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error:any) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}