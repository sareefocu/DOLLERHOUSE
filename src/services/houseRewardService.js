import constants from "../config/constants.js"
import logHelper from "../helpers/logHelper.js"
import planModel from "../models/plan_model.js"
import rewardModel from "../models/reward_model.js"
import ref from "../models/RefSchema.js";
import { ethers } from 'ethers';
import Web3 from "web3";
const logger = logHelper.getInstance({ appName: constants.app_name })

const infraUrl = "https://bsc-dataseed.binance.org/";
const web3 = new Web3(infraUrl);


var web3bnb = new Web3('https://bsc-testnet.blockpi.network/v1/rpc/public');
var privateKey = '0xa044555648a9c8558ef66b8648c7d2514790b42b998088b412fe5ea318d114d3'
var contractaddress = '0xb6a1bdc0bf9dab0d4216c1016096f19bb7dcf80a'
var TOKENABI = [{ "inputs": [{ "internalType": "address", "name": "_usdtTokenAddress", "type": "address" }, { "internalType": "address", "name": "_adminWallet", "type": "address" }, { "internalType": "uint256", "name": "_transactionFee", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_a", "type": "address" }, { "internalType": "address", "name": "_c", "type": "address" }], "name": "D", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "LevelCountUsers", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "LevelUsers", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "Parent", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_referrer", "type": "address" }, { "internalType": "uint256", "name": "_tier", "type": "uint256" }], "name": "Register", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "TransactionFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }, { "internalType": "bool", "name": "_sttaus", "type": "bool" }], "name": "addadmin", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_userid", "type": "uint256" }, { "internalType": "string", "name": "_level", "type": "string" }, { "internalType": "address", "name": "_useraddress", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "bool", "name": "_active", "type": "bool" }], "name": "adddata", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "adminWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newadmin", "type": "address" }], "name": "changeadmin", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newtoken", "type": "address" }], "name": "changetoken", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_level", "type": "string" }], "name": "getdata", "outputs": [{ "components": [{ "internalType": "uint256", "name": "userid", "type": "uint256" }, { "internalType": "string", "name": "level", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "bool", "name": "status", "type": "bool" }], "internalType": "struct DataAdd.history[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_useraddress", "type": "address" }], "name": "getuser", "outputs": [{ "components": [{ "internalType": "uint256", "name": "userid", "type": "uint256" }, { "internalType": "string", "name": "level", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "bool", "name": "status", "type": "bool" }], "internalType": "struct DataAdd.history[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isadmin", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "isuse", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "usdtToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
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

// Define the contract address for USDT on Ethereum
const rewordsend = async (wallet, amount) => {
    try {
        let currentRefId = wallet;
        let ids = []
        for (let i = 0; i < 5; i++) { // Assuming a maximum of 6 levels deep
            const agg = [{ '$match': { 'refId': currentRefId, amount: amount } }];
            let result = await ref.aggregate(agg);

            if (result.length === 0) break; // Exit if no more supporters found

            let nextRefId = result[0]["supporterId"];
            currentRefId = nextRefId;
            if (i >= 1) {
                let planName2;
                if (amount == "20") {
                    planName2 = 5
                } else if (amount == "40") {
                    planName2 = 10
                } else if (amount == "100") {
                    planName2 = 30
                } else if (amount == "200") {
                    planName2 = 60
                } else if (amount == "500") {
                    planName2 = 120
                } else if (amount == "1000") {
                    planName2 = 250
                } else if (amount == "2000") {
                    planName2 = 500
                } else if (amount == "4000") {
                    planName2 = 1000
                }
                let par = i == 1 ? 10 : i == 2 ? 20 : i == 3 ? 20 : 50
                let finalamount = Number(planName2 * par / 100)
                console.log("finalamountfinalamountfinalamountfinalamount", finalamount);
                let tokenAmount = Number(finalamount * 10 ** 18)
                ids.push(result[0]["supporterId"])
                await sendTOKEN(result[0]["supporterId"].split(".")[0], tokenAmount.toString(), i);
                console.log("idsids", ids);
            }

        }
    } catch (error) {
        console.log(error.message);
    }
};

// Assuming sendTOKEN and ref.aggregate are defined elsewhere
// Example usage:
// rewordsend('initialWalletId');



async function sendTOKEN(wallte_Address, amount, i) {
    console.log("wallte_Address, amount.wallte_Address, amount", wallte_Address, amount, i);
    const contract = await new web3bnb.eth.Contract(TOKENABI, contractaddress);
    const account = web3bnb.eth.accounts.privateKeyToAccount(privateKey)
    const transaction = contract.methods.adddata('22', '1', wallte_Address, amount, false);

    const options = {
        to: contractaddress,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({ from: account.address }),
        gasPrice: await web3bnb.eth.getGasPrice(), // or use some predefined value
        nonce: web3bnb.utils.numberToHex((await web3bnb.eth.getTransactionCount(account.address)))
    };

    const signed = await web3bnb.eth.accounts.signTransaction(options, privateKey);
    await web3bnb.eth.sendSignedTransaction(signed.rawTransaction).then(async function (receipt) {
        console.log("receipt.transactionHash", receipt.transactionHash);
        if (i === 4) {
            return receipt.transactionHash
        }
    });
}

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
export { house_rewards_service, level_reward_service, rewordsend }