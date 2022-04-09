import React from 'react'
import styled, { keyframes } from 'styled-components/macro'

export const FadeIn = ({ duration = 400, delay = 100, children, ...delegated }) => {
  return (
    <Wrapper
      {...delegated}
      style={{
        ...(delegated.style || {}),
        animationDuration: duration + 'ms',
        animationDelay: delay + 'ms',
      }}>
      {children}
    </Wrapper>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  @media only screen and (prefers-reduced-motion: no-preference) {
    animation-name: ${fadeIn};
    animation-fill-mode: backwards;
  }
`
