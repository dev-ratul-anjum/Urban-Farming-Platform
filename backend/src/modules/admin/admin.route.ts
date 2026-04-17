import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { AdminController } from "./admin.controller.js";
import {
  adminUpdateUserSchema,
  adminUpdateOrderSchema,
  adminUpdateProduceSchema,
  adminUpdateBookingSchema,
  createAdminSchema,
} from "./admin.schema.js";
import { signupLimiter } from "$/middlewares/rateLimiter.js";

const router = express.Router();

// ALL ROUTES ARE ADMIN ONLY
const adminAuth = checkAuth(["ADMIN"]);

// Create Admin
router.post(
  "/v1/register",
  adminAuth,
  validateSchema(createAdminSchema),
  signupLimiter,
  AdminController.createAdmin,
);

// --- User Management ---
router.patch(
  "/v1/users/:id",
  adminAuth,
  validateSchema(adminUpdateUserSchema),
  AdminController.updateUser,
);
router.delete("/v1/users/:id", adminAuth, AdminController.deleteUser);

// --- Community Post Management ---
router.delete(
  "/v1/community-posts/:id",
  adminAuth,
  AdminController.deleteCommunityPost,
);

// --- Order Management ---
router.get("/v1/orders", adminAuth, AdminController.getAllOrders);
router.patch(
  "/v1/orders/:id",
  adminAuth,
  validateSchema(adminUpdateOrderSchema),
  AdminController.updateOrder,
);
router.delete("/v1/orders/:id", adminAuth, AdminController.deleteOrder);

// --- Produce Management ---
router.get("/v1/produces", adminAuth, AdminController.getAllProduces);
router.patch(
  "/v1/produces/:id",
  adminAuth,
  validateSchema(adminUpdateProduceSchema),
  AdminController.updateProduce,
);
router.delete("/v1/produces/:id", adminAuth, AdminController.deleteProduce);

// --- Rental Space Management ---
router.delete(
  "/v1/rental-spaces/:id",
  adminAuth,
  AdminController.deleteRentalSpace,
);

// --- Sustainability Certificate Management ---
router.delete(
  "/v1/sustainability-certs/:id",
  adminAuth,
  AdminController.deleteSustainabilityCert,
);

// --- Vendor Management ---
router.delete("/v1/vendors/:id", adminAuth, AdminController.deleteVendor);

// --- Booking Management ---
router.get("/v1/bookings", adminAuth, AdminController.getAllBookings);
router.patch(
  "/v1/bookings/:id",
  adminAuth,
  validateSchema(adminUpdateBookingSchema),
  AdminController.updateBooking,
);
router.delete("/v1/bookings/:id", adminAuth, AdminController.deleteBooking);

// --- Plant Tracking Management ---
router.get(
  "/v1/plant-trackings",
  adminAuth,
  AdminController.getAllPlantTrackings,
);
router.delete(
  "/v1/plant-trackings/:id",
  adminAuth,
  AdminController.deletePlantTracking,
);

export const AdminRoutes = router;
