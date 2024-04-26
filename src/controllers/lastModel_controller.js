import constants from "../config/constants.js";
import logHelper from "../helpers/logHelper.js";
import teamModel from "../models/team_model.js";
import userModel from "../models/user_model.js";
import ref from "../models/RefSchema.js";
import ref40 from "../models/RefSchema1.js";
import ref100 from "../models/RefSchema2.js";
import ref200 from "../models/RefSchema3.js";
import ref500 from "../models/RefSchema4.js";
import ref1000 from "../models/RefSchema5.js";
import ref2000 from "../models/RefSchema6.js";
import ref4000 from "../models/RefSchema7.js";

const logger = logHelper.getInstance({ appName: constants.app_name });
// const findUpline = async (refId) => {
//     // Find the ref data based on the refId in the ref collection
//     const refData = await ref.findOne({ refId: refId });

//     if (refData.mainId !== null) {
//         // Check if the ref exists in the ref40 collection
//         const ref40Data = await ref40.findOne({ refId: refData.refId });
//         if (ref40Data?.mainId !== null) {
//             // If the ref data doesn't exist in the ref40 collection, recursively find the upline
//             await findUpline(refData.mainId);
//         } else {
//             console.log(ref40Data);
//             return ref40Data;
//         }
//     }
// };
const findUpline = async (refId) => {
    // Find the ref data based on the refId in the ref collection
    const refData = await ref.findOne({ refId: refId });

    if (refData.mainId !== null) {
        // Check if the ref exists in the ref40 collection
        const ref40Data = await ref40.findOne({ refId: refData.refId });
        if (ref40Data?.mainId !== null) {
            // If the ref data doesn't exist in the ref40 collection, recursively find the upline
            return findUpline(refData.mainId); // Return the result of the recursive call
        } else {
            return refData;
        }
    }
};

// Call the function and log the result

// const data2 = findUpline("0x83de05433055babae0d508a2342a75b67aeba70a").then(async (e) => {
//     console.log("e", e);
// })
// console.log(data2);
const setdata = async (plandata, a, b, ref1, res) => {
    let pipeline = [
        {
            $match: {
                refId: b === "" ? a : a + b,
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
            $addFields: {
                referBY: {
                    $map: {
                        input: "$referBY",
                        as: "item",
                        in: {
                            $mergeObjects: [
                                "$$item",
                                {
                                    depthData: {
                                        $filter: {
                                            input: "$referBY",
                                            as: "innerItem",
                                            cond: {
                                                $eq: [
                                                    "$$innerItem.supporterId",
                                                    "$$item.refId",
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
            $match: {
                referBY: { $ne: [] }, // Ensure referBY array is not empty after filtering
                // Add any additional conditions here if needed
            },
        },
        {
            $addFields: {
                referBY: {
                    $map: {
                        input: "$referBY",
                        as: "outerItem",
                        in: {
                            $mergeObjects: [
                                "$$outerItem",
                                {
                                    depthData: {
                                        $map: {
                                            input: "$$outerItem.depthData",
                                            as: "innerItem",
                                            in: {
                                                $mergeObjects: [
                                                    "$$innerItem",
                                                    {
                                                        depthData: {
                                                            $filter: {
                                                                input: "$referBY",
                                                                as: "innerInnerItem",
                                                                cond: {
                                                                    $eq: [
                                                                        "$$innerInnerItem.supporterId",
                                                                        "$$innerItem.refId",
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
                            ],
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "referBY.depthData.refId",
                foreignField: "wallet_id",
                as: "userIds",
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
                                    userIds: "$userIds",
                                    depthData: {
                                        $map: {
                                            input: "$$refer.depthData",
                                            as: "depthItem",
                                            in: {
                                                $mergeObjects: [
                                                    "$$depthItem",
                                                    {
                                                        userIds: {
                                                            $arrayElemAt: [
                                                                {
                                                                    $map: {
                                                                        input: {
                                                                            $filter: {
                                                                                input: "$userIds",
                                                                                as: "user",
                                                                                cond: {
                                                                                    $eq: [
                                                                                        "$$user.wallet_id",
                                                                                        "$$depthItem.refId",
                                                                                    ],
                                                                                },
                                                                            },
                                                                        },
                                                                        as: "filteredUser",
                                                                        in: "$$filteredUser.user_id",
                                                                    },
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                    },
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
                referBY: 1,
            },
        },
    ];
    let memberDetails = await ref1.aggregate(pipeline);
    let memberDetails12 = await ref1.aggregate([
        {
            $match: {
                refId: b === "" ? a : a + b,
            },
        },
        {
            $graphLookup: {
                from: plandata,
                startWith: "$refId",
                connectFromField: "refId",
                depthField: "depthleval",
                connectToField: "supporterId",
                maxDepth: 4,
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
    const refExists = await ref1.findOne({ refId: a });
    memberDetails12[0]?.referBY.forEach(async (item) => {
        const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
        if (!refIdExists) {
            refExists.missedusers.push({
                uid: item.uid,
                refId: item.refId,
                mainId: item.mainId,
                supporterId: item.supporterId,
                depthleval: item.depthleval,
                status: "done",
                createdAt: item.createdAt
            });
        }
        const refExists111neww = await ref.findOne({ refId: item.refId });
        console.log("refExists111neww", refExists111neww);
    });
    await refExists?.save(); // Save changes to the document
    if (!memberDetails) {
        return res.send({ message: "team not found" })
    }
    let userdata = await ref1.findOne({ refId: a })
    const filteredData = memberDetails[0]?.referBY.filter(item => item.depthleval === 0);
    const filteredDatalastwor = memberDetails[0]?.referBY.filter(item => item.depthleval === 4);
    res.send({ data: filteredData, data1: memberDetails12, filteredDatalastwor: filteredDatalastwor, userdata: userdata })
}
const setdata1122233 = async (plandata, a, b, ref1) => {
    try {
        let memberDetails12 = await ref1.aggregate([
            {
                $match: {
                    refId: b === "" ? a : a + b,
                },
            },
            {
                $graphLookup: {
                    from: plandata,
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    connectToField: "supporterId",
                    maxDepth: 4,
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
        const refExists = await ref1.findOne({ refId: a });
        memberDetails12[0]?.referBY.forEach(async (item) => {
            const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
            if (!refIdExists) {
                refExists.missedusers.push({
                    uid: item.uid,
                    refId: item.refId,
                    mainId: item.mainId,
                    supporterId: item.supporterId,
                    depthleval: item.depthleval,
                    status: "done",
                    createdAt: item.createdAt
                });
            }
        });
        await refExists?.save(); // Save changes to the document
        let userdata = await ref1.find({ refId: a })
        console.log("aaaaa", a);
        const refExists111neww = await ref1.find({ misseduser: a });
        return { userdata: userdata, missedUser: refExists111neww }
    } catch (error) {
        return {}; // Re-throw the error to be caught by the caller
    }
}


const setdata11 = async (req, res) => {
    try {
        const id = req.params.id;
        let memberDetails1 = await userModel.findOne({ user_id: id });
        let a = memberDetails1.wallet_id.slice('.');
        let b = "";

        console.log("b", b);
        console.log("a", a);
        console.log("a + b", a + b);
        const promises = [
            setdata1122233("refs", a, b, ref),
            setdata1122233("ref40", a, b, ref40),
            setdata1122233("ref100", a, b, ref100),
            setdata1122233("ref200", a, b, ref200),
            setdata1122233("ref500", a, b, ref500),
            setdata1122233("ref1000", a, b, ref1000),
            setdata1122233("ref2000", a, b, ref2000),
            setdata1122233("ref4000", a, b, ref4000)
        ];
        // Wait for all promises to resolve
        const results = await Promise.all(promises);

        // Send the response with results
        res.send({ data: results });
    } catch (error) {
        console.error("Error in setdata11:", error);
        res.status(500).send({ message: "Internal server error" });
    }
};

async function getRef(refSelectedId, refId, id) {
    const refSelected = await ref.findOne({ refId: refSelectedId });
    const refSelectedq = await ref40.findOne({ refId: refSelectedId });
    const refExists11 = await userModel.findOne({ wallet_id: id });
    if (refSelectedq !== null) {
        if (refSelected.referred.length < 2) {
            const newRef = await ref.create({
                refId: id,
                mainId: refId,
                supporterId: refSelected.refId,
                uid: refExists11.user_id,
                referred: [],
            });
            refSelected.referred.push(newRef.refId);
            refSelected.save();
        } else {
            await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id);
            refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
            await refSelected.save();
        }
    } else {
        if (refSelected.referred.length < 2) {
            const newRef = await ref.create({
                refId: id,
                mainId: refId,
                supporterId: refSelected.refId,
                uid: refExists11.user_id,
                referred: [],
            });
            refSelected.referred.push(newRef.refId);
            refSelected.save();
        } else {
            await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id);
            refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
            await refSelected.save();
        }
    }
}

async function getRef2(refSelectedId, refId, id, newLeval) {
    const refExists123aaa = await ref.findOne({ refId: refId });
    const refExists123 = await ref.find({ uid: refExists123aaa.uid });
    for (let index = 0; index < refExists123.length; index++) {
        const element = refExists123[index];
        const ids = refId;
        let memberDetails12 = await ref.aggregate([
            {
                $match: {
                    refId: element.refId,
                },
            },
            {
                $graphLookup: {
                    from: "refs",
                    startWith: "$refId",
                    connectFromField: "refId",
                    depthField: "depthleval",
                    connectToField: "supporterId",
                    maxDepth: 4,
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
        if (memberDetails12[0].referBY.length <= 61) {
            const refExists11new = await ref.findOne({ refId: id });
            const newuserdata = await ref.find({ refId: id });
            const refExists = await ref.findOne({ refId: element.refId });
            if (refExists.referred.length < 2) {
                console.log("refExists.uid==========================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", refExists.uid);
                const refExistsrefExists1 = await ref.findOne({ refId: id + `.` + newLeval });
                if (refExistsrefExists1 == null) {

                    const newRef = await ref.create({
                        refId: id + `.` + newLeval,
                        mainId: refId,
                        supporterId: element.refId,
                        uid: refExists11new?.uid,
                        referred: [],
                        leval: newuserdata.length
                    });
                    element.referred.push(newRef.refId);
                    element.save();
                }
            } else {
                await getRef2(refExists.referred[refExists.nextRefIndex], refExists.referred[refExists.nextRefIndex], id, newLeval);
                refExists.nextRefIndex = refExists.nextRefIndex + 1 > 1 ? 0 : refExists.nextRefIndex + 1;
                await refExists.save();
            }
        }
    }
}
const processReferral = async (id, refId) => {
    try {
        if (!id) return res.send('Invalid id');
        const idAlreadyExists = await ref.findOne({ refId: id });
        if (idAlreadyExists) return res.send('Invalid id, already exists');
        const isFirstRef = await ref.countDocuments();
        if (!isFirstRef) {
            const newRef = await ref.create({
                refId: id,
                mainId: null,
                uid: "",
                supporterId: null,
                referred: [],
            });
        }

        if (!refId) return res.send('Invalid refId');
        const refExists123aaa = await ref.findOne({ refId: refId });
        const refExists123 = await ref.find({ uid: refExists123aaa?.uid });
        for (let index = 0; index < refExists123.length; index++) {
            const element = refExists123[index];
            const refExists = await ref.findOne({ refId: element.refId, leval: element.leval });
            let memberDetails12 = await ref.aggregate([
                {
                    $match: {
                        refId: element.refId,
                        leval: element.leval
                    },
                },
                {
                    $graphLookup: {
                        from: "refs",
                        startWith: "$refId",
                        connectFromField: "refId",
                        depthField: "depthleval",
                        connectToField: "supporterId",
                        as: "referBY",
                        maxDepth: 4,
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
            console.log("memberDetails12[0].referBY.length", memberDetails12[0].referBY.length);
            if (memberDetails12[0].referBY.length == 61) {
                const refExistsrefExists1 = await ref.findOne({ refId: element.supporterId, leval: element.leval });
                const newLeval = element.leval + 1;
                console.log(refExistsrefExists1.refId.toString());
                findUpline(refExistsrefExists1.refId.toString())
                    .then(async (uplineData) => {
                        if (uplineData !== null) {
                            if (uplineData.referred.length < 2) {
                                const refExistsrefExists1 = await ref.findOne({ refId: element.refId + `.` + newLeval });
                                if (refExistsrefExists1 == null) {
                                    const newRef = await ref.create({
                                        refId: element.refId + `.` + newLeval,
                                        mainId: uplineData.refId,
                                        supporterId: uplineData.refId || uplineData.refId,
                                        uid: element.uid,
                                        referred: [],
                                        leval: newLeval
                                    });
                                    uplineData.referred.push(newRef.refId);
                                    await uplineData.save();
                                }
                            } else {
                                const newLeval = element.leval + 1;
                                await getRef2(uplineData.referred[uplineData.nextRefIndex], uplineData.refId, element.refId, newLeval);
                                uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
                                await uplineData.save();
                            }
                        } else {
                            const refExistsrefExists1 = await ref.findOne({ refId: element.refId + `.` + newLeval });
                            if (refExistsrefExists1 == null) {
                                const newRef = await ref.create({
                                    refId: element.refId + `.` + newLeval,
                                    mainId: null,
                                    supporterId: null,
                                    uid: element.uid,
                                    referred: [],
                                    leval: newLeval
                                });
                                refSelected.referred.push(newRef.refId);
                                refSelected.save();
                            }
                        }
                    })
                    .catch(error => console.error(error));
            }
            if (memberDetails12[0].referBY.length <= 61) {
                const refExists11 = await ref.findOne({ refId: element.refId, leval: element.leval });
                const refExists1140 = await ref40.findOne({ uid: element.uid });
                const refExists111 = await userModel.findOne({ wallet_id: id });
                if (element.leval > 0 && refExists1140 === null) {
                    await findUpline(refExists11.refId)
                        .then(async (uplineData) => {
                            console.log("Upline DataDataDataDataDataDataDataDataDataDataDataData:", uplineData);
                            if (uplineData?.referred.length < 2) {
                                const newRef = await ref.create({
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
                                await getRef(uplineData.referred[uplineData.nextRefIndex], refId, id);
                                uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
                                await uplineData.save();
                            }
                        })
                } else {
                    console.log("refExists", refExists);
                    if (refExists?.referred.length < 2) {
                        const newRef = await ref.create({
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
                        await getRef(refExists.referred[refExists.nextRefIndex], refId, id);
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

const lastModelController = async (req, res) => {
    let walletId = (req.body.wallet_id).toLowerCase();
    let refferalId = (req.body.refferal_id).toLowerCase();
    try {
        let model = await teamModel.findOne({ wallet_id: walletId });
        //console.log(model)
        if (model) {
            return res.send({ message: "this user is already existing" })
        }
        let parent = await teamModel.findOne({ wallet_id: refferalId });

        /// my code
        const refId = refferalId;
        const id = walletId;
        await processReferral(id, refId).then(() => {
            console.log("====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>done<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================================");
        }).catch((error) => {
            console.log("================error===>>>>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>>>>>>>>>>>>error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=error=====================error===", error);
        })
        if (!parent) {
            let user = await userModel.findOne({ wallet_id: walletId })

            if (!user) {
                return res.send({ message: "user not found" })
            }
            let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: refferalId, user_id: user.user_id })
            await modelDetail.save();
            return res.send({ message: "this user is saved" })
        }

        if (parent.refferal_count < 2) {
            let user = await userModel.findOne({ wallet_id: walletId })
            let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: refferalId, user_id: user.user_id })
            await modelDetail.save();

            let parent1 = await teamModel.findOne({ wallet_id: parent.refferal_id });
            await parent.updateOne({ $inc: { refferal_count: 1 } });
            let parent2
            let parent3
            let parent4
            if (parent1) {
                await parent1.updateOne({ refferal_details: [...parent1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.50, level: 1, rewardvalue: "20%" }] });
                parent2 = await teamModel.findOne({ wallet_id: parent1.refferal_id });
            }
            if (parent2) {
                await parent2.updateOne({ refferal_details: [...parent2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                parent3 = await teamModel.findOne({ wallet_id: parent2.refferal_id });
            }

            if (parent3) {
                await parent3.updateOne({ refferal_details: [...parent3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "50%" }] })
                parent4 = await teamModel.findOne({ wallet_id: parent3.refferal_id });
            }
            if (parent4) {
                await parent4.updateOne({ refferal_details: [...parent4.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })
            }

            return res.send({ message: `We have successfully added this member under the team of : ${refferalId}`, user: user.user_id })
        } else {
            let totalNulle = await teamModel.find({ $or: [{ refferal_count: 0 }, { refferal_count: 1 }] })
            for (let i = 0; i < totalNulle.length; i++) {
                let memberdetails3
                let memberdetails4
                let memberdetails5
                let memberdetails1 = await teamModel.findOne({ wallet_id: totalNulle[i].refferal_id })
                if (!memberdetails1 && totalNulle[i].refferal_id !== 'superUser') {
                    return res.send({ message: "team is completed" })
                } else if (memberdetails1 && totalNulle[i].refferal_id === 'superUser') {
                    continue;
                }
                if (memberdetails1.wallet_id === refferalId) {
                    let user = await userModel.findOne({ wallet_id: walletId })
                    let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: totalNulle[i].wallet_id, user_id: user.user_id })
                    await modelDetail.save();

                    await memberdetails1.updateOne({ refferal_details: [...memberdetails1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.5, level: 1, rewardvalue: "10%" }] })
                    let parent1 = await teamModel.findOne({ wallet_id: memberdetails1.refferal_id });
                    let parent2
                    if (parent1) {
                        await parent1.updateOne({ refferal_details: [...parent1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                        parent2 = await teamModel.findOne({ wallet_id: parent1.refferal_id });
                    }
                    let parent3
                    if (parent2) {
                        await parent2.updateOne({ refferal_details: [...parent2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "20%" }] })
                        parent3 = await teamModel.findOne({ wallet_id: parent2.refferal_id });
                    }

                    if (parent3) {
                        await parent3.updateOne({ refferal_details: [...parent3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })
                    }
                    await totalNulle[i].updateOne({ $inc: { refferal_count: 1 } })
                    return res.send({ message: `We have successfully added this member under the team of : ${totalNulle[i].refferal_id}`, user: user.user_id })
                }
                let memberdetails2 = await teamModel.findOne({ wallet_id: memberdetails1.refferal_id })
                if (memberdetails2) {
                    if (memberdetails2.wallet_id === refferalId) {
                        let user = await userModel.findOne({ wallet_id: walletId })
                        let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: totalNulle[i].wallet_id, user_id: user.user_id })
                        await modelDetail.save();
                        await memberdetails1.updateOne({ refferal_details: [...memberdetails1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.5, level: 1, rewardvalue: "10%" }] })
                        await memberdetails2.updateOne({ refferal_details: [...memberdetails2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                        let parent2 = await teamModel.findOne({ wallet_id: memberdetails2.refferal_id });

                        let parent3
                        if (parent2) {
                            await parent2.updateOne({ refferal_details: [...parent2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "20%" }] })
                            parent3 = await teamModel.findOne({ wallet_id: parent2.refferal_id });
                        }

                        if (parent3) {
                            await parent3.updateOne({ refferal_details: [...parent3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })
                        }
                        await totalNulle[i].updateOne({ $inc: { refferal_count: 1 } })
                        return res.send({ message: `We have successfully added this member under the team of : ${totalNulle[i].refferal_id}`, user: user.user_id })
                    }
                    memberdetails3 = await teamModel.findOne({ wallet_id: memberdetails2.refferal_id })
                }

                if (memberdetails3) {
                    if (memberdetails3.wallet_id === refferalId) {
                        let user = await userModel.findOne({ wallet_id: walletId })
                        let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: totalNulle[i].wallet_id, user_id: user.user_id })
                        await modelDetail.save();
                        await memberdetails1.updateOne({ refferal_details: [...memberdetails1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.5, level: 1, rewardvalue: "10%" }] })
                        await memberdetails2.updateOne({ refferal_details: [...memberdetails2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                        await memberdetails3.updateOne({ refferal_details: [...memberdetails3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "20%" }] })
                        let parent3 = await teamModel.findOne({ wallet_id: memberdetails3.refferal_id });

                        if (parent3) {
                            await parent3.updateOne({ refferal_details: [...parent3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })
                        }
                        await totalNulle[i].updateOne({ $inc: { refferal_count: 1 } })
                        return res.send({ message: `We have successfully added this member under the team of : ${totalNulle[i].refferal_id}`, user: user.user_id })
                    }
                    memberdetails4 = await teamModel.findOne({ wallet_id: memberdetails3.refferal_id })
                }

                if (memberdetails4) {
                    if (memberdetails4.wallet_id === refferalId) {
                        let user = await userModel.findOne({ wallet_id: walletId })
                        let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: totalNulle[i].wallet_id, user_id: user.user_id })
                        await modelDetail.save();
                        await memberdetails1.updateOne({ refferal_details: [...memberdetails1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.5, level: 1, rewardvalue: "10%" }] })
                        await memberdetails2.updateOne({ refferal_details: [...memberdetails2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                        await memberdetails3.updateOne({ refferal_details: [...memberdetails3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "20%" }] })
                        await memberdetails4.updateOne({ refferal_details: [...memberdetails4.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })

                        await totalNulle[i].updateOne({ $inc: { refferal_count: 1 } })
                        return res.send({ message: `We have successfully added this member under the team of : ${totalNulle[i].refferal_id}`, user: user.user_id })
                    }
                    memberdetails5 = await teamModel.findOne({ wallet_id: memberdetails4.refferal_id })
                }

                if (memberdetails5) {
                    if (memberdetails5.wallet_id === refferalId) {
                        let user = await userModel.findOne({ wallet_id: walletId })
                        let modelDetail = new teamModel({ wallet_id: walletId, refferal_id: totalNulle[i].wallet_id, user_id: user.user_id })
                        await modelDetail.save();
                        await memberdetails5.updateOne({ refferal_details: [...memberdetails5.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.1 * 0.5, level: 1, rewardvalue: "10%" }] })
                        let parent1 = await teamModel.findOne({ wallet_id: memberdetails5.refferal_id });
                        let parent2
                        if (parent1) {
                            await parent1.updateOne({ refferal_details: [...parent1.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 2, rewardvalue: "20%" }] })
                            parent2 = await teamModel.findOne({ wallet_id: parent1.refferal_id });
                        }
                        let parent3
                        if (parent2) {
                            await parent2.updateOne({ refferal_details: [...parent2.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.2 * 0.5, level: 3, rewardvalue: "20%" }] })
                            parent3 = await teamModel.findOne({ wallet_id: parent2.refferal_id });
                        }

                        if (parent3) {
                            await parent3.updateOne({ refferal_details: [...parent3.refferal_details, { wallet_id: walletId, user_id: user.user_id, time: new Date(), reward: (req.body.amount) * 0.5 * 0.5, level: 4, rewardvalue: "50%" }] })
                        }
                        await totalNulle[i].updateOne({ $inc: { refferal_count: 1 } })
                        return res.send({ message: `We have successfully added this member under the team of : ${totalNulle[i].refferal_id}`, user: user.user_id })
                    }
                }

            }
        }
    } catch (error) {
        logger.error({
            message: "this is an error",
            errors: error.message
        })
        throw error
    }
}

const getSingleMember = async (req, res) => {
    try {
        let memberDetails = await teamModel.findOne({ user_id: req.query.userId })
        if (!memberDetails) {
            return res.send({ message: "team not found" })
        }
        res.send({ data: memberDetails })
    } catch (error) {
        logger.error({
            message: "get controller fail",
            errors: error.message
        })
    }
}

const getalldata = async (req, res) => {
    try {
        const id = req.params.id;
        const leval = req.params.leval;
        const planPrice = req.params.planPrice;
        let memberDetails1 = await userModel.findOne({ user_id: id })
        console.log(leval == 0);
        let a = memberDetails1.wallet_id.slice('.')
        let b = "";
        for (let index = 1; index <= leval; index++) {
            b += `.${index}`;
        }
        console.log("b", b);
        console.log("a", a);
        console.log("a + b", a + b);
        let plandata = planPrice == 20 ? "refs" : planPrice == 40 ? "ref40" : planPrice == 100 ? "ref100" : planPrice == 200 ? "ref200" : planPrice == 500 ? "ref500" : planPrice == 1000 ? "ref1000" : planPrice == 2000 ? "ref2000" : "ref4000"
        if (planPrice == 20) {
            setdata(plandata, a, b, ref, res)
        }
        if (planPrice == 40) {
            setdata(plandata, a, b, ref40, res)
        }
        if (planPrice == 100) {
            setdata(plandata, a, b, ref100, res)
        }
        if (planPrice == 200) {
            setdata(plandata, a, b, ref200, res)
        }
        if (planPrice == 500) {
            setdata(plandata, a, b, ref500, res)
        }
        if (planPrice == 1000) {
            setdata(plandata, a, b, ref1000, res)
        }
        if (planPrice == 2000) {
            setdata(plandata, a, b, ref2000, res)
        }
        if (planPrice == 4000) {
            setdata(plandata, a, b, ref4000, res)
        }
    } catch (error) {
        logger.error({
            message: "get controller fail",
            errors: error.message
        })
    }
}
const getTeamController = async (req, res) => {
    try {
        let response = [];
        let teamDetails = await teamModel.findOne({ user_id: req.query.userId })
        if (!teamDetails) {
            return res.send({ message: "temporory team not found" })
        }
        let allreffers = await teamModel.find({ refferal_id: teamDetails.wallet_id })

        if (allreffers.length === 0) {
            let members = await teamModel.findOne({ wallet_id: teamDetails.refferal_id })
            let allmembers = await teamModel.find({ refferal_id: members.wallet_id })

            let index = await allmembers.filter((elem) => elem.user_id !== req.query.userId)
            return res.send({ message: "temporory team is found", data: index })
        }
        response.push(...allreffers)
        for (let i = 0; i < teamDetails.refferal_details.length; i++) {
            // if(allreffers[i].refferal_count==1){
            //      let member = await teamModel.findOne({refferal_id:allreffers[i].wallet_id})
            //      response.push(member)
            // }else if(allreffers[i].refferal_count==2){
            //      let members = await teamModel.find({refferal_id:allreffers[i].wallet_id})
            //      response.push(...members)
            // }
            let member = await teamModel.findOne({ wallet_id: teamDetails.refferal_details[i].wallet_id })
        }
        res.send({ data: response })
    } catch (error) {
        logger.error({
            message: "get controller fail",
            errors: error.message
        })
    }
}


export { lastModelController, getTeamController, getSingleMember, getalldata, setdata11 };
