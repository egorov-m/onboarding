import { styled } from "styled-components";

export const BoardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
`;

export const SliderWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const SlideContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const SlideImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;
