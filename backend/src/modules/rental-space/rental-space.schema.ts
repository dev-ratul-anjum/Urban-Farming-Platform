import { z } from "zod";

export const createRentalSpaceSchema = z.object({
  location: z.string("Location is required").min(1, "Location cannot be empty"),
  size: z
    .number({ message: "Size is required" })
    .positive("Size must be positive"),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be positive"),
  availability: z.boolean().default(true),
});

export const updateRentalSpaceSchema = z.object({
  location: z.string().min(1, "Location cannot be empty").optional(),
  size: z.number().positive("Size must be positive").optional(),
  price: z.number().positive("Price must be positive").optional(),
  availability: z.boolean().optional(),
});

export type TCreateRentalSpaceSchema = z.infer<typeof createRentalSpaceSchema>;
export type TUpdateRentalSpaceSchema = z.infer<typeof updateRentalSpaceSchema>;
