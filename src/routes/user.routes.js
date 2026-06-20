import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { loginUser } from "../controllers/user.controllers.js";
import { logoutUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { ValidationResult } from "../middlewares/user.middlewares.js";
import { userRegistrationZodSchema } from "../validators/user.validators.js";
import { userLoginZodSchema } from "../validators/user.validators.js";

const userRouter = Router();

// console.log("UserValidatorType: ", typeof userValidator, userValidator)
userRouter.route("/register").post(ValidationResult(userRegistrationZodSchema), registerUser);
userRouter.route("/login").post(ValidationResult(userLoginZodSchema), loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;



