import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    content :{
      type:String,
      required:true
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    roomId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Room',
      required:true
    },
    status:{
      type:String,
      enum:['SENT','DELIVERED','READ'],
      default:'SENT'
    }
},{timestamps:{createdAt:true}})

export const Message = mongoose.model('Message',messageSchema);