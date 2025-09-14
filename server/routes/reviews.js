const express = require('express');
const { auth } = require('../middleware/auth');
const { validateReview, validateObjectId } = require('../middleware/validation');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// GET /api/reviews/movie/:id - Get reviews for specific movie
router.get('/movie/:id', validateObjectId, reviewController.getMovieReviews);

// POST /api/reviews/movie/:id - Submit new review for movie
router.post('/movie/:id', auth, validateObjectId, validateReview, reviewController.submitReview);

// PUT /api/reviews/:reviewId - Update a review
router.put('/:reviewId', auth, validateObjectId, validateReview, reviewController.updateReview);

// DELETE /api/reviews/:reviewId - Delete a review
router.delete('/:reviewId', auth, validateObjectId, reviewController.deleteReview);

module.exports = router;