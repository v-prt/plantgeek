import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../reducers/userReducer'
import styled from 'styled-components/macro'
import { Collapse } from 'antd'
import { RightCircleOutlined } from '@ant-design/icons'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { PlantList } from '../components/lists/PlantList'
import placeholder from '../assets/avatar-placeholder.png'
import moment from 'moment'
const { Panel } = Collapse

export const UserProfile = () => {
  const users = useSelector(usersArray)
  const [user, setUser] = useState(undefined)
  const { username } = useParams()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [username])

  // TODO: react-query
  useEffect(() => {
    setUser(users.find(user => user.username === username))
  }, [users, user, username])

  return (
    <Wrapper>
      {user ? (
        <FadeIn>
          <section className='user-info'>
            <Image src={user.image ? user.image[0] : placeholder} alt='' />
            <div className='text'>
              <h1>{user.username}</h1>
              <p>Member since {moment(user.joined).format('ll')}</p>
            </div>
          </section>
          <Collapse
            accordion
            bordered={false}
            expandIcon={({ isActive }) => <RightCircleOutlined rotate={isActive ? 90 : 0} />}
            className='custom-collapse'>
            <Panel
              header={
                <div className='panel-header'>
                  <h2>collection</h2>
                  <p>{user.collection.length} plants</p>
                </div>
              }
              className='custom-panel'>
              <PlantList
                username={username}
                user={user}
                list={user.collection}
                title='Collection'
              />
            </Panel>
            <Panel
              header={
                <div className='panel-header'>
                  <h2>favorites</h2>
                  <p>{user.favorites.length} plants</p>
                </div>
              }
              className='custom-panel'>
              <PlantList username={username} user={user} list={user.favorites} title='Favorites' />
            </Panel>
            <Panel
              header={
                <div className='panel-header'>
                  <h2>wishlist</h2>
                  <p>{user.wishlist.length} plants</p>
                </div>
              }
              className='custom-panel'>
              <PlantList username={username} user={user} list={user.wishlist} title='Wishlist' />
            </Panel>
          </Collapse>
          <section className='contributions'>
            <h2>contributions</h2>
            {user.contributions?.length > 0 ? (
              <p>{user.contributions.length} contributions made!</p>
            ) : (
              <p>No contributions yet.</p>
            )}
          </section>
        </FadeIn>
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
    }
  }
  .custom-collapse {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    .custom-panel {
      .ant-collapse-header {
        display: flex;
        align-items: center;
        .anticon {
          font-size: 14px;
        }
        .panel-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        h2 {
          font-size: 1.2rem;
        }
      }
      .ant-collapse-content {
        background: #f2f2f2;
      }
    }
  }
  .contributions {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
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

const Lists = styled.div`
  display: flex;
  flex-direction: column;
`
