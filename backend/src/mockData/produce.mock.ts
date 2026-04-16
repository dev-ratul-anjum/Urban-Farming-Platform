export const generateMockProduces = (vendorProfileIds: number[]) => {
  const produces = [];
  
  // Create exactly 100 produces randomly distributed among provided vendor profile IDs
  for (let i = 1; i <= 100; i++) {
    const randomVendorId = vendorProfileIds[Math.floor(Math.random() * vendorProfileIds.length)];
    
    produces.push({
      vendorId: randomVendorId,
      name: `Organic Produce ${i}`,
      description: `Delicious generic organic produce number ${i}`,
      price: Number((Math.random() * 50 + 5).toFixed(2)), // Random price between 5 and 55
      category: i % 2 === 0 ? "VEGETABLES" : "FRUITS",
      availableQuantity: Math.floor(Math.random() * 200) + 10, // 10 to 210
      certificationStatus: "PENDING" as any, // Cast to any to avoid exact Prisma Enum import matching issues, matches CertificationStatus
    });
  }

  return produces;
};

export const generateMockCerts = (produceIds: number[]) => {
  return produceIds.map((pid, idx) => ({
    produceId: pid,
    certifyingAgency: `EcoCert Agency ${idx % 5}`,
    certificationDate: new Date(),
    attachments: [`https://example.com/cert_${pid}.pdf`],
  }));
};
