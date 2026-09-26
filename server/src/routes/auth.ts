import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  register, login, forgotPassword, resetPassword, completeOnboarding,
  completeOrgOnboarding, getMe, changePassword, changeEmail,
  updateNotifications, deleteAccount,
} from "../controllers/auth.js";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 3 : 100,
  message: "Too many registrations. Please try again later.",
});

export const authRouter = Router();

authRouter.get("/me", requireAuth, getMe);

authRouter.post("/register", registerLimiter, register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/complete-onboarding", requireAuth, requireRole("volunteer"), completeOnboarding);
authRouter.post("/complete-org-onboarding", requireAuth, requireRole("organization"), completeOrgOnboarding);

authRouter.get("/me", requireAuth, getMe);
authRouter.post("/change-password", requireAuth, changePassword);
authRouter.post("/change-email", requireAuth, changeEmail);
authRouter.post("/notifications", requireAuth, updateNotifications);
authRouter.delete("/account", requireAuth, deleteAccount);

