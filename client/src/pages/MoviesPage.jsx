import React, { useEffect, useCallback, useState } from 'react';
import { useMovies } from '../contexts/MovieContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import movieAPI from '../services/movieAPI';
import userAPI from '../services/userAPI';
import StarRating from '../components/UI/StarRating';
import Pagination from '../components/UI/Pagination';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, X } from 'lucide-react';

const MoviesPage = () => {
    const {
        movies,
        setMovies,
        filters,
        updateFilters,
        resetFilters,
        pagination,
        setPagination,
        setLoading
    } = useMovies();
    const { user, isAuthenticated } = useAuth();
    const { showError, showSuccess } = useToast();
    const [showFilters, setShowFilters] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    const genres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
        'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
        'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
    ];

    // Fetch user's watchlist
    useEffect(() => {
        if (isAuthenticated && user) {
            const fetchWatchlist = async () => {
                try {
                    const response = await userAPI.getUserWatchlist(user.id);
                    setWatchlist(response.watchlist.map(movie => movie._id));
                } catch (error) {
                    console.log('Error fetching watchlist:', error);
                }
            };
            fetchWatchlist();
        }
    }, [isAuthenticated, user]);

    const fetchMovies = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                ...filters
            };

            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null || params[key] === undefined) {
                    delete params[key];
                }
            });

            const response = await movieAPI.getAllMovies(params);
            setMovies(response.movies);
            setPagination(response.pagination);
        } catch (error) {
            showError('Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    }, [filters, setMovies, setPagination, setLoading, showError]);

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchMovies(1), 500);
        return () => clearTimeout(timeoutId);
    }, [filters, fetchMovies]);

    const handleFilterChange = (key, value) => {
        updateFilters({ [key]: value });
    };

    const handlePageChange = (page) => {
        fetchMovies(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWatchlistToggle = async (movieId) => {
        if (!isAuthenticated) {
            showError('Please log in to manage your watchlist');
            return;
        }

        try {
            const isInWatchlist = watchlist.includes(movieId);

            if (isInWatchlist) {
                await userAPI.removeFromWatchlist(user.id, movieId);
                setWatchlist(prev => prev.filter(id => id !== movieId));
                showSuccess('Removed from watchlist');
            } else {
                await userAPI.addToWatchlist(user.id, movieId);
                setWatchlist(prev => [...prev, movieId]);
                showSuccess('Added to watchlist');
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to update watchlist');
        }
    };

    const MovieCard = ({ movie }) => {
        const isInWatchlist = watchlist.includes(movie._id);

        return (
            <div className="card group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                    <Link to={`/movies/${movie._id}`}>
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x450?text=Movie+Poster';
                            }}
                        />
                    </Link>
                    {isAuthenticated && (
                        <button
                            onClick={() => handleWatchlistToggle(movie._id)}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isInWatchlist
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                        </button>
                    )}
                </div>

                <div className="p-4">
                    <Link to={`/movies/${movie._id}`}>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {movie.title}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-sm">{movie.releaseYear}</span>
                        <StarRating rating={movie.averageRating} size="small" />
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.slice(0, 2).map((genre, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3">
                        {movie.synopsis}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
                        {pagination.totalMovies > 0 && (
                            <p className="text-gray-600 mt-2">
                                Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalMovies)}
                                of {pagination.totalMovies} movies
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden btn btn-outline flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`md:w-80 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Reset All
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Movies
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search by title..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            className="form-input pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Genre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Genre
                                    </label>
                                    <select
                                        value={filters.genre}
                                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">All Genres</option>
                                        {genres.map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Release Year
                                    </label>
                                    <select
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">All Years</option>
                                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={filters.minRating}
                                        onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">Any Rating</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="2">2+ Stars</option>
                                        <option value="1">1+ Stars</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="createdAt">Date Added</option>
                                        <option value="title">Title</option>
                                        <option value="releaseYear">Release Year</option>
                                        <option value="averageRating">Rating</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order
                                    </label>
                                    <select
                                        value={filters.sortOrder}
                                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Movies Grid */}
                    <main className="flex-1">
                        {movies.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {movies.map(movie => (
                                        <MovieCard key={movie._id} movie={movie} />
                                    ))}
                                </div>
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                                    <p className="text-gray-500 mb-4">
                                        Try adjusting your search criteria or browse our full collection.
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="btn btn-primary"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MoviesPage;