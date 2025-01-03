import React from "react";
import { useTheme } from "styled-components";

interface LogoutIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

export const LogoutIcon: React.FC<LogoutIconProps> = ({
  width = 22,
  height = 22,
  ...props
}) => {
  const theme = useTheme();

  const fillColor = theme.mode === "dark" ? "#e57373" : "#d32f2f";

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      id='Layer_1'
      data-name='Layer 1'
      viewBox='0 0 24 24'
      width={width}
      height={height}
      {...props}
    >
      <path
        d='m24,15c0,.617-.24,1.197-.678,1.634l-2.072,2.073c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l1.292-1.293h-6.128c-.553,0-1-.447-1-1s.447-1,1-1h6.128l-1.292-1.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.073,2.074c.437.436.677,1.016.677,1.633ZM6.5,11c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm9.5,8v2c0,1.654-1.346,3-3,3H3c-1.654,0-3-1.346-3-3V5.621C0,3.246,1.69,1.184,4.019.718L7.216.079c1.181-.236,2.391.066,3.321.829.375.307.665.685.902,1.092h.561c2.206,0,4,1.794,4,4v5c0,.553-.447,1-1,1s-1-.447-1-1v-5c0-1.103-.897-2-2-2h0s0,0,0,0v17.999h1c.552,0,1-.448,1-1v-2c0-.553.447-1,1-1s1,.447,1,1Zm-6-14.999c0-.602-.267-1.165-.731-1.546-.362-.297-.808-.454-1.266-.454-.131,0-.264.013-.396.039l-3.196.639c-1.397.279-2.411,1.517-2.411,2.942v15.379c0,.552.449,1,1,1h7V4.001Z'
        fill={fillColor}
      />
    </svg>
  );
};
