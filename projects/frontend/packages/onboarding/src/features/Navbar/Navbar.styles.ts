import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "@shared/ui";

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

export const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  margin-right: 20px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.5s ease, filter 0.5s ease;

  span {
    font-size: 1.6rem;
    font-weight: bold;
    background: linear-gradient(45deg, #ff007f, #00bfff, #7f00ff, #ff007f);
    background-size: 300% 300%;
    background-clip: text;
    color: transparent;
    animation: gradientAnimation 3s ease infinite;
    transition: transform 0.5s ease, filter 0.5s ease;
  }

  &:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
  }

  &:hover span {
    animation: gradientAnimationHover 1.5s ease infinite;
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes gradientAnimationHover {
    0% {
      background-position: 50% 0%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 50% 100%;
    }
  }
`;
