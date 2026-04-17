-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_rentalSpaceId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_rentalSpaceId_fkey" FOREIGN KEY ("rentalSpaceId") REFERENCES "RentalSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
