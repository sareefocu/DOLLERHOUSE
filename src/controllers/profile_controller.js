import multer from "multer"
import logHelper from "../helpers/logHelper.js"
import constants from "../config/constants.js"
import profileModel from "../models/profile_model.js"
import userModel from "../models/user_model.js"
const logger = logHelper.getInstance({appName:constants.app_name})
const uploadProfiledetails = async (req , res , next ) => {
    console.log(req.body)
    try {
        let user = await userModel.findOne({wallet_id:req.body['wallet_id']})
        let profile = new profileModel({wallet_id:req.body['wallet_id'] , user_id:user.user_id , username:req.body['username']})
        await profile.save()
        next()
    } catch (error) {
        logger.error({
            message:"faild to upload profile",
            errors:error.message
        })
    }
}



export {uploadProfiledetails}
