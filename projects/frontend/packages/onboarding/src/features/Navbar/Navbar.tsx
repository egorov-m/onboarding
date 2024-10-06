import React, { FC } from "react";
import { Link } from 'react-router-dom';

import * as styles from './Navbar.styles';

export const Navbar: FC = () => (
    <styles.NavbarContainer>
    <styles.NavbarContent>
      <styles.NavItemsContainer>
        <styles.Logo>
          <styles.StyledLink to="/">Logo</styles.StyledLink>
        </styles.Logo>

        <styles.NavLinks>
          <li>
            <styles.StyledLink to="/analyst">Analyst</styles.StyledLink>
          </li>
          <li>
            <styles.StyledLink to="/projects">Projects</styles.StyledLink>
          </li>
        </styles.NavLinks>
      </styles.NavItemsContainer>

      <styles.LogoutLink>
        <styles.StyledLink to="/logout">Log Out</styles.StyledLink>
      </styles.LogoutLink>
    </styles.NavbarContent>
  </styles.NavbarContainer>
)

