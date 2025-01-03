import React from "react";
import * as styles from './StarRating.styles';

interface StarRatingProps {
  rating: number; 
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;

  return (
    <styles.StarsContainer>
      {[...Array(totalStars)].map((_, index) => (
        <styles.Star key={index} filled={index < rating}>&#9733;</styles.Star>
      ))}
    </styles.StarsContainer>
  );
};