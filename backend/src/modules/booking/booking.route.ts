import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { createBookingSchema, updateBookingUserSchema, updateBookingVendorSchema } from "./booking.schema.js";
import { BookingController } from "./booking.controller.js";

const router = express.Router();

// --- General User Capabilities ---
router.post(
  "/v1/create",
  checkAuth(),
  validateSchema(createBookingSchema),
  BookingController.createBooking
);

router.get("/v1/my-bookings", checkAuth(), BookingController.getUserBookings);

// Users can solely update status to cancelled
router.patch(
  "/v1/my-bookings/:id",
  checkAuth(),
  validateSchema(updateBookingUserSchema),
  BookingController.updateBookingByUser
);


// --- Rental Owner (Vendor/Admin) Capabilities ---
router.get(
  "/v1/rental-space/:rentalSpaceId",
  checkAuth(["VENDOR", "ADMIN"]),
  BookingController.getBookingsForRentalSpace
);

// Owners update full status scope
router.patch(
  "/v1/vendor-update/:id",
  checkAuth(["VENDOR", "ADMIN"]),
  validateSchema(updateBookingVendorSchema),
  BookingController.updateBookingByVendor
);


export const BookingRoutes = router;
