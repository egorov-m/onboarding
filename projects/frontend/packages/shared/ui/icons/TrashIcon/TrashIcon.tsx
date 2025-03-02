import React from "react";
import { useTheme } from "styled-components";

interface TrashIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  width = 14,
  height = 14,
  ...props
}) => {
  const theme = useTheme();
  const fillColor = theme.mode === "dark" ? "#e57373" : "#d32f2f";

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
        d='M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z'
        fill={fillColor}
      />
      <path
        d='M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z'
        fill={fillColor}
      />
      <path
        d='M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z'
        fill={fillColor}
      />
    </svg>
  );
};
