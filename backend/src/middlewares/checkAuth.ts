import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";
import { env } from "$/utils/env.js";
import { prisma } from "$/prisma/index.js";
import { UserRole } from "$/prisma/generated/enums.js";

interface AuthPayload extends JwtPayload {
  userId: number;
}

const checkAuth =
  (allowedRoles?: UserRole[]): RequestHandler =>
  async (req, res, next) => {
    try {
      const token = req.signedCookies[env.ACCESS_TOKEN_NAME];

      if (!token) {
        throw new ApiError(401, "Please login to continue.");
      }

      let decodedUser: AuthPayload;
      try {
        decodedUser = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
      } catch (error) {
        throw new ApiError(
          401,
          "Your session is invalid or has expired. Please login again.",
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: decodedUser.userId },
        select: {
          id: true,
          name: true,
          role: true, // needed for RBAC
        },
      });

      if (!user) {
        throw new ApiError(
          401,
          "Your session is invalid or has expired. Please login again.",
        );
      }

      // ✅ Role check (only if roles are provided)
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        throw new ApiError(
          403,
          "You are not authorized to access this resource.",
        );
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };

export default checkAuth;
