import React, { useContext, useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import moment from 'moment'
import axios from 'axios'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { Wishlist } from '../components/lists/Wishlist'
import { Collection } from '../components/lists/Collection'
import placeholder from '../assets/avatar-placeholder.png'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { RiPlantLine } from 'react-icons/ri'
import { AiOutlineStar } from 'react-icons/ai'
import { BiPlusCircle } from 'react-icons/bi'
import bee from '../assets/stickers/bee.svg'
import boot from '../assets/stickers/boot.svg'
import cactus from '../assets/stickers/cactus.svg'
import flower from '../assets/stickers/flower.svg'
import flowers from '../assets/stickers/flowers.svg'
import leaf from '../assets/stickers/leaf.svg'
import potted1 from '../assets/stickers/potted1.svg'
import potted2 from '../assets/stickers/potted2.svg'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const UserProfile = () => {
  const { currentUser } = useContext(UserContext)
  useDocumentTitle(
    `${currentUser.firstName} ${currentUser.lastName} (@${currentUser.username}) • plantgeek`
  )

  const [list, setList] = useState('collection')

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

  const { data: collection, status: collectionStatus } = useQuery(
    ['collection', currentUser.collection],
    async () => {
      try {
        const { data } = await axios.get(`${API_URL}/collection/${currentUser._id}`)
        return data.collection
      } catch (err) {
        return null
      }
    }
  )

  const { data: wishlist, status: wishlistStatus } = useQuery(
    ['wishlist', currentUser.wishlist],
    async () => {
      try {
        const { data } = await axios.get(`${API_URL}/wishlist/${currentUser._id}`)
        return data.wishlist
      } catch (err) {
        return null
      }
    }
  )

  const { data: contributions, status: contributionsStatus } = useQuery(
    ['contributions', currentUser._id],
    async () => {
      const { data } = await axios.get(`${API_URL}/contributions/${currentUser._id}`)
      return data.contributions
    }
  )

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
          <div className='profile'>
            <div className='profile-img'>
              <ImageLoader src={currentUser.imageUrl || placeholder} alt='' />
            </div>
            <div className='text'>
              <h1>
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className='username'>
                @{currentUser.username} {currentUser.role === 'admin' && '(Admin)'}
              </p>
              <p className='date'>Joined {moment(currentUser.joined).format('ll')}</p>
            </div>
          </div>
          <div className='stats'>
            <div className='stat'>
              <p className='label'>
                <RiPlantLine /> Collection
              </p>
              <p className='number'>{currentUser.collection.length}</p>
            </div>
            <div className='stat'>
              <p className='label'>
                <AiOutlineStar /> Wishlist
              </p>
              <p className='number'>{currentUser.wishlist.length}</p>
            </div>
            <div className='stat'>
              <p className='label'>
                <BiPlusCircle /> Contributions
              </p>
              <p className='number'>{approvedContributions.length}</p>
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <div className='lists'>
          <div className='list-toggle'>
            <button
              className={`toggle-btn ${list === 'collection' && 'active'}`}
              onClick={() => setList('collection')}>
              My Collection
            </button>
            <button
              className={`toggle-btn ${list === 'wishlist' && 'active'}`}
              onClick={() => setList('wishlist')}>
              My Wishlist
            </button>
          </div>
          {/* TODO: add more elegant handling for removing items from lists (use state to set list of plants from query, then remove from state and fade card out) */}
          {list === 'collection' && (
            <Collection user={currentUser} data={collection} status={collectionStatus} />
          )}
          {list === 'wishlist' && (
            <Wishlist user={currentUser} data={wishlist} status={wishlistStatus} />
          )}
        </div>
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
                      <Link
                        className='contribution-card'
                        to={`/plant/${plant.slug}`}
                        key={plant._id}>
                        <div className='thumbnail'>
                          <ImageLoader src={plant.imageUrl} alt={''} placeholder={placeholder} />
                        </div>
                        <div className='info'>
                          <p className='primary-name'>{plant.primaryName.toLowerCase()}</p>
                          <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {pendingContributions.length > 0 && (
                <div className='pending-contributions'>
                  <h3>pending ({pendingContributions.length})</h3>
                  <div className='plants'>
                    {pendingContributions.map(plant => (
                      <Link
                        className='contribution-card pending'
                        to={`/plant/${plant.slug}`}
                        key={plant._id}>
                        <div className='thumbnail'>
                          <ImageLoader src={plant.imageUrl} alt={''} placeholder={placeholder} />
                        </div>
                        <div className='info'>
                          <p className='primary-name'>{plant.primaryName.toLowerCase()}</p>
                          <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
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
    gap: 20px;
    .profile {
      display: flex;
      align-items: center;
      gap: 10px;
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
      .text {
        h1 {
          font-size: 1.2rem;
        }
        .username {
          font-weight: bold;
        }
        .date {
          font-size: 0.8rem;
        }
      }
    }
    .stats {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 5px 20px;
        .number {
          font-size: 1.8rem;
          font-weight: bold;
        }
        .label {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }
  }
  .lists {
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 20px;
    .list-toggle {
      background: ${COLORS.lightest};
      display: flex;
      align-items: center;
      gap: 10px;
      position: sticky;
      top: 50px;
      padding-top: 10px;
      z-index: 1;
      .toggle-btn {
        background: #ddd;
        flex: 1;
        border-radius: 10px 10px 0 0;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
        color: #999;
        &.active {
          background: #f4f4f4;
          color: ${COLORS.darkest};
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .user-info {
      flex-direction: row;
      justify-content: space-between;
      .profile {
        gap: 20px;
        .profile-img {
          height: 100px;
          width: 100px;
        }
      }
      .stats {
        .stat {
          gap: 20px;
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .user-info {
      align-items: center;
      .stats {
        flex-direction: row;
        gap: 20px;
        .stat {
          flex-direction: column-reverse;
          gap: 0;
          padding: 10px 20px;
        }
      }
    }
    .lists {
      .list-toggle {
        top: 0;
      }
    }
  }
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
    margin-top: 40px;
    .plants {
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      .contribution-card {
        width: 100%;
        border-top: 1px solid #e6e6e6;
        padding: 10px;
        display: flex;
        align-items: center;
        &:last-child {
          border-bottom: 1px solid #e6e6e6;
        }
        img {
          height: 75px;
          width: 75px;
          border-radius: 50%;
        }
        .info {
          margin-left: 10px;
          .primary-name {
            font-size: 1rem;
            font-weight: bold;
            color: #222;
          }
          .secondary-name {
            color: #999;
            font-size: 0.8rem;
            font-style: italic;
          }
        }
        &:hover {
          background: #f6f6f6;
          .info .primary-name {
            color: #222;
          }
        }
      }
    }
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    }
  }
  .no-contributions {
    margin-top: 20px;
    opacity: 0.5;
  }
`
