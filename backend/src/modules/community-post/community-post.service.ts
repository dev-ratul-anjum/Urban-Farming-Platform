import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole } from "$/prisma/generated/enums.js";
import { TCreateCommunityPostSchema, TUpdateCommunityPostSchema } from "./community-post.schema.js";

const createPost = async (userId: number, payload: TCreateCommunityPostSchema) => {
  const post = await prisma.communityPost.create({
    data: {
      userId,
      postContent: payload.postContent,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return post;
};

const getAllPosts = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.communityPost.count(),
    prisma.communityPost.findMany({
      skip,
      take: limit,
      orderBy: { postDate: "desc" },
      include: {
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
    posts: rows,
  };
};

const getAllPostsByUser = async (userId: number, query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  const [totalItems, rows] = await Promise.all([
    prisma.communityPost.count({ where: { userId } }),
    prisma.communityPost.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { postDate: "desc" },
      include: {
        user: { select: { id: true, name: true } },
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
    posts: rows,
  };
};

const getPostById = async (id: number) => {
  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } } },
  });

  if (!post) {
    throw new ApiError(404, "Community post not found.");
  }

  return post;
};

const updatePost = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdateCommunityPostSchema
) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });

  if (!post) {
    throw new ApiError(404, "Community post not found.");
  }

  // Check authorization
  if (post.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Forbidden: You don't have permission to update this post.");
  }

  const updatedPost = await prisma.communityPost.update({
    where: { id },
    data: payload,
  });

  return updatedPost;
};

const deletePost = async (id: number, user: { id: number; role: UserRole }) => {
  const post = await prisma.communityPost.findUnique({ where: { id } });

  if (!post) {
    throw new ApiError(404, "Community post not found.");
  }

  if (post.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new ApiError(403, "Forbidden: You don't have permission to delete this post.");
  }

  await prisma.communityPost.delete({ where: { id } });

  return null;
};

export const CommunityPostService = {
  createPost,
  getAllPosts,
  getAllPostsByUser,
  getPostById,
  updatePost,
  deletePost,
};
