import rewardModel from "../models/reward_model.js"
import logHelper from "../helpers/logHelper.js"
import constants from "../config/constants.js"
const logger = logHelper.getInstance({ appName: constants.app_name })
const getRewardController = async (req, res) => {
  try {
    let details = await rewardModel.aggregate([
      {
        $match: {
          user_id:
            req.query.userId,
        },
      },
      {
        $lookup: {
          from: "reward_details",
          localField: "wallet_id",
          foreignField: "refferal",
          as: "refferal",
        },
      },
      {
        $unwind: {
          path: "$refferal",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "refferal.wallet_id",
          foreignField: "wallet_id",
          as: "refferal.user1",
        },
      },
      {
        $unwind: {
          path: "$refferal.user1",
        },
      },
      {
        $lookup: {
          from: "reward_details",
          localField: "refferal.wallet_id",
          foreignField: "refferal",
          as: "refferal.user1.refferal1",
        },
      },
      {
        $lookup: {
          from: "refs",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result",
        },
      },
      {
        $lookup: {
          from: "ref40",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result1",
        },
      },
      {
        $lookup: {
          from: "ref100",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result2",
        },
      },
      {
        $lookup: {
          from: "ref200",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result3",
        },
      },
      {
        $lookup: {
          from: "ref500",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result4",
        },
      },
      {
        $lookup: {
          from: "ref1000",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result5",
        },
      },
      {
        $lookup: {
          from: "ref2000",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result6",
        },
      },
      {
        $lookup: {
          from: "ref4000",
          localField: "refferal.wallet_id",
          foreignField: "refId",
          as: "refferal.result7",
        },
      },
      {
        $addFields: {
          "refferal.user1.refferal1Size": {
            $size: "$refferal.user1.refferal1",
          },
        },
      },
    ]
    )
    if (!details) {
      return res.send({ message: "the User not found " })
    }
    return res.send({ message: "User found successfully", data: details })
  } catch (error) {
    logger.error({
      message: "Something went wrong",
      errors: error.message
    })
  }
}

export default getRewardController
