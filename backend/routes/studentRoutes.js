import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// @route   GET /api/student/:registerNo
// @desc    Get a single student by register no.
// @access  Public
router.get("/:registerNo", async (req, res) => {
    try {
      const { registerNo } = req.params; 
      const student = await Student.findOne({ registerNo });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// @route   PUT /api/student/:registerNo
// @desc    Update a student
// @access  Public
router.put("/:registerNo", async (req, res) => {
    try {
      const { registerNo } = req.params;
      const updatedStudent = await Student.findOneAndUpdate(
        { registerNo } ,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


// @route   DELETE /api/student/:registerNo
// @desc    Delete a Student
// @access  Public
router.delete("/:registerNo", async (req, res) => {
    try {
      const deletedStudent = await Student.findOneAndDelete(
        { registerNo: req.params.registerNo } ,
        req.body
      );
      
      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Server error" });
    }
  });


export default router;