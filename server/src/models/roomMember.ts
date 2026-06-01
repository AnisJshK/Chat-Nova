import mongoose from 'mongoose'

const roomMemberSchema = new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },
    unreadCount:{
        type:Number,
        default:0
    }
},{timestamps:true});

export const roomMemberModel = mongoose.model('RoomMember',roomMemberSchema)