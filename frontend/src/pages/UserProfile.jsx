import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_URL } from '../constants.js'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext.jsx'
import moment from 'moment'
import axios from 'axios'
import styled from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'
import { COLORS, BREAKPOINTS } from '../GlobalStyles.js'
import { FadeIn } from '../components/loaders/FadeIn.jsx'
import { ImageLoader } from '../components/loaders/ImageLoader.jsx'
import { PlantList } from '../components/lists/PlantList.jsx'
import placeholder from '../assets/avatar-placeholder.png'
import bee from '../assets/stickers/bee.svg'
import boot from '../assets/stickers/boot.svg'
import cactus from '../assets/stickers/cactus.svg'
import flower from '../assets/stickers/flower.svg'
import flowers from '../assets/stickers/flowers.svg'
import leaf from '../assets/stickers/leaf.svg'
import potted1 from '../assets/stickers/potted1.svg'
import potted2 from '../assets/stickers/potted2.svg'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { Contributions } from '../components/lists/Contributions.jsx'

export const UserProfile = () => {
  const { currentUser } = useContext(UserContext)
  useDocumentTitle(
    `${currentUser.firstName} ${currentUser.lastName} (@${currentUser.username}) • plantgeek`
  )

  const [tab, setTab] = useState('collection')

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

  // TODO: pagination for collection, wishlist
  const { data: collection, status: collectionStatus } = useQuery(
    ['collection', currentUser.plantCollection],
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
    ['wishlist', currentUser.plantWishlist],
    async () => {
      try {
        const { data } = await axios.get(`${API_URL}/wishlist/${currentUser._id}`)
        return data.wishlist
      } catch (err) {
        return null
      }
    }
  )

  if (!currentUser) return <Navigate to='/signup' />

  return (
    <Wrapper>
      <FadeIn>
        <section className='user-info'>
          <div className='profile-img'>
            <ImageLoader src={currentUser.imageUrl || placeholder} alt='' borderRadius='50%' />
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
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <div className='lists'>
          <div className='tab-toggle'>
            <button
              className={`toggle-btn ${tab === 'collection' && 'active'}`}
              onClick={() => setTab('collection')}
            >
              Collection{' '}
              {collectionStatus === 'success' ? (
                `(${collection?.length})`
              ) : (
                <LoadingOutlined spin style={{ color: '#999' }} />
              )}
            </button>
            <button
              className={`toggle-btn ${tab === 'wishlist' && 'active'}`}
              onClick={() => setTab('wishlist')}
            >
              Wishlist{' '}
              {wishlistStatus === 'success' ? (
                `(${wishlist?.length})`
              ) : (
                <LoadingOutlined spin style={{ color: '#999' }} />
              )}
            </button>
          </div>
          {tab === 'collection' && (
            <PlantList user={currentUser} data={collection} status={collectionStatus} />
          )}
          {tab === 'wishlist' && (
            <PlantList user={currentUser} data={wishlist} status={wishlistStatus} />
          )}
        </div>
      </FadeIn>
      <FadeIn delay={500}>
        <ContributionsSection>
          <h2>contributions</h2>
          <p>Earn badges by submitting new houseplant information to our database!</p>
          <div className='inner'>
            <div className='badges'>
              {badges.map(badge => (
                <div
                  className={`badge ${currentUser.contributions >= badge.value && 'earned'} `}
                  key={badge.name}
                >
                  <img src={badge.name} alt='' />
                  <span className='value'>{badge.value}</span>
                </div>
              ))}
            </div>
            <Contributions currentUser={currentUser} reviewStatus='approved' />
            <Contributions currentUser={currentUser} reviewStatus='pending' />
          </div>
        </ContributionsSection>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-info {
    background: linear-gradient(45deg, #a4e17d, #95d190);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
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
        font-size: 1.4rem;
      }
      .username {
        font-weight: bold;
      }
      .date {
        font-size: 0.8rem;
      }
    }
  }
  .lists {
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 20px;
    .tab-toggle {
      display: flex;
      gap: 10px;
      .toggle-btn {
        width: 100%;
        max-width: 150px;
        background: #ddd;
        border-radius: 10px 10px 0 0;
        padding: 10px 20px;
        font-weight: bold;
        color: #999;
        transition: 0.2s ease-in-out;
        &:hover {
          color: #666;
        }
        &.active {
          background: #f4f4f4;
          color: ${COLORS.darkest};
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .user-info {
      padding: 30px;
      gap: 20px;
      .profile-img {
        height: 100px;
        width: 100px;
      }
      .text {
        h1 {
          font-size: 1.5rem;
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .user-info {
      padding: 40px;
      .profile-img {
        height: 150px;
        width: 150px;
      }
      .text {
        h1 {
          font-size: 1.6rem;
        }
      }
    }
  }
`

const ContributionsSection = styled.section`
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
`
