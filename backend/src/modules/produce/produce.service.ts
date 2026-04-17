import { prisma } from "$/prisma/index.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { UserRole, CertificationStatus } from "$/prisma/generated/enums.js";
import {
  TCreateProduceSchema,
  TUpdateProduceSchema,
} from "./produce.schema.js";

const createProduce = async (
  userId: number,
  payload: TCreateProduceSchema,
  fileUrls: string[],
) => {
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  if (!vendorProfile) {
    throw new ApiError(
      403,
      "Forbidden: Only vendors with a complete profile can create a produce.",
    );
  }

  const { certifyingAgency, certificationDate, ...produceData } = payload;

  const produce = await prisma.produce.create({
    data: {
      ...produceData,
      vendorId: vendorProfile.id,
      certificationStatus: CertificationStatus.PENDING,
      sustainabilityCerts: {
        create: {
          certifyingAgency,
          certificationDate: new Date(certificationDate),
          attachments: fileUrls,
        },
      },
    },
    include: {
      vendor: { select: { id: true, farmName: true, farmLocation: true } },
      sustainabilityCerts: true,
    },
  });

  return produce;
};

const getAllProduces = async (query: Record<string, any>) => {
  const pageNumber = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;

  // Must return only produces with approved SustainabilityCert
  const whereFilter = {
    certificationStatus: CertificationStatus.APPROVED,
  };

  const [totalItems, rows] = await Promise.all([
    prisma.produce.count({ where: whereFilter }),
    prisma.produce.findMany({
      where: whereFilter,
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

const getProduceById = async (id: number) => {
  const produce = await prisma.produce.findUnique({
    where: { id },
    include: {
      vendor: {
        select: {
          id: true,
          farmName: true,
          farmLocation: true,
          user: { select: { name: true, email: true } },
        },
      },
      sustainabilityCerts: true,
    },
  });

  if (!produce) {
    throw new ApiError(404, "Produce not found.");
  }
  
  if (produce.certificationStatus !== CertificationStatus.APPROVED) {
    throw new ApiError(
      403,
      "This produce is currently pending certification approval.",
    );
  }

  return produce;
};

const updateProduce = async (
  id: number,
  user: { id: number; role: UserRole },
  payload: TUpdateProduceSchema,
) => {
  const produce = await prisma.produce.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!produce) {
    throw new ApiError(404, "Produce not found.");
  }

  if (produce.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to update this produce.",
    );
  }

  const updatedProduce = await prisma.produce.update({
    where: { id },
    data: payload,
  });

  return updatedProduce;
};

const deleteProduce = async (
  id: number,
  user: { id: number; role: UserRole },
) => {
  const produce = await prisma.produce.findUnique({
    where: { id },
    include: { vendor: true },
  });

  if (!produce) {
    throw new ApiError(404, "Produce not found.");
  }

  if (produce.vendor.userId !== user.id) {
    throw new ApiError(
      403,
      "Forbidden: You don't have permission to delete this produce.",
    );
  }

  await prisma.produce.delete({ where: { id } });

  return null;
};

export const ProduceService = {
  createProduce,
  getAllProduces,
  getProduceById,
  updateProduce,
  deleteProduce,
};
