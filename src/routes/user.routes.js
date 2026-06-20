import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

import { userValidator } from "../middlewares/user.middlewares.js";
import { userValidationSchema } from "../validators/user.validators.js";

const userRouter = Router();

console.log("UserValidatorType: ", typeof userValidator, userValidator)
userRouter.route("/register").post(userValidator(userValidationSchema), registerUser);

export default userRouter;



