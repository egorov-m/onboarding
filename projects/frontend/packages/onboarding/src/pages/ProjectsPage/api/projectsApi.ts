import axios from "axios";

export interface Project {
  id: string;
  name: string;
  updated_at: string;
  status: "published" | "unpublished";
  average_rating: number;
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.post(
      "https://cobra-fancy-officially.ngrok-free.app/api/onboarding/boards/list",
      {}
    );
    return response.data.items;
  } catch (error) {
    console.error("Ошибка при загрузке списка проектов:", error);
    throw new Error("Не удалось загрузить проекты");
  }
};
