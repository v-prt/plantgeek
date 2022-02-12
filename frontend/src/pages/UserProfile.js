import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
    setUser(users.find(user => user?.username === username))
  }, [users, user, username])

  return (
    <Wrapper>
      {user && (
        <FadeIn>
          <section className='user-info'>
            <Image src={user?.image ? user?.image[0] : placeholder} alt='' />
            <div className='text'>
              <h1>{user?.username}</h1>
              <p>Member since {moment(user?.joined).format('ll')}</p>
            </div>
          </section>
          <Lists>
            <DetailedPlantList username={username} list={user?.collection} title='collection' />
            <DetailedPlantList username={username} list={user?.favorites} title='favorites' />
            <DetailedPlantList username={username} list={user?.wishlist} title='wishlist' />
          </Lists>
          <section className='contributions'>
            <h2>my contributions</h2>
            {user?.contributions?.length > 0 ? (
              <p>
                You've made ${user.contributions.length} contributions! Thanks for your help in
                growing our database.
              </p>
            ) : (
              <p>
                You haven't made any contributions yet.{' '}
                <Link to='/contributions'>Help us grow our database.</Link>
              </p>
            )}
          </section>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-info {
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      text-align: center;
    }
  }
  .contributions {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    a {
      text-decoration: underline;
    }
  }
  @media only screen and (min-width: 500px) {
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
  background: linear-gradient(
    -45deg,
    ${COLORS.medium} 0%,
    ${COLORS.mediumLight} 25%,
    ${COLORS.mediumLight} 50%,
    ${COLORS.light} 75%,
    ${COLORS.lightest} 100%
  );
  height: 200px;
  width: 200px;
  border-radius: 50%;
  padding: 5px;
`

const Lists = styled.div`
  display: flex;
  flex-direction: column;
`
