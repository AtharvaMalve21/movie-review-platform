const Movie = require('../models/Movie');
const Review = require('../models/Review');

const movieController = {
  getAllMovies: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        genre,
        year,
        minRating,
        maxRating,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};

      // Search by title or synopsis
      if (search) {
        query.$text = { $search: search };
      }

      // Filter by genre
      if (genre) {
        query.genre = { $in: genre.split(',') };
      }

      // Filter by year
      if (year) {
        query.releaseYear = parseInt(year);
      }

      // Filter by rating range
      if (minRating || maxRating) {
        query.averageRating = {};
        if (minRating) query.averageRating.$gte = parseFloat(minRating);
        if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const skip = (page - 1) * limit;

      const movies = await Movie.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      const total = await Movie.countDocuments(query);

      res.json({
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMovies: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
  },

  // Get movie by ID
  getMovieById: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      const reviews = await Review.find({ movie: req.params.id })
        .populate('user', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({ movie, reviews });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movie details', error: error.message });
    }
  },

  // Add new movie (admin only)
  addMovie: async (req, res) => {
    try {
      const movie = new Movie(req.body);
      await movie.save();
      
      res.status(201).json({
        message: 'Movie added successfully',
        movie
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating movie', error: error.message });
    }
  },

  // Get featured and trending movies
  getFeaturedMovies: async (req, res) => {
    try {
      const featured = await Movie.find({ featured: true }).limit(6);
      const trending = await Movie.find({ trending: true }).limit(6);

      res.json({ featured, trending });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured movies', error: error.message });
    }
  }
};

module.exports = movieController;