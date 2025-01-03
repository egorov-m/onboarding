import { useEffect, useState } from "react";
import { getProjects, createProject, Project } from "./api/projectsApi";
import { SearchProjects, TableProjects } from "@features";
import { Button, Input, Modal, Container } from "@shared/ui";

import * as styles from "./ProjectsPage.styles";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredData, setFilteredData] = useState<Project[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredData(data);
      } catch {
        console.error("Не удалось загрузить проекты");
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (query: string) => {
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
    } catch {
      console.error("Не удалось создать проект");
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
          <Button onClick={() => setIsModalVisible(true)}>
            Create Project
          </Button>
        </styles.ButtonWrapper>

        <TableProjects data={filteredData} onUpdate={handleUpdateProjects} />
      </Container>

      <Modal
        title='Create new project'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateProject}
        okText='Create'
        cancelText='Cancel'
      >
        <Input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder='Enter the project name'
        />
      </Modal>
    </styles.PageWrapper>
  );
};
