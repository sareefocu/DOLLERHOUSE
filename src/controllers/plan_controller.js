import planModel from "../models/plan_model.js";
import logHelper from "../helpers/logHelper.js";
import constants from "../config/constants.js";
import userModel from "../models/user_model.js";
import rewardModel from "../models/reward_model.js";
import ref from "../models/RefSchema.js";
import ref40 from "../models/RefSchema1.js";
import ref100 from "../models/RefSchema2.js";
import ref200 from "../models/RefSchema3.js";
import ref500 from "../models/RefSchema4.js";
import ref1000 from "../models/RefSchema5.js";
import ref2000 from "../models/RefSchema6.js";
import ref4000 from "../models/RefSchema7.js";
import { house_rewards_service, level_reward_service } from "../services/houseRewardService.js";
const logger = logHelper.getInstance({ appName: constants.app_name })
const findUpline = async (refId, refModel, refModel2) => {
    const refData = await ref.findOne({ refId: refId });
    if (refData) {
        // Check if the ref exists in the refModel2 collection
        const ref40Data = await refModel.findOne({ refId: refData.refId });
        console.log("ref40Data", ref40Data);
        if (ref40Data !== null) {
            return ref40Data;
        } else {
            return findUpline(refData.mainId, refModel, refModel2);
        }
    } else {
        return null;
    }
};
function calculatePercentageBasedOnLength(length, thresholds, percentages, fallbackPercentage) {
    for (let i = 0; i < thresholds.length; i++) {
        if (length <= thresholds[i]) {
            return percentages[i] * length / 100;
        }
    }
    return fallbackPercentage * length / 100;
}
async function getRef(refSelectedId, refId, id, refModel, refModel2, plandata, misseduser) {
    const refSelected = await refModel.findOne({ refId: refSelectedId });
    const refSelectedq = await refModel2.findOne({ refId: refSelectedId });
    const refExists11 = await userModel.findOne({ wallet_id: id });
    if (refSelectedq !== null) {
        if (refSelected.referred.length < 2) {
            const newRef = await refModel.create({
                refId: id,
                mainId: refId,
                supporterId: refSelected.refId,
                uid: refExists11.user_id,
                referred: [],
                misseduser: misseduser !== undefined ? misseduser : ""
            });
            refSelected.referred.push(newRef.refId);
            refSelected.save();
        } else {
            await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id, refModel, refModel2, plandata, misseduser);
            refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
            await refSelected.save();
        }
    } else {
        if (refSelected.referred.length < 2) {
            const newRef = await refModel.create({
                refId: id,
                mainId: refId,
                supporterId: refSelected.refId,
                uid: refExists11.user_id,
                referred: [],
                misseduser: misseduser !== undefined ? misseduser : ""
            });
            refSelected.referred.push(newRef.refId);
            refSelected.save();
        } else {
            await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id, refModel, refModel2, plandata, misseduser);
            refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
            await refSelected.save();
        }
    }
}

async function getRef2(refSelectedId, refId, id, newLeval, refModel, refModel2, plandata) {
    const refSelected = await refModel.findOne({ refId: refSelectedId });

    console.log("//=================//refId//==============", refId);
    // const refExists11 = await userModel.findOne({ wallet_id: id });
    // const refExists11new = await ref.findOne({ refId: id });
    const refExists123aaa = await refModel.findOne({ refId: refId });
    const refExists123 = await refModel.find({ uid: refExists123aaa.uid });
    console.log("//=================//refSelected//==============", refExists123aaa);

    for (let index = 0; index < refExists123.length; index++) {
        const element = refExists123[index];
        const ids = refId;
        let memberDetails12 = await refModel.aggregate([
            {
                $match: {
                    refId: element.refId,
                },
            },
            {
                $graphLookup: {
                    from: plandata,
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        if (memberDetails12[0].referBY.length <= 62) {
            const refExists11new = await refModel.findOne({ refId: id });
            const newuserdata = await refModel.find({ refId: id });
            const refExists = await refModel.findOne({ refId: element.refId });
            if (refExists.referred.length < 2) {
                const newiduser = await refModel.findOne({ refId: id });
                const newRef = await refModel.create({
                    refId: id + `.` + newLeval,
                    mainId: refId,
                    supporterId: element.refId,
                    uid: refExists11new?.uid,
                    referred: [],
                    leval: newuserdata.length
                });
                element.referred.push(newRef.refId);
                element.save();
            } else {
                await getRef2(refExists.referred[refExists.nextRefIndex], refExists.referred[refExists.nextRefIndex], id, newLeval, refModel, refModel2, plandata);
                refExists.nextRefIndex = refExists.nextRefIndex + 1 > 1 ? 0 : refExists.nextRefIndex + 1;
                await refExists.save();
            }
        }
    }
}

const processReferral = async (id, refId, refModel, refModel2, plandata) => {
    try {
        if (!id) return 'Invalid id';
        console.log("id, refId", id, refId);
        const refExists = await rewardModel.findOne({ wallet_id: id });
        const idAlreadyExists = await refModel.findOne({ refId: id });
        if (idAlreadyExists) return 'Invalid id, already exists';
        const idAlreadyExists11 = await refModel.findOne({ refId: refExists.refferal });
        console.log("id, refId", refExists.refferal);
        if (idAlreadyExists11 == null) {
            console.log("idAlreadyExists", idAlreadyExists);
            const uplineData = await findUpline(refExists.refferal, refModel, refModel2);
            console.log("Upline Data:", uplineData);
            if (uplineData !== null) {
                if (uplineData.referred.length < 2) {
                    const newRef = await refModel.create({
                        refId: id,
                        mainId: uplineData.refId,
                        misseduser: refExists.refferal,
                        supporterId: uplineData.refId || uplineData.refId,
                        uid: refExists.user_id,
                        referred: [],
                    });
                    uplineData.referred.push(id);
                    await uplineData.save(); // Save the changes to uplineData
                    console.log("uplineData", uplineData);
                } else {
                    console.log("refExistsrefExists1.referred", uplineData.referred);
                    await getRef(uplineData.referred[uplineData.nextRefIndex], uplineData.refId, id, refModel, refModel2, plandata, refExists.refferal);
                    uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
                    await uplineData.save(); // Save the changes to uplineData
                }
            } else {
                const newRef = await refModel.create({
                    refId: id,
                    mainId: uplineData?.refId ? uplineData?.refId : null,
                    uid: refExists.user_id,
                    misseduser: refExists.refferal,
                    supporterId: uplineData?.refId ? uplineData?.refId : null,
                    referred: [],
                });
            }
        }


        if (!refId) return res.send('Invalid refId');

        const refExists1 = await refModel.findOne({ refId: refId, leval: 0 });
        if (!refExists1) return res.send('Invalid referral link');

        const refExists123aaa = await refModel.findOne({ refId: refId });
        const refExists123 = await refModel.find({ uid: refExists123aaa.uid });
        for (let index = 0; index < refExists123.length; index++) {
            const element = refExists123[index];
            const refExists = await refModel.findOne({ refId: element.refId, leval: element.leval });
            let memberDetails12 = await refModel.aggregate([
                {
                    $match: {
                        refId: element.refId,
                        leval: element.leval
                    },
                },
                {
                    $graphLookup: {
                        from: plandata,
                        startWith: "$refId",
                        connectFromField: "refId",
                        depthField: "depthleval",
                        connectToField: "supporterId",
                        as: "referBY",
                    },
                },
                {
                    $lookup: {
                        from: "plan_buyeds",
                        localField: "referBY.refId",
                        foreignField: "wallet_id",
                        as: "result",
                    },
                },
                {
                    $addFields: {
                        referBY: {
                            $map: {
                                input: "$referBY",
                                as: "refer",
                                in: {
                                    $mergeObjects: [
                                        "$$refer",
                                        {
                                            result: {
                                                $filter: {
                                                    input: "$result",
                                                    as: "res",
                                                    cond: {
                                                        $eq: [
                                                            "$$res.wallet_id",
                                                            "$$refer.refId",
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        result: 0, // Optionally remove the 'result' field from the output
                    },
                },
            ]
            )
            console.log("memberDetails12[0].referBY.length==================>>", memberDetails12[0].referBY.length);
            if (memberDetails12[0].referBY.length === 61) {
                const refExistsrefExists1 = await refModel.findOne({ refId: element.supporterId, leval: element.leval });
                const newLeval = element.leval + 1;
                console.log(refExistsrefExists1.refId);
                const uplineData = await findUpline(refExistsrefExists1.refId, refModel, refModel2)
                console.log("Upline Data================================>>>>>>>>>>>:", uplineData);
                if (uplineData !== null) {
                    if (uplineData.referred.length < 2) {
                        const newRef = await refModel.create({
                            refId: element.refId + `.` + newLeval,
                            mainId: uplineData.refId,
                            supporterId: uplineData.refId || uplineData.refId,
                            uid: element.uid,
                            referred: [],
                            leval: newLeval
                        });
                        uplineData.referred.push(newRef.refId);
                        await uplineData.save();
                    } else {
                        const newLeval = element.leval + 1;
                        console.log("refExistsrefExists1.referred", uplineData.referred);
                        await getRef2(uplineData.referred[uplineData.nextRefIndex], uplineData.refId, element.refId, newLeval, refModel, refModel2, plandata);
                        uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
                        await uplineData.save();
                    }
                } else {
                    const newRef = await refModel.create({
                        refId: element.refId + `.` + newLeval,
                        mainId: null,
                        supporterId: null,
                        uid: element.uid,
                        referred: [],
                        leval: newLeval
                    });
                }

            }
            if (memberDetails12[0].referBY.length <= 61) {
                const refExists11 = await refModel.findOne({ refId: element.refId, leval: element.leval });
                const refExists1140 = await refModel2.findOne({ uid: element.uid });
                const refExists111 = await userModel.findOne({ wallet_id: id });
                if (element.leval > 0 && refExists1140 === null) {
                    const uplineData = await findUpline(refExists11.refId, refModel, refModel2)
                    if (uplineData?.referred.length < 2) {
                        const newRef = await refModel.create({
                            refId: id,
                            mainId: uplineData.refId,
                            supporterId: uplineData.refId,
                            uid: refExists111.user_id,
                            referred: [],
                        });

                        uplineData.referred.push(newRef.refId);
                        await uplineData.save();
                        //   res.send(added);
                    } else {
                        await getRef(uplineData.referred[uplineData.nextRefIndex], refId, id, refModel, refModel2, plandata);
                        uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
                        await uplineData.save();
                    }
                } else {
                    console.log("refExists", refExists);
                    if (refExists?.referred.length < 2) {
                        const newRef = await refModel.create({
                            refId: id,
                            mainId: refExists.refId,
                            supporterId: refExists.refId,
                            uid: refExists111.user_id,
                            referred: [],
                        });

                        refExists.referred.push(newRef.refId);
                        await refExists.save();
                        //   res.send(added);
                    } else {
                        await getRef(refExists.referred[refExists.nextRefIndex], refId, id, refModel, refModel2, plandata);
                        refExists.nextRefIndex = refExists.nextRefIndex + 1 > 1 ? 0 : refExists.nextRefIndex + 1;
                        await refExists.save();
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        return 'An error occurred';
    }
};

const createPlanController = async (req, res) => {
    let WalletId = (req.body.wallet_id)?.toLowerCase();
    let Refferal = (req.body.refferal)?.toLowerCase();
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
        const refId = Refferal;
        const id = WalletId;
        let plandata = req.body.plan_details[0].amount == 20 ? "refs" : req.body.plan_details[0].amount == 40 ? "ref40" : req.body.plan_details[0].amount == 100 ? "ref100" : req.body.plan_details[0].amount == 200 ? "ref200" : req.body.plan_details[0].amount == 500 ? "ref500" : req.body.plan_details[0].amount == 1000 ? "ref1000" : req.body.plan_details[0].amount == 2000 ? "ref2000" : "ref4000"
        if (req.body.plan_details[0].amount == 40) {
            console.log("req.body.plan_details[0].amount", req.body.plan_details[0].amount);
            await processReferral(id, refId, ref40, ref100, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        console.log("req.body.plan_details[0].amount", req.body.plan_details[0].amount);
        if (req.body.plan_details[0].amount == 100) {
            await processReferral(id, refId, ref100, ref200, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        if (req.body.plan_details[0].amount == 200) {
            await processReferral(id, refId, ref200, ref500, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        if (req.body.plan_details[0].amount == 500) {
            await processReferral(id, refId, ref500, ref1000, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        if (req.body.plan_details[0].amount == 1000) {
            await processReferral(id, refId, ref1000, ref2000, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        if (req.body.plan_details[0].amount == 2000) {
            await processReferral(id, refId, ref2000, ref4000, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
        }
        if (req.body.plan_details[0].amount == 4000) {
            await processReferral(id, refId, ref4000, ref4000, plandata).then(() => {
                console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
            }).catch((error) => {
                console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
            })
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
};
const getPlanController = async (req, res) => {
    try {
        console.log(req.query.userid);
        const resp = await planModel.findOne({ $or: [{ wallet_id: req.query.walletid }, { user_id: req.query.userid }] });

        if (!resp) {
            return res.status(404).json({
                status: "NotFound",
                message: "Invalid wallet id or user id",
            });
        }

        const memberDetails12 = await rewardModel.findOne({ wallet_id: resp.wallet_id });

        const data1 = {
            r20: memberDetails12?.house_reward?.filter(item => item.amount == 20).length,
            r40: memberDetails12?.house_reward?.filter(item => item.amount == 40).length,
            r100: memberDetails12?.house_reward?.filter(item => item.amount == 100).length,
            r200: memberDetails12?.house_reward?.filter(item => item.amount == 200).length,
            r500: memberDetails12?.house_reward?.filter(item => item.amount == 500).length,
            r1000: memberDetails12?.house_reward?.filter(item => item.amount == 1000).length,
            r2000: memberDetails12?.house_reward?.filter(item => item.amount == 2000).length,
            r4000: memberDetails12?.house_reward?.filter(item => item.amount == 4000).length,
        };

        const now = new Date(); // Get current time
        const currentTimestamp = new Date().getTime();
        const twentyFourHoursAgo = currentTimestamp - (24 * 60 * 60 * 1000);
        // Calculate innerAmountSum for each amount
        let h520 = await ref.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "refs",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum20 = 0;
        let innerAmount24Sum20 = 0;
        h520.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum20 += 5 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum20 += 5 * parse / 100;
                }
            });
        });
        let h540 = await ref40.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref40",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum40 = 0;
        let innerAmount24Sum40 = 0;
        h540.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum40 += 10 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum40 += 10 * parse / 100;
                }
            });
        });
        let h5100 = await ref100.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref100",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum100 = 0;
        let innerAmount24Sum100 = 0;
        h5100.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum100 += 10 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum100 += 10 * parse / 100;
                }
            });
        });
        let h5200 = await ref200.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref200",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum200 = 0;
        let innerAmount24Sum200 = 0;
        h5200.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum200 += 10 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum200 += 10 * parse / 100;
                }
            });
        });
        let h5500 = await ref500.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref500",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum500 = 0;
        let innerAmount24Sum500 = 0;
        h5500.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum500 += 20 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum500 += 20 * parse / 100;
                }
            });
        });
        let h51000 = await ref1000.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref1000",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum1000 = 0;
        let innerAmount24Sum1000 = 0;
        h51000.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum1000 += 50 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum1000 += 50 * parse / 100;
                }
            });
        });
        let h52000 = await ref2000.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref2000",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum2000 = 0;
        let innerAmount24Sum2000 = 0;
        h52000.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum2000 += 100 * parse / 100;

                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum2000 += 100 * parse / 100;
                }
            });
        });
        let h54000 = await ref4000.aggregate([
            {
                $match: {
                    refId: resp.wallet_id,
                },
            },
            {
                $graphLookup: {
                    from: "ref4000",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    maxDepth: 5,
                    connectToField: "supporterId",
                    as: "referBY",
                },
            },
            {
                $lookup: {
                    from: "plan_buyeds",
                    localField: "referBY.refId",
                    foreignField: "wallet_id",
                    as: "result",
                },
            },
            {
                $addFields: {
                    referBY: {
                        $map: {
                            input: "$referBY",
                            as: "refer",
                            in: {
                                $mergeObjects: [
                                    "$$refer",
                                    {
                                        result: {
                                            $filter: {
                                                input: "$result",
                                                as: "res",
                                                cond: {
                                                    $eq: [
                                                        "$$res.wallet_id",
                                                        "$$refer.refId",
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    result: 0, // Optionally remove the 'result' field from the output
                },
            },
        ]
        )
        let innerAmountSum4000 = 0;
        let innerAmount24Sum4000 = 0;
        h54000.forEach(item => {
            item.referBY.forEach(refer => {
                let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                innerAmountSum4000 += 200 * parse / 100;
                const incomeTimestamp = new Date(refer.createdAt);
                if (incomeTimestamp > twentyFourHoursAgo && incomeTimestamp <= now) {
                    let parse = refer.depthleval + 1 === 1 ? 0 : refer.depthleval + 1 === 2 ? 10 : refer.depthleval + 1 === 3 ? 20 : refer.depthleval + 1 === 4 ? 20 : refer.depthleval + 1 === 5 ? 50 : 0
                    innerAmount24Sum4000 += 200 * parse / 100;
                }
            });
        });
        let totalSlotSum = (
            memberDetails12?.house_reward?.filter(item => item.amount === 20).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 20 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 20).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 20 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 40).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 40 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 40).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 40 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 100).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 100 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 100).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 100 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 200).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 200 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 200).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 200 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 500).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 500 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 500).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 500 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 1000).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 1000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 1000).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 1000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 2000).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 2000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 2000).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 2000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 4000).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 4000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 4000).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 4000 && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0)
        );


        // Timestamp of 24 hours ago
        let totalSlotSum24 = (
            memberDetails12?.house_reward?.filter(item => item.amount === 20 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 20 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 20 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 20 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 40 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 40 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 40 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 40 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 100 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 100 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 100 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 100 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 200 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 200 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 200 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 200 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 500 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 500 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 500 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 500 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 1000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 1000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 1000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 1000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 2000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 2000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 2000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 2000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0) +
            memberDetails12?.house_reward?.filter(item => item.amount === 4000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.house_reward, 0) -
            memberDetails12?.house_reward?.filter(item => item.amount === 4000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.house_reward, 0) +
            memberDetails12?.level_reward?.filter(item => item.amount === 4000 && item.Time >= twentyFourHoursAgo).reduce((sum, item) => sum + item.reward, 0) -
            memberDetails12?.level_reward?.filter(item => item.amount === 4000 && item.Time >= twentyFourHoursAgo && item.status === 'missed Reword').reduce((sum, item) => sum + item.reward, 0)
        );
        // Current timestamp

        // Filter data within the last 24 hours


        // Calculate the total rewards for each specific amount

        // Calculate the sum of 24-hour income
        let sum24HourIncome = (
            innerAmountSum20 +
            innerAmountSum40 +
            innerAmountSum100 +
            innerAmountSum200 +
            innerAmountSum500 +
            innerAmountSum1000 +
            innerAmountSum2000 +
            innerAmountSum4000
        );

        return res.send({
            message: "Your Plan fetched successfully",
            status: "Ok",
            data: resp,
            data1: data1,
            data2: {
                r20: memberDetails12?.house_reward?.filter(item => item.amount == 20).length,
                r40: memberDetails12?.house_reward?.filter(item => item.amount == 40).length,
                r100: memberDetails12?.house_reward?.filter(item => item.amount == 100).length,
                r200: memberDetails12?.house_reward?.filter(item => item.amount == 200).length,
                r500: memberDetails12?.house_reward?.filter(item => item.amount == 500).length,
                r1000: memberDetails12?.house_reward?.filter(item => item.amount == 1000).length,
                r2000: memberDetails12?.house_reward?.filter(item => item.amount == 2000).length,
                r4000: memberDetails12?.house_reward?.filter(item => item.amount == 4000).length,
            },
            data3: {
                h120all: memberDetails12?.house_reward?.filter(item => item.amount == 20).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h120miss: 0,
                h140all: memberDetails12?.house_reward?.filter(item => item.amount == 40).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h140miss: memberDetails12?.house_reward?.filter(item => item.amount == 40 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1100all: memberDetails12?.house_reward?.filter(item => item.amount == 100).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1100miss: memberDetails12?.house_reward?.filter(item => item.amount == 100 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1200all: memberDetails12?.house_reward?.filter(item => item.amount == 200).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1200miss: memberDetails12?.house_reward?.filter(item => item.amount == 200 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1500all: memberDetails12?.house_reward?.filter(item => item.amount == 500).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1500miss: memberDetails12?.house_reward?.filter(item => item.amount == 500 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h11000all: memberDetails12?.house_reward?.filter(item => item.amount == 1000).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h11000miss: memberDetails12?.house_reward?.filter(item => item.amount == 1000 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h12000all: memberDetails12?.house_reward?.filter(item => item.amount == 2000).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h12000miss: memberDetails12?.house_reward?.filter(item => item.amount == 2000 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h14000all: memberDetails12?.house_reward?.filter(item => item.amount == 4000).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h14000miss: memberDetails12?.house_reward?.filter(item => item.amount == 4000 && item.status === undefined).reduce((sum, item) => {
                    if (item.status === undefined) {
                        return sum + item.house_reward;
                    } else {
                        return sum;
                    }
                }, 0),
                h1520all: memberDetails12?.level_reward?.filter(item => item.amount == 20).reduce((sum, item) => sum + item.reward, 0),
                h1520miss: 0,
                h1540all: memberDetails12?.level_reward?.filter(item => item.amount == 40).reduce((sum, item) => sum + item.reward, 0),
                h1540miss: 0,
                h15100all: memberDetails12?.level_reward?.filter(item => item.amount == 100).reduce((sum, item) => sum + item.reward, 0),
                h15100miss: 0,
                h15200all: memberDetails12?.level_reward?.filter(item => item.amount == 200).reduce((sum, item) => sum + item.reward, 0),
                h15200miss: 0,
                h15500all: memberDetails12?.level_reward?.filter(item => item.amount == 500).reduce((sum, item) => sum + item.reward, 0),
                h15500miss: 0,
                h151000all: memberDetails12?.level_reward?.filter(item => item.amount == 1000).reduce((sum, item) => sum + item.reward, 0),
                h151000miss: 0,
                h152000all: memberDetails12?.level_reward?.filter(item => item.amount == 2000).reduce((sum, item) => sum + item.reward, 0),
                h152000miss: 0,
                h154000all: memberDetails12?.level_reward?.filter(item => item.amount == 4000).reduce((sum, item) => sum + item.reward, 0),
                h154000miss: 0,
                innerAmountSum20: innerAmountSum20,
                innerAmountSum40: innerAmountSum40,
                innerAmountSum100: innerAmountSum100,
                innerAmountSum200: innerAmountSum200,
                innerAmountSum500: innerAmountSum500,
                innerAmountSum1000: innerAmountSum1000,
                innerAmountSum2000: innerAmountSum2000,
                innerAmountSum4000: innerAmountSum4000,
            },
            data4: {
                totalSlotSum: totalSlotSum + innerAmountSum20 + innerAmountSum40 + innerAmountSum100 + innerAmountSum200 + innerAmountSum500 + innerAmountSum1000 + innerAmountSum2000 + innerAmountSum4000,
                totalSlotSum240: totalSlotSum24 + innerAmount24Sum20 + innerAmount24Sum40 + innerAmount24Sum100 + innerAmount24Sum200 + innerAmount24Sum500 + innerAmount24Sum1000 + innerAmount24Sum2000 + innerAmount24Sum4000,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Something went wrong",
            status: error,
        });
    }
};

export { createPlanController, getPlanController }
