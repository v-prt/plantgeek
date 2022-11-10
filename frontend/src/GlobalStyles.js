import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components/macro'

export const COLORS = {
  darkest: '#1a1a1a',
  dark: '#112211',
  medium: '#224422',
  mediumLight: '#5d9e2e',
  mutedMedium: '#cee1bc',
  light: '#92d265',
  lightest: '#e5efdc',
  accent: '#966fd1',
  danger: '#cc0000',
  alert: '#ff6b00',
}

export const BREAKPOINTS = {
  tablet: '768px',
  desktop: '1100px',
}

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
  .preview-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .thumbnail {
      display: grid;
      place-content: center;
      border-radius: 2px;
      border: 1px solid #e6e6e6;
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
  border: ${props => (props.isDragAccept ? `2px solid ${COLORS.accent}` : `2px dotted #ccc`)};
  color: ${props => (props.isDragAccept ? `${COLORS.accent}` : '#ccc')};
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
    display: grid;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${COLORS.accent};
    color: ${COLORS.accent};
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
      &:hover, &:focus {
        background: transparent;
        color: ${COLORS.accent};
      }
    }
    .ant-btn:disabled {
      background: grey !important;
      border-color: grey !important;
      color: #fff !important;
      opacity: 0.5 !important;
      pointer-events: none !important;
    }
    .ant-input-affix-wrapper-disabled {
      cursor: default;
    }
    .ant-modal-footer {
      display: flex;
    }
`
