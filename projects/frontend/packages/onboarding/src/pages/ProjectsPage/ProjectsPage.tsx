import { useState } from "react";
import { SearchProjects } from "../../features/SearchProjects/SearchProjects";
import { TableProjects } from "../../features/TableProjects/TableProjects";
import { Container } from '../../../../shared/ui/layout/Container'

import * as styles from './ProjectsPage.styles';

interface RowData {
  id: string;
  name: string;
  updated_at: string;
  status: "Published" | "Saved";
  average_rating: number;
}

const initialData: RowData[] = [
  { id: '1324-5678', name: 'Demo tutor', updated_at: '23.09.24 at 22:02', status: 'Published', average_rating: 4 },
  { id: '5678-abcd', name: 'Demo tutor2', updated_at: '24.09.24 at 02:02', status: 'Published', average_rating: 3 },
  { id: '8901-qwerty', name: 'Tutor from dan4ik', updated_at: '26.09.24 at 12:32', status: 'Saved', average_rating: 5 },
  { id: '1324-reboot', name: 'Photoshop shlepa edition gostarbaiter my IIT', updated_at: '27.09.24 at 13:54', status: 'Published', average_rating: 2 },
  { id: '1324-poor', name: 'Adobe Design tutor part 1', updated_at: '01.10.24 at 10:02', status: 'Saved', average_rating: 1 },
];

export const ProjectsPage: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<RowData[]>(initialData);

  const handleSearch = (query: string) => {
    setQuery(query);

    const filtered = initialData.filter((project) =>
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