import React, { FC } from "react";

import * as styles from './Navbar.styles';

interface NavbarProps {
  links: { to: string, label: string }[];
}

export const Navbar: FC<NavbarProps> = ({ links }) => (
  <styles.NavbarContainer>
    <styles.NavbarContent>
      <styles.LeftSide>
        <styles.StyledLink to={links[0].to}>{links[0].label}</styles.StyledLink>
        <styles.NavLinks>
          {links.slice(1, -1).map((link, index) => (
            <li key={index}>
              <styles.StyledLink to={link.to}>{link.label}</styles.StyledLink>
            </li>
          ))}
        </styles.NavLinks>
      </styles.LeftSide>

      <styles.StyledLink to={links[links.length - 1].to}>
        {links[links.length - 1].label}
      </styles.StyledLink>
    </styles.NavbarContent>
  </styles.NavbarContainer>
);