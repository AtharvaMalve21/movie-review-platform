
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StarRating from '../components/UI/StarRating';
import { User, Edit2, Save, X, Calendar, MessageSquare } from 'lucide-react';
import userAPI from '../services/userAPI';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', profilePicture: '' });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getUserProfile(id);
        setProfile(response.user);
        setReviews(response.reviews);
        setEditData({
          username: response.user.username,
          profilePicture: response.user.profilePicture
        });
      } catch (error) {
        showError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, showError]);

  const handleEditToggle = () => {
    setEditing(!editing);
    if (editing) {
      setEditData({
        username: profile.username,
        profilePicture: profile.profilePicture
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await userAPI.updateUserProfile(id, editData);
      setProfile(prev => ({ ...prev, ...response.user }));
      setEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <img
                src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=128`}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover"
              />
              {isOwnProfile && (
                <button
                  onClick={handleEditToggle}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="form-input"
                      maxLength="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={editData.profilePicture}
                      onChange={(e) => setEditData(prev => ({ ...prev, profilePicture: e.target.value }))}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSave} className="btn btn-primary flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button onClick={handleEditToggle} className="btn btn-outline">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Watchlist Preview */}
        {profile.watchlist && profile.watchlist.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Watchlist</h2>
              {isOwnProfile && (
                <Link to="/watchlist" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All ({profile.watchlist.length})
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {profile.watchlist.slice(0, 5).map(movie => (
                <Link key={movie._id} to={`/movies/${movie._id}`} className="group">
                  <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x300?text=Movie';
                      }}
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-500">{movie.releaseYear}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Reviews' : `${profile.username}'s Reviews`}
          </h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="card p-6">
                  <div className="flex items-start space-x-4">
                    <Link to={`/movies/${review.movie._id}`}>
                      <img
                        src={review.movie.posterUrl}
                        alt={review.movie.title}
                        className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x96?text=Movie';
                        }}
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link 
                          to={`/movies/${review.movie._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {review.movie.title}
                        </Link>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={review.rating} size="small" />
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">
                {isOwnProfile 
                  ? "Start watching movies and sharing your thoughts!" 
                  : `${profile.username} hasn't written any reviews yet.`
                }
              </p>
              {isOwnProfile && (
                <Link to="/movies" className="btn btn-primary mt-4">
                  Browse Movies
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



