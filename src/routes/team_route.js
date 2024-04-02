import { Router } from "express";
import { getSingleMember, getTeamController, lastModelController, getalldata, setdata11 } from "../controllers/lastModel_controller.js";
let teamRouter = Router();
teamRouter.post('/add', lastModelController);
teamRouter.get('/get', getTeamController)
teamRouter.get('/single-member', getSingleMember)
teamRouter.get('/leval5-member/:id/:leval/:planPrice', getalldata)
teamRouter.get('/leval5-membe22/:id', setdata11)
export default teamRouter;
