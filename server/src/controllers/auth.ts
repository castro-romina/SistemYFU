import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { signToken, type AuthRequest } from "../middleware/auth.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// Los hashes de bcrypt empiezan con "$2". Las cuentas viejas (contraseña en texto plano)
// se siguen aceptando una vez y se convierten a hash al iniciar sesión.
const isHashed = (value: string) => value.startsWith("$2");
const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
const passwordMatches = async (plain: string, stored: string) =>
  isHashed(stored) ? bcrypt.compare(plain, stored) : plain === stored;

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
        data: { 
          nombre: name, 
          email, 
          password: await hashPassword(password), 
          descripcion: "",
          areasTrabajo: []
        }
      });

      // Send welcome email (no esperar: si falla, el registro igual se completa)
      resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `<h2>Welcome to MatchVol, ${name}!</h2><p>We're excited to have you join our community.</p>`
      }).catch(err => console.error("Email error:", err));

      return res.status(201).json({
        name: newNGO.nombre,
        email: newNGO.email,
        role: "organization",
        token: signToken({ email: newNGO.email, role: "organization" })
      });
    } else {
      const existingVolunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (existingVolunteer) return res.status(400).json({ message: "Email already registered as volunteer." });

      const newVolunteer = await prisma.voluntario.create({
        data: { nombre: name, email, password: await hashPassword(password) }
      });

      // Send welcome email (no esperar)
      resend.emails.send({
        from: "MatchVol <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to MatchVol!",
        html: `<h2>Welcome to MatchVol, ${name}!</h2><p>We're excited to have you join our community.</p>`
      }).catch(err => console.error("Email error:", err));

      return res.status(201).json({
        name: newVolunteer.nombre,
        email: newVolunteer.email,
        role: "volunteer",
        token: signToken({ email: newVolunteer.email, role: "volunteer" })
      });
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
      if (!ngo || !(await passwordMatches(password, ngo.password))) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      if (!isHashed(ngo.password)) {
        await prisma.fundacion.update({ where: { email }, data: { password: await hashPassword(password) } });
      }
      return res.status(200).json({
        name: ngo.nombre,
        email: ngo.email,
        role: "organization",
        token: signToken({ email: ngo.email, role: "organization" })
      });
    } else {
      const volunteer = await prisma.voluntario.findUnique({ where: { email } });
      if (!volunteer || !(await passwordMatches(password, volunteer.password))) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
      if (!isHashed(volunteer.password)) {
        await prisma.voluntario.update({ where: { email }, data: { password: await hashPassword(password) } });
      }
      return res.status(200).json({
        name: volunteer.nombre,
        email: volunteer.email,
        role: "volunteer",
        token: signToken({ email: volunteer.email, role: "volunteer" })
      });
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
    const hashed = await hashPassword(newPassword);
    const isOrganization = await prisma.fundacion.findUnique({ where: { email } });

    if (isOrganization) {
      await prisma.fundacion.update({
        where: { email },
        data: { password: hashed }
      });
    } else {
      await prisma.voluntario.update({
        where: { email },
        data: { password: hashed }
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
  // El email sale del token, no del cuerpo: nadie puede editar el perfil de otra persona
  const email = (req as AuthRequest).user!.email;

  const { fullName, fechaNacimiento, pais, telefono, ciudad, comoSeEntero, fotoPerfil, acercaDe, carrera, genero, linkedin, habilidades, experiencia, horasPorSemana, disponibilidad } = req.body;

  try {
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
    if (habilidades) updateData.habilidades = Array.isArray(habilidades) ? JSON.stringify(habilidades) : habilidades;
    if (experiencia) updateData.experiencia = experiencia;
    if (horasPorSemana) updateData.horasPorSemana = horasPorSemana;
    if (disponibilidad) updateData.disponibilidad = Array.isArray(disponibilidad) ? JSON.stringify(disponibilidad) : disponibilidad;

    const updated = await prisma.voluntario.update({
      where: { email },
      data: updateData
    });

    const { password, ...volunteer } = updated;
    return res.status(200).json({ message: "Onboarding completed successfully", volunteer });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const completeOrgOnboarding = async (req: Request, res: Response) => {
  // El email sale del token, no del cuerpo
  const email = (req as AuthRequest).user!.email;

  const {
    nombre, tipo, pais, ciudad, telefono, logo,
    descripcion, mision, areasTrabajo, sitioWeb, linkedin, instagram, cuit,
  } = req.body;

  try {
    const required = { nombre, tipo, pais, ciudad, telefono, descripcion, sitioWeb, linkedin, cuit };
    const missing = Object.entries(required)
      .filter(([, value]) => typeof value !== "string" || !value.trim())
      .map(([key]) => key);
    if (!Array.isArray(areasTrabajo) || areasTrabajo.length === 0) missing.push("areasTrabajo");

    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const existing = await prisma.fundacion.findUnique({ where: { email } });
    if (!existing) {
      return res.status(404).json({ message: "Organization not found." });
    }

    const updated = await prisma.fundacion.update({
      where: { email },
      data: {
        nombre: nombre.trim(),
        tipo,
        pais,
        ciudad,
        telefono,
        logo: logo || null,
        descripcion: descripcion.trim(),
        mision: mision?.trim() || null,
        areasTrabajo: areasTrabajo.map(String),
        sitioWeb: sitioWeb.trim(),
        linkedin: linkedin.trim(),
        instagram: instagram?.trim() || null,
        cuit: cuit.trim(),
      },
    });

    // No devolvemos la contraseña
    const { password, ...organization } = updated;
    return res.status(200).json({ message: "Organization onboarding completed successfully", organization });
  } catch (error) {
    console.error("Error completing organization onboarding:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};