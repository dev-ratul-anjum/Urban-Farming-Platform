import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";
import {
  createCommunityPostSchema,
  updateCommunityPostSchema,
} from "./community-post.schema.js";
import { CommunityPostController } from "./community-post.controller.js";

const router = express.Router();

// Get all posts (global feed)
router.get("/v1/all", CommunityPostController.getAllPosts);

// Get all posts by the logged in user
router.get(
  "/v1/my-posts",
  checkAuth(),
  CommunityPostController.getAllPostsByUser,
);

// Get all posts by a specific user
router.get("/v1/user/:userId", CommunityPostController.getAllPostsByUser);

// Get a single post
router.get("/v1/:id", CommunityPostController.getPostById);

// Create a new post
router.post(
  "/v1/create",
  checkAuth(),
  validateSchema(createCommunityPostSchema),
  CommunityPostController.createPost,
);

// Update a post
router.patch(
  "/v1/update/:id",
  checkAuth(),
  validateSchema(updateCommunityPostSchema),
  CommunityPostController.updatePost,
);

// Delete a post
router.delete(
  "/v1/delete/:id",
  checkAuth(),
  CommunityPostController.deletePost,
);

export const CommunityPostRoutes = router;
