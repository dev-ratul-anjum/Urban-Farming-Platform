import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { AdminService } from "./admin.service.js";
import { ApiError } from "$/middlewares/errorHandler.js";

// --- USER MANAGEMENT ---
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const result = await AdminService.updateUser(userId, req.body);
  return responseHandler(res, 200, { success: true, message: "User updated successfully", data: result });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  await AdminService.deleteUser(userId);
  return responseHandler(res, 200, { success: true, message: "User deleted successfully" });
});

// --- COMMUNITY POST MANAGEMENT ---
const deleteCommunityPost = catchAsync(async (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  if (isNaN(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  await AdminService.deleteCommunityPost(postId);
  return responseHandler(res, 200, { success: true, message: "Community post deleted successfully" });
});

// --- ORDER MANAGEMENT ---
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllOrders(req.query);
  return responseHandler(res, 200, { success: true, message: "Orders retrieved successfully", data: result });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }
  const result = await AdminService.updateOrder(orderId, req.body);
  return responseHandler(res, 200, { success: true, message: "Order updated successfully", data: result });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  if (isNaN(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }
  await AdminService.deleteOrder(orderId);
  return responseHandler(res, 200, { success: true, message: "Order deleted successfully" });
});

// --- PRODUCE MANAGEMENT ---
const getAllProduces = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllProduces(req.query);
  return responseHandler(res, 200, { success: true, message: "Produces retrieved successfully", data: result });
});

const updateProduce = catchAsync(async (req: Request, res: Response) => {
  const produceId = Number(req.params.id);
  if (isNaN(produceId)) {
    throw new ApiError(400, "Invalid produce ID");
  }
  const result = await AdminService.updateProduce(produceId, req.body);
  return responseHandler(res, 200, { success: true, message: "Produce updated successfully", data: result });
});

const deleteProduce = catchAsync(async (req: Request, res: Response) => {
  const produceId = Number(req.params.id);
  if (isNaN(produceId)) {
    throw new ApiError(400, "Invalid produce ID");
  }
  await AdminService.deleteProduce(produceId);
  return responseHandler(res, 200, { success: true, message: "Produce deleted successfully" });
});

// --- RENTAL SPACE MANAGEMENT ---
const deleteRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const rentalSpaceId = Number(req.params.id);
  if (isNaN(rentalSpaceId)) {
    throw new ApiError(400, "Invalid rental space ID");
  }
  await AdminService.deleteRentalSpace(rentalSpaceId);
  return responseHandler(res, 200, { success: true, message: "Rental space deleted successfully" });
});

// --- SUSTAINABILITY CERTIFICATE MANAGEMENT ---
const deleteSustainabilityCert = catchAsync(async (req: Request, res: Response) => {
  const certId = Number(req.params.id);
  if (isNaN(certId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }
  await AdminService.deleteSustainabilityCert(certId);
  return responseHandler(res, 200, { success: true, message: "Sustainability certificate deleted successfully" });
});

// --- VENDOR MANAGEMENT ---
const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorId = Number(req.params.id);
  if (isNaN(vendorId)) {
    throw new ApiError(400, "Invalid vendor ID");
  }
  await AdminService.deleteVendor(vendorId);
  return responseHandler(res, 200, { success: true, message: "Vendor profile deleted successfully" });
});

// --- BOOKING MANAGEMENT ---
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllBookings(req.query);
  return responseHandler(res, 200, { success: true, message: "Bookings retrieved successfully", data: result });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  if (isNaN(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }
  const result = await AdminService.updateBooking(bookingId, req.body);
  return responseHandler(res, 200, { success: true, message: "Booking updated successfully", data: result });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = Number(req.params.id);
  if (isNaN(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }
  await AdminService.deleteBooking(bookingId);
  return responseHandler(res, 200, { success: true, message: "Booking deleted successfully" });
});

// --- PLANT TRACKING MANAGEMENT ---
const getAllPlantTrackings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllPlantTrackings(req.query);
  return responseHandler(res, 200, { success: true, message: "Plant trackings retrieved successfully", data: result });
});

const deletePlantTracking = catchAsync(async (req: Request, res: Response) => {
  const plantTrackingId = Number(req.params.id);
  if (isNaN(plantTrackingId)) {
    throw new ApiError(400, "Invalid plant tracking ID");
  }
  await AdminService.deletePlantTracking(plantTrackingId);
  return responseHandler(res, 200, { success: true, message: "Plant tracking record deleted successfully" });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.body);
  return responseHandler(res, 200, { success: true, message: "Admin created successfully", data: result });
});

export const AdminController = {
  createAdmin,
  updateUser,
  deleteUser,
  deleteCommunityPost,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getAllProduces,
  updateProduce,
  deleteProduce,
  deleteRentalSpace,
  deleteSustainabilityCert,
  deleteVendor,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getAllPlantTrackings,
  deletePlantTracking,
};
