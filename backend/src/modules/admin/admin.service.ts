import bcrypt from "bcryptjs";
import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import {
  TAdminUpdateUserSchema,
  TAdminUpdateOrderSchema,
  TAdminUpdateProduceSchema,
  TAdminUpdateBookingSchema,
  TCreateAdminSchema,
} from "./admin.schema.js";

// --- USER MANAGEMENT ---
const updateUser = async (id: number, payload: TAdminUpdateUserSchema) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found.");

  return await prisma.user.update({
    where: { id },
    data: payload,
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, "User not found.");

  await prisma.user.delete({ where: { id } });
  return null;
};

// --- COMMUNITY POST MANAGEMENT ---
const deleteCommunityPost = async (id: number) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });
  if (!post) throw new ApiError(404, "Community post not found.");

  await prisma.communityPost.delete({ where: { id } });
  return null;
};

// --- ORDER MANAGEMENT ---
const getAllOrders = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { orderDate: "desc" },
      include: {
        produce: { select: { id: true, name: true, price: true } },
        vendor: { select: { farmName: true } },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
    orders: rows,
  };
};

const updateOrder = async (id: number, payload: TAdminUpdateOrderSchema) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new ApiError(404, "Order not found.");

  return await prisma.order.update({
    where: { id },
    data: payload,
  });
};

const deleteOrder = async (id: number) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new ApiError(404, "Order not found.");

  await prisma.order.delete({ where: { id } });
  return null;
};

// --- PRODUCE MANAGEMENT ---
const getAllProduces = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.produce.count(),
    prisma.produce.findMany({
      skip,
      take: limit,
      include: {
        vendor: { select: { id: true, farmName: true } },
        sustainabilityCerts: true,
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
    produces: rows,
  };
};

const updateProduce = async (
  id: number,
  payload: TAdminUpdateProduceSchema,
) => {
  const produce = await prisma.produce.findUnique({ where: { id } });
  if (!produce) throw new ApiError(404, "Produce not found.");

  return await prisma.produce.update({
    where: { id },
    data: payload,
  });
};

const deleteProduce = async (id: number) => {
  const produce = await prisma.produce.findUnique({ where: { id } });
  if (!produce) throw new ApiError(404, "Produce not found.");

  await prisma.produce.delete({ where: { id } });
  return null;
};

// --- RENTAL SPACE MANAGEMENT ---
const deleteRentalSpace = async (id: number) => {
  const space = await prisma.rentalSpace.findUnique({ where: { id } });
  if (!space) throw new ApiError(404, "Rental space not found.");

  await prisma.rentalSpace.delete({ where: { id } });
  return null;
};

// --- SUSTAINABILITY CERTIFICATE MANAGEMENT ---
const deleteSustainabilityCert = async (id: number) => {
  const cert = await prisma.sustainabilityCert.findUnique({ where: { id } });
  if (!cert) throw new ApiError(404, "Sustainability certificate not found.");

  await prisma.sustainabilityCert.delete({ where: { id } });
  return null;
};

// --- VENDOR MANAGEMENT ---
const deleteVendor = async (id: number) => {
  const vendor = await prisma.vendorProfile.findUnique({ where: { id } });
  if (!vendor) throw new ApiError(404, "Vendor profile not found.");

  await prisma.vendorProfile.delete({ where: { id } });
  return null;
};

// --- BOOKING MANAGEMENT ---
const getAllBookings = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        rentalSpace: { select: { id: true, location: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
    bookings: rows,
  };
};

const updateBooking = async (
  id: number,
  payload: TAdminUpdateBookingSchema,
) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new ApiError(404, "Booking not found.");

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: payload,
  });

  if (payload.status) {
    if (payload.status === "ACTIVE") {
      await prisma.rentalSpace.update({
        where: { id: updatedBooking.rentalSpaceId },
        data: { availability: false },
      });
    } else {
      await prisma.rentalSpace.update({
        where: { id: updatedBooking.rentalSpaceId },
        data: { availability: true },
      });
    }
  }

  return updatedBooking;
};

const deleteBooking = async (id: number) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new ApiError(404, "Booking not found.");

  await prisma.booking.delete({ where: { id } });
  return null;
};

// --- PLANT TRACKING MANAGEMENT ---
const getAllPlantTrackings = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.plantTracking.count(),
    prisma.plantTracking.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        rentalSpace: { select: { id: true, location: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  const hasNextPage = skip + limit < totalItems;
  const hasPrevPage = pageNumber > 1;

  return {
    meta: {
      totalItems,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
    plantTrackings: rows,
  };
};

const deletePlantTracking = async (id: number) => {
  const trackingRecord = await prisma.plantTracking.findUnique({
    where: { id },
  });
  if (!trackingRecord)
    throw new ApiError(404, "Plant tracking record not found.");

  await prisma.plantTracking.delete({ where: { id } });
  return null;
};

const createAdmin = async (payload: TCreateAdminSchema) => {
  const { name, email, password, status } = payload;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const AdminService = {
  createAdmin,
  updateUser,
  deleteUser,
  deleteCommunityPost,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getAllProduces,
  updateProduce,
  deleteProduce,
  deleteRentalSpace,
  deleteSustainabilityCert,
  deleteVendor,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getAllPlantTrackings,
  deletePlantTracking,
};
