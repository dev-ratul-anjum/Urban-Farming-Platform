import { z } from "zod";

export const createProduceSchema = z.object({
  name: z.string("Name is required").min(1, "Name cannot be empty"),
  description: z.string("Description is required").min(1, "Description cannot be empty"),
  price: z.preprocess((a) => parseFloat(z.any().parse(a)), z.number().positive("Price must be positive")),
  category: z.string("Category is required").min(1, "Category cannot be empty"),
  availableQuantity: z.preprocess((a) => parseInt(z.any().parse(a), 10), z.number().int().positive("Available quantity must be positive")),
  
  // Sustainability Cert embedded data
  certifyingAgency: z.string("Certifying agency is required").min(1, "Certifying agency cannot be empty"),
  certificationDate: z.string("Certification date is required").refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "Invalid date format" }
  ),
});

export const updateProduceSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  price: z.preprocess((a) => a ? parseFloat(z.any().parse(a)) : undefined, z.number().positive("Price must be positive").optional()),
  category: z.string().min(1, "Category cannot be empty").optional(),
  availableQuantity: z.preprocess((a) => a ? parseInt(z.any().parse(a), 10) : undefined, z.number().int().positive("Available quantity must be positive").optional()),
});

export type TCreateProduceSchema = z.infer<typeof createProduceSchema>;
export type TUpdateProduceSchema = z.infer<typeof updateProduceSchema>;
