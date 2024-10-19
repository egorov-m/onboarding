import styled from 'styled-components';
import { Colors } from '../../../../shared/constants/Colors';

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SearchInput = styled.input`
  font-family: 'Montserrat', sans-serif;
  padding: 0.5rem 1rem;
  border: 1px solid ${Colors.Orochimaru};
  border-radius: 4px;
  font-size: 1rem;
  width: 300px;
`;

export const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${Colors.Orochimaru};
  color: ${Colors.White};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${Colors.Black};
  }
`;