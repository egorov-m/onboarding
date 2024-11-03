import * as styles from "./StatusButton.styles";

interface StatusButtonProps {
  status: "Published" | "Saved";
  onToggle: () => void;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  status,
  onToggle,
}) => {
  return (
    <styles.Button status={status} onClick={onToggle}>
      {status}
    </styles.Button>
  );
};
