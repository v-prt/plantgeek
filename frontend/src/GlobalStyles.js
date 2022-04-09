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
  darkest: '#1a1a1a',
  dark: '#112211',
  medium: '#224422',
  mediumLight: '#5d9e2e',
  light: '#92d265',
  lightest: '#e5efdc',
  accent: '#966fd1',
  danger: '#cc0000',
  alert: '#ff6b00',
}

export const BREAKPOINTS = {
  tablet: '500px',
  desktop: '1000px',
}

export const Button = styled.button`
  background: ${COLORS.darkest};
  color: #fff;
  border: 2px solid ${COLORS.darkest};
  display: grid;
  place-content: center;
  line-height: 1;
  height: 50px;
  padding: 10px 20px;
  border-radius: 10px;
  &.secondary {
    background: #fff;
    color: ${COLORS.darkest};
    border: 2px solid ${COLORS.darkest};
  }
  &.danger {
    background: #fff;
    color: ${COLORS.danger};
    border: 2px solid ${COLORS.danger};
  }
  h2 {
    margin-right: 10px;
  }
  &:hover {
    background: ${COLORS.medium};
    border: 2px solid ${COLORS.medium};
    &.secondary {
      color: #fff;
    }
    &.danger {
      background: ${COLORS.danger};
      color: #fff;
      border: 2px solid ${COLORS.danger};
    }
  }
`

export const Toggle = styled.label`
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
    background: ${COLORS.accent};
  }
`

export const DropZone = styled.div`
  /* padding-bottom: 15px;
  border-bottom: 1px solid #e6e6e6; */
  margin-bottom: 15px;
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
    @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
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
        margin: 0;
        padding: 0;
        border: 0;
    }
    html, body {
      font-family: 'Quicksand', sans-serif;
      background: ${COLORS.lightest};
        // causes issues with window.scrollTo(0,0)
        /* overflow-x: hidden; */
        overscroll-behavior-y: none;
        overscroll-behavior-x: none;
        scroll-behavior: smooth;
    }
    #root {
      height: 100%;
    }
    h1, h2, h3 {
        font-family: 'Quicksand', sans-serif;
        font-weight: 700;
        margin: 0;
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.2rem;
    }
    p {
      margin: 0;
    }
    ol, ul {
        list-style: none;
        margin: 0;
    }
    a {
      font-family: 'Quicksand', sans-serif;
      text-decoration: none;
      color: #000;
      transition: 0.2s ease-in-out;
      &:hover, &:focus {
        color: ${COLORS.accent};
      }
    }
    button {
      background: transparent;
      border: 0;
      cursor: pointer;
      transition: 0.2s ease-in-out;
    }
    .ant-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      text-shadow: none !important;
      box-shadow: none !important;
      transition: 0.2s ease-in-out;
      &:disabled {
        background: grey;
      border-color: grey;
      color: #fff;
      opacity: 0.5;
      pointer-events: none;
      }
    }
    .ant-btn-primary {
      background: ${COLORS.darkest};
      border-color: ${COLORS.darkest};
      color: #fff;
      &:hover, &:focus {
        background: ${COLORS.accent};
        border-color: ${COLORS.accent};
      }
    }
    .ant-btn-secondary {
      background: #fff;
      border-color: ${COLORS.darkest};
      color: ${COLORS.darkest};
      &:hover, &:focus {
        border-color: ${COLORS.accent};
        color: ${COLORS.accent};
      }
    }
    .ant-btn-danger {
      background: #fff;
      border-color: ${COLORS.danger};
      color: ${COLORS.danger};
      &:hover, &:focus {
        background: ${COLORS.danger};
        border-color: ${COLORS.danger};
        color: #fff;
      }
    }
    .ant-btn-text {
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      &:focus {
        background: transparent;
      }
      &:hover {
        background: transparent;
        color: ${COLORS.accent};
      }
    }
`
