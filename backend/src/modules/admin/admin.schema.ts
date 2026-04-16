import { z } from "zod";

export const adminUpdateUserSchema = z.object({
  role: z.enum(["ADMIN", "VENDOR", "CUSTOMER"]).optional(),
  status: z.enum(["ACTIVE", "PENDING", "BLOCKED"]).optional(),
});

export const adminUpdateOrderSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"], {
    message: "Status must be a valid order status.",
  }),
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

export type TAdminUpdateUserSchema = z.infer<typeof adminUpdateUserSchema>;
export type TAdminUpdateOrderSchema = z.infer<typeof adminUpdateOrderSchema>;
export type TAdminUpdateProduceSchema = z.infer<typeof adminUpdateProduceSchema>;
export type TAdminUpdateBookingSchema = z.infer<typeof adminUpdateBookingSchema>;
