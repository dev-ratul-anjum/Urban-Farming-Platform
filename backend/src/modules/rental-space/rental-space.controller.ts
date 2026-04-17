import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { RentalSpaceService } from "./rental-space.service.js";
import { UserRole } from "$/prisma/generated/enums.js";
import { ApiError } from "$/middlewares/errorHandler.js";

const createRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const result = await RentalSpaceService.createRentalSpace(currentUserId, req.body);
  
  return responseHandler(res, 201, {
    success: true,
    message: "Rental space created successfully",
    data: result,
  });
});

const getAllRentalSpaces = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalSpaceService.getAllRentalSpaces(req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Rental spaces retrieved successfully",
    data: result,
  });
});

const getRentalSpaceById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new ApiError(400, "Invalid rental space ID");
  }

  const result = await RentalSpaceService.getRentalSpaceById(id);

  return responseHandler(res, 200, {
    success: true,
    message: "Rental space retrieved successfully",
    data: result,
  });
});

const updateRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  const rentalId = Number(req.params.id);

  if (Number.isNaN(rentalId)) {
    throw new ApiError(400, "Invalid rental space ID");
  }

  const result = await RentalSpaceService.updateRentalSpace(rentalId, user, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Rental space updated successfully",
    data: result,
  });
});

const deleteRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  const rentalId = Number(req.params.id);

  if (Number.isNaN(rentalId)) {
    throw new ApiError(400, "Invalid rental space ID");
  }

  const result = await RentalSpaceService.deleteRentalSpace(rentalId, user);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Rental space deleted successfully",
    data: result,
  });
});

export const RentalSpaceController = {
  createRentalSpace,
  getAllRentalSpaces,
  getRentalSpaceById,
  updateRentalSpace,
  deleteRentalSpace,
};
