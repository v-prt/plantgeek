import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import placeholder from '../assets/avatar-placeholder.png'

import { FeaturedPlants } from '../components/FeaturedPlants'

export const Homepage = () => {
  const { currentUser } = useContext(UserContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Wrapper>
      <FadeIn>
        <section className='heading'>
          {currentUser ? (
            <div className='inner'>
              <h1>welcome back, {currentUser.username}</h1>
              <img src={currentUser.image ? currentUser.image[0] : placeholder} alt='' />
            </div>
          ) : (
            <h1>welcome to plantgeek</h1>
          )}
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <InfoCard>
          <h2>
            <Link to='/browse'>
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
              browse houseplants
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
                <Link to={`/user-profile/${currentUser._id}`}>
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                  view your profile
                </Link>
              </h2>
              <ul>
                <li>Manage your personal collection</li>
                <li>Add plants you would like to own to your wishlist</li>
                <li>Upvote and keep a list of your favorite plants</li>
                <li>Use the detailed view to quickly refer to your plants' needs</li>
              </ul>
              <h2>
                <Link to='/contribute'>
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                  contribute
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
                  <span className='icon'>
                    <FaArrowAltCircleRight />
                  </span>
                  create an account
                </Link>
              </h2>
              <ul>
                <li>Keep a list of your own houseplant collection</li>
                <li>Quickly view the care requirements for your plants via your profile</li>
                <li>Create a wishlist</li>
                <li>Upvote and save your favorite plants</li>
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
        <InfoCard>
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
          <h3>
            <Link to='/browse'>
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
              learn more
            </Link>
          </h3>
        </InfoCard>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  section {
    margin: 10px 0;
    padding: 20px;
    border-radius: 20px;
  }
  .heading {
    background: ${COLORS.light};
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: flex-end;
    }
    h1 {
      font-size: 1.8rem;
      text-align: center;
    }
    img {
      background: ${COLORS.lightest};
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      height: 80px;
      width: 80px;
      border-radius: 50%;
      margin-left: 20px;
      padding: 3px;
    }
  }
  .icon {
    font-size: 1.1rem;
    margin-right: 10px;
    display: grid;
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    section {
      margin: 20px;
      padding: 40px;
    }
    .heading {
      justify-content: flex-end;
      .inner {
        flex-direction: row;
      }
      h1 {
        text-align: right;
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
