import styled from "styled-components";

export const StarsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Star = styled.span<{ filled: boolean }>`
  font-size: 1.5rem;
  color: ${({ filled }) => (filled ? '#FFD700' : '#E0E0E0')};
  margin-right: 0.2rem;
`;