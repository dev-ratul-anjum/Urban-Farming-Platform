/*
  Warnings:

  - You are about to drop the column `vendorProfileId` on the `SustainabilityCert` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_produceId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Produce" DROP CONSTRAINT "Produce_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "RentalSpace" DROP CONSTRAINT "RentalSpace_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "SustainabilityCert" DROP CONSTRAINT "SustainabilityCert_produceId_fkey";

-- DropForeignKey
ALTER TABLE "SustainabilityCert" DROP CONSTRAINT "SustainabilityCert_vendorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_userId_fkey";

-- AlterTable
ALTER TABLE "SustainabilityCert" DROP COLUMN "vendorProfileId";

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produce" ADD CONSTRAINT "Produce_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalSpace" ADD CONSTRAINT "RentalSpace_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SustainabilityCert" ADD CONSTRAINT "SustainabilityCert_produceId_fkey" FOREIGN KEY ("produceId") REFERENCES "Produce"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
