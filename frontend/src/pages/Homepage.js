import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LoginContext } from '../context/LoginContext'

import styled from 'styled-components'
import { COLORS } from '../GlobalStyles'
import { RiArrowRightSFill } from 'react-icons/ri'
import placeholder from '../assets/avatar-placeholder.png'

import { FeaturedPlants } from '../components/FeaturedPlants'

export const Homepage = () => {
  const { currentUser } = useContext(LoginContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // TODO: improve site info, fix lists, add more content to heading (profile info/image? stats? random tip?)
  return (
    <Wrapper>
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
      <InfoCard>
        <Link to='/browse'>
          <h2>
            browse houseplants <RiArrowRightSFill />
          </h2>
        </Link>
        <li>View your plant's profile to learn how to care for it</li>
        <li>Find out if your plant is pet friendly (look for the toxicity symbol)</li>
        {currentUser ? (
          <>
            <Link to={`/user-profile/${currentUser.username}`}>
              <h2>
                view your profile <RiArrowRightSFill />
              </h2>
            </Link>
            <li>Manage your collection and quickly refer to your plants' needs</li>
            <li>Keep a list of your favorite plants</li>
            <li>Add plants you would like to own to your wishlist</li>
            <li>View your friends</li>
            <Link to='/contribute'>
              <h2>
                contribute <RiArrowRightSFill />
              </h2>
            </Link>
            <li>Help us grow our database of houseplants</li>
            <li>Upload images to our gallery</li>
            <li>Correct or add missing information</li>
          </>
        ) : (
          <>
            <Link to='/signup'>
              <h2>
                create an account <RiArrowRightSFill />
              </h2>
            </Link>
            <li>Keep a list of your own houseplant collection</li>
            <li>Quickly view your plant's needs</li>
            <li>Save your favorite plants</li>
            <li>Create a wishlist</li>
            <li>Add your friends</li>
            <li>Chat with other users about plants and share tips with each other</li>
          </>
        )}
      </InfoCard>
      <FeaturedPlants />
      <InfoCard>
        <h2>general tips</h2>
        <h3>tropical</h3>
        <p>
          Most tropical plants need medium to bright indirect light, medium water, and above average
          humidity. Keep them in a north-facing window or out of direct sunlight near south facing
          windows. Use a humidifier or group plants together to raise the ambient humidity and
          prevent crispy leaf tips. Avoid sudden temperature changes such as from drafty windows or
          doors, or heating/cooling vents. Plastic pots with drainage holes are recommended to help
          keep the soil moist, but not soggy. Water when top inch or two of soil is dry.
        </p>
        <h3>dessert</h3>
        <p>
          Dessert plants such as cacti and other succulents generally need direct sunlight or bright
          indirect light or else they tend to stretch and become leggy. Avoid watering them too
          often as they are prone to rotting. Wait until their soil is completely dry, then water
          generously. Make sure to use fast-draining soil and provide holes to allow the water to
          drain. Terracotta or clay pots are recommended to aid in preventing root rot from
          water-logged soil.
        </p>
      </InfoCard>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const Heading = styled.section`
  background: ${COLORS.light};
  width: 80%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  border-radius: 20px;
  padding: 30px;
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
  width: 80%;
  margin: 30px;
  border-radius: 20px;
  padding: 0 30px 20px 30px;
  h2 {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  h3 {
    margin-top: 20px;
  }
  li {
    margin-left: 20px;
  }
`
