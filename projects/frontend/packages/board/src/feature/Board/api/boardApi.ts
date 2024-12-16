import axios from "axios";

export const fetchSchema = async ({ boardId }: { boardId: string }) => {
  try {
    const url = `${process.env.BOARD_API_BASE_PATH}${process.env.BOARD_API_PATH_PREFIX}/schema`;
    console.log("Sending request to:", url);
    const requestBody = {
      items: [
        {
          board_step_id: "",
          type: "basic",
          is_passed_board_step: true,
          index: 0,
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      params: { board_id: boardId },
    });

    console.log("Response from schema API:", response.data);

    if (
      !response.data ||
      !response.data.items ||
      response.data.items.length === 0
    ) {
      throw new Error("Нет шагов в ответе");
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при запросе схемы:", error);
    throw error;
  }
};

export const fetchStepData = async ({
  boardId,
  boardStepId,
  rating = 0,
  finalized = false,
}: {
  boardId: string;
  boardStepId: string;
  rating?: number;
  finalized?: boolean;
}) => {
  try {
    const url = `${process.env.BOARD_API_BASE_PATH}${process.env.BOARD_API_PATH_PREFIX}/data`;

    const requestBody = {
      board_id: boardId,
      board_step_id: boardStepId,
      rating,
      finalized,
    };

    console.log("Отправка данных шага:", requestBody);

    const response = await axios.post(url, requestBody);

    console.log("Ответ на данные шага:", response.data);

    return response.data;
  } catch (error) {
    console.error("Ошибка при запросе данных шага:", error);
    throw error;
  }
};

export const syncRating = async ({
  boardId,
  boardStepId,
  rating,
  finalized = true,
}: {
  boardId: string;
  boardStepId: string;
  rating: number;
  finalized?: boolean;
}) => {
  try {
    const url = `${process.env.BOARD_API_BASE_PATH}${process.env.BOARD_API_PATH_PREFIX}/sync`;

    const requestBody = {
      board_id: boardId,
      board_step_id: boardStepId,
      rating,
      finalized,
    };

    console.log("Отправка данных синхронизации:", requestBody);

    const response = await axios.post(url, requestBody);

    console.log("Ответ на синхронизацию:", response.data);

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке синхронизации:", error);
    throw error;
  }
};
