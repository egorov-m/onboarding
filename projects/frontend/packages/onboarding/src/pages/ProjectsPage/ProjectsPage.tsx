import { useEffect, useState } from "react";
import { getProjects, createProject, Project } from "./api/projectsApi";
import { SearchProjects } from "../../features/SearchProjects/SearchProjects";
import { TableProjects } from "../../features/TableProjects/TableProjects";
import { Container } from "../../../../shared/ui/layout/Container";
import { Button } from "../../../../shared/ui/components/Button/Button";
import { Modal } from "../../../../shared/ui/components/Modal/Modal";
import { Input } from "../../../../shared/ui/components/Input/Input";

import * as styles from "./ProjectsPage.styles";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredData, setFilteredData] = useState<Project[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredData(data);
      } catch (error) {
        setError("Не удалось загрузить проекты");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (query: string) => {
    setQuery(query);
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      return;
    }

    try {
      await createProject(newProjectName);
      const data = await getProjects();
      setProjects(data);
      setFilteredData(data);
      setNewProjectName("");
      setIsModalVisible(false);
    } catch (error) {
      setError("Не удалось создать проект");
    }
  };

  const handleUpdateProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    setFilteredData(updatedProjects);
  };

  return (
    <styles.PageWrapper>
      <Container>
        <styles.Title>My Projects</styles.Title>
        <SearchProjects onSearch={handleSearch} />

        <styles.ButtonWrapper>
          <Button type='primary' onClick={() => setIsModalVisible(true)}>
            Создать проект
          </Button>
        </styles.ButtonWrapper>

        <TableProjects data={filteredData} onUpdate={handleUpdateProjects} />
      </Container>

      <Modal
        title='Создать новый проект'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateProject}
        okText='Создать'
        cancelText='Отмена'
      >
        <Input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder='Введите название проекта'
        />
      </Modal>
    </styles.PageWrapper>
  );
};
