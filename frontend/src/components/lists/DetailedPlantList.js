import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../../reducers/userReducer'
import { plantsArray } from '../../reducers/plantReducer'
import { UserContext } from '../../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, Switch } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { MdOutlineArrowDropDownCircle } from 'react-icons/md'

export const DetailedPlantList = ({ title }) => {
  const plants = useSelector(plantsArray)
  const users = useSelector(usersArray)
  const [user, setUser] = useState(undefined)
  const [list, setList] = useState(undefined)
  const { username } = useParams()
  const { currentUser } = useContext(UserContext)
  const [viewContent, setViewContent] = useState(false)
  const [viewNeeds, setViewNeeds] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setUser(users.find((user) => user.username === username))
  }, [users, user, username])

  useEffect(() => {
    if (user) {
      setList(user[title])
    }
  }, [title, user])

  // SETS USER'S PLANTS TO ACCESS THEIR PLANTS' DATA
  const [userPlants, setUserPlants] = useState(undefined)
  useEffect(() => {
    if (plants && list && list.length > 0) {
      let foundPlants = []
      list.forEach((id) => {
        // don't include IDs that aren't found in plant db
        if (plants.find((plant) => plant._id === id)) {
          foundPlants.push(plants.find((plant) => plant._id === id))
        } else return
      })
      setUserPlants(foundPlants)
    } else {
      setUserPlants(undefined)
    }
  }, [list, plants])

  return (
    <Wrapper>
      {user && (
        <FadeIn>
          <Heading onClick={() => setViewContent(!viewContent)}>
            <h2 className='title'>
              <DropDownArrow rotated={viewContent}>
                <MdOutlineArrowDropDownCircle />
              </DropDownArrow>
              {title}
            </h2>
            <span className='num-plants'>
              {user[title].length} plant{user[title].length === 1 ? '' : 's'}
            </span>
          </Heading>
          <Content expanded={viewContent}>
            {user[title] && user[title].length > 0 ? (
              <>
                <div className='filter-bar'>
                  <div className='toggle-wrapper'>
                    <span className='toggle-option'>Detailed view</span>
                    <Switch>
                      <input
                        id='needs-toggle'
                        type='checkbox'
                        onChange={(ev) => setViewNeeds(ev.target.checked)}
                      />
                      <span className='slider'></span>
                    </Switch>
                  </div>
                </div>
                <Plants>
                  {user &&
                    userPlants?.length > 0 &&
                    userPlants.map((plant) => {
                      return <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />
                    })}
                </Plants>
              </>
            ) : currentUser && user.username === currentUser.username ? (
              <Alert>
                {title === 'collection' && (
                  <p className='msg'>
                    Your collection is empty. <Link to='/browse'>Find plants</Link> you own and add
                    them here!
                  </p>
                )}
                {title === 'favorites' && (
                  <p className='msg'>
                    You have no favorite plants. <Link to='/browse'>Find plants</Link> you love and
                    add them here!
                  </p>
                )}
                {title === 'wishlist' && (
                  <p className='msg'>
                    Your wishlist is empty. <Link to='/browse'>Find plants</Link> you want and add
                    them here!
                  </p>
                )}
              </Alert>
            ) : (
              <Alert>
                {title === 'collection' && (
                  <p className='msg'>{user.username}'s collection is empty</p>
                )}
                {title === 'favorites' && (
                  <p className='msg'>{user.username} has no favorite plants</p>
                )}
                {title === 'wishlist' && <p className='msg'>{user.username}'s wishlist is empty</p>}
              </Alert>
            )}
          </Content>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
`

const Heading = styled.div`
  background: ${COLORS.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    background: ${COLORS.mediumLight};
  }
  .title {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .num-plants {
    margin-left: 10px;
  }
`

const Content = styled.div`
  visibility: ${(props) => (props.expanded ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.expanded ? '1' : '0')};
  max-height: ${(props) => (props.expanded ? '1000px' : '0')};
  padding: ${(props) => (props.expanded ? '10px' : '')};
  overflow: hidden;
  transition: 0.3s ease-in-out;
  .filter-bar {
    box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
    padding: 0 20px 10px 20px;
    margin-bottom: 10px;
    .toggle-wrapper {
      background: #fff;
      width: fit-content;
      display: flex;
      align-items: center;
      border-radius: 20px;
      padding: 5px 10px;
      .toggle-option {
        margin-right: 20px;
        line-height: 1;
      }
    }
  }
`

const DropDownArrow = styled.span`
  display: grid;
  margin-right: 10px;
  transform: ${(props) => (props.rotated ? '' : 'rotate(-90deg)')};
  transition: 0.2s ease-in-out;
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const Alert = styled.div`
  .msg {
    text-align: center;
    a {
      text-decoration: underline;
    }
  }
`
