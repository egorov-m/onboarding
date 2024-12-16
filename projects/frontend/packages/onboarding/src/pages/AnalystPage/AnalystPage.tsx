import { CustomFunnelChart } from "@features";
import { Container } from "@shared/ui";

import * as styles from "./AnalystPage.styles";
import { useEffect, useState } from "react";
import { fetchBoards, fetchFunnelData } from "./api";

interface FunnelData {
  name: string;
  value: number;
  percentage: number;
}

interface ProjectData {
  projectId: string;
  projectName: string;
  funnelData: FunnelData[];
}

export const AnalystPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectsAndFunnelData = async () => {
      setLoading(true);
      setError(null);

      try {
        const boards: { id: string; name: string }[] = await fetchBoards();

        console.log("Fetched boards:", boards);

        const projectDataPromises = boards.map(async (board) => {
          try {
            const funnelResponse = await fetchFunnelData(board.id);

            const formattedFunnelData = funnelResponse.items.map(
              (item: any) => ({
                name: item.step_title,
                value: item.step_count_users,
                percentage: item.step_percentage_users,
              })
            );

            return {
              projectId: board.id,
              projectName: board.name,
              funnelData: formattedFunnelData,
            };
          } catch (funnelError) {
            console.error(
              `Ошибка при получении данных воронки для доски ${board.id}:`,
              funnelError
            );
            return {
              projectId: board.id,
              projectName: board.name,
              funnelData: [],
            };
          }
        });

        const allProjectData = await Promise.all(projectDataPromises);

        console.log("Final Project Data:", allProjectData);

        setProjects(allProjectData);
      } catch (err) {
        console.error("Error during board or funnel data fetch:", err);
        setError((err as Error).message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    loadProjectsAndFunnelData();
  }, []);

  return (
    <styles.PageWrapper>
      <Container>
        <styles.Title>Step-by-step conferencing</styles.Title>
        <styles.AnalystPageContainer>
          {loading && <p>Loading data ...</p>}
          {error && <p>Error: {error}</p>}
          {!loading &&
            !error &&
            projects.length > 0 &&
            projects.map((project) => (
              <styles.ProjectWrapper key={project.projectId}>
                <styles.ProjectTitle>{project.projectName}</styles.ProjectTitle>
                {project.funnelData.length > 0 ? (
                  <styles.FunnelChartWrapper>
                    <CustomFunnelChart data={project.funnelData} />
                  </styles.FunnelChartWrapper>
                ) : (
                  <p>No data to display</p>
                )}
              </styles.ProjectWrapper>
            ))}
        </styles.AnalystPageContainer>
      </Container>
    </styles.PageWrapper>
  );
};
