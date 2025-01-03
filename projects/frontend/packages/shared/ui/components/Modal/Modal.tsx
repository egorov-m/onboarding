import React from "react";

import * as styles from "./Modal.styles";

interface ModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  okText: string;
  cancelText: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  visible,
  onCancel,
  onOk,
  okText,
  cancelText,
  children,
}) => (
  <styles.ModalWrapper visible={visible}>
    <styles.ModalContent>
      <styles.ModalHeader>{title}</styles.ModalHeader>
      {children}
      <styles.ModalFooter>
        <styles.Button onClick={onCancel}>{cancelText}</styles.Button>
        <styles.Button onClick={onOk}>{okText}</styles.Button>
      </styles.ModalFooter>
    </styles.ModalContent>
  </styles.ModalWrapper>
);
