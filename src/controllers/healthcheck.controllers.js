import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

/*
const healthCheck = (req, res, next) => {
    try {
        res.status(200).json(new ApiResponse(200, {
            message: "Server is running"
        }));
    } catch (err) {
        next(err)
    }
}
*/

const healthCheck = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, {
        message: "Server is running"
    }))
})


export { healthCheck }