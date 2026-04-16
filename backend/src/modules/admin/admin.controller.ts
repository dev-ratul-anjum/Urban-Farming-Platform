import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { AdminService } from "./admin.service.js";

// --- USER MANAGEMENT ---
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateUser(Number(req.params.id), req.body);
  return responseHandler(res, 200, { success: true, message: "User updated successfully", data: result });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteUser(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "User deleted successfully" });
});

// --- COMMUNITY POST MANAGEMENT ---
const deleteCommunityPost = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteCommunityPost(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Community post deleted successfully" });
});

// --- ORDER MANAGEMENT ---
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllOrders(req.query);
  return responseHandler(res, 200, { success: true, message: "Orders retrieved successfully", data: result });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateOrder(Number(req.params.id), req.body);
  return responseHandler(res, 200, { success: true, message: "Order updated successfully", data: result });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteOrder(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Order deleted successfully" });
});

// --- PRODUCE MANAGEMENT ---
const getAllProduces = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllProduces(req.query);
  return responseHandler(res, 200, { success: true, message: "Produces retrieved successfully", data: result });
});

const updateProduce = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateProduce(Number(req.params.id), req.body);
  return responseHandler(res, 200, { success: true, message: "Produce updated successfully", data: result });
});

const deleteProduce = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteProduce(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Produce deleted successfully" });
});

// --- RENTAL SPACE MANAGEMENT ---
const deleteRentalSpace = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteRentalSpace(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Rental space deleted successfully" });
});

// --- SUSTAINABILITY CERTIFICATE MANAGEMENT ---
const deleteSustainabilityCert = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteSustainabilityCert(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Sustainability certificate deleted successfully" });
});

// --- VENDOR MANAGEMENT ---
const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteVendor(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Vendor profile deleted successfully" });
});

// --- BOOKING MANAGEMENT ---
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllBookings(req.query);
  return responseHandler(res, 200, { success: true, message: "Bookings retrieved successfully", data: result });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateBooking(Number(req.params.id), req.body);
  return responseHandler(res, 200, { success: true, message: "Booking updated successfully", data: result });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteBooking(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Booking deleted successfully" });
});

// --- PLANT TRACKING MANAGEMENT ---
const getAllPlantTrackings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllPlantTrackings(req.query);
  return responseHandler(res, 200, { success: true, message: "Plant trackings retrieved successfully", data: result });
});

const deletePlantTracking = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deletePlantTracking(Number(req.params.id));
  return responseHandler(res, 200, { success: true, message: "Plant tracking record deleted successfully" });
});

export const AdminController = {
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
