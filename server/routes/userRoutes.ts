import { Router } from "express";
import { getUserCaloriesData } from "../controller/userController.js";

const userRouter = Router();

userRouter.get("/calories",getUserCaloriesData);


export default userRouter;