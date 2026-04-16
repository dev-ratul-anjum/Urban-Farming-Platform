import express from "express";
import { UserRoutes } from "./modules/users/user.route.js";
import authRouter from "./modules/auth/auth.router.js";
import { CommunityPostRoutes } from "./modules/community-post/community-post.route.js";
import { RentalSpaceRoutes } from "./modules/rental-space/rental-space.route.js";
import { ProduceRoutes } from "./modules/produce/produce.route.js";
import { OrderRoutes } from "./modules/order/order.route.js";
import { AdminRoutes } from "./modules/admin/admin.route.js";
import { BookingRoutes } from "./modules/booking/booking.route.js";
import { PlantTrackingRoutes } from "./modules/plant-tracking/plant-tracking.route.js";

const appRouter = express.Router();

appRouter.use("/users", UserRoutes);
appRouter.use("/auth", authRouter);
appRouter.use("/community-posts", CommunityPostRoutes);
appRouter.use("/rental-spaces", RentalSpaceRoutes);
appRouter.use("/produces", ProduceRoutes);
appRouter.use("/orders", OrderRoutes);
appRouter.use("/admin", AdminRoutes);
appRouter.use("/bookings", BookingRoutes);
appRouter.use("/plant-tracking", PlantTrackingRoutes);

export default appRouter;
