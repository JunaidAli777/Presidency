import express from 'express';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/authadmin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { admin: { id: admin._id, email: admin.email } }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    // Create an admin object without the password
    const { password: _, ...adminData } = admin.toObject();
    
    // Return admin data
    res.status(200).json({
      success: true,
      token,
      data: adminData
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
