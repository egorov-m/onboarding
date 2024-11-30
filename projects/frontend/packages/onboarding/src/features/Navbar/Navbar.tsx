import React, { FC, useState } from "react";

import * as styles from "./Navbar.styles";
import { MoonIcon, SunIcon } from "shared/ui/icons";
import { Modal } from "shared/ui/components/Modal/Modal";

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleThemeSwitchClick = () => {
    if (isDarkMode) {
      onToggleTheme();
    } else {
      setIsModalVisible(true);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    onToggleTheme();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
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
            <styles.ThemeSwitcher onClick={handleThemeSwitchClick}>
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </styles.ThemeSwitcher>

            <styles.StyledLink to={`${prefix}${links[links.length - 1].to}`}>
              {links[links.length - 1].icon || links[links.length - 1].label}
            </styles.StyledLink>
          </styles.RightSide>
        </styles.NavbarContent>
      </styles.NavbarContainer>

      <Modal
        title='Переключение темы'
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        okText='Переключить'
        cancelText='Отмена'
      >
        <p>
          Сейчас темная тема находится в тестовом формате. Не успели все
          компоненты привести к темной теме. Реализуем до основной защиты.
          Хотите переключиться на темную тему?
        </p>
      </Modal>
    </>
  );
};
