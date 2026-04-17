import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { createProduceSchema, updateProduceSchema } from "./produce.schema.js";
import { ProduceController } from "./produce.controller.js";
import { uploader } from "$/utils/fileUploader.js";

const router = express.Router();

// Allowed file types and limits for certificates
const upload = uploader(
  ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  5 * 1024 * 1024, // 5 MB max
  "Only PDF and JPEG/PNG/WEBP Image formats are allowed.",
  3, // Max 3 files
);

// Get all produces (publicly visible ones)
router.get("/v1/all", ProduceController.getAllProduces);

// Get a single produce
router.get("/v1/:id", ProduceController.getProduceById);

// Create a new produce (Requires file upload)
router.post(
  "/v1/create",
  checkAuth(["VENDOR"]),
  upload.array("attachments"),
  validateSchema(createProduceSchema),
  ProduceController.createProduce,
);

// Update a produce
router.patch(
  "/v1/update/:id",
  checkAuth(["VENDOR"]),
  validateSchema(updateProduceSchema),
  ProduceController.updateProduce,
);

// Delete a produce
router.delete(
  "/v1/delete/:id",
  checkAuth(["VENDOR", "ADMIN"]),
  ProduceController.deleteProduce,
);

export const ProduceRoutes = router;
