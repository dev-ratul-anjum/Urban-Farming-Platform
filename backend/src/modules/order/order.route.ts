import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { createOrderSchema, updateOrderSchema } from "./order.schema.js";
import { OrderController } from "./order.controller.js";

const router = express.Router();

// Get all orders
router.get("/v1/all", checkAuth(), OrderController.getAllOrders);

// Get a single order
router.get("/v1/:id", checkAuth(), OrderController.getOrderById);

// Create an order
router.post(
  "/v1/create",
  checkAuth(),
  validateSchema(createOrderSchema),
  OrderController.createOrder,
);

// Update an order (typically for Vendors to update status)
router.patch(
  "/v1/update/:id",
  checkAuth(["VENDOR"]),
  validateSchema(updateOrderSchema),
  OrderController.updateOrder,
);

// Delete an order
router.delete("/v1/delete/:id", checkAuth(), OrderController.deleteOrder);

export const OrderRoutes = router;
