import {getAuth} from '@clerk/express';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req:Request,res:Response,next:NextFunction)=>{
    const auth = getAuth(req);

    if(!auth.userId){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }
    (req as any).clerkId = auth.userId;
    (req as any).user = { id: auth.userId };
    next()   
}