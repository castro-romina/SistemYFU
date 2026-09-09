import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";

export const authRouter = Router();
type AccountRole = "volunteer" | "organization";

function isAccountRole(value: unknown): value is AccountRole {
  return value === "volunteer" || value === "organization";
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function publicUser(user: { id: string; nombre: string; email: string }, role: AccountRole) {
  return { id: user.id, name: user.nombre, email: user.email, role };
}

authRouter.post("/register", async (req, res) => {
  const { name, email: rawEmail, password, role } = req.body ?? {};
  const email = normalizeEmail(rawEmail);
  const displayName = typeof name === "string" ? name.trim() : "";

  if (!displayName || !email || !isAccountRole(role)) return res.status(400).json({ message: "Completa todos los campos requeridos." });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Ingresa un correo electronico valido." });
  if (typeof password !== "string" || password.length < 8) return res.status(400).json({ message: "La contrasena debe tener al menos 8 caracteres." });

  try {
    const [volunteer, organization] = await Promise.all([
      prisma.voluntario.findUnique({ where: { email }, select: { id: true } }),
      prisma.fundacion.findUnique({ where: { email }, select: { id: true } }),
    ]);
    if (volunteer || organization) return res.status(409).json({ message: "Ya existe una cuenta con este correo." });

    const passwordHash = await hashPassword(password);
    const user = role === "volunteer"
      ? await prisma.voluntario.create({ data: { nombre: displayName, email, password: passwordHash, intereses: [] }, select: { id: true, nombre: true, email: true } })
      : await prisma.fundacion.create({ data: { nombre: displayName, email, password: passwordHash }, select: { id: true, nombre: true, email: true } });

    return res.status(201).json({ user: publicUser(user, role) });
  } catch (error) {
    console.error("Error al registrar usuario", error);
    return res.status(500).json({ message: "No pudimos crear la cuenta. Intenta nuevamente." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email: rawEmail, password, role } = req.body ?? {};
  const email = normalizeEmail(rawEmail);
  if (!email || typeof password !== "string" || !isAccountRole(role)) return res.status(400).json({ message: "Completa correo, contrasena y tipo de cuenta." });

  try {
    const user = role === "volunteer"
      ? await prisma.voluntario.findUnique({ where: { email }, select: { id: true, nombre: true, email: true, password: true } })
      : await prisma.fundacion.findUnique({ where: { email }, select: { id: true, nombre: true, email: true, password: true } });

    if (!user || !(await verifyPassword(password, user.password))) return res.status(401).json({ message: "El correo o la contrasena no son correctos." });
    return res.json({ user: publicUser(user, role) });
  } catch (error) {
    console.error("Error al iniciar sesion", error);
    return res.status(500).json({ message: "No pudimos iniciar sesion. Intenta nuevamente." });
  }
});
