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
  accent: '#966FD1',
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

export const DropZone = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #fff;
  .guidelines-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .guidelines {
      margin-right: 50px;
      ul {
        font-size: 0.9rem;
        list-style: disc inside;
      }
    }
    .example {
      background: #dadada;
      border-radius: 5px;
      margin: 10px 0;
      padding: 20px;
      display: grid;
      place-content: center;
      text-align: center;
      img {
        margin-top: 10px;
      }
    }
    @media only screen and (min-width: 1000px) {
      flex-direction: row;
    }
  }
  .preview-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 16px;
    .thumbnail {
      display: inline-flex;
      border-radius: 2px;
      border: 1px solid #eaeaea;
      margin-bottom: 8px;
      margin-right: 8px;
      width: 100px;
      height: 100px;
      padding: 4px;
      box-sizing: border-box;
      .thumbnail-inner {
        display: flex;
        min-width: 0px;
        overflow: hidden;
        img {
          display: block;
          width: auto;
          height: 100%;
        }
      }
    }
  }
`

export const DropBox = styled.div`
  background: ${props => (props.isDragAccept ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.4)`)};
  border: ${props => (props.isDragAccept ? `2px solid ${COLORS.light}` : `2px dotted #ccc`)};
  color: ${props => (props.isDragAccept ? `${COLORS.light}` : '#ccc')};
  margin: 10px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 150px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  .icon {
    font-size: 4rem;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${COLORS.light};
    color: ${COLORS.light};
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
        overflow-x: hidden;
        overscroll-behavior-y: none;
        overscroll-behavior-x: none;
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
            color: ${COLORS.accent};
        }
    }
    input {
      padding: 10px;
      font-size: 1rem;
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
