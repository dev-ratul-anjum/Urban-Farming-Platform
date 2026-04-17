import { z } from "zod";

export const createCommunityPostSchema = z.object({
  postContent: z
    .string("Post content is required")
    .min(1, "Post content cannot be empty"),
});

export const updateCommunityPostSchema = z.object({
  postContent: z.string().min(1, "Post content cannot be empty").optional(),
});

export type TCreateCommunityPostSchema = z.infer<
  typeof createCommunityPostSchema
>;
export type TUpdateCommunityPostSchema = z.infer<
  typeof updateCommunityPostSchema
>;
