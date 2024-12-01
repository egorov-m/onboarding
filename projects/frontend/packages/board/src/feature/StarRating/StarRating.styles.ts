import styled from "styled-components";

export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

export const Header = styled.h2`
  font-size: 24px;
  color: ${({ theme }) => theme.textColor || "black"};
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

export const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

export const Star = styled.svg<{ isFilled: boolean }>`
  width: 24px;
  height: 24px;
  fill: ${({ isFilled }) => (isFilled ? "gold" : "gray")};
  transition: fill 0.2s;
`;
