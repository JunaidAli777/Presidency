import express from 'express';
import Faculty from '../models/Faculty.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// POST /api/auth/login - Faculty login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the faculty by email
    const faculty = await Faculty.findOne({ email });
    
    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, faculty.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create a faculty object without the password
    const { password: _, ...facultyData } = faculty.toObject();
    
    // Return faculty data
    res.status(200).json({
      success: true,
      data: facultyData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;