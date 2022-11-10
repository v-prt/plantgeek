import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import { FeaturedPlants } from '../components/FeaturedPlants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import plantgeekLogo from '../assets/logo.webp'
import userPlaceholder from '../assets/avatar-placeholder.png'
import plantPlaceholder from '../assets/plant-placeholder.svg'

export const Homepage = () => {
  useDocumentTitle('plantgeek')
  const { currentUser } = useContext(UserContext)

  return (
    <Wrapper>
      <FadeIn>
        {currentUser ? (
          <section className='heading'>
            <Link className='profile-img' to='/profile'>
              <ImageLoader src={currentUser.imageUrl || userPlaceholder} alt='' />
            </Link>
            <div className='text'>
              <h1>hey, {currentUser.firstName}!</h1>
              <p>How are your plants today?</p>
            </div>
          </section>
        ) : (
          <section className='heading'>
            <img className='logo' src={plantgeekLogo} alt='' />
            <div className='text'>
              <h1>hey there!</h1>
              <p>How are your plants today?</p>
            </div>
          </section>
        )}
      </FadeIn>
      <FadeIn delay={200}>
        <InfoCard>
          <h2>
            <Link to='/browse'>
              browse houseplants
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
            </Link>
          </h2>
          <ul>
            <li>Search & filter hundreds of plants by name or genus</li>
            <li>Learn how to care for your plants</li>
            <li>Find out if your plant is toxic (if so, keep away from pets & children)</li>
          </ul>
          {currentUser ? (
            <>
              <h2>
                <Link to='/profile'>
                  view your profile
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                </Link>
              </h2>
              <ul>
                <li>Manage your personal collection</li>
                <li>Add plants you would like to own to your wishlist</li>
                <li>Upvote your favorite plants</li>
                <li>Quickly refer to your plants specific needs</li>
              </ul>
              <h2>
                <Link to='/contribute'>
                  contribute
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                </Link>
              </h2>
              <ul>
                <li>Help us grow our database of houseplants</li>
                <li>Upload images to our gallery</li>
                <li>Correct or add missing information</li>
              </ul>
            </>
          ) : (
            <>
              <h2>
                <Link to='/signup'>
                  create an account
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                </Link>
              </h2>
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
    background: ${COLORS.light};
    display: flex;
    align-items: center;
    gap: 12px;
    h1 {
      font-size: 1.5rem;
    }
    .logo {
      height: 50px;
      width: 50px;
    }
    .profile-img {
      border: 2px solid #fff;
      height: 75px;
      width: 75px;
      border-radius: 50%;
      padding: 2px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 50%;
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
      gap: 20px;
      .logo {
        height: 75px;
        width: 75px;
      }
      .profile-img {
        height: 100px;
        width: 100px;
      }
      h1 {
        font-size: 2rem;
      }
    }
  }
`

const InfoCard = styled.section`
  background: #fff;
  h2,
  h3 {
    width: fit-content;
    a {
      display: flex;
      align-items: center;
    }
  }
  h3 {
    margin-top: 20px;
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
