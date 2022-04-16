import React from 'react'
import styled from 'styled-components/macro'
import { BREAKPOINTS } from '../../GlobalStyles'

export const Pulser = ({ color }) => {
  return (
    <Wrapper>
      <div className='ring' style={{ borderColor: color }}></div>
      <div className='circle' style={{ backgroundColor: color }}></div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  transform: scale(0.8);
  top: 2px;
  left: 2px;
  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    right: -5px;
  }
  .ring {
    border: 2px solid;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    position: absolute;
    bottom: -10px;
    right: -10px;
    animation: pulsate 1s ease-in-out infinite;
    opacity: 0;
  }
  @keyframes pulsate {
    0% {
      transform: scale(0.1, 0.1);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.1, 1.1);
      opacity: 0;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    transform: scale(1);
    top: 5px;
    left: 5px;
  }
`
