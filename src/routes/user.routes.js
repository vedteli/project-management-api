import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { userValidator } from "../validators/user.validators.js";

const userRouter = Router();

userRouter.route("/register").post(userValidator, registerUser);

export default userRouter;



