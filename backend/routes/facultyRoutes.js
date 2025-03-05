import express from "express";
import Faculty from "../models/Faculty.js";

const router = express.Router();

// @route   GET /api/faculty/:id
// @desc    Get a single faculty member by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/faculty/:id
// @desc    Update a faculty member
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    
    res.status(200).json(updatedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete a faculty member
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(
      req.params.id,
      req.body
    );
    
    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    
    res.status(200).json(deletedFaculty);
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;