const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { validateMovie, validateObjectId } = require('../middleware/validation');
const movieController = require('../controllers/movieController');

const router = express.Router();

// GET /api/movies - Retrieve all movies with pagination and filtering
router.get('/', movieController.getAllMovies);

// GET /api/movies/featured/list - Get featured and trending movies
router.get('/featured/list', movieController.getFeaturedMovies);

// GET /api/movies/:id - Retrieve specific movie with reviews
router.get('/:id', validateObjectId, movieController.getMovieById);

// POST /api/movies - Add new movie (admin only)
router.post('/', adminAuth, validateMovie, movieController.addMovie);

module.exports = router;