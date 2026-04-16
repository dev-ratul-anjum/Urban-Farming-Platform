import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { OrderService } from "./order.service.js";
import { UserRole } from "$/prisma/generated/enums.js";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  
  const result = await OrderService.createOrder(currentUserId, req.body);
  
  return responseHandler(res, 201, {
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderById(Number(req.params.id));
  
  return responseHandler(res, 200, {
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const result = await OrderService.updateOrder(Number(req.params.id), user, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const result = await OrderService.deleteOrder(Number(req.params.id), user);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
