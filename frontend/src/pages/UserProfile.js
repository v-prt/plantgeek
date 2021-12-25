import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../reducers/userReducer'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import background from '../assets/monstera-bg.jpg'
import placeholder from '../assets/avatar-placeholder.png'
import moment from 'moment'
import { SimplePlantList } from '../components/lists/SimplePlantList'
import { Friends } from '../components/Friends'

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
      <Banner />
      {user && (
        <Div>
          <Avatar src={user.image ? user.image[0] : placeholder} alt='' />
          <Name>{user.username}</Name>
          <Joined>Member since {moment(user.joined).format('ll')}</Joined>
          <Lists>
            {user.collection && user.collection.length > 0 && (
              <SimplePlantList username={username} list={user.collection} title='collection' />
            )}
            {user.favorites && user.favorites.length > 0 && (
              <SimplePlantList username={username} list={user.favorites} title='favorites' />
            )}
            {user.wishlist && user.wishlist.length > 0 && (
              <SimplePlantList username={username} list={user.wishlist} title='wishlist' />
            )}
          </Lists>
          <Friends />
        </Div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.dark};
  color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
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

const Name = styled.h1``

const Joined = styled.p``

const Lists = styled.section`
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
`