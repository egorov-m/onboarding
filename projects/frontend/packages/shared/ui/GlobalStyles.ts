import { createGlobalStyle } from "styled-components";
import { Colors } from "../constants/Colors";

const GlobalStyles = createGlobalStyle`
  *{
  padding: 0;
  margin: 0;
  border: 0;
  font-family: "Montserrat", sans-serif;
}
*, *:before, *:after{
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
:focus, :active{outline: none;}
a:focus, a:active{outline: none;}

nav,footer,header,aside{display: block;}

html, body{
  height: 100%;
  width: 100%;
  font-style: 100%;
  line-height: 1;
  font-style: 14px;
  -ms-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  color: ${({ theme }) => theme.textColor || Colors.Black};
}
  
.icon {
    filter: ${({ theme }) => (theme.isDarkMode ? "invert(1)" : "none")};
  }

::selection {
    background-color: ${({ theme }) =>
      theme.selectionColor || Colors.Orochimaru};
  }
    

input, button, textarea{font-family: inherit;}

input::-ms-clear{display:none;}
button{cursor: pointer;}
button::-moz-focus-inner{padding: 0;border: 0;}
a, a:visited {
    text-decoration: none;
    color: ${({ theme }) => theme.textColor || Colors.Black};
  }
  a:hover {
    text-decoration: underline;
    color: ${({ theme }) =>
      theme.linkHoverColor || theme.textColor || Colors.Black};
  }
a:hover{text-decoration: none;}
ul li{list-style-type: none;}
img{vertical-align: top;}

h1,h2, h3, h4, h5, h6{font-style: inherit; font-weight: 400;}
`;

export default GlobalStyles;
