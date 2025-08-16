// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const sameSite = process.env.COOKIE_SAMESITE || 'strict';
  const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  res.cookie('jwt', token, {
    httpOnly: true,
    secure,
    sameSite,
    domain,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
