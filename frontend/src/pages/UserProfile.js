import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import moment from 'moment'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ListWrapper, PlantList } from '../components/lists/PlantList'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import placeholder from '../assets/avatar-placeholder.png'

export const UserProfile = () => {
  const { id } = useParams()
  // const { currentUser } = useContext(UserContext)

  const { data: user } = useQuery('user', async () => {
    const { data } = await axios.get(`/users/${id}`)
    return data.user
  })

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Wrapper>
      {user ? (
        <>
          <FadeIn>
            <section className='user-info'>
              <Image src={user.image ? user.image[0] : placeholder} alt='' />
              <div className='text'>
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <p className='username'>{user.username}</p>
                <p>Member since {moment(user.joined).format('ll')}</p>
              </div>
            </section>
          </FadeIn>
          <FadeIn delay={200}>
            {user.collection.length > 0 ? (
              <PlantList user={user} list={user.collection} title='collection' />
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
                    <p className='empty'>No plants in collection.</p>
                  </div>
                </FadeIn>
              </ListWrapper>
            )}
          </FadeIn>
          <FadeIn delay={300}>
            {user.favorites.length > 0 ? (
              <PlantList user={user} list={user.favorites} title='favorites' />
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
                    <p className='empty'>No plants in favorites.</p>
                  </div>
                </FadeIn>
              </ListWrapper>
            )}
          </FadeIn>
          <FadeIn delay={400}>
            {user.wishlist.length > 0 ? (
              <PlantList user={user} list={user.wishlist} title='wishlist' />
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
                    <p className='empty'>No plants in wishlist.</p>
                  </div>
                </FadeIn>
              </ListWrapper>
            )}
          </FadeIn>
          <FadeIn delay={500}>
            <section className='contributions'>
              <h2>contributions</h2>
              {user.contributions?.length > 0 ? (
                <p>{user.contributions.length} contributions made!</p>
              ) : (
                <p>No contributions yet.</p>
              )}
            </section>
          </FadeIn>
        </>
      ) : (
        <BeatingHeart />
      )}
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
  .contributions {
    background: #fff;
    a {
      text-decoration: underline;
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
