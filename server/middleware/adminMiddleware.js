const jwt = require('jsonwebtoken');

const adminProtect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hardcoded check: Admin token has role 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an admin.' });
    }
    
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid.' });
  }
};

module.exports = { adminProtect };
