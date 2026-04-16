import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import authService from "./auth.service.js";

import {
  clearAuthCookie,
  createJwtToken,
  setAuthCookie,
} from "$/utils/authHelpers.js";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);

  const token = createJwtToken(user.id);
  setAuthCookie(res, token);

  responseHandler(res, 200, {
    success: true,
    message: "Login successfull.",
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookie(res);

  responseHandler(res, 200, {
    success: true,
    message: "Logout successfull.",
  });
});

const authController = {
  loginUser,
  logoutUser,
};

export default authController;
