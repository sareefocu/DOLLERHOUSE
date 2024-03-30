import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    wallet_id: { type: String, required: true },
    user_id: { type: Number, required: true },
    refId: String,
    mainId: String,
    supporterId: String,
    referred: {
        type: [String],
        default: [],
    },
    nextRefIndex: {
        type: Number,
        default: 0,
    },
    nextRefIdsToBeSkipped: {
        type: [String],
        default: [],
    },
}, { timestamps: true })

let userModel = mongoose.model("users", userSchema);
export default userModel;