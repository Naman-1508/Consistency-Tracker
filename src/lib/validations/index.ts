import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const habitSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(255).optional().nullable(),
    category: z.string().max(50).optional().nullable(),
    reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional().nullable().or(z.literal("")),
});

export const trackHabitSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    note: z.string().max(500).optional().nullable(),
});
