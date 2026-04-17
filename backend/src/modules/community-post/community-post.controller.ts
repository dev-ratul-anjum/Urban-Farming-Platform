import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { CommunityPostService } from "./community-post.service.js";
import { UserRole } from "$/prisma/generated/enums.js";
import { ApiError } from "$/middlewares/errorHandler.js";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const result = await CommunityPostService.createPost(currentUserId, req.body);

  return responseHandler(res, 201, {
    success: true,
    message: "Community post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await CommunityPostService.getAllPosts(req.query);

  return responseHandler(res, 200, {
    success: true,
    message: "Community posts retrieved successfully",
    data: result,
  });
});

const getAllPostsByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId
    ? Number(req.params.userId)
    : req.user!.id;

  if (Number.isNaN(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const result = await CommunityPostService.getAllPostsByUser(
    userId,
    req.query,
  );

  return responseHandler(res, 200, {
    success: true,
    message: "User's community posts retrieved successfully",
    data: result,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const postId = Number(req.params.id);

  if (Number.isNaN(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const result = await CommunityPostService.getPostById(postId);

  return responseHandler(res, 200, {
    success: true,
    message: "Community post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  const postId = Number(req.params.id);

  if (Number.isNaN(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const result = await CommunityPostService.updatePost(postId, user, req.body);

  return responseHandler(res, 200, {
    success: true,
    message: "Community post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  
  const postId = Number(req.params.id);

  if (Number.isNaN(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const result = await CommunityPostService.deletePost(postId, user);

  return responseHandler(res, 200, {
    success: true,
    message: "Community post deleted successfully",
    data: result,
  });
});

export const CommunityPostController = {
  createPost,
  getAllPosts,
  getAllPostsByUser,
  getPostById,
  updatePost,
  deletePost,
};
