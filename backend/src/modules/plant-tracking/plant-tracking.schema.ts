import { z } from "zod";

export const createPlantTrackingSchema = z.object({
  rentalSpaceId: z
    .number({ message: "Rental space ID is required" })
    .int()
    .positive(),
  plantName: z
    .string({ message: "Plant name is required" })
    .min(1, "Plant name cannot be empty"),
  growthStatus: z
    .string({ message: "Growth status is required" })
    .min(1, "Growth status cannot be empty"),
  healthStatus: z
    .string({ message: "Health status is required" })
    .min(1, "Health status cannot be empty"),
  plantedDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid planted date format",
    })
    .optional(),
  estimatedHarvestDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid estimated harvest date format",
    })
    .optional(),
});

export const updatePlantTrackingSchema = z.object({
  plantName: z.string().min(1, "Plant name cannot be empty").optional(),
  growthStatus: z.string().min(1, "Growth status cannot be empty").optional(),
  healthStatus: z.string().min(1, "Health status cannot be empty").optional(),
  plantedDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid planted date format",
    })
    .optional(),
  estimatedHarvestDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid estimated harvest date format",
    })
    .optional(),
});

export type TCreatePlantTrackingSchema = z.infer<
  typeof createPlantTrackingSchema
>;
export type TUpdatePlantTrackingSchema = z.infer<
  typeof updatePlantTrackingSchema
>;
