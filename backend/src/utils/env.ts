import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z.string(), // comma separated list
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_NAME: z.string(),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  COOKIE_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables:");

  result.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });

  process.exit(1);
}

export const env = result.data;
