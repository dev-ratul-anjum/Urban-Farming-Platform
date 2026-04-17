-- CreateTable
CREATE TABLE "PlantTracking" (
    "id" SERIAL NOT NULL,
    "rentalSpaceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "plantName" TEXT NOT NULL,
    "growthStatus" TEXT NOT NULL,
    "healthStatus" TEXT NOT NULL,
    "plantedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedHarvestDate" TIMESTAMP(3),
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantTracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlantTracking" ADD CONSTRAINT "PlantTracking_rentalSpaceId_fkey" FOREIGN KEY ("rentalSpaceId") REFERENCES "RentalSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantTracking" ADD CONSTRAINT "PlantTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
