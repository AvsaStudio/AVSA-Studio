import { z } from "zod";

// ─── Booking ────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  location: z.string().optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
});

// ─── Service ────────────────────────────────────────────────────────────────

export const createServiceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.number().int().positive("Duration must be a positive number of minutes"),
  price: z.number().int().positive("Price must be a positive amount"),
  depositAmount: z.number().int().min(0, "Deposit must be 0 or more"),
  isActive: z.boolean().optional().default(true),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

// ─── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Availability ────────────────────────────────────────────────────────────

export const createSlotSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export type CreateSlotInput = z.infer<typeof createSlotSchema>;
