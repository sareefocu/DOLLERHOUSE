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
                let tokenAmount = Number(finalamount * 10 ** 18)
                ids.push({ id: result[0]["supporterId"]?.split(".")[0], amount: tokenAmount, leval: i })
            }

        }
        setTimeout(async () => {
            for (let index = 0; index < ids.length; index++) {
                const element = ids[index];
                console.log("element", element);
                await sendTOKEN(element["id"], element['amount'].toString(), element["leval"]);
            }
        }, 1000);
    } catch (error) {
        console.log(error.message);
    }
};

// Assuming sendTOKEN and ref.aggregate are defined elsewhere
// Example usage:



async function sendTOKEN(wallte_Address, amount, i) {
    try {

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

    } catch (error) {
        console.log(error);
    }
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

async function getUpline(wallet_id, level = 15) {
    const upline = [];

    async function findReferral(currentWalletId, currentLevel) {
        if (currentLevel > level) return;

        const user = await rewardModel.findOne({ wallet_id: currentWalletId });
        if (user && user.refferal) {
            upline.push(user.refferal);
            await findReferral(user.refferal, currentLevel + 1);
        }
    }

    await findReferral(wallet_id, 1);
    return upline;
}
async function level_reward_service(childWallet, wallet, obj, userId) {
    try {
        const wallet_id = childWallet
        const upline = await getUpline(wallet_id);
        console.log("wallet_idwallet_idwallet_id", wallet_id);
        let rewordpre = [0.5, 0.2, 0.1, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005, 0.005]
        if (obj.amount == "20" || obj.amount == "40" || obj.amount == "1000" || obj.amount == "2000" || obj.amount == "4000") {
            upline.map(async (el, index) => {
                console.log("elelelel", el);
                let rewardValue = Number(obj.amount) * 0.5
                let reward_details1 = await rewardModel.findOne({ wallet_id: el })
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: index + 1, reward: rewardValue * rewordpre[index], ...obj, user_id: userId, invited_member_id: childWallet }] })
            })
        } else if (obj.amount == "100" || obj.amount == "200") {
            upline.map(async (el, index) => {
                console.log("elelelel", el);
                let rewardValue = Number(obj.amount) * 0.4
                let reward_details1 = await rewardModel.findOne({ wallet_id: el })
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: index + 1, reward: rewardValue * rewordpre[index], ...obj, user_id: userId, invited_member_id: childWallet }] })
            })
        } else {
            upline.map(async (el, index) => {
                console.log("elelelel", el);
                let rewardValue = Number(obj.amount) * 0.52
                let reward_details1 = await rewardModel.findOne({ wallet_id: el })
                await reward_details1.updateOne({ level_reward: [...reward_details1.level_reward, { level: index + 1, reward: rewardValue * rewordpre[index], ...obj, user_id: userId, invited_member_id: childWallet }] })
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}
export { house_rewards_service, level_reward_service, rewordsend }