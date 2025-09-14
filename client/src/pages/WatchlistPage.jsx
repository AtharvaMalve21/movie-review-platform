import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StarRating from '../components/UI/StarRating';
import { Heart, Calendar, User as UserIcon, Trash2 } from 'lucide-react';
import userAPI from '../services/userAPI';
import { Link } from 'react-router-dom';

const WatchlistPage = () => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            try {
                const response = await userAPI.getUserWatchlist(user.id);
                setWatchlist(response.watchlist);
            } catch (error) {
                showError('Failed to fetch watchlist');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWatchlist();
        }
    }, [user, showError]);

    const handleRemoveFromWatchlist = async (movieId) => {
        try {
            await userAPI.removeFromWatchlist(user.id, movieId);
            setWatchlist(prev => prev.filter(movie => movie._id !== movieId));
            showSuccess('Removed from watchlist');
        } catch (error) {
            showError('Failed to remove from watchlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
                        <p className="text-gray-600 mt-2">
                            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved to watch later
                        </p>
                    </div>
                    <Link to="/movies" className="btn btn-primary">
                        Browse Movies
                    </Link>
                </div>

                {watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {watchlist.map(movie => (
                            <div key={movie._id} className="card group hover:shadow-xl transition-all duration-300">
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

                                    <button
                                        onClick={() => handleRemoveFromWatchlist(movie._id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove from watchlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <Link to={`/movies/${movie._id}`}>
                                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {movie.title}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>{movie.releaseYear}</span>
                                        </div>
                                        <StarRating rating={movie.averageRating} size="small" />
                                    </div>

                                    <div className="flex items-center text-gray-600 text-sm mb-3">
                                        <UserIcon className="w-4 h-4 mr-1" />
                                        <span>{movie.director}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {movie.genre.slice(0, 2).map((genre, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your watchlist is empty</h2>
                            <p className="text-gray-600 mb-8">
                                Start adding movies to your watchlist to keep track of what you want to watch.
                            </p>
                            <Link to="/movies" className="btn btn-primary">
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchlistPage;