import { styled } from "styled-components";

export const BoardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const SliderWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
`;

export const SliderControls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 20px;
  transform: translateY(-50%);
`;

export const SliderButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-radius: 5px;
  width: 60px;
  height: 40px;

  &:hover {
    background-color: #45a049;
    transform: scale(1.1);
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

export const PrevButton = styled(SliderButton)`
  left: 3% !important;
  z-index: 1;
  margin-right: auto;
`;

export const NextButton = styled(SliderButton)`
  margin-left: auto;
  right: 3% !important;
  z-index: 1;
`;
