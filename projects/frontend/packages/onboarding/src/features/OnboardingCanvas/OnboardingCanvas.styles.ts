import styled from "styled-components";

interface CanvasContainerProps {
  height: number;
}

export const CanvasContainer = styled.div<CanvasContainerProps>`
  height: ${(props) => props.height}px;
  background-color: ${({ theme }) => theme.bodyBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  position: relative;
`;

export const Stage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;

  button {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #007bff;
    color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
`;
