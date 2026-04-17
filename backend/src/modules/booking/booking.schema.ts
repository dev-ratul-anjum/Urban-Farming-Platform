import { z } from "zod";

export const createBookingSchema = z.object({
  rentalSpaceId: z
    .number({ message: "Rental space ID is required" })
    .int()
    .positive(),
  startDate: z
    .string({ message: "Start date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    }),
  endDate: z
    .string({ message: "End date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    }),
  totalAmount: z.number({ message: "Total amount is required" }).positive(),
});

export const updateBookingUserSchema = z.object({
  status: z.enum(["CANCELLED"], {
    message: "Users can only cancel their booking.",
  }),
});

export const updateBookingVendorSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"], {
    message: "Status must be a valid booking status.",
  }),
});

export type TCreateBookingSchema = z.infer<typeof createBookingSchema>;
export type TUpdateBookingUserSchema = z.infer<typeof updateBookingUserSchema>;
export type TUpdateBookingVendorSchema = z.infer<
  typeof updateBookingVendorSchema
>;
