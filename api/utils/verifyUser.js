import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // We check the cookies for the access_token we created during login
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If token is tampered with or expired
    if (err) return next(errorHandler(403, 'Forbidden'));

    // If everything is fine, we save the user info to the request 
    // so the controller knows WHO is making the update
    req.user = user;
    next();
  });
};