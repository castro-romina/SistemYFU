import { Router } from "express";
import { register, login, forgotPassword, resetPassword, completeOnboarding } from "../controllers/auth.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/complete-onboarding", completeOnboarding);


