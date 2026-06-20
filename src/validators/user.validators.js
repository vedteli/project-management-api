    import * as z from "zod";
    import { ApiError } from "../utils/api-error.js";
    import asyncHandler from "../utils/async-handler.js";

    const userValidationSchema = z.object({
        email: z.email(),
        username: z.string().trim().min(3, "Username must consist of atleast 3 character").max(20, "Maximum character limit reached"),
        password: z.string().trim()
                .min(8, "Password Must be Minimum 8 characters long")
                .max(18, "Password Must be Maximum 18 characters long")
                .regex(/[A-Z]/, "Must contain atleast one upper case character")
                .regex(/[a-z]/, "Must contain at least one lowercase letter")
                .regex(/[0-9]/, "Must contain at least one number")
                .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, "Must contain at least one special character")
                }).passthrough();

    const userValidator = asyncHandler(async (req, res, next) => {
        const isUserValidated = await userValidationSchema.safeParseAsync(req.body);

        if(!isUserValidated.success){
            // throw new ApiError(400, "Validation Error", isUserValidated.error.issues)
            return res.status(400).json(new ApiError(400, "Validation Error", isUserValidated.error.issues))
        }

        req.body = isUserValidated.data;    
        next()
    })

    export { userValidator }