import mongoose from 'mongoose';
const teamSchema = mongoose.Schema({
    wallet_id : {type:String , required:true} ,
    user_id : {type:String , required:true} ,
    refferal_id : {type:String , required:true},
    refferal_count: {type:Number , default:0},
    refferal_details: {type:Array , default:[]},
    isRoot: { type: Boolean, default: false }
},
{
    timestamps:true,
}
)

const teamModel = mongoose.model('team' , teamSchema)

export default teamModel