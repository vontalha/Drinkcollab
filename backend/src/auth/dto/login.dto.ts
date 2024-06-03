import { z } from "zod";

export const LoginSchema = z.object({
	login: z.string({ required_error: "Username or E-Mail required" })
		.min(2, { message: "Username must be at least 2 characters long" })
		.regex(/^[a-zA-Z0-9_]+$/, { message: "Invalid Username or E-Mail" })
		.or(z.string()
		.email({ message: "Invalid email format. Please enter a valid email address." })),

	password: z.string({ required_error: "Password is required" })
		.min(8, { message: "Password must be at least 8 characters long" })
}).required();

export type LoginDto = z.infer<typeof LoginSchema>