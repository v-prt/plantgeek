import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { RiArrowRightSFill } from 'react-icons/ri'
import placeholder from '../assets/avatar-placeholder.png'

import { FeaturedPlants } from '../components/FeaturedPlants'

export const Homepage = () => {
  const { currentUser } = useContext(UserContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // TODO: set loading state true while checking for current user - if not logged in load public homepage, if logged in load personal homepage (may need react query)
  // TODO: improve site info, add more content to heading (profile info/image? stats? random tip?)
  return (
    <Wrapper>
      <FadeIn>
        <Heading>
          {currentUser ? (
            <Row>
              <h1>welcome back, {currentUser.username}</h1>
              <img src={currentUser.image ? currentUser.image[0] : placeholder} alt='' />
            </Row>
          ) : (
            <h1>welcome to plantgeek</h1>
          )}
        </Heading>
      </FadeIn>
      <FadeIn delay={200}>
        <InfoCard>
          <h2>
            <Link to='/browse'>
              browse houseplants <RiArrowRightSFill />
            </Link>
          </h2>
          <ul>
            <li>View your plant's profile to learn how to care for it</li>
            <li>Find out if your plant is toxic (if so, keep away from pets & children)</li>
          </ul>
          {currentUser ? (
            <>
              <h2>
                <Link to={`/user-profile/${currentUser.username}`}>
                  view your profile <RiArrowRightSFill />
                </Link>
              </h2>
              <ul>
                <li>Manage your collection and quickly refer to your plants' needs</li>
                <li>Keep a list of your favorite plants</li>
                <li>Add plants you would like to own to your wishlist</li>
                <li>View your friends</li>
              </ul>
              <h2>
                <Link to='/contribute'>
                  contribute <RiArrowRightSFill />
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
                  create an account <RiArrowRightSFill />
                </Link>
              </h2>
              <ul>
                <li>Keep a list of your own houseplant collection</li>
                <li>Quickly view your plant's needs</li>
                <li>Save your favorite plants</li>
                <li>Create a wishlist</li>
                <li>Add your friends</li>
                <li>Chat with other users about plants and share tips with each other</li>
              </ul>
            </>
          )}
        </InfoCard>
      </FadeIn>
      <FadeIn delay={300}>
        <FeaturedPlants />
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
              learn more about houseplants <RiArrowRightSFill />
            </Link>
          </h3>
        </InfoCard>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding: 20px 0;
  section {
    margin: 20px;
    padding: 40px;
    border-radius: 20px;
  }
`

const Heading = styled.section`
  background: ${COLORS.light};
  display: flex;
  justify-content: flex-end;
  h1 {
    font-size: 1.8rem;
  }
  img {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    margin-left: 20px;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
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
    li {
      margin-left: 20px;
    }
  }
`
