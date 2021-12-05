import React from 'react'
import styled, { keyframes } from 'styled-components'

// TODO: wrap more components with this
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
  @media (prefers-reduced-motion: no-preference) {
    animation-name: ${fadeIn};
    animation-fill-mode: backwards;
  }
`
