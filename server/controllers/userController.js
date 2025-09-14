const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

const userController = {
  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password -email')
        .populate('watchlist', 'title posterUrl averageRating releaseYear');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const reviews = await Review.find({ user: req.params.id })
        .populate('movie', 'title posterUrl averageRating')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({
        user: {
          id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
          joinDate: user.joinDate,
          watchlist: user.watchlist
        },
        reviews
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      // Check if user is updating their own profile
      if (req.params.id !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your own profile' });
      }

      const { username, profilePicture } = req.body;
      const updateData = {};

      if (username) {
        // Check if username is already taken
        const existingUser = await User.findOne({ 
          username, 
          _id: { $ne: req.params.id } 
        });
        
        if (existingUser) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        updateData.username = username;
      }

      if (profilePicture !== undefined) {
        updateData.profilePicture = profilePicture;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  },

  // Get user's watchlist
  getUserWatchlist: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: 'watchlist',
          select: 'title posterUrl averageRating releaseYear genre director'
        });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ watchlist: user.watchlist });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
  },

  // Add movie to watchlist
  addToWatchlist: async (req, res) => {
    try {
      if (req.params.id !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only modify your own watchlist' });
      }

      const { movieId } = req.body;

      if (!movieId) {
        return res.status(400).json({ message: 'Movie ID is required' });
      }

      // Check if movie exists
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      const user = await User.findById(req.params.id);
      
      if (user.watchlist.includes(movieId)) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
      }

      user.watchlist.push(movieId);
      await user.save();

      res.json({ message: 'Movie added to watchlist successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding movie to watchlist', error: error.message });
    }
  },

  // Remove movie from watchlist
  removeFromWatchlist: async (req, res) => {
    try {
      if (req.params.id !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only modify your own watchlist' });
      }

      const user = await User.findById(req.params.id);
      user.watchlist = user.watchlist.filter(
        movieId => movieId.toString() !== req.params.movieId
      );
      
      await user.save();

      res.json({ message: 'Movie removed from watchlist successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing movie from watchlist', error: error.message });
    }
  }
};

module.exports = userController;