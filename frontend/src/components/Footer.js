import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Wrapper>
      <div className='inner'>
        <div className='links'>
          <Link to='/terms'>Terms and Conditions</Link>•<Link to='/privacy'>Privacy Policy</Link>•
          <Link to='/contact'>Contact</Link>
        </div>
        <p>&copy; 2021 - {currentYear} plantgeek - All rights reserved.</p>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  background: #fff;
  color: ${COLORS.dark};
  font-size: 0.7rem;
  padding: 10px;
  .inner {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    a {
      text-decoration: underline;
      margin: 10px;
    }
    p {
      margin: 10px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    font-size: 0.8rem;
    padding: 10px 20px;
    .inner {
      max-width: 1200px;
      a {
        margin: 10px 20px;
      }
      p {
        margin: 10px 20px;
      }
    }
  }
`
