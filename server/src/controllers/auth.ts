import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === "organization") {
      const existingNGO = await prisma.fundacion.findUnique({ where: { email } });
      if (existingNGO) return res.status(400).json({ message: "Email already registered as NGO." });

      const newNGO = await prisma.fundacion.create({
        data: { nombre: name, email, password, descripcion: "" }
      });
      return res.status(201).json({ name: newNGO.nombre, email: newNGO.email, role });
    } else {
      const existingVolunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (existingVolunteer) return res.status(400).json({ message: "Email already registered as Volunteer." });

      const newVolunteer = await prisma.voluntario.create({
        data: { nombre: name, email, password, disponibilidad: "" }
      });
      return res.status(201).json({ name: newVolunteer.nombre, email: newVolunteer.email, role });
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Internal server database error." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required." });
    }

    if (role === "organization") {
      const ngo = await prisma.fundacion.findUnique({ where: { email } });
      if (!ngo || ngo.password !== password) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      return res.status(200).json({ name: ngo.nombre, email: ngo.email, role });
    } else {
      const volunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (!volunteer || volunteer.password !== password) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      return res.status(200).json({ name: volunteer.nombre, email: volunteer.email, role });
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Internal server database error." });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await prisma.fundacion.findUnique({ where: { email } })
      || await prisma.voluntario.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.passwordReset.create({
      data: { email, token, expiresAt }
    });

    // ⚡ INICIALIZACIÓN SEGURA ACÁ ADENTRO:
    // Al crearse adentro de la función, garantizamos que el .env ya fue leído por Node
    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "MatchVol <onboarding@resend.dev>", // Mantenemos el sandbox de pruebas obligatorias
      to: email,
      subject: "Restablecer tu contraseña en MatchVol",
      html: `
        <h2>¿Olvidaste tu contraseña?</h2>
        <p>Haz clic en el enlace de abajo para restablecer tu contraseña. El enlace expira en 15 minutos.</p>
        <a href="${resetLink}" style="background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Restablecer contraseña</a>
        <p>Si no solicitaste esto, ignora este email.</p>
      `
    });

    return res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    const reset = await prisma.passwordReset.findUnique({ where: { token } });

    if (!reset || reset.usado || reset.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const email = reset.email;
    const isOrganization = await prisma.fundacion.findUnique({ where: { email } });

    if (isOrganization) {
      await prisma.fundacion.update({
        where: { email },
        data: { password: newPassword }
      });
    } else {
      await prisma.voluntario.update({
        where: { email },
        data: { password: newPassword }
      });
    }

    await prisma.passwordReset.update({
      where: { token },
      data: { usado: true }
    });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
