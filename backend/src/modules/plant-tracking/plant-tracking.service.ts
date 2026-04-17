import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole } from "$/prisma/generated/enums.js";
import {
  TCreatePlantTrackingSchema,
  TUpdatePlantTrackingSchema,
} from "./plant-tracking.schema.js";

const createPlantTracking = async (
  userId: number,
  payload: TCreatePlantTrackingSchema,
) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id: payload.rentalSpaceId },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  // Determine dates
  const plantedDate = payload.plantedDate
    ? new Date(payload.plantedDate)
    : new Date();
  const estimatedHarvestDate = payload.estimatedHarvestDate
    ? new Date(payload.estimatedHarvestDate)
    : null;

  const trackingRecord = await prisma.plantTracking.create({
    data: {
      userId,
      rentalSpaceId: rentalSpace.id,
      plantName: payload.plantName,
      growthStatus: payload.growthStatus,
      healthStatus: payload.healthStatus,
      plantedDate,
      estimatedHarvestDate,
    },
    include: {
      user: { select: { name: true, email: true } },
      rentalSpace: { select: { location: true } },
    },
  });

  return trackingRecord;
};

const getPlantTrackingByRentalSpace = async (
  rentalSpaceId: number,
  query: Record<string, any>,
) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id: rentalSpaceId },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  const [totalItems, rows] = await Promise.all([
    prisma.plantTracking.count({ where: { rentalSpaceId } }),
    prisma.plantTracking.findMany({
      where: { rentalSpaceId },
      skip,
      take: limit,
      orderBy: { lastUpdate: "desc" },
      include: {
        user: { select: { id: true, name: true } },
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
    plantTrackings: rows,
  };
};

const updatePlantTracking = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdatePlantTrackingSchema,
) => {
  const trackingRecord = await prisma.plantTracking.findUnique({
    where: { id },
    include: { rentalSpace: { include: { vendor: true } } },
  });

  if (!trackingRecord) {
    throw new ApiError(404, "Plant tracking record not found.");
  }

  // Only the owner of the rental space can update
  if (trackingRecord.rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: Only the owner of the rental space can update plant tracking data.",
    );
  }

  const updateData: any = { ...payload };
  if (payload.plantedDate)
    updateData.plantedDate = new Date(payload.plantedDate);
  if (payload.estimatedHarvestDate)
    updateData.estimatedHarvestDate = new Date(payload.estimatedHarvestDate);

  const updatedRecord = await prisma.plantTracking.update({
    where: { id },
    data: updateData,
  });

  return updatedRecord;
};

const deletePlantTracking = async (
  id: number,
  user: { id: number; role: UserRole },
) => {
  const trackingRecord = await prisma.plantTracking.findUnique({
    where: { id },
    include: { rentalSpace: { include: { vendor: true } } },
  });

  if (!trackingRecord) {
    throw new ApiError(404, "Plant tracking record not found.");
  }

  // Only the owner of the rental space can delete
  if (trackingRecord.rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: Only the owner of the rental space can delete plant tracking data.",
    );
  }

  await prisma.plantTracking.delete({ where: { id } });

  return null;
};

export const PlantTrackingService = {
  createPlantTracking,
  getPlantTrackingByRentalSpace,
  updatePlantTracking,
  deletePlantTracking,
};
