import React, { useContext, useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import moment from 'moment'
import axios from 'axios'
import styled from 'styled-components/macro'
import { Empty } from 'antd'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Button } from 'antd'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { ListWrapper, PlantList } from '../components/lists/PlantList'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import placeholder from '../assets/avatar-placeholder.png'
import { Ellipsis } from '../components/loaders/Ellipsis'
import bee from '../assets/stickers/bee.svg'
import boot from '../assets/stickers/boot.svg'
import cactus from '../assets/stickers/cactus.svg'
import flower from '../assets/stickers/flower.svg'
import flowers from '../assets/stickers/flowers.svg'
import leaf from '../assets/stickers/leaf.svg'
import potted1 from '../assets/stickers/potted1.svg'
import potted2 from '../assets/stickers/potted2.svg'

export const UserProfile = () => {
  const { currentUser } = useContext(UserContext)
  const [approvedContributions, setApprovedContributions] = useState([])
  const [pendingContributions, setPendingContributions] = useState([])
  const badges = [
    { name: leaf, value: 1 },
    { name: flower, value: 3 },
    { name: bee, value: 10 },
    { name: flowers, value: 25 },
    { name: potted2, value: 40 },
    { name: potted1, value: 50 },
    { name: boot, value: 75 },
    { name: cactus, value: 100 },
  ]

  const { data: contributions, status: contributionsStatus } = useQuery(
    ['contributions', currentUser._id],
    async () => {
      const { data } = await axios.get(`${API_URL}/contributions/${currentUser._id}`)
      return data.contributions
    }
  )

  // makes window scroll to top between renders
  const pathname = window.location.pathname
  useEffect(() => {
    if (pathname) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  useEffect(() => {
    if (contributions) {
      const approved = contributions.filter(contribution => contribution.review === 'approved')
      const pending = contributions.filter(contribution => contribution.review === 'pending')
      setApprovedContributions(approved)
      setPendingContributions(pending)
    }
  }, [contributions])

  return !currentUser ? (
    <Redirect to='/signup' />
  ) : (
    <Wrapper>
      <FadeIn>
        <section className='user-info'>
          <Image src={currentUser.image ? currentUser.image[0] : placeholder} alt='' />
          <div className='text'>
            <h1>
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p className='username'>{currentUser.username}</p>
            <p>Member since {moment(currentUser.joined).format('ll')}</p>
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        {currentUser.collection.length > 0 ? (
          <PlantList user={currentUser} list={currentUser.collection} title='collection' />
        ) : (
          <ListWrapper>
            <FadeIn>
              <div className='inner'>
                <div className='header'>
                  <h2>
                    <span className='icon'>
                      <RiPlantLine />
                    </span>
                    collection
                  </h2>
                  <div className='info'>
                    <span className='num-plants'>0 plants</span>
                  </div>
                </div>
                <div className='empty'>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='No plants in collection'
                  />
                  <Link to='/browse'>
                    <Button type='secondary'>BROWSE</Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </ListWrapper>
        )}
      </FadeIn>
      <FadeIn delay={300}>
        {currentUser.wishlist.length > 0 ? (
          <PlantList user={currentUser} list={currentUser.wishlist} title='wishlist' />
        ) : (
          <ListWrapper>
            <FadeIn>
              <div className='inner'>
                <div className='header'>
                  <h2>
                    <span className='icon'>
                      <TiHeartOutline />
                    </span>
                    wishlist
                  </h2>
                  <div className='info'>
                    <span className='num-plants'>0 plants</span>
                  </div>
                </div>
                <div className='empty'>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No plants in wishlist' />
                  <Link to='/browse'>
                    <Button type='secondary'>BROWSE</Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </ListWrapper>
        )}
      </FadeIn>
      <FadeIn delay={400}>
        {currentUser.favorites.length > 0 ? (
          <PlantList user={currentUser} list={currentUser.favorites} title='favorites' />
        ) : (
          <ListWrapper>
            <FadeIn>
              <div className='inner'>
                <div className='header'>
                  <h2>
                    <span className='icon'>
                      <AiOutlineStar />
                    </span>
                    favorites
                  </h2>
                  <div className='info'>
                    <span className='num-plants'>0 plants</span>
                  </div>
                </div>
                <div className='empty'>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='No plants in favorites'
                  />
                  <Link to='/browse'>
                    <Button type='secondary'>BROWSE</Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </ListWrapper>
        )}
      </FadeIn>
      <FadeIn delay={500}>
        <Contributions>
          <h2>contributions</h2>
          <p>Earn badges by submitting new houseplant information to our database!</p>
          {contributionsStatus === 'loading' ? (
            <Ellipsis />
          ) : contributions?.length > 0 ? (
            <div className='inner'>
              <div className='badges'>
                {badges.map(badge => (
                  <div
                    className={`badge ${approvedContributions.length >= badge.value && 'earned'} `}
                    key={badge.name}>
                    <img src={badge.name} alt='' />
                    <span className='value'>{badge.value}</span>
                  </div>
                ))}
              </div>
              {approvedContributions.length > 0 && (
                <div className='approved-contributions'>
                  <h3>approved ({approvedContributions.length})</h3>
                  <div className='plants'>
                    {approvedContributions.map(plant => (
                      <Link className='contribution-card' to={`/plant/${plant._id}`}>
                        <div className='thumbnail'>
                          <ImageLoader src={plant.imageUrl} alt={''} placeholder={placeholder} />
                        </div>{' '}
                        <div className='info'>
                          <p className='primary-name'>{plant.primaryName}</p>
                          <p className='secondary-name'>{plant.secondaryName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {pendingContributions.length > 0 && (
                <div className='pending-contributions'>
                  <h3>pending review ({pendingContributions.length})</h3>
                  <div className='plants'>
                    {pendingContributions.map(plant => (
                      <Link className='contribution-card pending' to={`/plant/${plant._id}`}>
                        <div className='thumbnail'>
                          <ImageLoader src={plant.imageUrl} alt={''} placeholder={placeholder} />
                        </div>
                        <div className='info'>
                          <p className='primary-name'>{plant.primaryName}</p>
                          <p className='secondary-name'>{plant.secondaryName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className='no-contributions'>No contributions yet.</p>
          )}
        </Contributions>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-info {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      text-align: center;
      .username {
        font-weight: bold;
        font-size: 1.2rem;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .user-info {
      flex-direction: row;
      .text {
        margin-left: 30px;
        text-align: left;
      }
    }
  }
`

export const Image = styled.img`
  border: 5px solid #fff;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  padding: 5px;
`

const Contributions = styled.section`
  background: #fff;
  .inner {
    display: flex;
    flex-direction: column;
  }
  .badges {
    margin: 10px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    .badge {
      opacity: 0.5;
      filter: grayscale(1);
      background: #e6e6e6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 10px;
      position: relative;
      &.earned {
        opacity: 1;
        filter: grayscale(0);
      }
      img {
        height: 60px;
        filter: drop-shadow(0 0 2px rgba(55, 73, 87, 0.15))
          drop-shadow(0 2px 5px rgba(55, 73, 87, 0.2));
      }
      .value {
        background: ${COLORS.accent};
        color: #fff;
        padding: 2px 5px;
        text-align: center;
        border-radius: 10px;
        font-size: 0.6rem;
        font-weight: bold;
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      .badge {
        padding: 20px;
        img {
          height: 80px;
        }
        .value {
          padding: 5px 10px;
        }
      }
    }
  }
  .approved-contributions,
  .pending-contributions {
    margin: 10px 0;
    .plants {
      display: flex;
      grid-gap: 20px;
      flex-wrap: wrap;
      align-items: center;
      margin: 10px 0;
      .contribution-card {
        width: 100%;
        border: 1px solid #e6e6e6;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        align-items: center;
        &.pending {
          border: 1px dotted #e6e6e6;
        }
        img {
          height: 100px;
          width: 100px;
          border-radius: 50%;
          &.placeholder {
            height: 75px;
            width: 75px;
          }
        }
        .info {
          margin-left: 10px;
          .primary-name {
            font-size: 1.1rem;
            font-weight: bold;
            color: #222;
          }
          .secondary-name {
            color: #999;
            font-size: 0.8rem;
          }
        }
        &:hover {
          border-color: ${COLORS.accent};
          &.pending {
            border-color: orange;
          }
          .info .primary-name {
            color: #222;
          }
        }
      }
    }
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      .contribution-card {
        max-width: 300px;
      }
    }
  }
  .no-contributions {
    margin-top: 20px;
    opacity: 0.5;
  }
`
