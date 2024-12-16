import { styled } from "styled-components";

export const SlideImage = styled.img`
  max-width: 90%;
  max-height: 70vh;
  object-fit: contain;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const SlideContent = styled.div`
  text-align: center;
  margin-top: 5%;
`;

export const SlideTitle = styled.h3`
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
  text-transform: uppercase;
  font-weight: bold;
`;

export const SlideDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 80%;
`;
