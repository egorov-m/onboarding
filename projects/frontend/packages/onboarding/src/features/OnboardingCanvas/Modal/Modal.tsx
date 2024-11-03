import React from "react";

import * as styles from "./Modal.styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <styles.modalOverlayStyle onClick={onClose}>
      <styles.modalContentStyle onClick={(e) => e.stopPropagation()}>
        <styles.closeButtonStyle onClick={onClose}>X</styles.closeButtonStyle>
        {children}
      </styles.modalContentStyle>
    </styles.modalOverlayStyle>
  );
};
