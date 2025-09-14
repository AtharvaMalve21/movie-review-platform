import api from './api';

const movieAPI = {
  getAllMovies: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getFeaturedMovies: async () => {
    const response = await api.get('/movies/featured/list');
    return response.data;
  },

  submitReview: async (movieId, reviewData) => {
    const response = await api.post(`/reviews/movie/${movieId}`, reviewData);
    return response.data;
  },

  getMovieReviews: async (movieId, params = {}) => {
    const response = await api.get(`/reviews/movie/${movieId}`, { params });
    return response.data;
  }
};

export default movieAPI;