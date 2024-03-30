import teamModel from "../models/team_model.js";
import planModel from "../models/plan_model.js";
import logHelper from "../helpers/logHelper.js";
import constants from "../config/constants.js";
const logger = logHelper.getInstance({ appName: constants.app_name })
export const getUserDetails = async (req, res) => {
  try {
    //let walletId = req.body.wallet_id.toLowerCase();
    let walletId = req.query.wallet_id.toLowerCase();
    let team_details = await teamModel.findOne({ wallet_id: walletId });
    const current_date = new Date();
    const past_date = new Date(current_date.getTime() - 24 * 60 * 60 * 1000);
    const recent_referrals = team_details.refferal_details.filter(
      (detail) => new Date(detail.time) >= past_date
    );
    const total_users_in_24Hours = recent_referrals.reduce((acc, curr) => {
      if (!acc.includes(curr.user_id)) {
        acc.push(curr.user_id);
      }
      return acc;
    }, []);
    const total_reward = team_details.refferal_details.reduce((acc, curr) => {
      acc += curr.reward;
      return acc;
    }, 0);
    let plan_details = await planModel.findOne({
      user_id: team_details.user_id,
    });
    const plan_value = plan_details.plan_details.reduce((acc, curr) => {
      if (curr.amount > acc) {
        acc = curr.amount;
      }
      return acc;
    }, 0);
    return res.status(200).send({
      status: "ok",
      data: {
        team_members_in_last_24Hours: total_users_in_24Hours.length,
        total_team_members: team_details.refferal_details.length,
        total_reward: total_reward,
        plan_reward_ratio: plan_value / total_reward,
      },
    });
  } catch (error) {
    logger.error({
      message: "Not able to find total user distribution",
      errors: error.message
    })
  }
};
