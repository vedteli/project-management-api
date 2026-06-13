import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";


const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: `https://placehold.co/200x200/EEE/31343C`,
            localStorage:""
        }
    },

    username: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
        required: [true, "Username is required"]
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
        required: [true, "Email is required"]
    },

    password: {
        type: String,
        required: [true, "Passwored is required"],
    },

    fullName: {
        type: String,
        trim: true, 
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: {
        type: String
    },

    forgotPasswordToken: {
        type: String,
    },

    forgotPasswordTokenExpiry: {
        type: Date
    },

    emailVerificationToken: {
        type: String
    },

    emailVerificationTokenExpiry:{
        type: Date
    }
 
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 7);
    next();
})

userSchema.methods.isPasswordValid = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    const HashedToken = crypto.createHash("sha256")
                              .update(unHashedToken)
                              .digest("hex")

    const tokenExpiry = Date.now() * (20*60*100);
    return { unHashedToken, HashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema);