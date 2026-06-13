import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.method.isPasswordValid = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);