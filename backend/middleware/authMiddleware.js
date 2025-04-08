import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has admin information
    if (decoded.admin) {
      req.admin = decoded.admin;
      req.userRole = 'admin';
    } 
    // Check if token has faculty information
    else if (decoded.faculty) {
      req.faculty = decoded.faculty;
      req.userRole = 'faculty';
    } 
    // Neither admin nor faculty
    else {
      return res.status(403).json({ message: 'Access denied: invalid user role' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware for routes that only admins can access
export const adminOnlyMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admin privileges required' });
  }
  next();
};

// Middleware for routes that both admins and faculty can access
export const adminOrFacultyMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'faculty') {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

export { authMiddleware as default };