import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import {
  createPlantTrackingSchema,
  updatePlantTrackingSchema,
} from "./plant-tracking.schema.js";
import { PlantTrackingController } from "./plant-tracking.controller.js";

const router = express.Router();

// Get all plant tracking records for a specific rental space
router.get(
  "/v1/rental-space/:rentalSpaceId",
  checkAuth(),
  PlantTrackingController.getPlantTrackingByRentalSpace,
);

// Create plant tracking record
router.post(
  "/v1/create",
  checkAuth(),
  validateSchema(createPlantTrackingSchema),
  PlantTrackingController.createPlantTracking,
);

// Update plant tracking record (Owner only)
router.patch(
  "/v1/update/:id",
  checkAuth(["VENDOR"]),
  validateSchema(updatePlantTrackingSchema),
  PlantTrackingController.updatePlantTracking,
);

// Delete plant tracking record (Owner only)
router.delete(
  "/v1/delete/:id",
  checkAuth(["VENDOR"]),
  PlantTrackingController.deletePlantTracking,
);

export const PlantTrackingRoutes = router;
