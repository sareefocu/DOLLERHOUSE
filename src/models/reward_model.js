import mongoose from "mongoose";

let rewardSchema = mongoose.Schema({
    wallet_id:{type:String, required:true},
    refferal:{type:String, required:true},
    user_id:{type:String, required:true},
    invite:{type:Number, default:0},
    house_reward:{type:Array , default:[]} ,
    level_reward:{type:Array , default:[]}
},
{
    timestamps:true,
});

let rewardModel = mongoose.model("Reward_details", rewardSchema);
export default rewardModel ; 