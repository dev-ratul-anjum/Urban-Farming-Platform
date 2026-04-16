import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole, OrderStatus } from "$/prisma/generated/enums.js";
import { TCreateOrderSchema, TUpdateOrderSchema } from "./order.schema.js";

const createOrder = async (userId: number, payload: TCreateOrderSchema) => {
  const produce = await prisma.produce.findUnique({
    where: { id: payload.produceId },
  });

  if (!produce) {
    throw new ApiError(404, "Requested produce not found.");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      produceId: produce.id,
      vendorId: produce.vendorId,
      status: OrderStatus.PENDING,
    },
    include: {
      produce: { select: { id: true, name: true, price: true } },
      vendor: { select: { id: true, farmName: true } },
    },
  });

  return order;
};

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

const getOrderById = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      produce: true,
      vendor: { select: { farmName: true, farmLocation: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return order;
};

const updateOrder = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdateOrderSchema
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Only Admin or Vendor owning the order should update it
  if (order.vendor.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Forbidden: You don't have permission to update this order.");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: payload,
  });

  return updatedOrder;
};

const deleteOrder = async (id: number, user: { id: number; role: UserRole }) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Only Admin or Vendor owning the order should delete it (or maybe the user who created it).
  // Standard generic check:
  if (order.userId !== user.id && order.vendor.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Forbidden: You don't have permission to delete this order.");
  }

  await prisma.order.delete({ where: { id } });

  return null;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
