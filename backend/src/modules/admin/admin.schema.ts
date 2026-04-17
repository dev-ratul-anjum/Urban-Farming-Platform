import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  email: z.string("Email is required").email("Invalid email format"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  status: z.enum(["ACTIVE", "PENDING", "BLOCKED"]).default("PENDING"),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"]).optional(),
  status: z.enum(["ACTIVE", "PENDING", "BLOCKED"]).optional(),
});

export const adminUpdateOrderSchema = z.object({
  status: z.enum(
    ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    {
      message: "Status must be a valid order status.",
    },
  ),
});

export const adminUpdateProduceSchema = z.object({
  certificationStatus: z.enum(["APPROVED", "PENDING", "CANCELLED"], {
    message: "Certification status must be valid.",
  }),
});

export const adminUpdateBookingSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"], {
    message: "Status must be a valid booking status.",
  }),
});

export type TCreateAdminSchema = z.infer<typeof createAdminSchema>;
export type TAdminUpdateUserSchema = z.infer<typeof adminUpdateUserSchema>;
export type TAdminUpdateOrderSchema = z.infer<typeof adminUpdateOrderSchema>;
export type TAdminUpdateProduceSchema = z.infer<
  typeof adminUpdateProduceSchema
>;
export type TAdminUpdateBookingSchema = z.infer<
  typeof adminUpdateBookingSchema
>;
