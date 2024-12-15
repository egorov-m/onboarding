import React, { useState } from "react";

import * as styles from "./StarRating.styles";

interface StarRatingProps {
  maxStars: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ maxStars }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleMouseEnter = (index: number) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);
  };

  return (
    <styles.CenteredContainer>
      <styles.Header>Оцени туториал</styles.Header>
      <styles.RatingContainer>
        {Array.from({ length: maxStars }, (_, index) => {
          const starIndex = index + 1;
          const isFilled =
            hoveredStar !== null
              ? starIndex <= hoveredStar
              : starIndex <= selectedRating;

          return (
            <styles.Star
              key={index}
              isFilled={isFilled}
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
            >
              <path d='M12 .587l3.668 7.429 8.2 1.192-5.934 5.794 1.4 8.167L12 18.897l-7.334 3.872 1.4-8.167-5.934-5.794 8.2-1.192z' />
            </styles.Star>
          );
        })}
      </styles.RatingContainer>
    </styles.CenteredContainer>
  );
};
