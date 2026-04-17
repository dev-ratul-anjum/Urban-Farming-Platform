import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { ProduceService } from "./produce.service.js";
import { UserRole } from "$/prisma/generated/enums.js";
import { uploadMultipleToCloudinary } from "$/utils/fileUploader.js";
import { ApiError } from "$/middlewares/errorHandler.js";

const createProduce = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    throw new ApiError(400, "Please upload at least one certification file.");
  }

  // Extract files depending on how multer provides them
  const files = req.files as Express.Multer.File[];
  
  // Upload to Cloudinary
  const uploadResults = await uploadMultipleToCloudinary(files);
  const fileUrls = uploadResults.map((result) => result.secure_url);

  const result = await ProduceService.createProduce(currentUserId, req.body, fileUrls);
  
  return responseHandler(res, 201, {
    success: true,
    message: "Produce and certification details submitted successfully. Awaiting approval.",
    data: result,
  });
});

const getAllProduces = catchAsync(async (req: Request, res: Response) => {
  const result = await ProduceService.getAllProduces(req.query);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Approved produces retrieved successfully",
    data: result,
  });
});

const getProduceById = catchAsync(async (req: Request, res: Response) => {
  const produceId = Number(req.params.id);
  if(isNaN(produceId)){
    throw new ApiError(400, "Invalid produce ID");
  }
  const result = await ProduceService.getProduceById(produceId);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Produce retrieved successfully",
    data: result,
  });
});

const updateProduce = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  const produceId = Number(req.params.id);
  if(isNaN(produceId)){
    throw new ApiError(400, "Invalid produce ID");
  }
  const result = await ProduceService.updateProduce(produceId, user, req.body);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Produce updated successfully",
    data: result,
  });
});

const deleteProduce = catchAsync(async (req: Request, res: Response) => {
  const user = req.user! as { id: number; role: UserRole };

  const produceId = Number(req.params.id);
  if(isNaN(produceId)){
    throw new ApiError(400, "Invalid produce ID");
  }
  const result = await ProduceService.deleteProduce(produceId, user);
  
  return responseHandler(res, 200, {
    success: true,
    message: "Produce deleted successfully",
    data: result,
  });
});

export const ProduceController = {
  createProduce,
  getAllProduces,
  getProduceById,
  updateProduce,
  deleteProduce,
};
