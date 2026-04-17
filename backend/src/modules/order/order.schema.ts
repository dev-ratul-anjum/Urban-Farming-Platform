import { z } from "zod";

export const createOrderSchema = z.object({
  produceId: z.number({ message: "Produce ID is required" }).int().positive(),
});

export const updateOrderSchema = z.object({
  status: z.enum(
    ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    {
      message: "Status must be a valid order status.",
    },
  ),
});

export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;
export type TUpdateOrderSchema = z.infer<typeof updateOrderSchema>;
