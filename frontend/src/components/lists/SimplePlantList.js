import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { usersArray } from '../../reducers/userReducer'
import { plantsArray } from '../../reducers/plantReducer.js'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import placeholder from '../../assets/plant-placeholder.svg'

export const SimplePlantList = ({ username, list, title }) => {
  const plants = useSelector(plantsArray)
  const users = useSelector(usersArray)
  const [user, setUser] = useState(undefined)
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    setUser(users.find((user) => user.username === username))
  }, [users, user, username])

  // SETS USER'S PLANTS TO ACCESS THEIR PLANTS' DATA
  const [userPlants, setUserPlants] = useState(undefined)
  useEffect(() => {
    if (user && plants && list && list.length > 0) {
      let tempArr = []
      list.forEach((id) => {
        tempArr.push(plants.find((plant) => plant._id === id))
      })
      setUserPlants(tempArr)
    } else {
      setUserPlants(undefined)
    }
    return () => {
      setUserPlants(undefined)
      setUser(undefined)
    }
  }, [setUser, list, plants, username, user, title])

  return (
    <Wrapper>
      {user && (
        <>
          <Heading to={`/user-${title}/${user.username}/`}>
            {currentUser && username === currentUser.username ? (
              <h2>
                <>your {title}</>
              </h2>
            ) : (
              <h2>their {title}</h2>
            )}
          </Heading>
          <Plants>
            {userPlants &&
              userPlants.map((plant) => {
                return (
                  <Plant key={plant._id}>
                    <InfoLink to={`/plant-profile/${plant?._id}`}>
                      {plant.imageUrl ? (
                        <img src={plant.imageUrl} alt='' />
                      ) : (
                        <img className='placeholder' src={placeholder} alt='' />
                      )}
                    </InfoLink>
                    <p className='name'>{plant.species}</p>
                  </Plant>
                )
              })}
          </Plants>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
`

const Heading = styled(Link)`
  background: ${COLORS.light};
  text-align: center;
  &:hover {
    color: #fff;
  }
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px;
`

const Plant = styled.div`
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  transition: 0.2s ease-in-out;
  p {
    font-size: 0.8rem;
    color: ${COLORS.darkest};
  }
  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`

const InfoLink = styled(Link)`
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  img {
    max-height: 100%;
    max-width: 100%;
    &.placeholder {
      height: 100px;
    }
  }
`
