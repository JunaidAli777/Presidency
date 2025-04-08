import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
