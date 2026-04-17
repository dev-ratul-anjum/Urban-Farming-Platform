import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import bcrypt from "bcryptjs";
import { TCreateUserSchema, TUpdateUserSchema } from "./user.schema.js";
import { UserRole, UserStatus } from "$/prisma/generated/enums.js";

const createUser = async (payload: TCreateUserSchema) => {
  let { role, status, ...userData } = payload;

  // Business logic for status assignment
  if (role === "CUSTOMER") {
    status = UserStatus.ACTIVE;
  } else if (role === "VENDOR") {
    status = UserStatus.PENDING;
  }

  // Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      role,
      status,
      password: hashedPassword,
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

const getAllUsers = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [usersCount, rows] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const hasNextPage = skip + limit < usersCount;
  const hasPrevPage = pageNumber > 1;

  return {
    users: rows,
    meta: {
      totalUsers: usersCount,
      currentPage: pageNumber,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNumber + 1 : null,
      prevPage: hasPrevPage ? pageNumber - 1 : null,
    },
  };
};

const getUserById = async (currentUserId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

const updateUser = async (
  user: { id: number; role: UserRole },
  payload: TUpdateUserSchema,
) => {
  const { id, role } = user;

  if (payload.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists.");
    }
  }

  const updateData: TUpdateUserSchema & { status?: UserStatus } = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
  };
  if (payload.password) {
    updateData.password = await bcrypt.hash(payload.password, 10);
  }

  // If user is vendor and first time providing farm name and location, create vendor profile otherwise update it & update status to active
  if (role === "VENDOR" && payload.farmName && payload.farmLocation) {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: id },
    });
    if (vendorProfile) {
      await prisma.vendorProfile.update({
        where: { userId: id },
        data: {
          farmName: payload.farmName,
          farmLocation: payload.farmLocation,
        },
      });
    } else {
      await prisma.vendorProfile.create({
        data: {
          userId: id,
          farmName: payload.farmName,
          farmLocation: payload.farmLocation,
        },
      });

      updateData.status = UserStatus.ACTIVE;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await prisma.user.delete({ where: { id } });

  return null;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
