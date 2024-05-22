import mongoose from "mongoose";

let profileSchema = mongoose.Schema({
    wallet_id:{type:String , required:true},
    user_id:{type:Number , required:true},
    username:{type:String , required:true},
    picture:{type:String , default:null}
},{timestamps:true})

let     profileModel = mongoose.model("profile" , profileSchema);
export default profileModel;