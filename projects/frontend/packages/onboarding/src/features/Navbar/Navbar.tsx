import React, { FC } from "react";

import * as styles from "./Navbar.styles";
import { MoonIcon, SunIcon } from "shared/ui/icons";

interface NavbarProps {
  links: {
    to: string;
    label?: string;
    icon?: React.ReactNode;
    isExternal?: boolean;
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
  const oauthPathPrefix = process.env.OAUTH_PATH_PREFIX || "/oauth2";
  const onboardingWebAppPathPrefix =
    process.env.ONBOARDING_WEB_APP_PATH_PREFIX || "/app/onboarding";

  return (
    <styles.NavbarContainer>
      <styles.NavbarContent>
        <styles.LeftSide>
          <styles.Logo>
            Step
            <span>Flow</span>
          </styles.Logo>
          {links[0].isExternal ? (
            <a href={links[0].to} target='_blank' rel='noopener noreferrer'>
              {links[0].label}
            </a>
          ) : (
            <styles.StyledLink to={`${prefix}${links[0].to}`}>
              {links[0].label}
            </styles.StyledLink>
          )}

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

          <a
            href={`${oauthPathPrefix}/sign_out?rd=${onboardingWebAppPathPrefix}`}
          >
            {links[links.length - 1].icon || links[links.length - 1].label}
          </a>
        </styles.RightSide>
      </styles.NavbarContent>
    </styles.NavbarContainer>
  );
};
