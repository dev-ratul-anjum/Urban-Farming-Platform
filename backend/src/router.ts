import express from "express";
import { UserRoutes } from "./modules/users/user.route.js";
import authRouter from "./modules/auth/auth.router.js";

const appRouter = express.Router();

appRouter.use("/users", UserRoutes);
appRouter.use("/auth", authRouter);

export default appRouter;
