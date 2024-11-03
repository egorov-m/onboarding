import React, { useState } from "react";
import { Container } from "../../../../shared/ui/layout/Container";
import { OnboardingCanvas } from "../../features/OnboardingCanvas/OnboardingCanvas";
import { StatusButton } from "../../features/StatusButton/StatusButton";
import { SaveButton } from "../../features/SaveButton/SaveButton";

import * as styles from "./ConstructorPage.styles";

export const ConstructorPage = () => {
  const [status, setStatus] = useState<"Published" | "Saved">("Published");

  const toggleStatus = () => {
    setStatus((prevStatus) =>
      prevStatus === "Published" ? "Saved" : "Published"
    );
  };

  return (
    <styles.PageWrapper>
      <Container>
        <styles.Header>
          <styles.Title>Рыба</styles.Title>
          <StatusButton status={status} onToggle={toggleStatus} />
        </styles.Header>
        <OnboardingCanvas />
        <SaveButton />
      </Container>
    </styles.PageWrapper>
  );
};
