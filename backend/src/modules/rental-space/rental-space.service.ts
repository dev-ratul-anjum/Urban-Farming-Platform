import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole } from "$/prisma/generated/enums.js";
import {
  TCreateRentalSpaceSchema,
  TUpdateRentalSpaceSchema,
} from "./rental-space.schema.js";

const createRentalSpace = async (
  userId: number,
  payload: TCreateRentalSpaceSchema,
) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  if (!vendorProfile) {
    throw new ApiError(
      403,
      "Forbidden: Only vendors with a complete profile can create rental spaces.",
    );
  }

  const rentalSpace = await prisma.rentalSpace.create({
    data: {
      vendorId: vendorProfile.id,
      ...payload,
    },
    include: {
      vendor: {
        select: {
          id: true,
          farmName: true,
          farmLocation: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  return rentalSpace;
};

const getAllRentalSpaces = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.rentalSpace.count(),
    prisma.rentalSpace.findMany({
      skip,
      take: limit,
      include: {
        vendor: {
          select: {
            id: true,
            farmName: true,
            user: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    rentalSpaces: rows,
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
  };
};

const getRentalSpaceById = async (id: number) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id },
    include: {
      vendor: {
        select: {
          id: true,
          farmName: true,
          farmLocation: true,
          user: { select: { name: true, email: true, id: true } },
        },
      },
    },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  return rentalSpace;
};

const updateRentalSpace = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdateRentalSpaceSchema,
) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  if (rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to update this rental space.",
    );
  }

  const updatedRentalSpace = await prisma.rentalSpace.update({
    where: { id },
    data: payload,
  });

  return updatedRentalSpace;
};

const deleteRentalSpace = async (
  id: number,
  user: { id: number; role: UserRole },
) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  if (rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to delete this rental space.",
    );
  }

  await prisma.rentalSpace.delete({ where: { id } });

  return null;
};

export const RentalSpaceService = {
  createRentalSpace,
  getAllRentalSpaces,
  getRentalSpaceById,
  updateRentalSpace,
  deleteRentalSpace,
};
