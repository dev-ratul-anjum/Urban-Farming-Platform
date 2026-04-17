import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { UserService } from "./user.service.js";

// Register Any User
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  return responseHandler(res, 201, {
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);
  return responseHandler(res, 200, {
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id!;
  const result = await UserService.getUserById(currentUserId);
  return responseHandler(res, 200, {
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const result = await UserService.updateUser(currentUser, req.body);
  return responseHandler(res, 200, {
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id!;
  const result = await UserService.deleteUser(currentUserId);
  return responseHandler(res, 200, {
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
