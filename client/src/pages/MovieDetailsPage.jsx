import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StarRating from '../components/UI/StarRating';
import { Heart, Calendar, Clock, Globe, User, ExternalLink, ArrowLeft } from 'lucide-react';
import movieAPI from '../services/movieAPI';
import userAPI from '../services/userAPI';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 0, reviewText: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            try {
                const response = await movieAPI.getMovieById(id);
                setMovie(response.movie);
                setReviews(response.reviews);

                if (isAuthenticated && user) {
                    try {
                        const watchlistResponse = await userAPI.getUserWatchlist(user.id);
                        const isInList = watchlistResponse.watchlist.some(
                            item => item._id === response.movie._id
                        );
                        setIsInWatchlist(isInList);
                    } catch (error) {
                        console.log('Error checking watchlist:', error);
                    }
                }
            } catch (error) {
                showError('Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id, isAuthenticated, user, showError]);

    const handleWatchlistToggle = async () => {
        if (!isAuthenticated) {
            showError('Please log in to manage your watchlist');
            return;
        }

        try {
            if (isInWatchlist) {
                await userAPI.removeFromWatchlist(user.id, movie._id);
                setIsInWatchlist(false);
                showSuccess('Removed from watchlist');
            } else {
                await userAPI.addToWatchlist(user.id, movie._id);
                setIsInWatchlist(true);
                showSuccess('Added to watchlist');
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to update watchlist');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            showError('Please log in to submit a review');
            return;
        }

        if (reviewData.rating === 0) {
            showError('Please select a rating');
            return;
        }

        if (reviewData.reviewText.trim().length < 10) {
            showError('Review must be at least 10 characters long');
            return;
        }

        setSubmittingReview(true);

        try {
            const response = await movieAPI.submitReview(movie._id, {
                rating: reviewData.rating,
                reviewText: reviewData.reviewText.trim()
            });

            showSuccess('Review submitted successfully!');
            setReviewData({ rating: 0, reviewText: '' });
            setReviews(prev => [response.review, ...prev]);

            // Update movie rating
            const newTotalReviews = movie.totalReviews + 1;
            const newAverageRating =
                ((movie.averageRating * movie.totalReviews) + response.review.rating) / newTotalReviews;

            setMovie(prev => ({
                ...prev,
                averageRating: newAverageRating,
                totalReviews: newTotalReviews
            }));
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie not found</h1>
                    <Link to="/movies" className="btn btn-primary">
                        Browse Movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                ></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        to="/movies"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Movies
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-shrink-0">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-80 h-auto rounded-lg shadow-2xl mx-auto lg:mx-0"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=Movie+Poster';
                                }}
                            />
                        </div>

                        <div className="flex-1 lg:pt-8">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{movie.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-lg">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{movie.releaseYear}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>{movie.duration} min</span>
                                </div>
                                <div className="flex items-center">
                                    <Globe className="w-5 h-5 mr-2" />
                                    <span>{movie.language}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-6">
                                <StarRating
                                    rating={movie.averageRating}
                                    size="large"
                                    showCount={true}
                                    reviewCount={movie.totalReviews}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genre.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={handleWatchlistToggle}
                                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${isInWatchlist
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                </button>

                                {movie.trailerUrl && (
                                    <a
                                        href={movie.trailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        Watch Trailer
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Synopsis */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Synopsis</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{movie.synopsis}</p>
                        </section>

                        {/* Reviews Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                            {/* Review Form */}
                            {isAuthenticated ? (
                                <div className="card p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Rating
                                            </label>
                                            <StarRating
                                                rating={reviewData.rating}
                                                onRatingClick={(rating) => setReviewData(prev => ({ ...prev, rating }))}
                                                size="large"
                                                interactive={true}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Review
                                            </label>
                                            <textarea
                                                value={reviewData.reviewText}
                                                onChange={(e) => setReviewData(prev => ({ ...prev, reviewText: e.target.value }))}
                                                placeholder="Share your thoughts about this movie..."
                                                rows="4"
                                                maxLength="2000"
                                                className="form-input"
                                            />
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reviewData.reviewText.length}/2000 characters
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingReview || reviewData.rating === 0}
                                            className="btn btn-primary disabled:opacity-50"
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="card p-6 mb-8 text-center">
                                    <p className="text-gray-600 mb-4">Please log in to write a review</p>
                                    <Link to="/login" className="btn btn-primary">
                                        Log In
                                    </Link>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map(review => (
                                        <div key={review._id} className="card p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={review.user.profilePicture || `https://ui-avatars.com/api/?name=${review.user.username}&background=random`}
                                                        alt={review.user.username}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{review.user.username}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} size="small" />
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No reviews yet. Be the first to review this movie!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movie Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <span className="block text-sm font-medium text-gray-700">Director</span>
                                    <span className="text-gray-900">{movie.director}</span>
                                </div>

                                {movie.cast && movie.cast.length > 0 && (
                                    <div>
                                        <span className="block text-sm font-medium text-gray-700 mb-2">Cast</span>
                                        <div className="space-y-2">
                                            {movie.cast.slice(0, 5).map((actor, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-medium text-gray-900">{actor.name}</span>
                                                    {actor.character && (
                                                        <span className="text-gray-600"> as {actor.character}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">Release Year</span>
                                    <span className="text-gray-900">{movie.releaseYear}</span>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">Duration</span>
                                    <span className="text-gray-900">{movie.duration} minutes</span>
                                </div>

                                <div>
                                    <span className="block text-sm font-medium text-gray-700">Language</span>
                                    <span className="text-gray-900">{movie.language}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;