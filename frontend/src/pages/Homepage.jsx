import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'
import styled from 'styled-components'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { Button, Input } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import { FeaturedPlants } from '../components/FeaturedPlants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import plantPlaceholder from '../assets/plant-placeholder.svg'
import heroImage from '../assets/hero-image.png'
const { Search } = Input

export const Homepage = () => {
  useDocumentTitle('plantgeek')
  const { currentUser } = useContext(UserContext)
  const { formData, setFormData } = useContext(PlantContext)
  const history = useHistory()

  const onSearch = value => {
    // clear scrollPosition from previous search since results may be different
    localStorage.removeItem('scrollPosition')
    setFormData({ ...formData, search: [value] })
    history.push(`/browse`)
  }

  return (
    <Wrapper>
      <FadeIn>
        <section className='heading'>
          <div className='text'>
            <h1>
              welcome to <span className='gradient-text'>plantgeek</span>
            </h1>
            <p className='subheader'>The houseplant encyclopedia for modern plant parents.</p>
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
          <Search
            placeholder='Search houseplants'
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: '20px' }}
          />
          <div className='feature'>
            <Link to='/browse' className='info-cta'>
              browse
              <span className='icon'>
                <DoubleRightOutlined />
              </span>
            </Link>
            <p>
              Search and filter hundreds of plants by name, genus, care requirements, rarity, and
              more. Plus, find out if your plant is toxic.
            </p>
          </div>
          {currentUser ? (
            <>
              <div className='feature'>
                <Link to='/profile' className='info-cta'>
                  view your profile
                  <span className='icon'>
                    <DoubleRightOutlined />
                  </span>
                </Link>
                <p>
                  Manage your personal collection and wishlist. Quickly refer to your plants'
                  specific needs.
                </p>
              </div>
              <div className='feature'>
                <Link to='/contribute' className='info-cta'>
                  contribute
                  <span className='icon'>
                    <DoubleRightOutlined />
                  </span>
                </Link>
                <p>
                  Help us grow our website. Upload new houseplant information and earn badges for
                  approved submissions.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className='feature'>
                <Link to='/signup' className='info-cta'>
                  create an account
                  <span className='icon'>
                    <DoubleRightOutlined />
                  </span>
                </Link>
                <p>
                  Keep a list of your plant collection and wishlist. Quickly refer to your plants'
                  specific needs via your profile. Contribute to our houseplant database and earn
                  badges.
                </p>
              </div>
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
            <Link to='/care'>
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
              Can't find a specific plant? Submit it to our website - you'll earn badges for
              approved submissions! You can also help us by reporting any duplicate or incorrect
              information.
            </p>
            <Link to='contribute'>
              <Button type='secondary'>CONTRIBUTE</Button>
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
      padding: 40px 20px;
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
  .search {
    background: #fff;
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
        padding: 60px 30px;
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
        padding: 60px 40px;
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
  .feature {
    padding: 20px 0;
    max-width: 600px;
  }
  .info-cta {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    width: fit-content;
  }
`
