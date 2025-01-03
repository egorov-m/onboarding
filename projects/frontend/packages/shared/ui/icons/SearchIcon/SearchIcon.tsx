import React from "react";
import { useTheme } from "styled-components";
interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  width = 14,
  height = 14,
  ...props
}) => {
  const theme = useTheme();
  const fillColor = theme.textColor || "#000000";

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='Outline'
      viewBox='0 0 24 24'
      width={width}
      height={height}
      {...props}
    >
      <path
        d='M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z'
        fill={fillColor}
      />
    </svg>
  );
};
