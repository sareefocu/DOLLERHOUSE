import { Router } from "express";
import { createPlanController, getPlanController } from "../controllers/plan_controller.js";
let planRouter = Router();
planRouter.post('/create' , createPlanController);
planRouter.get('/get-plan' , getPlanController) ;
export default planRouter;