import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { COLORS } from '../GlobalStyles'

export const Footer = () => {
  return (
    <Wrapper>
      <Links>
        <p>
          All houseplant images property of{' '}
          <a href='https://planterina.com/' target='blank' rel='noopenner noreferrer'>
            Planterina
          </a>
          .
        </p>
        {/* TODO: */}
        <StyledLink to='#'>about</StyledLink>
        <StyledLink to='#'>contact</StyledLink>
        <StyledLink to='#'>support</StyledLink>
        <p>&copy; plantgeek 2021</p>
      </Links>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  width: 100%;
  position: relative;
  bottom: 100%;
  background: ${COLORS.light};
  display: flex;
  justify-content: center;
  font-size: 0.8rem;
`

const Links = styled.div`
  display: flex;
  justify-content: space-around;
  width: 60%;
  p {
    margin: 10px;
    a {
      color: ${COLORS.dark};
      text-decoration: underline;
      &:hover {
        color: #fff;
      }
    }
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`

const StyledLink = styled(Link)`
  margin: 10px;
  &:hover {
    color: #fff;
  }
`
