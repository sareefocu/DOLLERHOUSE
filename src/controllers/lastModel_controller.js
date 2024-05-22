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
const findUpline = async (refId) => {
    // Find the ref data based on the refId in the ref collection
    const refData = await ref.findOne({ refId: refId });

    // if (refData.mainId !== null) {
    //     // Check if the ref exists in the ref40 collection
    //     const ref40Data = await ref40.findOne({ refId: refData.refId });
    //     if (ref40Data?.mainId !== null) {
    //         // If the ref data doesn't exist in the ref40 collection, recursively find the upline
    //         return findUpline(refData.mainId); // Return the result of the recursive call
    //     } else {
    //         return refData;
    //     }
    // }
};

const setdata = async (plandata, a, b, ref1, ref2, res, amount) => {
    let pipeline = [
        {
            $match: {
                refId: b === "" ? a : a + b,
                amount: amount
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
                restrictSearchWithMatch: { amount: amount }
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
    console.log("b === ,", b === "" ? a : a + b,);
    let memberDetails = await ref1.aggregate(pipeline);
    let memberDetails12 = await ref1.aggregate([
        {
            $match: {
                refId: b === "" ? a : a + b,
                amount: amount,
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
                restrictSearchWithMatch: { amount: amount },
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
    // for (let index = 0; index < memberDetails12.length; index++) {
    //     const el = memberDetails12[index]
    //     const refExists = await ref1.findOne({ refId: a });
    //     const refExists1 = await ref2.findOne({ refId: a });
    //     if (b === "") {
    //         el.referBY?.sort((a, b) => {
    //             return new Date(a.createdAt) - new Date(b.createdAt);
    //         }).forEach(async (item, index) => {
    //             const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
    //             if (!refIdExists) {
    //                 refExists.missedusers.push({
    //                     uid: item.uid,
    //                     refId: item.refId,
    //                     mainId: item.mainId,
    //                     supporterId: item.supporterId,
    //                     depthleval: item.depthleval,
    //                     status: item.depthleval !== 0 ? index === 60 ? "stored" : index === 61 ? "stored" : "done" : "send to upline",
    //                     createdAt: item.createdAt
    //                 });
    //             }
    //         })
    //     } else {
    //         el.referBY?.sort((a, b) => {
    //             return new Date(a.createdAt) - new Date(b.createdAt);
    //         }).forEach(async (item, index) => {
    //             console.log("refExists1", refExists1);
    //             const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
    //             if (!refIdExists) {
    //                 refExists.missedusers.push({
    //                     uid: item.uid,
    //                     refId: item.refId,
    //                     mainId: item.mainId,
    //                     supporterId: item.supporterId,
    //                     depthleval: item.depthleval,
    //                     status: refExists1 !== null ? item.depthleval !== 0 ? index === 60 ? "stored" : index === 61 ? "stored" : "done" : "send to upline" : "missed",
    //                     createdAt: item.createdAt
    //                 });
    //             }
    //         })
    //     }
    //     await refExists?.save(); // Save changes to the document
    // }
    if (!memberDetails) {
        return res.send({ message: "team not found" })
    }
    let userdata = await ref1.findOne({ refId: b === "" ? a : a + b })
    const filteredData = memberDetails[0]?.referBY.filter(item => item.depthleval === 0);
    console.log(memberDetails[0]?.referBY);
    const filteredDatalastwor = memberDetails[0]?.referBY.filter(item => item.depthleval === 4);
    res.send({ data: filteredData, data1: memberDetails12, filteredDatalastwor: filteredDatalastwor, userdata: userdata })
}
function checkMultiples(array, number) {
    return array % number === 0
}
const setdata1122233 = async (plandata, a, b, ref1, ref2) => {
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
        for (let index = 0; index < memberDetails12.length; index++) {
            const el = memberDetails12[index]
            const refExists1 = await ref2.findOne({ refId: a });
            if (b === "") {
                el.referBY?.sort((a, b) => {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }).forEach(async (item, index) => {
                    const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
                    if (!refIdExists) {
                        refExists.missedusers.push({
                            uid: item.uid,
                            refId: item.refId,
                            mainId: item.mainId,
                            supporterId: item.supporterId,
                            depthleval: item.depthleval,
                            status: item.depthleval !== 0 ? index === 60 ? "stored" : index === 61 ? "stored" : "done" : "send to upline",
                            createdAt: item.createdAt
                        });
                    }
                })
            } else {
                console.log("refExists1", refExists1);
                el.referBY?.sort((a, b) => {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                }).forEach(async (item, index) => {
                    const array60 = checkMultiples(index, 60);
                    const array61 = checkMultiples(index, 61);
                    const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
                    if (!refIdExists) {
                        refExists.missedusers.push({
                            uid: item.uid,
                            refId: item.refId,
                            mainId: item.mainId,
                            supporterId: item.supporterId,
                            depthleval: item.depthleval,
                            status: refExists1 !== null ? item.depthleval !== 0 ? index === 60 ? "stored" : index === 61 ? "stored" : "done" : "send to upline" : "missed",
                            createdAt: item.createdAt
                        });
                    }
                })
            }
            await refExists?.save(); // Save changes to the document
        }
        return refExists
        // memberDetails12[0]?.referBY?.sort((a, b) => {
        //     return new Date(a.createdAt) - new Date(b.createdAt);
        // }).forEach(async (item, index) => {
        //     const array60 = checkMultiples(index, 60);
        //     const array61 = checkMultiples(index, 61);
        //     const refIdExists = refExists.missedusers.some(missedUser => missedUser.refId === item.refId);
        //     const refIdExistsq = refExists.missedusers.find(missedUser => missedUser.refId === item.refId);
        //     console.log("refIdExistsq", refIdExistsq);
        //     if (!refIdExists) {
        //         refExists.missedusers.push({
        //             uid: item.uid,
        //             refId: item.refId,
        //             mainId: item.mainId,
        //             supporterId: item.supporterId,
        //             depthleval: item.depthleval,
        //             status: array60 ? "stored" : array61 ? "stored" : "done",
        //             createdAt: item.createdAt
        //         });
        //     }
        // });
        await refExists?.save(); // Save changes to the document
        let userdata = await ref1.find({ refId: a })
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
        console.log(memberDetails1);
        let a = memberDetails1.wallet_id.slice('.');
        let b = "";

        console.log("b", b);
        console.log("a", a);
        console.log("a + b", a + b);
        const promises = [
            setdata1122233("refs", a, b, ref, ref40),
            setdata1122233("ref40", a, b, ref, ref100),
            setdata1122233("ref100", a, b, ref, ref200),
            setdata1122233("ref200", a, b, ref200, ref500),
            setdata1122233("ref500", a, b, ref500, ref1000),
            setdata1122233("ref1000", a, b, ref1000, ref2000),
            setdata1122233("ref2000", a, b, ref2000, ref4000),
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
// async function getRef(refSelectedId, refId, id) {
//     const refSelected = await ref.findOne({ refId: refSelectedId });
//     const refSelectedq = await ref40.findOne({ refId: refSelectedId });
//     const refExists11 = await userModel.findOne({ wallet_id: id });
//     if (refSelectedq !== null) {
//         if (refSelected.referred.length < 2) {
//             const newRef = await ref.create({
//                 refId: id,
//                 mainId: refId,
//                 supporterId: refSelected.refId,
//                 uid: refExists11.user_id,
//                 referred: [],
//             });
//             refSelected.referred.push(newRef.refId);
//             refSelected.save();
//         } else {
//             let a = []
//             for (const referredId of refSelected.referred) {
//                 const refSelected = await ref.findOne({ refId: referredId });
//                 const ref1 = await ref.aggregate([
//                     {
//                         $match: {
//                             refId: referredId,
//                         },
//                     },
//                     {
//                         $graphLookup: {
//                             from: "refs",
//                             startWith: "$refId",
//                             connectFromField: "refId",
//                             connectToField: "supporterId",
//                             as: "refers_to",
//                         },
//                     },
//                 ]);
//                 const ref2 = await ref.aggregate([
//                     {
//                         $match: {
//                             refId: referredId,
//                         },
//                     },
//                     {
//                         $graphLookup: {
//                             from: "refs",
//                             startWith: "$refId",
//                             connectFromField: "refId",
//                             connectToField: "supporterId",
//                             as: "refers_to",
//                             maxDepth: ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4,
//                         },
//                     },
//                 ]);
//                 console.log(ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4);
//                 console.log(ref1[0].refers_to?.length);
//                 console.log(ref2[0].refers_to?.length);
//                 a.push({ referred: referredId, referredlegth: refSelected.referred?.length, team: ref2[0].refers_to?.length || 0, refId: refId, createdAt: ref1[0].createdAt });
//             }
//             a.sort((a, b) => {
//                 if (a.team === b.team) {
//                     // If team counts are equal, sort by createdAt
//                     return new Date(a.createdAt) - new Date(b.createdAt);
//                 } else {
//                     // Otherwise, sort by team counts
//                     return a.team - b.team;
//                 }
//             });
//             console.log("aaaaa", a);
//             const index = refSelected.referred.indexOf(a[0].referred);
//             refSelected.nextRefIndex = index;
//             await getRef(refSelected.referred[index], refId, id);
//             // await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id);
//             // refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
//             // await refSelected.save();
//         }
//     } else {
//         if (refSelected.referred.length < 2) {
//             const newRef = await ref.create({
//                 refId: id,
//                 mainId: refId,
//                 supporterId: refSelected.refId,
//                 uid: refExists11.user_id,
//                 referred: [],
//             });
//             refSelected.referred.push(newRef.refId);
//             refSelected.save();
//         } else {
//             await getRef(refSelected.referred[refSelected.nextRefIndex], refId, id);
//             refSelected.nextRefIndex = refSelected.nextRefIndex + 1 > 1 ? 0 : refSelected.nextRefIndex + 1;
//             await refSelected.save();
//         }
//     }
// }

// async function getRef2(refSelectedId, refId, id, newLeval) {
//     const refExists123aaa = await ref.findOne({ refId: refId });
//     const refExists123 = await ref.find({ uid: refExists123aaa.uid });
//     for (let index = 0; index < refExists123.length; index++) {
//         const element = refExists123[index];
//         const ids = refId;
//         let memberDetails12 = await ref.aggregate([
//             {
//                 $match: {
//                     refId: element.refId,
//                 },
//             },
//             {
//                 $graphLookup: {
//                     from: "refs",
//                     startWith: "$refId",
//                     connectFromField: "refId",
//                     depthField: "depthleval",
//                     connectToField: "supporterId",
//                     maxDepth: 4,
//                     as: "referBY",
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "plan_buyeds",
//                     localField: "referBY.refId",
//                     foreignField: "wallet_id",
//                     as: "result",
//                 },
//             },
//             {
//                 $addFields: {
//                     referBY: {
//                         $map: {
//                             input: "$referBY",
//                             as: "refer",
//                             in: {
//                                 $mergeObjects: [
//                                     "$$refer",
//                                     {
//                                         result: {
//                                             $filter: {
//                                                 input: "$result",
//                                                 as: "res",
//                                                 cond: {
//                                                     $eq: [
//                                                         "$$res.wallet_id",
//                                                         "$$refer.refId",
//                                                     ],
//                                                 },
//                                             },
//                                         },
//                                     },
//                                 ],
//                             },
//                         },
//                     },
//                 },
//             },
//             {
//                 $project: {
//                     result: 0, // Optionally remove the 'result' field from the output
//                 },
//             },
//         ]
//         )
//         if (memberDetails12[0].referBY.length <= 61) {
//             const refExists11new = await ref.findOne({ refId: id });
//             const newuserdata = await ref.find({ refId: id });
//             const refExists = await ref.findOne({ refId: element.refId });
//             const refSelected = await ref.findOne({ refId: element.refId });
//             if (refExists.referred.length < 2) {
//                 const refExistsrefExists1 = await ref.findOne({ refId: id + `.` + newLeval });
//                 if (refExistsrefExists1 == null) {

//                     const newRef = await ref.create({
//                         refId: id + `.` + newLeval,
//                         mainId: refId,
//                         supporterId: element.refId,
//                         uid: refExists11new?.uid,
//                         referred: [],
//                         leval: newuserdata.length
//                     });
//                     element.referred.push(newRef.refId);
//                     element.save();
//                 }
//             } else {
//                 let a = []
//                 for (const referredId of refExists.referred) {
//                     const refSelected = await ref.findOne({ refId: referredId });
//                     const ref1 = await ref.aggregate([
//                         {
//                             $match: {
//                                 refId: referredId,
//                             },
//                         },
//                         {
//                             $graphLookup: {
//                                 from: "refs",
//                                 startWith: "$refId",
//                                 connectFromField: "refId",
//                                 connectToField: "supporterId",
//                                 as: "refers_to",
//                             },
//                         },
//                     ]);
//                     const ref2 = await ref.aggregate([
//                         {
//                             $match: {
//                                 refId: referredId,
//                             },
//                         },
//                         {
//                             $graphLookup: {
//                                 from: "refs",
//                                 startWith: "$refId",
//                                 connectFromField: "refId",
//                                 connectToField: "supporterId",
//                                 as: "refers_to",
//                                 maxDepth: ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4,
//                             },
//                         },
//                     ]);
//                     console.log(ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4);
//                     console.log(ref1[0].refers_to?.length);
//                     console.log(ref2[0].refers_to?.length);
//                     a.push({ referred: referredId, referredlegth: refSelected.referred?.length, team: ref2[0].refers_to?.length || 0, refId: refId, createdAt: ref1[0].createdAt });
//                 }
//                 a.sort((a, b) => {
//                     if (a.team === b.team) {
//                         // If team counts are equal, sort by createdAt
//                         return new Date(a.createdAt) - new Date(b.createdAt);
//                     } else {
//                         // Otherwise, sort by team counts
//                         return a.team - b.team;
//                     }
//                 });
//                 console.log("aaaaa", a);
//                 const index = refSelected.referred.indexOf(a[0].referred);
//                 console.log("aaaaa", index);
//                 refSelected.nextRefIndex = index;
//                 await getRef(refSelected.referred[index], refId, id);
//             }
//         }
//     }
// }
// const processReferral = async (id, refId) => {
//     try {
//         if (!id) return res.send('Invalid id');
//         const idAlreadyExists = await ref.findOne({ refId: id });
//         if (idAlreadyExists) return res.send('Invalid id, already exists');
//         const isFirstRef = await ref.countDocuments();
//         if (!isFirstRef) {
//             const newRef = await ref.create({
//                 refId: id,
//                 mainId: null,
//                 uid: "",
//                 supporterId: null,
//                 referred: [],
//             });
//         }

//         if (!refId) return res.send('Invalid refId');
//         const refExists123aaa = await ref.findOne({ refId: refId });
//         const refExists123 = await ref.find({ uid: refExists123aaa?.uid });
//         for (let index = 0; index < refExists123.length; index++) {
//             const element = refExists123[index];
//             const refExists = await ref.findOne({ refId: element.refId, leval: element.leval });
//             let memberDetails12 = await ref.aggregate([
//                 {
//                     $match: {
//                         refId: element.refId,
//                         leval: element.leval
//                     },
//                 },
//                 {
//                     $graphLookup: {
//                         from: "refs",
//                         startWith: "$refId",
//                         connectFromField: "refId",
//                         depthField: "depthleval",
//                         connectToField: "supporterId",
//                         as: "referBY",
//                         maxDepth: 4,
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "plan_buyeds",
//                         localField: "referBY.refId",
//                         foreignField: "wallet_id",
//                         as: "result",
//                     },
//                 },
//                 {
//                     $addFields: {
//                         referBY: {
//                             $map: {
//                                 input: "$referBY",
//                                 as: "refer",
//                                 in: {
//                                     $mergeObjects: [
//                                         "$$refer",
//                                         {
//                                             result: {
//                                                 $filter: {
//                                                     input: "$result",
//                                                     as: "res",
//                                                     cond: {
//                                                         $eq: [
//                                                             "$$res.wallet_id",
//                                                             "$$refer.refId",
//                                                         ],
//                                                     },
//                                                 },
//                                             },
//                                         },
//                                     ],
//                                 },
//                             },
//                         },
//                     },
//                 },
//                 {
//                     $project: {
//                         result: 0, // Optionally remove the 'result' field from the output
//                     },
//                 },
//             ]
//             )
//             if (memberDetails12[0].referBY.length < 62) {
//                 if (memberDetails12[0].referBY.length == 61) {
//                     const refExistsrefExists1 = await ref.findOne({ refId: element.supporterId, leval: element.leval });
//                     const newLeval = element.leval + 1;
//                     findUpline(refExistsrefExists1.refId.toString())
//                         .then(async (uplineData) => {
//                             if (uplineData !== null) {
//                                 if (uplineData.referred.length < 2) {
//                                     const refExistsrefExists1 = await ref.findOne({ refId: element.refId + `.` + newLeval });
//                                     if (refExistsrefExists1 == null) {
//                                         const newRef = await ref.create({
//                                             refId: element.refId + `.` + newLeval,
//                                             mainId: uplineData.refId,
//                                             supporterId: uplineData.refId || uplineData.refId,
//                                             uid: element.uid,
//                                             referred: [],
//                                             leval: newLeval
//                                         });
//                                         uplineData.referred.push(newRef.refId);
//                                         await uplineData.save();
//                                     }
//                                 } else {
//                                     const newLeval = element.leval + 1;
//                                     await getRef2(uplineData.referred[uplineData.nextRefIndex], uplineData.refId, element.refId, newLeval);
//                                     uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
//                                     await uplineData.save();
//                                 }
//                             } else {
//                                 const refExistsrefExists1 = await ref.findOne({ refId: element.refId + `.` + newLeval });
//                                 if (refExistsrefExists1 == null) {
//                                     const newRef = await ref.create({
//                                         refId: element.refId + `.` + newLeval,
//                                         mainId: null,
//                                         supporterId: null,
//                                         uid: element.uid,
//                                         referred: [],
//                                         leval: newLeval
//                                     });
//                                     refSelected.referred.push(newRef.refId);
//                                     refSelected.save();
//                                 }
//                             }
//                         })
//                         .catch(error => console.error(error));
//                 }
//                 if (memberDetails12[0].referBY.length <= 61) {
//                     const refExists11 = await ref.findOne({ refId: element.refId, leval: element.leval });
//                     const refExists1140 = await ref40.findOne({ uid: element.uid });
//                     const refExists111 = await userModel.findOne({ wallet_id: id });
//                     if (element.leval > 0 && refExists1140 === null) {
//                         await findUpline(refExists11.refId)
//                             .then(async (uplineData) => {
//                                 if (uplineData?.referred.length < 2) {
//                                     const newRef = await ref.create({
//                                         refId: id,
//                                         mainId: uplineData.refId,
//                                         supporterId: uplineData.refId,
//                                         uid: refExists111.user_id,
//                                         referred: [],
//                                     });

//                                     uplineData.referred.push(newRef.refId);
//                                     await uplineData.save();
//                                     //   res.send(added);
//                                 } else {
//                                     let a = []
//                                     for (const referredId of refExists.referred) {
//                                         const refSelected = await ref.findOne({ refId: referredId });
//                                         const ref1 = await ref.aggregate([
//                                             {
//                                                 $match: {
//                                                     refId: referredId,
//                                                 },
//                                             },
//                                             {
//                                                 $graphLookup: {
//                                                     from: "refs",
//                                                     startWith: "$refId",
//                                                     connectFromField: "refId",
//                                                     connectToField: "supporterId",
//                                                     as: "refers_to",
//                                                 },
//                                             },
//                                         ]);
//                                         const ref2 = await ref.aggregate([
//                                             {
//                                                 $match: {
//                                                     refId: referredId,
//                                                 },
//                                             },
//                                             {
//                                                 $graphLookup: {
//                                                     from: "refs",
//                                                     startWith: "$refId",
//                                                     connectFromField: "refId",
//                                                     connectToField: "supporterId",
//                                                     as: "refers_to",
//                                                     maxDepth: ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4,
//                                                 },
//                                             },
//                                         ]);
//                                         console.log(ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4);
//                                         console.log(ref1[0].refers_to?.length);
//                                         a.push({ referred: referredId, referredlegth: refSelected.referred?.length, team: ref2[0].refers_to?.length || 0, refId: refId, createdAt: ref1[0].createdAt });
//                                     }
//                                     a.sort((a, b) => {
//                                         if (a.team === b.team) {
//                                             // If team counts are equal, sort by createdAt
//                                             return new Date(a.createdAt) - new Date(b.createdAt);
//                                         } else {
//                                             // Otherwise, sort by team counts
//                                             return a.team - b.team;
//                                         }
//                                     });
//                                     console.log("aaaaa", a);
//                                     const index = uplineData.referred.indexOf(a[0].referred);
//                                     console.log("aaaaa", index);
//                                     uplineData.nextRefIndex = index;
//                                     await getRef(uplineData.referred[index], refId, id);
//                                     // await getRef(uplineData.referred[uplineData.nextRefIndex], refId, id);
//                                     // uplineData.nextRefIndex = uplineData.nextRefIndex + 1 > 1 ? 0 : uplineData.nextRefIndex + 1;
//                                     // await uplineData.save();
//                                 }
//                             })
//                     } else {
//                         if (refExists?.referred.length < 2) {
//                             const newRef = await ref.create({
//                                 refId: id,
//                                 mainId: refExists.refId,
//                                 supporterId: refExists.refId,
//                                 uid: refExists111.user_id,
//                                 referred: [],
//                             });

//                             refExists.referred.push(newRef.refId);
//                             await refExists.save();
//                             //   res.send(added);
//                         } else {
//                             let a = []
//                             for (const referredId of refExists.referred) {
//                                 const refSelected = await ref.findOne({ refId: referredId });
//                                 const ref1 = await ref.aggregate([
//                                     {
//                                         $match: {
//                                             refId: referredId,
//                                         },
//                                     },
//                                     {
//                                         $graphLookup: {
//                                             from: "refs",
//                                             startWith: "$refId",
//                                             connectFromField: "refId",
//                                             connectToField: "supporterId",
//                                             as: "refers_to",
//                                         },
//                                     },
//                                 ]);
//                                 const ref2 = await ref.aggregate([
//                                     {
//                                         $match: {
//                                             refId: referredId,
//                                         },
//                                     },
//                                     {
//                                         $graphLookup: {
//                                             from: "refs",
//                                             startWith: "$refId",
//                                             connectFromField: "refId",
//                                             connectToField: "supporterId",
//                                             as: "refers_to",
//                                             maxDepth: ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4,
//                                         },
//                                     },
//                                 ]);
//                                 console.log(ref1[0].refers_to?.length == 0 ? 0 : ref1[0].refers_to?.length == 1 ? 1 : ref1[0].refers_to?.length == 5 ? 2 : ref1[0].refers_to?.length == 13 ? 3 : 4);
//                                 console.log(ref1[0].refers_to?.length);
//                                 console.log(ref2[0].refers_to?.length);
//                                 a.push({ referred: referredId, referredlegth: refSelected.referred?.length, team: ref2[0].refers_to?.length || 0, refId: refId, createdAt: ref1[0].createdAt });
//                             }
//                             a.sort((a, b) => {
//                                 if (a.team === b.team) {
//                                     // If team counts are equal, sort by createdAt
//                                     return new Date(a.createdAt) - new Date(b.createdAt);
//                                 } else {
//                                     // Otherwise, sort by team counts
//                                     return a.team - b.team;
//                                 }
//                             });
//                             console.log("aaaaa", a);
//                             const index = refExists.referred.indexOf(a[0].referred);
//                             console.log("aaaaa", index);
//                             refExists.nextRefIndex = index;
//                             await getRef(refExists.referred[index], refId, id);
//                             // await getRef(refExists.referred[refExists.nextRefIndex], refId, id);
//                             // refExists.nextRefIndex = refExists.nextRefIndex + 1 > 1 ? 0 : refExists.nextRefIndex + 1;
//                             // await refExists.save();
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         return 'An error occurred';
//     }
// };
async function register(referid, newid, amount) {
    try {
        const referData = await ref.find({ "refId": referid, "amount": amount })
        console.log(referData);
        const refExists111 = await userModel.findOne({ wallet_id: newid.split(".")[0] });
        const newRefDoc = new ref({
            user: newid,
            reffre: !referData ? referData[0]["mid"] : 0,
            L: 0,
            R: 0,
            mid: newid,
            amount: amount,
            uid: refExists111?.user_id,
            leval: 0,
            referred: [],
            refId: newid,
            missedusers: [],
            misseduser: "",
            mainId: referid,
            supporterId: !referData ? referData[0]["refId"] : 0,
        });
        await newRefDoc.save();
        let test = 0;
        let LL = [referData[0]["L"], referData[0]["R"]];
        console.log(LL);
        if (referData[0]["L"] == 0) {
            await leftPositionCheck(referData[0]["refId"], newid, amount);
        } else if (referData[0]["R"] == 0) {
            await rightPositionCheck(referData[0]["refId"], newid, amount);
        } else {
            while (true) {
                for (let i of LL) {
                    if (i !== 0) {
                        const status = await leftPositionCheck(i, newid, amount);
                        if (status === 1) {
                            test = 1;
                            console.log("for loop brake");
                            break;
                        }
                    }
                }
                if (test === 1) {
                    console.log("while loop brake");
                    break;
                }
                for (let i of LL) {
                    if (i !== 0) {
                        const status = await rightPositionCheck(i, newid, amount);
                        if (status === 1) {
                            test = 1;
                            break;
                        }
                    }
                }
                if (test === 1) {
                    break;
                }
                let RR = [];
                for (let k of LL) {
                    if (k != 0) {
                        const a = await ref.find({ "refId": k, "amount": amount })
                        RR.push(a[0]["L"]);
                    }
                }
                for (let k of LL) {
                    if (k != 0) {
                        const a = await ref.find({ "refId": k, "amount": amount })
                        RR.push(a[0]["R"]);
                    }
                }
                LL = RR;
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
async function leftPositionCheck(L, user_mid, amount) {
    try {
        const left = await ref.find({ "refId": L, "amount": amount })
        if (left[0]["L"] == 0) {
            console.log("update position in L");
            await ref.updateOne({ "refId": L, "amount": amount }, { "$set": { "L": user_mid } });
            await ref.updateOne({ "refId": L, "amount": amount }, { "$set": { "referred": [user_mid] } });
            await ref.updateOne({ "refId": user_mid, "amount": amount }, { $set: { "supporterId": L } });
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
async function rightPositionCheck(L, user_mid, amount) {
    try {
        const left = await ref.find({ "refId": L, "amount": amount })
        if (left[0]["R"] == 0) {
            console.log("update position in R");
            await ref.updateOne({ "refId": L, "amount": amount }, { "$set": { "R": user_mid } });
            await ref.updateOne({ "refId": L, "amount": amount }, { "$push": { "referred": user_mid } });
            await ref.updateOne({ "refId": user_mid, "amount": amount }, { $set: { "supporterId": L } });
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
const dat = async (UIDS, referid, amount) => {
    try {
        const d1 = await ref.aggregate([
            {
                $match: {
                    uid: UIDS.uid,
                    amount: amount,
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
                    restrictSearchWithMatch: { amount: amount }
                }
            }
        ]
        ) // Convert cursor to array
        for (let index = 0; index < d1.length; index++) {
            const element = d1[index];
            if (element.referBY.length <= 62) {
                const newLeval = element.leval + 1;
                const refExistsrefExists1 = await ref.findOne({ refId: element.refId, leval: element.leval });
                if (element.referBY.length == 61) {
                    findUpline(refExistsrefExists1.refId, element.amount * 2).then(async (uplineData) => {
                        const refExistsrefExists2 = await ref.find({ refId: referid, amount: amount })
                        console.log("", refExistsrefExists2.length - 1 == 0 ? refExistsrefExists1.refId : refExistsrefExists1.refId + `.` + refExistsrefExists2.length);
                        const d2 = await ref.aggregate([
                            {
                                $match: {
                                    refId: refExistsrefExists2.length - 1 == 0 ? refExistsrefExists1.refId : refExistsrefExists1.refId + `.` + refExistsrefExists2.length,
                                    amount: amount,
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
                                    restrictSearchWithMatch: { amount: amount }
                                }
                            }
                        ]
                        )
                        console.log("d2.length", d2.length);
                        for (let index = 0; index < d2.length; index++) {
                            const element1 = d2[index];
                            if (element1.referBY.length <= 62) {
                                if (element1.supporterId === 0) {
                                    const checkalredyexist = await ref.findOne({ refId: element1.refId + `.` + refExistsrefExists2.length, leval: element.leval });
                                    if (checkalredyexist === null) {
                                        const newRefDoc = new ref({
                                            "user": element1.user,
                                            "reffre": 0,
                                            "L": 0,
                                            "R": 0,
                                            "mid": element1.mid,
                                            "amount": 20,
                                            "uid": element1.uid,
                                            "leval": newLeval,
                                            "referred": [],
                                            "refId": element1.refId + `.` + refExistsrefExists2.length,
                                            "missedusers": [],
                                            "mainId": 0,
                                            "supporterId": 0,
                                        });
                                        await newRefDoc.save();
                                    }
                                } else {
                                    const checkalredyexist = await ref.findOne({ refId: element1.refId + `.` + refExistsrefExists2.length, leval: element.leval });
                                    if (checkalredyexist === null) {
                                        await register(element1.supporterId, element1.refId + `.` + refExistsrefExists2.length, amount);
                                    }
                                }
                            }
                        }
                    })
                } else {
                    const refExistsrefExists1 = await ref.findOne({ refId: element.supporterId, leval: element.leval });
                    console.log(refExistsrefExists1);
                    if (element.supporterId != 0) {
                        await dat(refExistsrefExists1.uid, amount)
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
const lastModelController = async (req, res) => {
    let walletId = (req.body.wallet_id).toLowerCase();
    let refferalId = (req.body.refferal_id).toLowerCase();
    let amount = 20
    try {
        const referid = refferalId;
        const newid = walletId;
        const refExistsrefExists1 = await ref.findOne({ refId: refferalId });
        const d1 = await ref.aggregate([
            {
                $match: {
                    uid: refExistsrefExists1.uid,
                    amount: amount,
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
                    restrictSearchWithMatch: { amount: amount }
                }
            }
        ]
        )
        await dat(refExistsrefExists1, referid, amount)
        console.log(d1);
        for (let index = 0; index < d1.length; index++) {
            const element = d1[index];
            if (element.referBY.length <= 61) {
                const refExistsrefExists1 = await ref.findOne({ refId: newid });
                if (refExistsrefExists1 === null) {
                    console.log("element.refId, =========================================================================>>>>>>>>>>>>>>>>>>>>>", element.refId, newid, amount, newid);
                    await register(element.refId, newid, amount).then(() => {
                        res.json({ message: `We have successfully added this member under the team of : ${newid}`, newid });
                        // return res.send({ message: `We have successfully added this member under the team of : ${newid}` })
                    })
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
        let a = memberDetails1.wallet_id.slice('.')
        let b = "";
        if (leval > 0) {
            b += `.${leval}`;
        }
        setdata("refs", a, b, ref, ref, res, Number(planPrice))
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