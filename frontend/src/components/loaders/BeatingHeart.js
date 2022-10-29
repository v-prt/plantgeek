import styled, { keyframes } from 'styled-components/macro'
import logo from '../../assets/logo.webp'

export const BeatingHeart = () => {
  return (
    <Wrapper>
      <img src={logo} alt='Loading...' />
    </Wrapper>
  )
}

const beat = keyframes`
  0% {
    transform: scale(0.95);
  }
  5% {
    transform: scale(1.2);
  }
  39% {
    transform: scale(0.85);
  }
  45% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0.9);
  }
`

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  margin: auto;
  img {
    opacity: 0.2;
    height: 40px;
    animation: ${beat} 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  }
`
