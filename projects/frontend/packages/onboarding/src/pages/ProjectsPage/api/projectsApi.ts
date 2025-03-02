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
      `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/boards/list`,
      {}
    );
    return response.data.items;
  } catch (error) {
    console.error("Ошибка при загрузке списка проектов:", error);
    throw new Error("Не удалось загрузить проекты");
  }
};

export const createProject = async (name: string): Promise<Project> => {
  try {
    const response = await axios.post(
      `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/boards/`,
      { name }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    throw new Error("Не удалось создать проект");
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await axios.delete(
      `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/boards/${projectId}`
    );
  } catch (error) {
    console.error("Ошибка при удалении проекта", error);
    throw new Error("Не удалось удалить проект");
  }
};

export const updateProject = async (
  projectId: string,
  updatedProject: { name: string; status: "published" | "unpublished" }
): Promise<void> => {
  try {
    await axios.patch(
      `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/boards/${projectId}`,
      updatedProject
    );
  } catch (error) {
    console.error("Ошибка при обновлении проекта", error);
    throw new Error("Не удалось обновить проект");
  }
};
