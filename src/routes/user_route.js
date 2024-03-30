import { Router } from "express";
import {
  getUserController,
  setUserController,
} from "../controllers/user_controller.js";
import { getUserDetails } from "../controllers/last24hours_user_details.js";
let userRouter = Router();
userRouter.post("/create", setUserController);
userRouter.get("/get-user", getUserController);
userRouter.get("/user-details", getUserDetails);
export default userRouter;
