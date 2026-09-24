import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
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
      if (existingNGO) return res.status(400).json({ message: "Email already registered as organization." });

      const newNGO = await prisma.fundacion.create({
        data: { nombre: name, email, password, descripcion: "" }
      });

      await resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `<h2>Welcome to MatchVol, ${name}!</h2><p>We're excited to have you join our community.</p>`
      });

      return res.status(201).json({ name: newNGO.nombre, email: newNGO.email, role });
    } else {
      const existingVolunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (existingVolunteer) return res.status(400).json({ message: "Email already registered as volunteer." });

      const newVolunteer = await prisma.voluntario.create({
        data: { nombre: name, email, password }
      });

      await resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `<h2>Welcome to MatchVol, ${name}!</h2><p>We're thrilled to have you join us.</p>`
      });

      return res.status(201).json({ name: newVolunteer.nombre, email: newVolunteer.email, role });
    }
  } catch (error) {
    console.error("Error during registration:", error);
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
    console.error("Error during login:", error);
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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordReset.create({
      data: { email, token, expiresAt }
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "MatchVol <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password on MatchVol",
      html: `<h2>Forgot your password?</h2><p>Click the link below to reset your password.</p><a href="${resetLink}">Reset password</a>`
    });

    return res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgot-password:", error);
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
    console.error("Error in reset-password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  const { email, fullName, fechaNacimiento, pais, telefono, ciudad, comoSeEntero, fotoPerfil, acercaDe, carrera, genero, linkedin, habilidades, experiencia, horasPorSemana, disponibilidad } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const updateData: any = {};
    
    if (fullName) updateData.nombre = fullName;
    if (fechaNacimiento) updateData.fechaNacimiento = new Date(fechaNacimiento);
    if (pais) updateData.pais = pais;
    if (telefono) updateData.telefono = telefono;
    if (ciudad) updateData.ciudad = ciudad;
    if (comoSeEntero) updateData.comoSeEntero = comoSeEntero;
    if (fotoPerfil) updateData.fotoPerfil = fotoPerfil;
    if (acercaDe) updateData.acercaDe = acercaDe;
    if (carrera) updateData.carrera = carrera;
    if (genero) updateData.genero = genero;
    if (linkedin) updateData.linkedin = linkedin;
    if (habilidades) updateData.habilidades = JSON.stringify(habilidades);
    if (experiencia) updateData.experiencia = experiencia;
    if (horasPorSemana) updateData.horasPorSemana = horasPorSemana;
    if (disponibilidad) updateData.disponibilidad = JSON.stringify(disponibilidad);

    const volunteer = await prisma.voluntario.update({
      where: { email },
      data: updateData
    });

    return res.status(200).json({ message: "Onboarding completed successfully", volunteer });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};