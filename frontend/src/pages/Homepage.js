import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { Button } from 'antd'
import { PlusCircleOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { FeaturedPlants } from '../components/FeaturedPlants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import plantPlaceholder from '../assets/plant-placeholder.svg'
import heroImage from '../assets/hero-image.png'

export const Homepage = () => {
  useDocumentTitle('plantgeek')
  const { currentUser } = useContext(UserContext)

  return (
    <Wrapper>
      <FadeIn>
        <section className='heading'>
          <div className='text'>
            <h1>
              welcome to <span className='gradient-text'>plantgeek</span>
            </h1>
            <p className='subheader'>The houseplant encyclopedia for the modern plant parent.</p>
            <div className='buttons'>
              {currentUser ? (
                <>
                  <Link to='/browse'>
                    <Button type='primary'>BROWSE PLANTS</Button>
                  </Link>
                  <Link to='/profile'>
                    <Button type='secondary'>VIEW PROFILE</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to='/login'>
                    <Button type='primary'>LOG IN</Button>
                  </Link>
                  <Link to='/signup'>
                    <Button type='secondary'>SIGN UP</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className='hero-image'>
            <ImageLoader src={heroImage} alt='' borderRadius='100px 0 20px 0' />
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <InfoCard>
          <Link to='/browse' className='info-cta'>
            browse houseplants
            <span className='icon'>
              <DoubleRightOutlined />
            </span>
          </Link>
          <ul>
            <li>Search & filter hundreds of plants by name or genus</li>
            <li>Learn how to care for your plants</li>
            <li>Find out if your plant is toxic (if so, keep away from pets & children)</li>
          </ul>
          {currentUser ? (
            <>
              <Link to='/profile' className='info-cta'>
                view your profile
                <span className='icon'>
                  <DoubleRightOutlined />
                </span>
              </Link>
              <ul>
                <li>Manage your personal collection</li>
                <li>Add plants you would like to own to your wishlist</li>
                <li>Upvote your favorite plants</li>
                <li>Quickly refer to your plants specific needs</li>
              </ul>
              <Link to='/contribute' className='info-cta'>
                contribute
                <span className='icon'>
                  <DoubleRightOutlined />
                </span>
              </Link>
              <ul>
                <li>Help us grow our database of houseplants</li>
                <li>Upload images to our gallery</li>
                <li>Correct or add missing information</li>
              </ul>
            </>
          ) : (
            <>
              <Link to='/signup' className='info-cta'>
                create an account
                <span className='icon'>
                  <DoubleRightOutlined />
                </span>
              </Link>
              <ul>
                <li>Keep a list of your own houseplant collection</li>
                <li>Quickly view the care requirements for your plants via your profile</li>
                <li>Create a wishlist</li>
                <li>Upvote your favorite plants</li>
                <li>Help contribute to our database of houseplants</li>
              </ul>
            </>
          )}
        </InfoCard>
      </FadeIn>
      <FadeIn delay={300}>
        <FeaturedPlants currentUser={currentUser} />
      </FadeIn>
      <FadeIn delay={400}>
        <InfoCard className='tips'>
          <h2>general tips</h2>
          <h3>tropical</h3>
          <p>
            Most tropical plants need medium to bright indirect light, medium water, and above
            average humidity. Keep them in a north-facing window or out of direct sunlight near
            south facing windows. Use a humidifier or group plants together to raise the ambient
            humidity and prevent crispy leaf tips. Avoid sudden temperature changes such as from
            drafty windows or doors, or heating/cooling vents. Plastic pots with drainage holes are
            recommended to help keep the soil moist, but not soggy. Water when top inch or two of
            soil is dry.
          </p>
          <h3>desert</h3>
          <p>
            Desert plants such as cacti and other succulents generally need direct sunlight or
            bright indirect light or else they tend to stretch and become leggy. Avoid watering them
            too often as they are prone to rotting. Wait until their soil is completely dry, then
            water generously. Make sure to use fast-draining soil and provide holes to allow the
            water to drain. Terracotta or clay pots are recommended to aid in preventing root rot
            from water-logged soil.
          </p>
          <div className='cta' style={{ marginTop: '20px' }}>
            <Link to='/guidelines'>
              <Button type='primary'>READ MORE</Button>
            </Link>
          </div>
        </InfoCard>
      </FadeIn>
      <FadeIn delay={500}>
        <section className='contributions-info'>
          <div>
            <h2>contribute to plantgeek</h2>
            <p>
              Can't find a specific plant? Contribute it to our database - you'll earn badges for
              approved submissions! You can also help us by reporting any duplicate or incorrect
              information.
            </p>
            <Link to='contribute'>
              <Button type='secondary' icon={<PlusCircleOutlined />}>
                CONTRIBUTE
              </Button>
            </Link>
          </div>
          <img src={plantPlaceholder} alt='' />
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .heading {
    background: linear-gradient(45deg, #a4e17d, #95d190);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 0;
    overflow: hidden;
    .text {
      display: flex;
      flex-direction: column;
      padding: 20px;
      h1 {
        color: ${COLORS.lighter};
        font-family: 'Lobster Two', cursive;
        font-size: 4rem;
        line-height: 1;
        .gradient-text {
          color: ${COLORS.darkest};
        }
      }
      .subheader {
        font-size: 1.4rem;
        margin: 20px 0;
      }
      .buttons {
        display: flex;
        gap: 12px;
      }
      a {
        width: fit-content;
      }
    }
    .hero-image {
      margin-top: auto;
      border-radius: 100px 0 0 0;
      overflow: hidden;
      img {
        max-width: 100%;
      }
    }
  }
  .icon {
    font-size: 1.1rem;
    margin-left: 10px;
    display: grid;
  }
  .contributions-info {
    background: ${COLORS.mutedMedium};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    h2 {
      margin-bottom: 10px;
    }
    p {
      max-width: 600px;
      margin-bottom: 50px;
    }
    img {
      width: 100px;
      align-self: flex-end;
      margin-top: 20px;
      margin-left: auto;
      filter: invert(1);
      opacity: 0.2;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .heading {
      flex-direction: row;
      gap: 20px;
      .text,
      .hero-image {
        flex: 1;
      }
      .text {
        padding: 30px;
        h1 {
          font-size: 4.5rem;
        }
        .subheader {
          font-size: 1.5rem;
          margin: 30px 0;
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .heading {
      .text {
        padding: 40px;
        h1 {
          font-size: 5rem;
        }
        .subheader {
          margin: 40px 0;
        }
      }
    }
  }
`

const InfoCard = styled.section`
  background: #fff;
  h3 {
    margin-top: 20px;
  }
  .info-cta {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    width: fit-content;
  }
  ul {
    list-style: disc;
    margin-bottom: 20px;
    margin-left: 3px;
    li {
      margin-left: 20px;
    }
  }
`
