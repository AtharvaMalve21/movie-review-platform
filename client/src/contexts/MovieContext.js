import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    minRating: '',
    maxRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
    hasNext: false,
    hasPrev: false
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      genre: '',
      year: '',
      minRating: '',
      maxRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const value = {
    movies,
    setMovies,
    featuredMovies,
    setFeaturedMovies,
    trendingMovies,
    setTrendingMovies,
    loading,
    setLoading,
    currentMovie,
    setCurrentMovie,
    filters,
    updateFilters,
    resetFilters,
    pagination,
    setPagination
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
