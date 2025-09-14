import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import { useToast } from '../contexts/ToastContext';
import movieAPI from '../services/movieAPI';
import StarRating from '../components/UI/StarRating';
import { Play, ArrowRight } from 'lucide-react';

const HomePage = () => {
    const {
        featuredMovies,
        setFeaturedMovies,
        trendingMovies,
        setTrendingMovies,
        setLoading
    } = useMovies();
    const { showError } = useToast();
    const [heroMovie, setHeroMovie] = useState(null);

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            setLoading(true);
            try {
                const response = await movieAPI.getFeaturedMovies();
                setFeaturedMovies(response.featured);
                setTrendingMovies(response.trending);

                if (response.featured.length > 0) {
                    setHeroMovie(response.featured[0]);
                }
            } catch (error) {
                showError('Failed to fetch featured movies');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedMovies();
    }, [setFeaturedMovies, setTrendingMovies, setLoading, showError]);

    const MovieCard = ({ movie }) => (
        <Link to={`/movies/${movie._id}`} className="group">
            <div className="card hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-w-2 aspect-h-3 overflow-hidden">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450?text=Movie+Poster';
                        }}
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">{movie.releaseYear}</span>
                        <StarRating rating={movie.averageRating} size="small" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
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
        </Link>
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {heroMovie && (
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${heroMovie.posterUrl})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">{heroMovie.title}</h1>
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <span className="text-xl">{heroMovie.releaseYear}</span>
                            <StarRating rating={heroMovie.averageRating} size="large" />
                        </div>
                        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                            {heroMovie.synopsis.length > 200
                                ? `${heroMovie.synopsis.substring(0, 200)}...`
                                : heroMovie.synopsis
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to={`/movies/${heroMovie._id}`}
                                className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                            >
                                <Play className="w-5 h-5" />
                                <span>View Details</span>
                            </Link>
                            <Link
                                to="/movies"
                                className="btn btn-outline text-lg px-8 py-3 flex items-center justify-center space-x-2 text-white border-white hover:bg-white hover:text-gray-900"
                            >
                                <span>Browse Movies</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Featured Movies */}
                {featuredMovies.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Movies</h2>
                            <Link
                                to="/movies"
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredMovies.slice(0, 8).map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Movies */}
                {trendingMovies.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                            <Link
                                to="/movies?sortBy=averageRating"
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {trendingMovies.slice(0, 8).map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Join the Movie Community</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Discover, review, and discuss your favorite movies with fellow film enthusiasts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                            Sign Up Now
                        </Link>
                        <Link to="/movies" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                            Explore Movies
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;


