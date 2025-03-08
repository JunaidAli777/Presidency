import express from "express";
import Student from "../models/Student.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Admin/Faculty only)
router.get("/", authMiddleware, async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// @route   POST /api/students
// @desc    Register a new student
// @access  Private (Admin/Faculty only)
router.post("/", authMiddleware, async (req, res) => {
    const { firstName, 
            middleName, 
            lastName, 
            branch, 
            year, 
            registerNo, 
            mathematics, 
            physics, 
            chemistry, 
            cmoputerScience, 
            technicalEnglish, 
            engineeringGraphics 
        } = req.body;
  
    if (!firstName || !lastName || !branch || !year || !registerNo) {
      return res.status(400).json({ message: "firstName, lastName, branch, year, registerNo cannot be empty" });
    }
  
    try {
      // Check if the student already exists
      const existingStudent = await Student.findOne({ registerNo });
      if (existingStudent) {
        return res.status(400).json({ message: "Register number is already registered." });
      }
  
      // Save new student
      const student = new Student({ firstName, 
                                    middleName, 
                                    lastName, 
                                    branch, 
                                    year, 
                                    registerNo, 
                                    mathematics, 
                                    physics, 
                                    chemistry, 
                                    cmoputerScience, 
                                    technicalEnglish, 
                                    engineeringGraphics
                                });
      await student.save();
      res.status(201).json({ message: "Student registered successfully", student });
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  export default router;