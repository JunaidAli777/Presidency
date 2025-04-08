import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

// @route   GET /api/admins
// @desc    Get all admins
// @access  Public
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admins
// @desc    Register a new admin
// @access  Public
router.post("/", async (req, res) => {
  const { firstName, middleName, lastName, email, password, inviteCode } = req.body;

  if (!firstName || !lastName || !email || !password || !inviteCode) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {

    // Verify invite code
    if (inviteCode.trim() !== process.env.ADMIN_INVITE_CODE.trim()) {
        return res.status(403).json({ message: "Invalid invite code." });
      }
      
    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new admin (password will be hashed by the pre-save middleware)
    const admin = new Admin(req.body);
    await admin.save();

    // Return admin data without password
    const { password, ...adminData } = admin.toObject();
    res.status(201).json(adminData);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
