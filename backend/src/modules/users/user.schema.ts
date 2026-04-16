import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  email: z.string("Email is required").email("Invalid email format"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"], {
    message: "Role is required",
  }),
  status: z.enum(["ACTIVE", "PENDING", "BLOCKED"]).default("PENDING"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),

  // For Vendor Profile
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
