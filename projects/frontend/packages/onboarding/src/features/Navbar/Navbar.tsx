import React, { FC } from "react";

import * as styles from "./Navbar.styles";
import { MoonIcon, SunIcon } from "shared/ui/icons";

interface NavbarProps {
  links: {
    to: string;
    label?: string;
    icon?: React.ReactNode;
  }[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  links,
  isDarkMode,
  onToggleTheme,
}) => {
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
                  {link.icon || link.label}{" "}
                </styles.StyledLink>
              </li>
            ))}
          </styles.NavLinks>
        </styles.LeftSide>

        <styles.RightSide>
          <styles.ThemeSwitcher onClick={onToggleTheme}>
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </styles.ThemeSwitcher>

          <styles.StyledLink to={`${prefix}${links[links.length - 1].to}`}>
            {links[links.length - 1].icon || links[links.length - 1].label}
          </styles.StyledLink>
        </styles.RightSide>
      </styles.NavbarContent>
    </styles.NavbarContainer>
  );
};
