import express from "express";
import Faculty from "../models/Faculty.js";

const router = express.Router();

// @route   GET /api/faculties
// @desc    Get all faculty members
// @access  Public
router.get("/", async (req, res) => {
    try {
      const faculties = await Faculty.find();
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  
// @route   POST /api/faculties
// @desc    Register a new faculty
// @access  Public
router.post("/", async (req, res) => {
  const { firstName, middleName, lastName, branch, designation, email, password } = req.body;

  if (!firstName || !lastName || !branch || !designation || !email || !password) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    // Check if email already exists
    const existingFaculty = await Faculty.findOne({ email: req.body.email });
    if (existingFaculty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new faculty (password will be hashed by the pre-save middleware)
    const faculty = new Faculty(req.body);
    await faculty.save();

    // Return faculty data without password
    const { password, ...facultyData } = faculty.toObject();
    res.status(201).json(facultyData);
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
