import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  width: 100%;
  background-color: #333;
`;

export const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  color: white;
`;

export const NavItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;


export const StyledLink = styled(RouterLink)`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;

  &:hover {
    color: #ff6347;
  }

  &.active {
    font-weight: bold;
    border-bottom: 2px solid white;
  }
`;

export const LogoutLink = styled.div`
  margin-left: auto;
`;