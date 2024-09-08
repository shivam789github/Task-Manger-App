const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    // console.log(token)
    
    if (!token) return res.sendStatus(401); // No token, unauthorized
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token invalid or expired
  
      req.user = user; // Attach user to request
      next();
    });
  };

  module.exports=authenticateToken