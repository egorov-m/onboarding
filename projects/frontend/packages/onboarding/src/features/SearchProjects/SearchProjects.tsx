import React, { FC, useState } from "react";

import * as styles from './SearchProjects.styles';

interface SearchProjectsProps {
  onSearch: (query: string) => void;
}

export const SearchProjects: FC<SearchProjectsProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
  
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      onSearch(e.target.value);
    };
  
    return (
      <styles.SearchContainer>

        <styles.SearchInput
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="🔍 Search..."
        />
      </styles.SearchContainer>
    );
  };