import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarRating } from "../StarRating/StarRating";

import * as styles from "./Board.styles";

interface Step {
  title: string;
  description: string;
  image: string;
}

interface BoardProps {
  steps: Step[];
}

export const Board: React.FC<BoardProps> = ({ steps }) => {
  const handleRate = (value: number) => {
    alert(`Спасибо за ваш рейтинг: ${value}`);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <styles.BoardContainer>
      <styles.SliderWrapper>
        <Slider {...settings}>
          {steps.map((step, index) => (
            <styles.SlideContent key={index}>
              <styles.SlideImage src={step.image} alt={step.title} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </styles.SlideContent>
          ))}
          <styles.SlideContent>
            <StarRating maxStars={5} onRate={handleRate} />
          </styles.SlideContent>
        </Slider>
      </styles.SliderWrapper>
    </styles.BoardContainer>
  );
};
