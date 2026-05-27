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
    lastReadAt:{
        type:Date,
        default:null
    }
},{timestamps:{createdAt:'joinedAt',updatedAt:false}});

export const roomMemberModel = mongoose.model('RoomMember',roomMemberSchema)