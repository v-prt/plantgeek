import React, { useEffect } from 'react'
import styled from 'styled-components/macro'

export const About = () => {
  // makes window scroll to top between renders
  const pathname = window.location.pathname
  useEffect(() => {
    if (pathname) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <Wrapper>
      <section className='introduction'>
        <h1>about plantgeek</h1>
        <p>
          Hey! I'm Victoria, the creator of plantgeek. I'm a web developer based in West Kelowna,
          BC. I created plantgeek as a way to share my love for plants with the world. I hope you
          enjoy it!
        </p>
        <p>
          If you would like to get in touch, connect with me on{' '}
          <a
            href='https://www.linkedin.com/in/victoria-peart'
            target='_blank'
            rel='noopener noreferrer'>
            LinkedIn
          </a>{' '}
          or learn more about me and my projects by viewing{' '}
          <a href='https://victoriapeart.com' target='_blank' rel='noopener noreferrer'>
            my portfolio
          </a>
          .
        </p>
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  margin: 30px;
  .introduction {
    background: #fff;
    h1 {
      margin-bottom: 30px;
    }
    p {
      margin-bottom: 20px;
    }
    a {
      text-decoration: underline;
    }
  }
`
