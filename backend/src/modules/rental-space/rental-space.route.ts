import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { createRentalSpaceSchema, updateRentalSpaceSchema } from "./rental-space.schema.js";
import { RentalSpaceController } from "./rental-space.controller.js";

const router = express.Router();

// Get all rental spaces
router.get("/v1/all", RentalSpaceController.getAllRentalSpaces);

// Get a single rental space
router.get("/v1/:id", RentalSpaceController.getRentalSpaceById);

// Create a new rental space (Only VENDORs)
router.post(
  "/v1/create",
  checkAuth(["VENDOR", "ADMIN"]),
  validateSchema(createRentalSpaceSchema),
  RentalSpaceController.createRentalSpace
);

// Update a rental space
router.patch(
  "/v1/update/:id",
  checkAuth(["VENDOR", "ADMIN"]),
  validateSchema(updateRentalSpaceSchema),
  RentalSpaceController.updateRentalSpace
);

// Delete a rental space
router.delete(
  "/v1/delete/:id",
  checkAuth(["VENDOR", "ADMIN"]),
  RentalSpaceController.deleteRentalSpace
);

export const RentalSpaceRoutes = router;
