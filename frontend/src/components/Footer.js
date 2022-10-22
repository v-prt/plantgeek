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
          <Link to='/about'>About</Link>•<Link to='/privacy'>Privacy Policy</Link>•
          <Link to='/terms'>Terms and Conditions</Link>
        </div>
        <p>&copy; 2021 - {currentYear} plantgeek. All rights reserved.</p>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  background: rgba(255, 255, 255, 0.3);
  color: ${COLORS.dark};
  font-size: 0.7rem;
  padding: 10px;
  margin-top: auto;
  .inner {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .links {
      margin: 5px 0;
      a {
        text-decoration: underline;
        margin: 0 10px;
      }
    }
    p {
      margin: 5px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    font-size: 0.8rem;
    padding: 10px 20px;
    .inner {
      max-width: 1200px;
      .links {
        margin: 10px 0;
        a {
          margin: 0 20px;
        }
      }
      p {
        margin: 10px 20px;
      }
    }
  }
`
