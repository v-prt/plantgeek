// STYLE GUIDELINES
// lowercase for all heading text
// proper sentence case for body text
// rounded corners for all sections/cards
// mobile first (up to 500px)
// tablet breakpoint: 500px
// desktop breakpoint: 1000px

import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components/macro'

export const COLORS = {
  darkest: '#1A1A1A',
  dark: '#112211',
  medium: '#224422',
  mediumLight: '#5d9e2e',
  light: '#92D265',
  lightest: '#E5EFDC',
}

export const Button = styled.button`
  background: ${COLORS.medium};
  color: #fff;
  display: grid;
  place-content: center;
  line-height: 1;
  padding: 0 20px;
  border-radius: 10px;
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.mediumLight};
  }
  &:disabled {
    background: #ccc;
    color: #000;
  }
`

export const Switch = styled.label`
  height: 20px;
  width: 40px;
  position: relative;
  input {
    display: none;
  }
  .slider {
    background: #b5b5b5;
    border-radius: 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    &:before {
      background: #fff;
      border-radius: 50%;
      content: '';
      height: 16px;
      width: 16px;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: 0.2s ease-in-out;
    }
  }
  input:checked + .slider:before {
    transform: translateX(20px);
  }
  input:checked + .slider {
    background: ${COLORS.mediumLight};
    box-shadow: 0 0 0 1px ${COLORS.light};
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
        font-size: 0.9rem;
        @media only screen and (min-width: 500px) {
          font-size: 1rem;
        }
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
            color: ${COLORS.mediumLight};
        }
    }
    input {
      padding: 10px;
    }
    button {
        background: none;
        border: none;
        transition: 0.2s ease-in-out;
        &:hover {
            cursor: pointer;
        }
        &:focus {
            outline: none;
        }
        &:disabled {
            opacity: 50%;
            pointer-events: none;
        }
    }
`
