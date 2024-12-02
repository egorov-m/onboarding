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

  const handleLoginRedirect = () => {
    const ssoUrl = "https://cobra-fancy-officially.ngrok-free.app/sso/auth";
    const params = new URLSearchParams({
      approval_prompt: "auto",
      client_id: "app.oidc.onboarding",
      code_challenge: "random_code_challenge",
      code_challenge_method: "S256",
      nonce: "random_nonce",
      redirect_uri: `${window.location.origin}/oauth2/callback`,
      response_type: "code",
      scope: "openid email profile groups",
      state: encodeURIComponent(window.location.href),
    });

    window.location.href = `${ssoUrl}?${params.toString()}`;
  };

  return (
    <styles.NavbarContainer>
      <styles.NavbarContent>
        <styles.LeftSide>
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

          <styles.StyledLink
            to={`${prefix}${links[links.length - 1].to}`}
            onClick={handleLoginRedirect}
          >
            {links[links.length - 1].icon || links[links.length - 1].label}
          </styles.StyledLink>
        </styles.RightSide>
      </styles.NavbarContent>
    </styles.NavbarContainer>
  );
};
