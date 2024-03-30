import planModel from "../models/plan_model.js";
import logHelper from "../helpers/logHelper.js";
import constants from "../config/constants.js";
import userModel from "../models/user_model.js";
import rewardModel from "../models/reward_model.js";
import { house_rewards_service, level_reward_service } from "../services/houseRewardService.js";
const logger = logHelper.getInstance({ appName: constants.app_name })

const createPlanController = async (req, res) => {
    let WalletId = (req.body.wallet_id).toLowerCase();
    let Refferal = (req.body.refferal).toLowerCase();


   
    try {
        var user = await userModel.findOne({ wallet_id: WalletId });
        let userId
        if (user) {
            userId = user.user_id
        }
        if (!user) {
            let allusers = await userModel.find()
            userId = allusers.length + 1
            let user = new userModel({ wallet_id: WalletId, user_id: userId })
            await user.save();
        }
        let previousePlan = await planModel.findOne({ wallet_id: WalletId })
        let time = new Date()
        let requireObject = {
            amount: req.body.plan_details[0].amount,
            plan_name: req.body.plan_details[0].plan_name,
            type: req.body.plan_details[0].type,
            Time: time
        }
        if (previousePlan) {
            await previousePlan.updateOne({ plan_details: [...previousePlan.plan_details, requireObject] })
            await house_rewards_service(WalletId, Refferal, requireObject, previousePlan.user_id)
            await level_reward_service(WalletId, Refferal, requireObject, previousePlan.user_id);
            return res.send({ message: "plan saved successfully", status: "Ok", response: "team get reward both success" })
        } else {
            if (!user) {
                let newplan = new planModel({ wallet_id: WalletId, user_id: userId, amount: req.body.amount, refferal: Refferal, plan_details: [requireObject] })
                await newplan.save();
            } else {
                let newplan = new planModel({ wallet_id: WalletId, user_id: user.user_id, amount: req.body.amount, refferal: Refferal, plan_details: [requireObject] })
                await newplan.save();
            }
        }
        let rewarddetails = await rewardModel.findOne({ wallet_id: WalletId });
        if (!rewarddetails) {
            let reward = new rewardModel({ wallet_id: WalletId, user_id: userId, refferal: Refferal })
            await reward.save();
        }
        await house_rewards_service(WalletId, Refferal, requireObject, userId)
        await level_reward_service(WalletId, Refferal, requireObject, userId)
        return res.send({ message: "plan saved successfully", status: "Ok", response: "team get reward both success" })
    } catch (error) {
        logger.error({
            message: "Could not save plan",
            errors: error.message
        })
        throw error
    }
}

const getPlanController = async (req, res) => {
    try {
        let resp = await planModel.findOne({ $or: [{ wallet_id: req.query.walletid }, { user_id: req.query.userid }] })
        return res.send({ message: "Your Plan fetched successfully", status: "Ok", data: resp });
    } catch (error) {
        logger.error({
            message: "Could not fetch plan",
            errors: error.message
        });
        throw error
    }
}

export { createPlanController, getPlanController }