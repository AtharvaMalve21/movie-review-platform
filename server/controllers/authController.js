const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

const authController = {
  // Register user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error during login', error: error.message });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      res.json({
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          profilePicture: req.user.profilePicture,
          role: req.user.role,
          joinDate: req.user.joinDate
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error fetching user data', error: error.message });
    }
  }
};

module.exports = authController;

