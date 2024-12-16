import axios from "axios";

export const fetchFunnelData = async (boardId: string): Promise<any> => {
  try {
    console.log("Requesting funnel data for boardId:", boardId);
    const url = `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/analytics/funnel_board_steps?board_id=${boardId}`;
    const response = await axios.get(url);

    if (
      !response.data ||
      !response.data.items ||
      response.data.items.length === 0
    ) {
      throw new Error("Данные воронки пусты или отсутствуют");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при получении данных воронки:",
        error.response?.data || error.message
      );
    } else {
      console.error("Ошибка при получении данных воронки:", error);
    }
    throw error;
  }
};
