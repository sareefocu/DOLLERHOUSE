import constants from "../config/constants.js"
import logHelper from "../helpers/logHelper.js"
import planModel from "../models/plan_model.js"
import rewardModel from "../models/reward_model.js"
const logger = logHelper.getInstance({ appName: constants.app_name })
const findUpline = async (wallet_id, obj, houseValue, userId, childWallet) => {
    try {
        const buyed_plan1 = await planModel.findOne({ wallet_id: wallet_id });
        if (buyed_plan1) {
            const maxValue = buyed_plan1?.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount);
                return numericValue > max ? numericValue : max;
            }, parseInt(buyed_plan1?.plan_details[0].amount));

            if (maxValue >= obj.amount) {
                let reward_details = await rewardModel.findOne({ wallet_id: wallet_id })
                const filteredRewards = reward_details.house_reward.filter(reward => reward.amount == obj.amount);
                const filteredRewardsLength = filteredRewards.length + 1;
                const result = filteredRewardsLength % 4 === 0 ? filteredRewardsLength / 4 : filteredRewardsLength / 4;
                const resultString = result.toString();
                const splitResult = resultString.split(".")

                if (filteredRewards.length <= 2) {
                    let requireObject = {
                        house_reward: houseValue,
                        ...obj,
                        user_id: userId,
                        invited_member_id: childWallet,
                    }
                    await reward_details.updateOne({ $push: { house_reward: requireObject } });
                    await reward_details.updateOne({ $inc: { invite: 1 } });
                } else {
                    if (Number(resultString) > 0 && splitResult.length === 1) {
                        let requireObject2 = {
                            house_reward: houseValue,
                            ...obj,
                            user_id: userId,
                            invited_member_id: childWallet,
                            status: "missed"
                        }
                        await reward_details.updateOne({ $push: { house_reward: requireObject2 } });
                        if (reward_details.invite < 3) {
                            await reward_details.updateOne({ $inc: { invite: 1 } });
                        }
                        await findUpline(buyed_plan1.refferal, obj, houseValue, userId, childWallet);
                    } else {
                        const filteredRewards = reward_details.house_reward.filter(reward => reward.amount == obj.amount);
                        const filteredRewardsLength = filteredRewards.length + 1;
                        const result = filteredRewardsLength % 4 === 0 ? filteredRewardsLength / 4 : filteredRewardsLength / 4;
                        const resultString = result.toString();
                        const splitResult = resultString.split(".")

                        if (Number(resultString) > 0 && splitResult.length === 1) {
                            let requireObject = {
                                house_reward: houseValue,
                                ...obj,
                                user_id: userId,
                                invited_member_id: childWallet,
                            }
                            await reward_details.updateOne({ $push: { house_reward: requireObject } });
                            await reward_details.updateOne({ $inc: { invite: 1 } });
                        } else {
                            if (maxValue > obj.amount) {
                                let requireObject = {
                                    house_reward: houseValue,
                                    ...obj,
                                    user_id: userId,
                                    invited_member_id: childWallet,
                                }
                                await reward_details.updateOne({ $push: { house_reward: requireObject } });
                                await reward_details.updateOne({ $inc: { invite: 1 } });
                                return reward_details;
                            } else {
                                let requireObject2 = {
                                    house_reward: houseValue,
                                    ...obj,
                                    user_id: userId,
                                    invited_member_id: childWallet,
                                    status: "missed Reword"
                                }
                                if (reward_details.invite < 3) {
                                    await reward_details.updateOne({ $inc: { invite: 1 } });
                                }
                                await reward_details.updateOne({ $push: { house_reward: requireObject2 } });
                                await findUpline(buyed_plan1.refferal, obj, houseValue, userId, childWallet);
                            }
                        }
                    }
                }
            } else {
                let reward_details = await rewardModel.findOne({ wallet_id: wallet_id })
                let requireObject2 = {
                    house_reward: houseValue,
                    ...obj,
                    user_id: userId,
                    invited_member_id: childWallet,
                    status: "missed Reword"
                }
                if (reward_details.invite < 3) {
                    await reward_details.updateOne({ $inc: { invite: 1 } });
                }
                await reward_details.updateOne({ $push: { house_reward: requireObject2 } });
                await findUpline(buyed_plan1.refferal, obj, houseValue, userId, childWallet);
            }
        }
    } catch (error) {
        console.error("Error in findUpline:", error);
    }
};

let house_rewards_service = async (childWallet, wallet, obj, userId) => {
    try {

        if (obj.amount == "20" || obj.amount == "40" || obj.amount == "1000" || obj.amount == "2000" || obj.amount == "4000") {
            let houseValue = Number(obj.amount) * 0.25
            await findUpline(wallet, obj, houseValue, userId, childWallet)
        } else if (obj.amount == "100" || obj.amount == "200") {
            let houseValue = Number(obj.amount) * 0.3
            await findUpline(wallet, obj, houseValue, userId, childWallet)
        } else {
            let houseValue = Number(obj.amount) * 0.24
            await findUpline(wallet, obj, houseValue, userId, childWallet)
        }
        return true
    } catch (error) {
        console.log(error.message);
    }
}

async function level_reward_service(childWallet, wallet, obj, userId) {
    try {
        if (obj.amount == "20" || obj.amount == "40" || obj.amount == "1000" || obj.amount == "2000" || obj.amount == "4000") {
            let rewardValue = Number(obj.amount) * 0.5
            let reward_details1 = await rewardModel.findOne({ wallet_id: wallet })
            if (!reward_details1) {
                return true
            }
            let buyed_plan1 = await planModel.findOne({ wallet_id: wallet })
            if (!buyed_plan1) {
                return true
            }
            let maxValue1 = buyed_plan1.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan1.plan_details[0].amount))
            console.log("maxValue1", maxValue1)
            console.log("obj.amount", obj.amount)
            if (maxValue1 >= "40") {
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details1.level_reward.length < 4) {
                    await reward_details1.updateOne({
                        level_reward: [...reward_details1.level_reward, {
                            level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet,
                            ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" })
                        }]
                    })
                } else {
                    await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed Reword" }] })
                }
            }

            let reward_details2 = await rewardModel.findOne({ wallet_id: reward_details1.refferal })
            if (!reward_details2) {
                return true
            }
            let buyed_plan2 = await planModel.findOne({ wallet_id: reward_details1.refferal })
            let maxValue2 = buyed_plan2.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan2.plan_details[0].amount))
            if (maxValue2 >= "40") {
                await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue2 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details2.level_reward.length < 4) {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue2 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details3 = await rewardModel.findOne({ wallet_id: reward_details2.refferal })
            if (!reward_details3) {
                return true
            }
            let buyed_plan3 = await planModel.findOne({ wallet_id: reward_details2.refferal })
            let maxValue3 = buyed_plan3.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan3.plan_details[0].amount))
            if (maxValue3 >= "40") {
                await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue3 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details3.level_reward.length < 4) {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue3 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details4 = await rewardModel.findOne({ wallet_id: reward_details3.refferal })
            if (!reward_details4) {
                return true
            }
            let buyed_plan4 = await planModel.findOne({ wallet_id: reward_details3.refferal })
            let maxValue4 = buyed_plan4.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan4.plan_details[0].amount))
            if (maxValue4 >= "40") {
                await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue4 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details4.level_reward.length < 4) {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue4 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details5 = await rewardModel.findOne({ wallet_id: reward_details4.refferal })
            if (!reward_details5) {
                return true
            }
            let buyed_plan5 = await planModel.findOne({ wallet_id: reward_details4.refferal })
            let maxValue5 = buyed_plan5.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan5.plan_details[0].amount))
            if (maxValue5 >= "40") {
                await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) < maxValue5 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details5.level_reward.length < 4) {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) < maxValue5 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details6 = await rewardModel.findOne({ wallet_id: reward_details5.refferal })
            if (!reward_details6) {
                return true
            }
            let buyed_plan6 = await planModel.findOne({ wallet_id: reward_details5.refferal })
            let maxValue6 = buyed_plan6.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan6.plan_details[0].amount))
            if (maxValue6 >= "40") {
                await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue6 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details6.level_reward.length < 4) {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue6 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details7 = await rewardModel.findOne({ wallet_id: reward_details6.refferal })
            if (!reward_details7) {
                return true
            }
            let buyed_plan7 = await planModel.findOne({ wallet_id: reward_details6.refferal })
            let maxValue7 = buyed_plan7.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan7.plan_details[0].amount))
            if (maxValue7 >= "40") {
                await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue7 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details7.level_reward.length < 4) {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue7 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details8 = await rewardModel.findOne({ wallet_id: reward_details7.refferal })
            if (!reward_details8) {
                return true
            }
            let buyed_plan8 = await planModel.findOne({ wallet_id: reward_details7.refferal })
            let maxValue8 = buyed_plan8.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan8.plan_details[0].amount))
            if (maxValue8 >= "40") {
                await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue8 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details8.level_reward.length < 4) {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue8 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details9 = await rewardModel.findOne({ wallet_id: reward_details8.refferal })
            if (!reward_details9) {
                return true
            }
            let buyed_plan9 = await planModel.findOne({ wallet_id: reward_details8.refferal })
            let maxValue9 = buyed_plan9.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan9.plan_details[0].amount))
            if (maxValue9 >= "40") {
                await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details9.level_reward.length < 4) {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details10 = await rewardModel.findOne({ wallet_id: reward_details9.refferal })
            if (!reward_details10) {
                return true
            }
            let buyed_plan10 = await planModel.findOne({ wallet_id: reward_details9.refferal })
            let maxValue10 = buyed_plan10.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan10.plan_details[0].amount))
            if (maxValue10 >= "40") {
                await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details10.level_reward.length < 4) {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details11 = await rewardModel.findOne({ wallet_id: reward_details10.refferal })
            if (!reward_details11) {
                return true
            }
            let buyed_plan11 = await planModel.findOne({ wallet_id: reward_details10.refferal })
            let maxValue11 = buyed_plan11.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan11.plan_details[0].amount))
            if (maxValue11 >= "40") {
                await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details11.level_reward.length < 4) {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details12 = await rewardModel.findOne({ wallet_id: reward_details11.refferal })
            if (!reward_details12) {
                return true
            }
            let buyed_plan12 = await planModel.findOne({ wallet_id: reward_details11.refferal })
            let maxValue12 = buyed_plan12.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan12.plan_details[0].amount))
            if (maxValue12 >= "40") {
                await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details12.level_reward.length < 4) {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details13 = await rewardModel.findOne({ wallet_id: reward_details12.refferal })
            if (!reward_details13) {
                return true
            }
            let buyed_plan13 = await planModel.findOne({ wallet_id: reward_details12.refferal })
            let maxValue13 = buyed_plan13.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan13.plan_details[0].amount))
            if (maxValue13 >= "40") {
                await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details13.level_reward.length < 4) {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details14 = await rewardModel.findOne({ wallet_id: reward_details13.refferal })
            if (!reward_details14) {
                return true
            }
            let buyed_plan14 = await planModel.findOne({ wallet_id: reward_details13.refferal })
            let maxValue14 = buyed_plan14.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan14.plan_details[0].amount))
            if (maxValue14 >= "40") {
                await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details14.level_reward.length < 4) {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details15 = await rewardModel.findOne({ wallet_id: reward_details14.refferal })
            if (!reward_details15) {
                return true
            }
            let buyed_plan15 = await planModel.findOne({ wallet_id: reward_details14.refferal })
            let maxValue15 = buyed_plan15.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan15.plan_details[0].amount))
            if (maxValue15 >= "40") {
                await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details15.level_reward.length < 4) {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
        } else if (obj.amount == "100" || obj.amount == "200") {
            let rewardValue = Number(obj.amount) * 0.4
            let reward_details1 = await rewardModel.findOne({ wallet_id: wallet })
            if (!reward_details1) {
                return true
            }
            let buyed_plan1 = await planModel.findOne({ wallet_id: wallet })
            if (!buyed_plan1) {
                return true
            }
            let maxValue1 = buyed_plan1.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan1.plan_details[0].amount))
            if (maxValue1 >= "40") {
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details1.level_reward.length < 4) {
                    await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details2 = await rewardModel.findOne({ wallet_id: reward_details1.refferal })
            if (!reward_details2) {
                return true
            }
            let buyed_plan2 = await planModel.findOne({ wallet_id: reward_details1.refferal })
            let maxValue2 = buyed_plan2.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan2.plan_details[0].amount))
            if (maxValue2 >= "40") {
                await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details2.level_reward.length < 4) {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details3 = await rewardModel.findOne({ wallet_id: reward_details2.refferal })
            if (!reward_details3) {
                return true
            }
            let buyed_plan3 = await planModel.findOne({ wallet_id: reward_details2.refferal })
            let maxValue3 = buyed_plan3.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan3.plan_details[0].amount))
            if (maxValue3 >= "40") {
                await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details3.level_reward.length < 4) {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details4 = await rewardModel.findOne({ wallet_id: reward_details3.refferal })
            if (!reward_details4) {
                return true
            }
            let buyed_plan4 = await planModel.findOne({ wallet_id: reward_details3.refferal })
            let maxValue4 = buyed_plan4.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan4.plan_details[0].amount))
            if (maxValue4 >= "40") {
                await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details4.level_reward.length < 4) {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details5 = await rewardModel.findOne({ wallet_id: reward_details4.refferal })
            if (!reward_details5) {
                return true
            }
            let buyed_plan5 = await planModel.findOne({ wallet_id: reward_details4.refferal })
            let maxValue5 = buyed_plan5.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan5.plan_details[0].amount))
            if (maxValue5 >= "40") {
                await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details5.level_reward.length < 4) {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details6 = await rewardModel.findOne({ wallet_id: reward_details5.refferal })
            if (!reward_details6) {
                return true
            }
            let buyed_plan6 = await planModel.findOne({ wallet_id: reward_details5.refferal })
            let maxValue6 = buyed_plan6.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan6.plan_details[0].amount))
            if (maxValue6 >= "40") {
                await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details6.level_reward.length < 4) {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details7 = await rewardModel.findOne({ wallet_id: reward_details6.refferal })
            if (!reward_details7) {
                return true
            }
            let buyed_plan7 = await planModel.findOne({ wallet_id: reward_details6.refferal })
            let maxValue7 = buyed_plan7.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan7.plan_details[0].amount))
            if (maxValue7 >= "40") {
                await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details7.level_reward.length < 4) {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details8 = await rewardModel.findOne({ wallet_id: reward_details7.refferal })
            if (!reward_details8) {
                return true
            }
            let buyed_plan8 = await planModel.findOne({ wallet_id: reward_details7.refferal })
            let maxValue8 = buyed_plan8.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan8.plan_details[0].amount))
            if (maxValue8 >= "40") {
                await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details8.level_reward.length < 4) {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details9 = await rewardModel.findOne({ wallet_id: reward_details8.refferal })
            if (!reward_details9) {
                return true
            }
            let buyed_plan9 = await planModel.findOne({ wallet_id: reward_details8.refferal })
            let maxValue9 = buyed_plan9.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan9.plan_details[0].amount))
            if (maxValue9 >= "40") {
                await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details9.level_reward.length < 4) {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details10 = await rewardModel.findOne({ wallet_id: reward_details9.refferal })
            if (!reward_details10) {
                return true
            }
            let buyed_plan10 = await planModel.findOne({ wallet_id: reward_details9.refferal })
            let maxValue10 = buyed_plan10.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan10.plan_details[0].amount))
            if (maxValue10 >= "40") {
                await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details10.level_reward.length < 4) {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details11 = await rewardModel.findOne({ wallet_id: reward_details10.refferal })
            if (!reward_details11) {
                return true
            }
            let buyed_plan11 = await planModel.findOne({ wallet_id: reward_details10.refferal })
            let maxValue11 = buyed_plan11.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan11.plan_details[0].amount))
            if (maxValue11 >= "40") {
                await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details11.level_reward.length < 4) {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details12 = await rewardModel.findOne({ wallet_id: reward_details11.refferal })
            if (!reward_details12) {
                return true
            }
            let buyed_plan12 = await planModel.findOne({ wallet_id: reward_details11.refferal })
            let maxValue12 = buyed_plan12.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan12.plan_details[0].amount))
            if (maxValue12 >= "40") {
                await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details12.level_reward.length < 4) {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details13 = await rewardModel.findOne({ wallet_id: reward_details12.refferal })
            if (!reward_details13) {
                return true
            }
            let buyed_plan13 = await planModel.findOne({ wallet_id: reward_details12.refferal })
            let maxValue13 = buyed_plan13.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan13.plan_details[0].amount))
            if (maxValue13 >= "40") {
                await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details13.level_reward.length < 4) {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details14 = await rewardModel.findOne({ wallet_id: reward_details13.refferal })
            if (!reward_details14) {
                return true
            }
            let buyed_plan14 = await planModel.findOne({ wallet_id: reward_details13.refferal })
            let maxValue14 = buyed_plan14.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan14.plan_details[0].amount))
            if (maxValue14 >= "40") {
                await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details14.level_reward.length < 4) {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details15 = await rewardModel.findOne({ wallet_id: reward_details14.refferal })
            if (!reward_details15) {
                return true
            }
            let buyed_plan15 = await planModel.findOne({ wallet_id: reward_details14.refferal })
            let maxValue15 = buyed_plan15.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan15.plan_details[0].amount))
            if (maxValue15 >= "40") {
                await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details15.level_reward.length < 4) {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
        } else {
            let rewardValue = Number(obj.amount) * 0.52
            let reward_details1 = await rewardModel.findOne({ wallet_id: wallet })
            if (!reward_details1) {
                return true
            }
            let buyed_plan1 = await planModel.findOne({ wallet_id: wallet })
            if (!buyed_plan1) {
                return true
            }
            let maxValue1 = buyed_plan1.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan1.plan_details[0].amount))
            if (maxValue1 >= "40") {
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details1.level_reward.length < 4) {
                    await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: 1, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details2 = await rewardModel.findOne({ wallet_id: reward_details1.refferal })
            if (!reward_details2) {
                return true
            }
            let buyed_plan2 = await planModel.findOne({ wallet_id: reward_details1.refferal })
            let maxValue2 = buyed_plan2.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan2.plan_details[0].amount))
            if (maxValue2 >= "40") {
                await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details2.level_reward.length < 4) {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details2.updateOne({ level_reward: [...reward_details2.level_reward, { level: 2, reward: rewardValue * 0.2, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details3 = await rewardModel.findOne({ wallet_id: reward_details2.refferal })
            if (!reward_details3) {
                return true
            }
            let buyed_plan3 = await planModel.findOne({ wallet_id: reward_details2.refferal })
            let maxValue3 = buyed_plan3.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan3.plan_details[0].amount))
            if (maxValue3 >= "40") {
                await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details3.level_reward.length < 4) {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details3.updateOne({ level_reward: [...reward_details3.level_reward, { level: 3, reward: rewardValue * 0.1, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details4 = await rewardModel.findOne({ wallet_id: reward_details3.refferal })
            if (!reward_details4) {
                return true
            }
            let buyed_plan4 = await planModel.findOne({ wallet_id: reward_details3.refferal })
            let maxValue4 = buyed_plan4.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan4.plan_details[0].amount))
            if (maxValue4 >= "40") {
                await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details4.level_reward.length < 4) {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details4.updateOne({ level_reward: [...reward_details4.level_reward, { level: 4, reward: rewardValue * 0.05, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
            let reward_details5 = await rewardModel.findOne({ wallet_id: reward_details4.refferal })
            if (!reward_details5) {
                return true
            }
            let buyed_plan5 = await planModel.findOne({ wallet_id: reward_details4.refferal })
            let maxValue5 = buyed_plan5.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan5.plan_details[0].amount))
            if (maxValue5 >= "40") {
                await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details5.level_reward.length < 4) {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details5.updateOne({ level_reward: [...reward_details5.level_reward, { level: 5, reward: rewardValue * 0.04, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details6 = await rewardModel.findOne({ wallet_id: reward_details5.refferal })
            if (!reward_details6) {
                return true
            }
            let buyed_plan6 = await planModel.findOne({ wallet_id: reward_details5.refferal })
            let maxValue6 = buyed_plan6.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan6.plan_details[0].amount))
            if (maxValue6 >= "40") {
                await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details6.level_reward.length < 4) {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details6.updateOne({ level_reward: [...reward_details6.level_reward, { level: 6, reward: rewardValue * 0.03, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details7 = await rewardModel.findOne({ wallet_id: reward_details6.refferal })
            if (!reward_details7) {
                return true
            }
            let buyed_plan7 = await planModel.findOne({ wallet_id: reward_details6.refferal })
            let maxValue7 = buyed_plan7.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan7.plan_details[0].amount))
            if (maxValue7 >= "40") {
                await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details7.level_reward.length < 4) {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details7.updateOne({ level_reward: [...reward_details7.level_reward, { level: 7, reward: rewardValue * 0.02, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details8 = await rewardModel.findOne({ wallet_id: reward_details7.refferal })
            if (!reward_details8) {
                return true
            }
            let buyed_plan8 = await planModel.findOne({ wallet_id: reward_details7.refferal })
            let maxValue8 = buyed_plan8.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan8.plan_details[0].amount))
            if (maxValue8 >= "40") {
                await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details8.level_reward.length < 4) {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details8.updateOne({ level_reward: [...reward_details8.level_reward, { level: 8, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details9 = await rewardModel.findOne({ wallet_id: reward_details8.refferal })
            if (!reward_details9) {
                return true
            }
            let buyed_plan9 = await planModel.findOne({ wallet_id: reward_details8.refferal })
            let maxValue9 = buyed_plan9.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan9.plan_details[0].amount))
            if (maxValue9 >= "40") {
                await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details9.level_reward.length < 4) {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details9.updateOne({ level_reward: [...reward_details9.level_reward, { level: 9, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details10 = await rewardModel.findOne({ wallet_id: reward_details9.refferal })
            if (!reward_details10) {
                return true
            }
            let buyed_plan10 = await planModel.findOne({ wallet_id: reward_details9.refferal })
            let maxValue10 = buyed_plan10.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan10.plan_details[0].amount))
            if (maxValue10 >= "40") {
                await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details10.level_reward.length < 4) {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details10.updateOne({ level_reward: [...reward_details10.level_reward, { level: 10, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details11 = await rewardModel.findOne({ wallet_id: reward_details10.refferal })
            if (!reward_details11) {
                return true
            }
            let buyed_plan11 = await planModel.findOne({ wallet_id: reward_details10.refferal })
            let maxValue11 = buyed_plan11.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan11.plan_details[0].amount))
            if (maxValue11 >= "40") {
                await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details11.level_reward.length < 4) {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details11.updateOne({ level_reward: [...reward_details11.level_reward, { level: 11, reward: rewardValue * 0.01, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details12 = await rewardModel.findOne({ wallet_id: reward_details11.refferal })
            if (!reward_details12) {
                return true
            }
            let buyed_plan12 = await planModel.findOne({ wallet_id: reward_details11.refferal })
            let maxValue12 = buyed_plan12.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan12.plan_details[0].amount))
            if (maxValue12 >= "40") {
                await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details12.level_reward.length < 4) {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details12.updateOne({ level_reward: [...reward_details12.level_reward, { level: 12, reward: rewardValue * 0.5, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details13 = await rewardModel.findOne({ wallet_id: reward_details12.refferal })
            if (!reward_details13) {
                return true
            }
            let buyed_plan13 = await planModel.findOne({ wallet_id: reward_details12.refferal })
            let maxValue13 = buyed_plan13.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan13.plan_details[0].amount))
            if (maxValue13 >= "40") {
                await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details13.level_reward.length < 4) {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details13.updateOne({ level_reward: [...reward_details13.level_reward, { level: 13, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details14 = await rewardModel.findOne({ wallet_id: reward_details13.refferal })
            if (!reward_details14) {
                return true
            }
            let buyed_plan14 = await planModel.findOne({ wallet_id: reward_details13.refferal })
            let maxValue14 = buyed_plan14.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan14.plan_details[0].amount))
            if (maxValue14 >= "40") {
                await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details14.level_reward.length < 4) {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details14.updateOne({ level_reward: [...reward_details14.level_reward, { level: 14, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }

            let reward_details15 = await rewardModel.findOne({ wallet_id: reward_details14.refferal })
            if (!reward_details15) {
                return true
            }
            let buyed_plan15 = await planModel.findOne({ wallet_id: reward_details14.refferal })
            let maxValue15 = buyed_plan15.plan_details.reduce((max, obj) => {
                let numericValue = parseInt(obj.amount)
                return numericValue > max ? numericValue : max
            }, parseInt(buyed_plan15.plan_details[0].amount))
            if (maxValue15 >= "40") {
                await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
            } else {
                if (reward_details15.level_reward.length < 4) {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, ...((+obj.amount) <= maxValue1 ? {} : { status: "missed Reword" }) }] })
                } else {
                    await reward_details15.updateOne({ level_reward: [...reward_details15.level_reward, { level: 15, reward: rewardValue * 0.005, ...obj, user_id: userId, invited_member_id: childWallet, status: "missed" }] })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

export { house_rewards_service, level_reward_service }