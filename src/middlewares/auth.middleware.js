import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // console.log("Token: ", token)
    if(!token){
        throw new ApiError(401, "Invalid User")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
        );

        if(!user){ throw new ApiError(401, "Invalid Access Token"); }

        req.body = user;
        // console.log("Request Body: ", req.body)
        next();

    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }

})

export {
    verifyJWT   
}