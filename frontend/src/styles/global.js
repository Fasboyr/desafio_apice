import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    font-family: 'poppins', sans-serif;
  }
  
  body {

    background-color: rgb(228, 223, 223);
    justify-content: center;
  }
`;

export default Global;