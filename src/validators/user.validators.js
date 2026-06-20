import * as z from "zod";

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


export { userValidationSchema }