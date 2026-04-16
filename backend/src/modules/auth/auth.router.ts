import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import { loginUserSchema } from "./auth.schema.js";
import authController from "./auth.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";

const authRouter = express.Router();

// Login Any User
authRouter.post(
  "/v1/login",
  validateSchema(loginUserSchema),
  authController.loginUser,
);

// Logout Any User
authRouter.post("/v1/logout", checkAuth(), authController.logoutUser);

export default authRouter;
