import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, forgotPassword, resetPassword, completeOnboarding, completeOrgOnboarding } from "../controllers/auth.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP
  message: "Too many registrations. Please try again later.",
});

export const authRouter = Router();

authRouter.post("/register", registerLimiter, register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/complete-onboarding", requireAuth, requireRole("volunteer"), completeOnboarding);
authRouter.post("/complete-org-onboarding", requireAuth, requireRole("organization"), completeOrgOnboarding);

