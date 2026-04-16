import "dotenv/config";
import { prisma } from "./prisma/index.js";
import { generateMockUsers, generateMockVendorProfiles } from "./mockData/user.mock.js";
import { generateMockProduces, generateMockCerts } from "./mockData/produce.mock.js";
import { UserRole } from "./prisma/generated/enums.js";

async function seedDatabase() {
  console.log("Starting DB seed implementation...");

  try {
    // 1. users
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log(`[Users] Skipping seed. Count = ${userCount}`);
    } else {
      console.log("[Users] Generating and inserting mock data...");
      const usersData = await generateMockUsers();
      await prisma.user.createMany({ data: usersData });
      console.log("[Users] Successfully seeded.");
    }

    // 2. Vendor Profiles
    const vendorProfileCount = await prisma.vendorProfile.count();
    if (vendorProfileCount > 0) {
      console.log(`[VendorProfiles] Skipping seed`);
    } else {
      console.log("[VendorProfiles] Generating and inserting mock data...");
      const dbVendors = await prisma.user.findMany({ where: { role: UserRole.VENDOR } });
      const vendorProfileData = generateMockVendorProfiles(dbVendors);
      await prisma.vendorProfile.createMany({ data: vendorProfileData });
      console.log("[VendorProfiles] Successfully seeded.");
    }

    // 3. Produces
    const produceCount = await prisma.produce.count();
    if (produceCount > 0) {
      console.log(`[Produces] Skipping seed`);
    } else {
      console.log("[Produces] Generating and inserting mock data...");
      const dbVendorProfiles = await prisma.vendorProfile.findMany({ select: { id: true } });
      const vendorProfileIds = dbVendorProfiles.map(vp => vp.id);
      
      if (vendorProfileIds.length === 0) {
        throw new Error("Cannot seed produces without vendor profiles.");
      }

      const produceData = generateMockProduces(vendorProfileIds);
      await prisma.produce.createMany({ data: produceData });
      console.log("[Produces] Successfully seeded 100 produce items.");
    }

    // 4. Sustainability Certs
    const certCount = await prisma.sustainabilityCert.count();
    if (certCount > 0) {
      console.log(`[SustainabilityCerts] Skipping seed`);
    } else {
      console.log("[SustainabilityCerts] Generating and inserting mock data...");
      // Fetch all produce IDs to map certifications
      const produces = await prisma.produce.findMany({ select: { id: true } });
      const produceIds = produces.map(p => p.id);
      
      const certData = generateMockCerts(produceIds);
      await prisma.sustainabilityCert.createMany({ data: certData });
      console.log("[SustainabilityCerts] Successfully seeded relation certs.");
    }

    console.log("Seed implementation correctly finished! All targets completed.");
  } catch (error) {
    console.error("Error encountered while seeding the database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute immediately when the file is run
seedDatabase();
