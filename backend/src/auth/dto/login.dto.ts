import { z } from 'zod';

export const LoginSchema = z
    .object({
        email: z
            .string({ required_error: 'E-Mail required' })
            .email({
                message:
                    'Invalid email format. Please enter a valid email address.',
            }),

        password: z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters long' }),
    })
    .required();

export type LoginDto = z.infer<typeof LoginSchema>;
