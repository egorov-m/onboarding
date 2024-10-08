import { useState } from "react";
import { SearchProjects } from "../../features/SearchProjects/SearchProjects";
import { TableProjects } from "../../features/TableProjects/TableProjects";
import { Container } from '../../../../shared/ui/layout/Container'

import * as styles from './ProjectsPage.styles';

interface RowData {
  name: string;
  lastEdited: string;
  status: "Published" | "Saved";
  rating: number;
}

const initialData: RowData[] = [
  { name: 'Demo tutor', lastEdited: '23.09.24 at 22:02', status: 'Published', rating: 4 },
  { name: 'Demo tutor2', lastEdited: '24.09.24 at 02:02', status: 'Published', rating: 3 },
  { name: 'Tutor from dan4ik', lastEdited: '26.09.24 at 12:32', status: 'Saved', rating: 5 },
  { name: 'Photoshop shlepa edition gostarbaiter my IIT', lastEdited: '27.09.24 at 13:54', status: 'Published', rating: 2 },
  { name: 'Adobe Design tutor part 1', lastEdited: '01.10.24 at 10:02', status: 'Saved', rating: 1 },
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