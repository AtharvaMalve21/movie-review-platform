const Review = require('../models/Review');
const Movie = require('../models/Movie');

const reviewController = {
  // Get reviews for a specific movie
  getMovieReviews: async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
      const skip = (page - 1) * limit;

      const reviews = await Review.find({ movie: req.params.id })
        .populate('user', 'username profilePicture')
        .sort({ [sortBy]: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Review.countDocuments({ movie: req.params.id });

      res.json({
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  },

  // Submit a new review
  submitReview: async (req, res) => {
    try {
      const { rating, reviewText } = req.body;

      // Check if movie exists
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      // Check if user already reviewed this movie
      const existingReview = await Review.findOne({
        user: req.user._id,
        movie: req.params.id
      });

      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this movie' });
      }

      // Create new review
      const review = new Review({
        user: req.user._id,
        movie: req.params.id,
        rating,
        reviewText
      });

      await review.save();

      // Update movie's average rating and total reviews
      const reviews = await Review.find({ movie: req.params.id });
      const avgRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
      
      await Movie.findByIdAndUpdate(req.params.id, {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      });

      await review.populate('user', 'username profilePicture');

      res.status(201).json({
        message: 'Review submitted successfully',
        review
      });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
  },

  // Update a review
  updateReview: async (req, res) => {
    try {
      const { rating, reviewText } = req.body;

      const review = await Review.findById(req.params.reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user owns this review
      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your own reviews' });
      }

      review.rating = rating || review.rating;
      review.reviewText = reviewText || review.reviewText;
      await review.save();

      // Recalculate movie's average rating
      const reviews = await Review.find({ movie: review.movie });
      const avgRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
      
      await Movie.findByIdAndUpdate(review.movie, {
        averageRating: Math.round(avgRating * 10) / 10
      });

      await review.populate('user', 'username profilePicture');

      res.json({
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.reviewId);
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user owns this review or is admin
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }

      const movieId = review.movie;
      await Review.findByIdAndDelete(req.params.reviewId);

      // Recalculate movie's average rating and total reviews
      const remainingReviews = await Review.find({ movie: movieId });
      const avgRating = remainingReviews.length > 0 
        ? remainingReviews.reduce((sum, rev) => sum + rev.rating, 0) / remainingReviews.length
        : 0;
      
      await Movie.findByIdAndUpdate(movieId, {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: remainingReviews.length
      });

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  }
};

module.exports = reviewController;