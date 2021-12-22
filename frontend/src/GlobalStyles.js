import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components/macro'

export const COLORS = {
  darkest: '#1A1A1A',
  dark: '#112211',
  medium: '#224422',
  light: '#92D265',
  lightest: '#E5EFDC',
}

export const Button = styled.button`
  line-height: 1;
  background: ${COLORS.medium};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 10px 20px;
  border-radius: 10px;
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.light};
    color: #000;
  }
  &:disabled {
    pointer-events: none;
    background: #ccc;
    color: #000;
  }
`

export default createGlobalStyle`
    * {
        font-family: 'Quicksand', sans-serif;
        line-height: 1.75;
        margin: 0;
        padding: 0;
    }
    html, body {
        background: ${COLORS.lightest};
        overscroll-behavior: none;
    }
    h1, h2, h3 {
        font-family: 'Quicksand', sans-serif;
        font-weight: 700;
    }
    ol, ul {
        list-style: none;
    }
    a {
        font-family: 'Quicksand', sans-serif;
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
            cursor: auto;
        }
    }
`
