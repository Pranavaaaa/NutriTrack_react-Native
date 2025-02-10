import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript + Express + ES6!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});