import multer from "multer"
import logHelper from "../helpers/logHelper.js"
import constants from "../config/constants.js"
const logger = logHelper.getInstance({ appName: constants.app_name })
import { Router } from "express"
import profileModel from "../models/profile_model.js"
import userModel from "../models/user_model.js"
import rewardModel from "../models/reward_model.js"
let profileUploadRouter = Router()
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./src/profile")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "" + Date.now() + ".jpg")
        }
    })
}).single("user_profile")
profileUploadRouter.post('/upload', async (req, res) => {
    try {
        let user = await userModel.findOne({ wallet_id: req.body.wallet_id })
        console.log("req.body", req.body.username, user);
        let profile1 = await profileModel.findOne({ user_id: user.user_id })
        if (profile1 !== null) {
            profile1.picture = req.body.filename
            await profile1.save();
            console.log(req.body.username);
            profile1.username = req.body.username
            await profile1.save();
        } else {
            let profile = new profileModel({ wallet_id: req.body.wallet_id, user_id: user.user_id, username: req.body.username, picture: req.body.filename });
            await profile.save();
        }
        res.send({
            "status": "Sucusess",
            data: {
                link: `http://localhost:3100/profile/${req.body.filename}`,
                user_name: req.user_name
            }
        })
    } catch (error) {
        console.log(error);
    }

})

profileUploadRouter.get('/get-profile', async (req, res) => {
    try {
        let response1 = await profileModel.findOne({ wallet_id: req.query.wallet_id })
        if (response1) {
            let dumy = await rewardModel.findOne({ wallet_id: req.query.wallet_id })
            let response2 = await userModel.findOne({ wallet_id: dumy.refferal })
            let message = "parent data not found"
            if (response2) {
                message = "parent data is found"
            }
            let response = {
                _id: response1._id,
                wallet_id: response1.wallet_id,
                user_id: response1.user_id,
                username: response1.username,
                picture: response1.picture,
                createAt: response1.createAt,
                updateAt: response1.updateAt,
                parent_details: {
                    wallet_id: response2.wallet_id,
                    user_id: response2.user_id
                },
                Message: message
            }
            res.send({ message: "success", data: response })
        } else {
            res.send({ message: "user not found" })
        }

    } catch (error) {
        console.log(error);
    }
})

export default profileUploadRouter