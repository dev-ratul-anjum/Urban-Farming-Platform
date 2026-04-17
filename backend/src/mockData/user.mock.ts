import bcrypt from "bcryptjs";
import { UserRole, UserStatus } from "$/prisma/generated/enums.js";

export const generateMockUsers = async () => {
  const users = [];
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash("Password123!", salt);

  // 3 Admins
  for (let i = 1; i <= 3; i++) {
    users.push({
      name: `Admin User ${i}`,
      email: `admin${i}@example.com`,
      password: defaultPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
  }

  // 10 Vendors
  for (let i = 1; i <= 10; i++) {
    users.push({
      name: `Vendor User ${i}`,
      email: `vendor${i}@example.com`,
      password: defaultPassword,
      role: UserRole.VENDOR,
      status: UserStatus.ACTIVE, // Making them ACTIVE so they can create produce in realistic testing
    });
  }

  // 10 Customers
  for (let i = 1; i <= 10; i++) {
    users.push({
      name: `Customer User ${i}`,
      email: `customer${i}@example.com`,
      password: defaultPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    });
  }

  return users;
};

export const generateMockVendorProfiles = (
  vendorUsers: { id: number; name: string; email: string }[],
) => {
  return vendorUsers.map((user, index) => ({
    userId: user.id,
    farmName: `${user.name} Farm`,
    farmLocation: `Location District ${index + 1}`,
  }));
};
