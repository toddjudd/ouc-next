import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
