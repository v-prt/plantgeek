import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../reducers/userReducer'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { DetailedPlantList } from '../components/lists/DetailedPlantList'
import placeholder from '../assets/avatar-placeholder.png'
import moment from 'moment'

export const UserProfile = () => {
  const users = useSelector(usersArray)
  const [user, setUser] = useState([])
  const { username } = useParams()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [username])

  useEffect(() => {
    setUser(users.find((user) => user?.username === username))
  }, [users, user, username])

  return (
    <Wrapper>
      {user && (
        <FadeIn>
          <div className='user-info'>
            <Avatar src={user?.image ? user?.image[0] : placeholder} alt='' />
            <div className='text'>
              <h1>{user?.username}</h1>
              <p>Member since {moment(user?.joined).format('ll')}</p>
            </div>
          </div>
          <Lists>
            <DetailedPlantList username={username} list={user?.collection} title='collection' />
            <DetailedPlantList username={username} list={user?.favorites} title='favorites' />
            <DetailedPlantList username={username} list={user?.wishlist} title='wishlist' />
          </Lists>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 190px);
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .text {
      margin-left: 30px;
    }
  }
`

export const Avatar = styled.img`
  background: linear-gradient(
    -45deg,
    ${COLORS.medium} 0%,
    ${COLORS.mediumLight} 25%,
    ${COLORS.mediumLight} 50%,
    ${COLORS.light} 75%,
    ${COLORS.lightest} 100%
  );
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 150px;
  width: 150px;
  border-radius: 50%;
  padding: 5px;
  @media only screen and (min-width: 500px) {
    height: 200px;
    width: 200px;
  }
`

const Lists = styled.div`
  display: flex;
  flex-direction: column;
`
