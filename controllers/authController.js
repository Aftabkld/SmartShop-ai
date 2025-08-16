// controllers/authController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });

  generateToken(res, user._id);

  res.status(201).json({ message: 'User registered', user });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ message: 'Logged in', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.json({ message: 'Logged out' });
};

// Get Profile
export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset/${token}`;
  const message = `<p>Reset your password by clicking <a href="${resetURL}">here</a></p>`;

  await sendEmail(user.email, 'Password Reset', message);
  res.json({ message: 'Reset link sent' });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: 'Password updated' });
};
