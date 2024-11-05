import React, { useState, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { Container } from "../../../../shared/ui/layout/Container";
import { OnboardingCanvas } from "../../features/OnboardingCanvas/OnboardingCanvas";
import { StatusButton } from "../../features/StatusButton/StatusButton";
import { SaveButton } from "../../features/SaveButton/SaveButton";
import * as styles from "./ConstructorPage.styles";

interface LocationState {
  name: string;
  status: "published" | "unpublished";
}

interface LocationState {
  name: string;
  status: "published" | "unpublished";
}

export const ConstructorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();

  const { name = "", status: initialStatus = "published" } =
    (location.state as LocationState) || {};

  const [status, setStatus] = useState<"published" | "unpublished">(
    initialStatus
  );

  const canvasRef = useRef<{ saveCanvas: () => void } | null>(null);

  const toggleStatus = () => {
    setStatus((prevStatus) =>
      prevStatus === "published" ? "unpublished" : "published"
    );
  };

  const handleSave = () => {
    canvasRef.current?.saveCanvas();
  };

  return (
    <styles.PageWrapper>
      <Container>
        <styles.Header>
          <styles.Title>{name}</styles.Title>
          <StatusButton status={status} onToggle={toggleStatus} />
        </styles.Header>
        <OnboardingCanvas ref={canvasRef} boardId={projectId!} />
        <SaveButton onClick={handleSave} />
      </Container>
    </styles.PageWrapper>
  );
};
