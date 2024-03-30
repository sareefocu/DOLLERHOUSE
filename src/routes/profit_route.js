import { Router } from "express";
import { getTotalProfitController, getTotalProfitController1 } from "../controllers/profit_controller.js";
let profitRouter = Router();
profitRouter.get('/total-profit' , getTotalProfitController);
profitRouter.get('/alltotal-profit' , getTotalProfitController1);

export default profitRouter;