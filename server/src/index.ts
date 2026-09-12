import "dotenv/config"; 
import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(cors({
  origin: ["https://sistem-yfu-xkb4.vercel.app", "http://localhost:3000"],
  credentials: true
}));
