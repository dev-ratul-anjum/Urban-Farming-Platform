import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole, BookingStatus } from "$/prisma/generated/enums.js";
import {
  TCreateBookingSchema,
  TUpdateBookingUserSchema,
  TUpdateBookingVendorSchema,
} from "./booking.schema.js";

const enforceAvailabilityLogic = async (
  rentalSpaceId: number,
  status: BookingStatus,
) => {
  if (status === BookingStatus.ACTIVE) {
    await prisma.rentalSpace.update({
      where: { id: rentalSpaceId },
      data: { availability: false },
    });
  } else {
    await prisma.rentalSpace.update({
      where: { id: rentalSpaceId },
      data: { availability: true },
    });
  }
};

const createBooking = async (userId: number, payload: TCreateBookingSchema) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id: payload.rentalSpaceId },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  if (!rentalSpace.availability) {
    throw new ApiError(400, "This rental space is currently unavailable.");
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      rentalSpaceId: rentalSpace.id,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      totalAmount: payload.totalAmount,
      status: BookingStatus.PENDING,
    },
    include: {
      rentalSpace: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  // Default is PENDING, but enforce logic anyway just in case Defaults change
  await enforceAvailabilityLogic(rentalSpace.id, booking.status);

  return booking;
};

const getUserBookings = async (userId: number, query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.booking.count({ where: { userId } }),
    prisma.booking.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        rentalSpace: { include: { vendor: { select: { farmName: true } } } },
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
    bookings: rows,
  };
};

const getBookingsForRentalSpace = async (
  rentalSpaceId: number,
  user: { id: number; role: UserRole },
  query: Record<string, any>,
) => {
  const rentalSpace = await prisma.rentalSpace.findUnique({
    where: { id: rentalSpaceId },
    include: { vendor: true },
  });

  if (!rentalSpace) {
    throw new ApiError(404, "Rental space not found.");
  }

  if (rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: Only the rental owner can view these bookings.",
    );
  }

  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.booking.count({ where: { rentalSpaceId } }),
    prisma.booking.findMany({
      where: { rentalSpaceId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
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
    bookings: rows,
  };
};

const updateBookingByUser = async (
  id: number,
  userId: number,
  payload: TUpdateBookingUserSchema,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  if (booking.userId !== userId) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to update this booking.",
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: payload.status as BookingStatus },
  });

  await enforceAvailabilityLogic(
    updatedBooking.rentalSpaceId,
    updatedBooking.status,
  );

  return updatedBooking;
};

const updateBookingByVendor = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdateBookingVendorSchema,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { rentalSpace: { include: { vendor: true } } },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  if (booking.rentalSpace.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to update this booking.",
    );
  }

  if(booking.status === BookingStatus.CANCELLED){
    throw new ApiError(400, "Booking is already cancelled.");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: payload.status },
  });

  await enforceAvailabilityLogic(
    updatedBooking.rentalSpaceId,
    updatedBooking.status,
  );

  return updatedBooking;
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingsForRentalSpace,
  updateBookingByUser,
  updateBookingByVendor,
  enforceAvailabilityLogic, // Exposing for admin service context
};
