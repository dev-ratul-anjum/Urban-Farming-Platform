import rateLimit, {
  ipKeyGenerator,
  RateLimitRequestHandler,
} from "express-rate-limit";
import { Request } from "express";

// Login Limiter (Email Based)
export const loginLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: Request): string => {
    const email = req.body?.email;

    if (email && typeof email === "string") {
      return email.toLowerCase().trim();
    }

    return ipKeyGenerator(req.ip ?? "0.0.0.0");
  },
});

// Signup Limiter (IP Based)
export const signupLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,

  message: {
    success: false,
    message: "Too many accounts created. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
