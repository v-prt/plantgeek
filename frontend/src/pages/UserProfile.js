import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../reducers/userReducer'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import placeholder from '../assets/avatar-placeholder.png'
import moment from 'moment'

import { DetailedPlantList } from '../components/lists/DetailedPlantList'
// import { Friends } from '../components/Friends'

export const UserProfile = () => {
  const users = useSelector(usersArray)
  const [user, setUser] = useState([])
  const { username } = useParams()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [username])

  useEffect(() => {
    setUser(users.find((user) => user.username === username))
  }, [users, user, username])

  return (
    <Wrapper>
      {user && (
        <FadeIn>
          <Div>
            <Avatar src={user.image ? user.image[0] : placeholder} alt='' />
            <h1>{user.username}</h1>
            <p>Member since {moment(user.joined).format('ll')}</p>
            <Lists>
              {user.collection && (
                <DetailedPlantList username={username} list={user.collection} title='collection' />
              )}
              {user.favorites && (
                <DetailedPlantList username={username} list={user.favorites} title='favorites' />
              )}
              {user.wishlist && (
                <DetailedPlantList username={username} list={user.wishlist} title='wishlist' />
              )}
            </Lists>
            {/* <Friends /> */}
          </Div>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const Div = styled.div`
  width: 100%;
  position: relative;
  top: -70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  border: 5px solid ${COLORS.light};
  padding: 5px;
`

const Lists = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
