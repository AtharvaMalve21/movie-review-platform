import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
    rating,
    onRatingClick,
    size = 'medium',
    interactive = false,
    showCount = false,
    reviewCount = 0
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6'
    };

    const handleStarClick = (starValue) => {
        if (interactive && onRatingClick) {
            onRatingClick(starValue);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            stars.push(
                <Star
                    key={i}
                    className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                    onClick={() => handleStarClick(i)}
                />
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">
                {renderStars()}
            </div>
            {showCount && reviewCount > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};

export default StarRating;