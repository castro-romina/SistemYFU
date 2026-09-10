import { Request, Response } from "express";
import { prisma } from "../config/prisma";

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
