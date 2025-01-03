import { Board } from "../../feature/Board/Board";
import { useParams } from "react-router-dom";

export const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) {
    return <p>Не удалось найти boardId</p>;
  }

  return <Board boardId={boardId} />;
};
