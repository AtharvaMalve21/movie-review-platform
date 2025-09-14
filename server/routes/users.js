const express = require('express');
const { auth } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const userController = require('../controllers/userController');

const router = express.Router();

// GET /api/users/:id - Get user profile and review history
router.get('/:id', validateObjectId, userController.getUserProfile);

// PUT /api/users/:id - Update user profile
router.put('/:id', auth, validateObjectId, userController.updateUserProfile);

// GET /api/users/:id/watchlist - Get user's watchlist
router.get('/:id/watchlist', auth, validateObjectId, userController.getUserWatchlist);

// POST /api/users/:id/watchlist - Add movie to watchlist
router.post('/:id/watchlist', auth, validateObjectId, userController.addToWatchlist);

// DELETE /api/users/:id/watchlist/:movieId - Remove movie from watchlist
router.delete('/:id/watchlist/:movieId', auth, validateObjectId, userController.removeFromWatchlist);

module.exports = router;