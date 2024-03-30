import { Router } from "express";
import { getSingleMember, getTeamController, lastModelController, getalldata } from "../controllers/lastModel_controller.js";
let teamRouter = Router();
teamRouter.post('/add', lastModelController);
teamRouter.get('/get', getTeamController)
teamRouter.get('/single-member', getSingleMember)
teamRouter.get('/leval5-member/:id/:leval/:planPrice', getalldata)
export default teamRouter;