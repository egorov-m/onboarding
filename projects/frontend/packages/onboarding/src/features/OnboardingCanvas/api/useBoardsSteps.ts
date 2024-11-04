import axios from "axios";

const API_URL = "https://cobra-fancy-officially.ngrok-free.app/api/onboarding";

export const fetchBoardSteps = async (boardId: string, page_size = 100) => {
  const response = await axios.post(`${API_URL}/board_steps/list/${boardId}`, {
    page_size,
  });
  return response.data;
};

export const updateBoardStep = async (
  stepId: string,
  data: { title: string; text: string }
) => {
  const response = await axios.patch(`${API_URL}/board_steps/${stepId}`, data);
  return response.data;
};
