import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'

export const Guidelines = () => {
  // TODO: wip
  return (
    <Wrapper>
      <section className='heading'>
        <h1>houseplant care guidelines</h1>
        <p className='subheader'>So what does "bright indirect" mean anyway?</p>
        <p className='disclaimer'>
          Disclaimer: The following are guidelines based on the personal experience and research of
          a houseplant hobbyist. Your mileage may vary!
        </p>
      </section>
      <section className='info-section'>
        <h2>Light</h2>
        <p className='introduction'>
          In the wild, plants are exposed to varying levels of light - from deep shade on the forest
          floor under a thick canopy, to dappled or partial sun in the tropical jungle, and full sun
          in the desert or plains. Plants are highly adaptable and as we brought them into our
          homes, they've acclimated to our indoor environments.
        </p>
        <p>
          Note: this assumes your plants are getting their light via windows in your home. Grow
          lights are not covered here.
        </p>
        <h3>low to bright indirect</h3>
        <p>
          Low light doesn't mean no light! Every houseplant should be in a room with a window, at
          minimum. All houseplants grow best when they receive bright indirect light but some can be
          tolerant of lower light levels, such as the Snake Plant and ZZ Plant. These plants can be
          placed in a window that doesn't receive much light (for example due to obstruction from
          neighboring buildings or trees), or across the room from windows that get full or partial
          sun.
        </p>
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .heading {
    background: ${COLORS.light};
    h1 {
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .subheader {
      font-style: italic;
      font-size: 1.2rem;
    }
    .disclaimer {
      font-size: 0.8rem;
      margin-top: 30px;
    }
  }
  .info-section {
    background: #fff;
    p {
      margin: 10px 0;
    }
    h3 {
      margin-top: 20px;
    }
  }
`
