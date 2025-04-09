import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import adminsRoutes from './routes/adminsRoutes.js'
import facultiesRoutes from './routes/facultiesRoutes.js'
import facultyRoutes from "./routes/facultyRoutes.js";
import studentsRoutes from "./routes/studentsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from './routes/adminAuthRoutes.js'

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/admins", adminsRoutes);
app.use("/api/faculties", facultiesRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/authadmin", adminAuthRoutes);

// -------------------- Serve Frontend --------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve index.html for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// --------------------------------------------------------


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
