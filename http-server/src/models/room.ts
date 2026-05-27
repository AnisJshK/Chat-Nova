import mongoose, { Schema } from "mongoose";
import { ref } from "node:process";

const RoomSchema = new Schema({
    name:{
      type:String,
      required:true,
      trim:true
    }
},{timestamps:true})

const Room = mongoose.model('chat',RoomSchema);
export default Room