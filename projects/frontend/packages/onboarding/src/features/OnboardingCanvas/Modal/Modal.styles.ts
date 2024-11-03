import styled from "styled-components";

export const modalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Убедитесь, что модалка поверх остальных элементов */
`;

export const modalContentStyle = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px; /* Ширина модалки */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const closeButtonStyle = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  color: #888; /* Цвет кнопки закрытия */
`;
