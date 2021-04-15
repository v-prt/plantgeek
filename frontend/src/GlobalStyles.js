import { createGlobalStyle } from "styled-components";

export const COLORS = {
  darkest: "#1A1A1A",
  dark: "#112211",
  medium: "#224422",
  light: "#92D265",
  lightest: "#E5EFDC",
};

export default createGlobalStyle`
    * {
        font-family: 'Quicksand', sans-serif;
        line-height: 1.75;
        margin: 0;
        padding: 0;
    }
    html, body {
        background: ${COLORS.lightest};
    }
    h1, h2, h3 {
        font-family: "Raleway", sans-serif;
    }
    ol, ul {
        list-style: none;
    }
    a {
        text-decoration: none;
        color: ${COLORS.darkest};
        transition: 0.2s ease-in-out;
        &:hover {
            color: ${COLORS.light};
        }
    }
    input {
        padding: 10px;
        font-size: 1.1rem;
    }
    button {
        background: none;
        border: none;
        font-size: 1.1rem;
        transition: 0.2s ease-in-out;
        &:hover {
            cursor: pointer;
        }
        &:focus {
            outline: none;
        }
        &:disabled {
            opacity: 50%;
            cursor: not-allowed;
        }
    }
`;
