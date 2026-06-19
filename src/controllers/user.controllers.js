import asyncHandler from "../utils/async-handler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { sendMail, generateVerificationMail } from "../utils/mail.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if(!user) throw new ApiError(404, "User Not Found In the Database");

        const accessToken = user.generateAccessToken(); 
        const refreshToken = user.generateRefreshToken();

        await user.save();

        return {refreshToken, accessToken}
        
    } catch (error) {
        throw new ApiError(400, "Error generating Access and refresh Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password} =  req.body
    const existingUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(existingUser) throw new ApiError(409, "User Already Exists", []);

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified: false
    })

    const {unHashedToken, HashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = HashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save()

    await sendMail({
        email: user.email,
        subject: "Verify your email",
        content: generateVerificationMail(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/verify-email/${unHashedToken}`
        )
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailverificationTokenExpiry"
    )

    if(!createdUser) throw new ApiError(500, "Error: User could not be registed")
    return res.status(200).json(new ApiResponse(200, {user: createdUser}, "User Created Successfully"))
})

export { registerUser  }