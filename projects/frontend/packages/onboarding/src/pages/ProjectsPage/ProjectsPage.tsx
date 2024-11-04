import { useEffect, useState } from "react";
import { SearchProjects } from "../../features/SearchProjects/SearchProjects";
import { TableProjects } from "../../features/TableProjects/TableProjects";
import { Container } from "../../../../shared/ui/layout/Container";
import { getProjects, Project } from "./api/projectsApi";

import * as styles from "./ProjectsPage.styles";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredData, setFilteredData] = useState<Project[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <styles.PageWrapper>
      <Container>
        <styles.Title>My Projects</styles.Title>
        <SearchProjects onSearch={handleSearch} />
        <TableProjects data={filteredData} />
      </Container>
    </styles.PageWrapper>
  );
};
