import styled from "styled-components";

export const StyledLabel = styled.text<{ theme: { text: string } }>`
  x: ${(props) => props.x ?? 0};
  y: ${(props) => props.y ?? 0};
  dy: 20;
  text-anchor: middle;
  fill: ${({ theme }) => theme.textColor};
  font-size: 14px;
`;
