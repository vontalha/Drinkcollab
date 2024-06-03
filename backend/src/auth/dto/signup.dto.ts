import { z } from "zod";

export const SignupSchema = z.object({
	username: z.string()
		.trim()
		.min(2, { message: "Username must be at least 2 characters long" })
		.regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
		.max(255, { message: "Username must not be more than 255 characters long" }),

	email: z.string()
		.email({ message: "Please enter a valid email address" }),
	
	password: z.string({ required_error: "Password is required" })
		.trim()
		.min(8, "Password must be atleast 8 characters long")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[\W_]/, "Password must contain at least one special character (e.g., !, #, $, %)")
		.regex(/[0-9]/, "Password must contain at least one number")
		.max(255),
}).required();

export type SignupDto = z.infer<typeof SignupSchema>