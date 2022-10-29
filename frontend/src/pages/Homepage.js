import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import { FeaturedPlants } from '../components/FeaturedPlants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import userPlaceholder from '../assets/avatar-placeholder.png'
import plantPlaceholder from '../assets/plant-placeholder.svg'

export const Homepage = () => {
  useDocumentTitle('plantgeek')
  const { currentUser } = useContext(UserContext)

  return (
    <Wrapper>
      <FadeIn>
        <section className='heading'>
          {currentUser ? (
            <div className='inner'>
              <h1>welcome back, {currentUser.firstName}</h1>
              <img
                className='profile-img'
                src={currentUser.image ? currentUser.image[0] : userPlaceholder}
                alt=''
              />
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
                <li>Upvote and keep a list of your favorite plants</li>
                <li>Use the detailed view to quickly refer to your plants' needs</li>
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
                <li>Upvote and save your favorite plants</li>
                <li>Help contribute to our database of houseplants</li>
              </ul>
            </>
          )}
        </InfoCard>
      </FadeIn>
      <FadeIn delay={300}>
        <InfoBox>
          <div>
            <span className='icon collection'>
              <RiPlantLine />
            </span>
            <span>
              <b>Have a plant?</b>
              <p>Add it to your collection</p>
            </span>
          </div>
          <div>
            <span className='icon wishlist'>
              <AiOutlineStar />
            </span>
            <span>
              <b>Want a plant?</b>
              <p>Add it to your wishlist</p>
            </span>
          </div>
          <div>
            <span className='icon favorites'>
              <TiHeartOutline />
            </span>
            <span>
              <b>Love a plant?</b>
              <p>Add it to your favorites</p>
            </span>
          </div>
        </InfoBox>
      </FadeIn>
      <FadeIn delay={400}>
        <FeaturedPlants currentUser={currentUser} />
      </FadeIn>
      <FadeIn delay={500}>
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
          <h3>
            <Link to='/guidelines'>
              more houseplant care tips
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
            </Link>
          </h3>
        </InfoCard>
      </FadeIn>
      <FadeIn delay={600}>
        <section className='contributions-info'>
          <div>
            <h2>contribute to our database</h2>
            <p>
              Can't find a specific plant? Contribute it to our database - you'll earn badges for
              approved submissions! Please help us by reporting any duplicate or incorrect
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
    .profile-img {
      background: ${COLORS.lightest};
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      height: 80px;
      width: 80px;
      border-radius: 50%;
      padding: 3px;
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
      justify-content: flex-end;
      .inner {
        flex-direction: row;
      }
      h1 {
        text-align: right;
        font-size: 2rem;
      }
      .profile-img {
        margin-left: 20px;
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

const InfoBox = styled.section`
  background: #fff;
  border: 1px dotted #ccc;
  display: flex;
  flex-direction: column;
  gap: 20px;
  div {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .icon {
    display: flex;
    align-items: center;
    font-size: 2rem;
    border-radius: 50%;
    padding: 10px;
    &.collection {
      background: ${COLORS.light};
    }
    &.wishlist {
      background: #ffd24d;
    }
    &.favorites {
      background: #b493e6;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    flex-direction: row;
    justify-content: space-around;
    div {
      flex-direction: column;
      text-align: center;
    }
  }
`
