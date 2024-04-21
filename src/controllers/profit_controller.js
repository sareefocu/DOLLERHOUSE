    import rewardModel from "../models/reward_model.js"
    import logHelper from "../helpers/logHelper.js";
    import constants from "../config/constants.js";
    import planModel from "../models/plan_model.js";
    const logger = logHelper.getInstance({ appName: constants.app_name });
    const getTotalProfitController = async (req, res) => {
        try {
            const now = new Date(); // Get current time
            let reward_details = await rewardModel.findOne({ user_id: req.query.userId })
            let plan_buyeds = await planModel.findOne({ user_id: req.query.userId })
            const currentTimestamp = new Date().getTime();
            const twentyFourHoursAgo = currentTimestamp - (24 * 60 * 60 * 1000);
            let reward_details112 = await rewardModel.aggregate([{
                $match: {
                    user_id: req.query.userId
                }
            },
            {
                $graphLookup: {
                    from: "reward_details",
                    startWith: "$wallet_id",
                    connectFromField: "wallet_id",
                    depthField: "depthleval",
                    connectToField: "refferal",
                    as: "referBY",
                },
            },
            ])
            let reward_details1 = await rewardModel.find({ refferal: reward_details.wallet_id })
            const joinCount = await rewardModel.find({ refferal: reward_details.wallet_id, createdAt: { $gte: twentyFourHoursAgo } });

            if (!reward_details) {
                return res.send({ message: "Not Found any details" });
            }
            let houseProfit = reward_details.house_reward.reduce((acc, cv) => acc + parseInt(cv.house_reward), 0)
            let levelProfit = reward_details.level_reward.reduce((acc, cv) => acc + parseInt(cv.reward), 0)
            let latesthousereward = await rewardModel.findOne({ user_id: req.query.userId, 'house_reward.time': { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
            let latestlevelreward = await rewardModel.findOne({ user_id: req.query.userId, 'level_reward.time': { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
            let houseProfitlatest
            if (latesthousereward) {
                houseProfitlatest = latesthousereward.house_reward.reduce((acc, cv) => acc + parseInt(cv.house_reward), 0)
            }
            let levelProfitlatest
            if (latestlevelreward) {
                levelProfitlatest = latestlevelreward.level_reward.reduce((acc, cv) => acc + parseInt(cv.reward), 0)
            }
            let totalArray = []
            let total = 2
            let details1 = await rewardModel.findOne({ refferal: reward_details.wallet_id })
            if (!details1) {
                return res.send({ message: "there is not direct/Total team" })
            }
            for (let i = 0; i < 2000; i++) {
                let details = await rewardModel.findOne({ refferal: details1.wallet_id })
                totalArray.push(details)
                details1 = details
                if (!details) {
                    break;
                }
                total++
            }
            const currentDate = new Date();
            const last24Hours = new Date(currentDate - 24 * 60 * 60 * 1000); // Date from the last 24 hours

            let latestteam = totalArray.filter(element => {
                if (element && element.createdAt) {
                    const createdAtDate = new Date(element.createdAt);
                    return createdAtDate >= last24Hours && createdAtDate <= currentDate;
                }
                return false;
            });
            const reward_details11233 = reward_details112[0].referBY.filter((user) => {
                const incomeTimestamp = new Date(user.createdAt);
                return incomeTimestamp >= last24Hours && incomeTimestamp <= currentDate;
            })
            let resp = {
                overAllProfit: houseProfit + levelProfit,
                directTeam: reward_details112[0].referBY.length,
                plan_buyeds: plan_buyeds.plan_details,
                directTeam112: reward_details11233.length,
                recentProfit: houseProfitlatest + levelProfitlatest,
                total_team: joinCount.length,
                recentTeam: reward_details1.length
            }

            res.send({ message: "find success all details", data: resp })
        } catch (error) {
            logger.error({
                message: "There is error in get profit controller",
                errors: error.message
            })
        }
    }
    const getTotalProfitController1 = async (req, res) => {
        try {
            const totalAmountSum = await planModel.aggregate([
                {
                    $unwind: '$plan_details' // Deconstructs the plan_details array
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$plan_details.amount' }, // Sums the amount field from each plan_detail
                    },
                },
            ]);
            const totaluser = await planModel.find({});
            const last24HoursDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Aggregate to get total investment made in the last 24 hours
            const totalInvestmentLast24h = await planModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: last24HoursDate } // Filter documents created in the last 24 hours
                    }
                }, {
                    $unwind: '$plan_details' // Deconstructs the plan_details array
                },
                {
                    $group: {
                        _id: null,
                        totalInvestment: { $sum: '$plan_details.amount' } // Sum the amount field for filtered documents
                    }
                }
            ]);
            const totaluserLast24h = await planModel.find({
                createdAt: { $gte: last24HoursDate } // Filter documents created in the last 24 hours
            });

            // const totalInvestment = totalInvestmentLast24h.length > 0 ? totalInvestmentLast24h[0].totalInvestment : 0;
            res.json({ totalAmountSum: totalAmountSum[0].totalAmount, totalInvestmentLast24h: totalInvestmentLast24h[0].totalInvestment, totaluser: totaluser.length, totaluserLast24h: totaluserLast24h.length });

        } catch (error) {
            console.error('Error fetching total investment in last 24 hours:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    export { getTotalProfitController, getTotalProfitController1 }
