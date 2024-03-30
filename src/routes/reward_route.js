import { Router } from "express";
import getRewardController from "../controllers/reward_controller.js";
import totalDistribution from "../controllers/totalDistribution_controller.js";
let rewardRouter = Router();
rewardRouter.get('/get' , getRewardController)
rewardRouter.get('/total-distribution' , totalDistribution)
export default rewardRouter; 