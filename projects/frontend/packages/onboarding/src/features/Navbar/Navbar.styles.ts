import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "shared/ui/layout/Container";

export const NavbarContainer = styled.nav`
  width: 100%;
  padding: 1.5rem 0;
  color: ${(props) => (props.theme.isDarkMode ? "#fff" : "#000")};
`;

export const NavbarContent = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
  margin-left: 2rem;
`;

export const StyledLink = styled(RouterLink)`
  text-decoration: none;
  font-size: 1.2rem;
`;

export const ThemeSwitcher = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 20px;

  svg {
    fill: currentColor;
  }

  &:hover {
    opacity: 0.8;
  }
`;
