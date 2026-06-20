import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";

const ValidationResult = (ZodSchema) => {
    // console.log("Test A")
    return asyncHandler(async (req, res, next) => {
    const isUserValidated = await ZodSchema.safeParseAsync(req.body);

    if(!isUserValidated.success){
        // throw new ApiError(400, "Validation Error", isUserValidated.error.issues)
        return res.status(400).json(new ApiError(400, "Validation Error", isUserValidated.error.issues))
    }

    req.body = isUserValidated.data;    
    next()
})
}

export {
    ValidationResult
}