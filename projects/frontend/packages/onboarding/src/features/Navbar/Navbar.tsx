import React, { FC } from "react";

import * as styles from "./Navbar.styles";

interface NavbarProps {
  links: { to: string; label: string }[];
}

export const Navbar: FC<NavbarProps> = ({ links }) => {
  const prefix = `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_WEB_APP_PATH_PREFIX}`;

  return (
    <styles.NavbarContainer>
      <styles.NavbarContent>
        <styles.LeftSide>
          <styles.StyledLink to={`${prefix}${links[0].to}`}>
            {links[0].label}
          </styles.StyledLink>

          <styles.NavLinks>
            {links.slice(1, -1).map((link, index) => (
              <li key={index}>
                <styles.StyledLink to={`${prefix}${link.to}`}>
                  {link.label}
                </styles.StyledLink>
              </li>
            ))}
          </styles.NavLinks>
        </styles.LeftSide>

        <styles.StyledLink to={`${prefix}${links[links.length - 1].to}`}>
          {links[links.length - 1].label}
        </styles.StyledLink>
      </styles.NavbarContent>
    </styles.NavbarContainer>
  );
};
