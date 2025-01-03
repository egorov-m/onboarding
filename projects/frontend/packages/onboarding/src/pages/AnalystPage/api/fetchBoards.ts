import axios from "axios";

export const fetchBoards = async (): Promise<
  { id: string; name: string }[]
> => {
  const url = `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/boards/list`;
  const response = await axios.post(url, {});

  if (
    !response.data ||
    !response.data.items ||
    response.data.items.length === 0
  ) {
    throw new Error("Данные досок пусты или отсутствуют");
  }

  return response.data.items;
};
