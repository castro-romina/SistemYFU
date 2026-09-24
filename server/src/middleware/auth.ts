import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AccountRole = "volunteer" | "organization";

export interface AuthPayload {
  email: string;
  role: AccountRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Se lee al momento de usarlo, para no depender del orden en que se carga el .env
const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
};

export const signToken = (payload: AuthPayload): string =>
  jwt.sign(payload, getSecret(), { expiresIn: "7d" });

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.user = jwt.verify(header.slice(7), getSecret()) as unknown as AuthPayload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
};

export const requireRole = (role: AccountRole) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: "You don't have permission to do this." });
  }
  return next();
};