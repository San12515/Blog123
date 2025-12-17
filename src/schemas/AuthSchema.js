import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyEmailSchema = z.object({
  username: z
    .string()
    .min(2, "Username is required"),
  token: z.string().min(10, "Invalid or missing verification token"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Usually logout has no body, but if you pass refresh tokens etc:
export const logoutSchema = z.object({
  token: z.string().min(10, "Invalid token"),
});

export const checkUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

