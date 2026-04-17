import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { PlantTrackingService } from "./plant-tracking.service.js";
import { UserRole } from "$/prisma/generated/enums.js";
import { ApiError } from "$/middlewares/errorHandler.js";

const createPlantTracking = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;

  const result = await PlantTrackingService.createPlantTracking(
    currentUserId,
    req.body,
  );

  return responseHandler(res, 201, {
    success: true,
    message: "Plant tracking record created successfully",
    data: result,
  });
});

const getPlantTrackingByRentalSpace = catchAsync(
  async (req: Request, res: Response) => {
    const rentalSpaceId = Number(req.params.rentalSpaceId);

    if (Number.isNaN(rentalSpaceId)) {
      throw new ApiError(400, "Invalid rental space ID");
    }

    const result = await PlantTrackingService.getPlantTrackingByRentalSpace(
      rentalSpaceId,
      req.query,
    );

    return responseHandler(res, 200, {
      success: true,
      message: "Plant tracking records retrieved successfully",
      data: result,
    });
  },
);

const updatePlantTracking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const trackingId = Number(req.params.id);

  if (Number.isNaN(trackingId)) {
    throw new ApiError(400, "Invalid plant tracking ID");
  }

  const result = await PlantTrackingService.updatePlantTracking(
    trackingId,
    user,
    req.body,
  );

  return responseHandler(res, 200, {
    success: true,
    message: "Plant tracking record updated successfully",
    data: result,
  });
});

const deletePlantTracking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const trackingId = Number(req.params.id);

  if (Number.isNaN(trackingId)) {
    throw new ApiError(400, "Invalid plant tracking ID");
  }

  await PlantTrackingService.deletePlantTracking(trackingId, user);

  return responseHandler(res, 200, {
    success: true,
    message: "Plant tracking record deleted successfully",
  });
});

export const PlantTrackingController = {
  createPlantTracking,
  getPlantTrackingByRentalSpace,
  updatePlantTracking,
  deletePlantTracking,
};
