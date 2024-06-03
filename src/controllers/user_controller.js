import constants from "../config/constants.js"
import logHelper from "../helpers/logHelper.js"
import rewardModel from "../models/reward_model.js"
import userModel from "../models/user_model.js"
import profilesModel from "../models/profile_model.js"
const logger = logHelper.getInstance({ appName: constants.app_name })


const setUserController = async (req, res) => {
  let WalletId = (req.body.wallet_id).toLowerCase();
  try {
    let alreadyUser = await userModel.findOne({ wallet_id: WalletId })
    if (alreadyUser) {
      return res.send({ message: "user is already registered" })
    }
    let allusers = await userModel.find()
    let userId = allusers.length + 1
    let user = new userModel({ wallet_id: WalletId, user_id: userId })
    await user.save();
    return res.send({ message: "user has been registered", status: "Ok" })
  } catch (error) {
    logger.error({
      message: "Not able to create this user",
      errors: error.message
    })
  }
}

const getUserController = async (req, res) => {
  let WalletId = (req.query.wallet_id)?.toLowerCase();
  try {
    let alreadyUser = await userModel.findOne({ wallet_id: WalletId })
    let profilesModel1 = await profilesModel.findOne({ wallet_id: WalletId })
    if (alreadyUser) {
      let parent = await rewardModel.findOne({ user_id: alreadyUser.user_id })
      let parent1 = await rewardModel.findOne({ wallet_id: parent.refferal })
      let reponse = {
        _id: alreadyUser._id,
        wallet_id: alreadyUser.wallet_id,
        user_id: alreadyUser.user_id,
        createdAt: alreadyUser.createdAt,
        updatedAt: alreadyUser.updatedAt,
        profile: profilesModel1,
        parent_details: {
          wallet_id: parent.refferal,
          user_id: parent1.user_id,
        }
      }
      res.send({ message: "user is fetch succesfully", data: reponse })
    } else {
      res.send({ message: "user Not found" })
    }

  } catch (error) {
    logger.error({
      message: "Not able to fetch this user",
      errors: error.message
    })
  }
}

export { setUserController, getUserController }
