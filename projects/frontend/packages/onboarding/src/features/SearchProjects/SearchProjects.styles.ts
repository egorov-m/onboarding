import styled from "styled-components";
import { Colors } from "../../../../shared/constants/Colors";

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 300px;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid ${Colors.Orochimaru};
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
`;
