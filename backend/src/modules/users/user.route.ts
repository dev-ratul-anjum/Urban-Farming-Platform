import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { UserController } from "./user.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";
import { signupLimiter } from "$/middlewares/rateLimiter.js";

const router = express.Router();

// Create User
router.post(
  "/v1/register",
  validateSchema(createUserSchema),
  signupLimiter,
  UserController.createUser,
);

// Get All Users
router.get("/v1/all", checkAuth(["ADMIN"]), UserController.getAllUsers);

// Get User Info
router.get("/v1/me", checkAuth(), UserController.getUserById);

// Update User
router.patch(
  "/v1/update",
  checkAuth(),
  validateSchema(updateUserSchema),
  UserController.updateUser,
);

// Delete User
router.delete("/v1/delete", checkAuth(), UserController.deleteUser);

export const UserRoutes = router;
