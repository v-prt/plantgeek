import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'

export const Footer = () => {
  return (
    <Wrapper>
      <Links>
        {/* TODO: */}
        <p>&copy; 2021 Plantgeek, Inc. All rights reserved.</p>
        <StyledLink to='#'>Terms of Use</StyledLink>•<StyledLink to='#'>Privacy Policy</StyledLink>•
        <StyledLink to='#'>Support</StyledLink>
      </Links>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  background: ${COLORS.light};
  color: ${COLORS.dark};
  width: 100%;
  position: relative;
  bottom: 100%;
  display: flex;
  justify-content: center;
  font-size: 0.8rem;
  a {
    text-decoration: underline;
    &:hover {
      color: #fff;
    }
  }
`

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 10px 20px;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  margin: 10px 20px;
  &:hover {
    color: #fff;
  }
`
