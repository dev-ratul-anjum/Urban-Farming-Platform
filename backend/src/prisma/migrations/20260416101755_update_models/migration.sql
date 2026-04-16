/*
  Warnings:

  - You are about to drop the column `vendorId` on the `SustainabilityCert` table. All the data in the column will be lost.
  - You are about to drop the column `certificationStatus` on the `VendorProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[produceId]` on the table `SustainabilityCert` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `certificationStatus` on the `Produce` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `produceId` to the `SustainabilityCert` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('APPROVED', 'PENDING', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "SustainabilityCert" DROP CONSTRAINT "SustainabilityCert_vendorId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Produce" DROP COLUMN "certificationStatus",
ADD COLUMN     "certificationStatus" "CertificationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "SustainabilityCert" DROP COLUMN "vendorId",
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "produceId" INTEGER NOT NULL,
ADD COLUMN     "vendorProfileId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL;

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "certificationStatus";

-- CreateIndex
CREATE UNIQUE INDEX "SustainabilityCert_produceId_key" ON "SustainabilityCert"("produceId");

-- AddForeignKey
ALTER TABLE "SustainabilityCert" ADD CONSTRAINT "SustainabilityCert_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SustainabilityCert" ADD CONSTRAINT "SustainabilityCert_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
