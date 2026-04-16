import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { PlantTrackingService } from "./plant-tracking.service.js";
import { UserRole } from "$/prisma/generated/enums.js";

const createPlantTracking = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  
  const result = await PlantTrackingService.createPlantTracking(currentUserId, req.body);
  
  return responseHandler(res, 201, {
    success: true,
    message: "Plant tracking record created successfully",
    data: result,
  });
});

const getPlantTrackingByRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const rentalSpaceId = Number(req.params.rentalSpaceId);
  const result = await PlantTrackingService.getPlantTrackingByRentalSpace(rentalSpaceId, req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Plant tracking records retrieved successfully",
    data: result,
  });
});

const updatePlantTracking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const trackingId = Number(req.params.id);

  const result = await PlantTrackingService.updatePlantTracking(trackingId, user, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Plant tracking record updated successfully",
    data: result,
  });
});

const deletePlantTracking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const trackingId = Number(req.params.id);

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
