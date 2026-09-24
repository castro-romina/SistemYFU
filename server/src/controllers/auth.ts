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

      // Send welcome email
      await resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `
          <h2>Welcome to MatchVol, ${name}!</h2>
          <p>We're excited to have you join our community. Your account has been successfully created.</p>
          <p>As an organization, you can now:</p>
          <ul>
            <li>Create volunteer opportunities</li>
            <li>Connect with passionate volunteers</li>
            <li>Make a real impact in your community</li>
          </ul>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Start exploring MatchVol</a></p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy volunteering!<br>The MatchVol Team</p>
        `
      });

      return res.status(201).json({ name: newNGO.nombre, email: newNGO.email, role });
    } else {
      const existingVolunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (existingVolunteer) return res.status(400).json({ message: "Email already registered as volunteer." });

      const newVolunteer = await prisma.voluntario.create({
        data: { nombre: name, email, password, disponibilidad: "" }
      });

      // Send welcome email
      await resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `
          <h2>Welcome to MatchVol, ${name}!</h2>
          <p>We're thrilled to have you join our community of passionate volunteers. Your account has been successfully created.</p>
          <p>Now you can:</p>
          <ul>
            <li>Discover meaningful volunteer opportunities</li>
            <li>Connect with organizations that need your skills</li>
            <li>Make a positive impact in your community</li>
          </ul>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Start exploring opportunities</a></p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy volunteering!<br>The MatchVol Team</p>
        `
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
  const { email, role } = req.body;

  try {
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required." });
    }

    const user = role === "organization"
      ? await prisma.fundacion.findUnique({ where: { email } })
      : await prisma.voluntario.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordReset.create({
      data: { email, role, token, expiresAt }
    });

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "MatchVol <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password on MatchVol",
      html: `
        <h2>Forgot your password?</h2>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetLink}" style="background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
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

    if (reset.role === "organization") {
      await prisma.fundacion.update({
        where: { email: reset.email },
        data: { password: newPassword }
      });
    } else {
      await prisma.voluntario.update({
        where: { email: reset.email },
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

    const volunteer = await prisma.voluntario.update({
      where: { email },
      data: {
        nombre: fullName || undefined,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        pais,
        telefono,
        ciudad,
        comoSeEntero,
        fotoPerfil,
        acercaDe,
        carrera,
        genero,
        linkedin,
        habilidades: habilidades || [],
        experiencia,
        horasPorSemana,
        disponibilidad: disponibilidad || []
      }
    });

    return res.status(200).json({ message: "Onboarding completed successfully", volunteer });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};