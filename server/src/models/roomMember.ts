import mongoose from 'mongoose'

const roomMemberSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },
    lastReadAt:{
        type:Date,
        default:null
    }
},{timestamps:true});

export const roomMemberModel = mongoose.model('RoomMember',roomMemberSchema)