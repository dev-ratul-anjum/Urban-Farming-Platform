import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { BookingService } from "./booking.service.js";
import { UserRole } from "$/prisma/generated/enums.js";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  
  const result = await BookingService.createBooking(currentUserId, req.body);
  
  return responseHandler(res, 201, {
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const result = await BookingService.getUserBookings(currentUserId, req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Your bookings retrieved successfully",
    data: result,
  });
});

const getBookingsForRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const rentalSpaceId = Number(req.params.rentalSpaceId);

  const result = await BookingService.getBookingsForRentalSpace(rentalSpaceId, user, req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Rental space bookings retrieved successfully",
    data: result,
  });
});

const updateBookingByUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const bookingId = Number(req.params.id);

  const result = await BookingService.updateBookingByUser(bookingId, currentUserId, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});

const updateBookingByVendor = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };
  const bookingId = Number(req.params.id);

  const result = await BookingService.updateBookingByVendor(bookingId, user, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Booking status manually updated successfully",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getUserBookings,
  getBookingsForRentalSpace,
  updateBookingByUser,
  updateBookingByVendor,
};
