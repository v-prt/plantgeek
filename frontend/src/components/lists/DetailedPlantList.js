import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../../reducers/userReducer'
import { plantsArray } from '../../reducers/plantReducer.js'
import { LoginContext } from '../../context/LoginContext'

import styled from 'styled-components/macro'
import background from '../../assets/monstera-bg.jpg'
import { COLORS } from '../../GlobalStyles'
import { ImDroplet } from 'react-icons/im'
import { RiTempColdFill, RiCloudWindyLine, RiPlantLine } from 'react-icons/ri'
import { FaSun, FaPaw, FaSkullCrossbones } from 'react-icons/fa'
import { TiHeartOutline } from 'react-icons/ti'
import { MdStarBorder } from 'react-icons/md'

import { ActionBar } from '../ActionBar'
import { FeaturedPlants } from '../FeaturedPlants'

export const DetailedPlantList = ({ title }) => {
  const plants = useSelector(plantsArray)
  const users = useSelector(usersArray)
  const [user, setUser] = useState(undefined)
  const [list, setList] = useState(undefined)
  const { username } = useParams()
  const { currentUser } = useContext(LoginContext)

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
      let tempArr = []
      list.forEach((id) => {
        tempArr.push(plants.find((plant) => plant._id === id))
      })
      setUserPlants(tempArr)
    } else {
      setUserPlants(undefined)
    }
  }, [list, plants])

  return (
    <Wrapper>
      <Banner />
      {user && (
        <>
          <Heading>
            {currentUser && user.username === currentUser.username ? (
              <>your {title}</>
            ) : (
              <>
                {user.username}'s {title}
              </>
            )}
          </Heading>
          {user[title] && user[title].length > 0 ? (
            <Plants>
              {user &&
                userPlants &&
                userPlants.map((plant) => {
                  return (
                    <Plant key={plant._id}>
                      <Div>
                        {plant.toxic ? (
                          <Toxicity toxic={true}>
                            <FaSkullCrossbones />
                          </Toxicity>
                        ) : (
                          <Toxicity toxic={false}>
                            <FaPaw />
                          </Toxicity>
                        )}
                        <InfoLink to={`/plant-profile/${plant._id}`}>
                          <img src={plant.image} alt={plant.name} />
                        </InfoLink>
                        <Name>{plant.name}</Name>
                      </Div>
                      <Needs>
                        <Row>
                          <FaSun />
                          <Bar>
                            {plant.light === 'low to bright indirect' && (
                              <Indicator level={'1-3'} />
                            )}
                            {plant.light === 'medium indirect' && <Indicator level={'2'} />}
                            {plant.light === 'medium to bright indirect' && (
                              <Indicator level={'2-3'} />
                            )}
                            {plant.light === 'bright indirect' && <Indicator level={'3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          <ImDroplet />
                          <Bar>
                            {plant.water === 'low' && <Indicator level={'1'} />}
                            {plant.water === 'low to medium' && <Indicator level={'1-2'} />}
                            {plant.water === 'medium' && <Indicator level={'2'} />}
                            {plant.water === 'medium to high' && <Indicator level={'2-3'} />}
                            {plant.water === 'high' && <Indicator level={'3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          <RiTempColdFill />
                          <Bar>
                            {plant.temperature === 'average' && <Indicator level={'1-2'} />}
                            {plant.temperature === 'above average' && <Indicator level={'2-3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          <RiCloudWindyLine />
                          <Bar>
                            {plant.humidity === 'average' && <Indicator level={'1-2'} />}
                            {plant.humidity === 'above average' && <Indicator level={'2-3'} />}
                          </Bar>
                        </Row>
                      </Needs>
                      <ActionBar id={plant._id} />
                    </Plant>
                  )
                })}
            </Plants>
          ) : (
            <Alert>
              {title === 'collection' && (
                <>
                  <p>Your collection is empty! Do you have any of these plants?</p>
                  <Info>
                    <Icon>
                      <RiPlantLine />
                    </Icon>
                    Add it to your collection
                  </Info>
                </>
              )}
              {title === 'favorites' && (
                <>
                  <p>You have no favorite plants! Do you love any of these plants?</p>
                  <Info>
                    <Icon>
                      <TiHeartOutline />
                    </Icon>
                    Add it to your favorites
                  </Info>
                </>
              )}
              {title === 'wishlist' && (
                <>
                  <p>Your wishlist is empty! Do you want any of these plants?</p>
                  <Info>
                    <Icon>
                      <MdStarBorder />
                    </Icon>
                    Add it to your wishlist
                  </Info>
                </>
              )}
              <FeaturedPlants />
            </Alert>
          )}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid ${COLORS.light};
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

const Plant = styled.div`
  background: #fff;
  width: 250px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  transition: 0.2s ease-in-out;
  img {
    height: 150px;
    width: 150px;
    align-self: center;
  }
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 5px ${COLORS.light};
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLink = styled(Link)`
  display: flex;
  justify-content: center;
`

const Name = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  align-self: center;
  margin: 5px 0;
`

const Toxicity = styled.div`
  color: ${(props) => (props.toxic ? `${COLORS.medium}` : '#68b234}')};
  position: absolute;
  background: ${COLORS.lightest};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Needs = styled.div`
  padding: 0 20px 10px 20px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`

const Bar = styled.div`
  background: #f2f2f2;
  height: 20px;
  flex: 1;
  margin-left: 5px;
  border-radius: 10px;
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light});
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.level === '1' && '20%'};
  width: ${(props) => props.level === '1-2' && '50%'};
  width: ${(props) => props.level === '1-3' && '100%'};
  width: ${(props) => props.level === '2' && '50%'};
  width: ${(props) => props.level === '2-3' && '80%'};
  width: ${(props) => props.level === '3' && '100%'};
`

const Alert = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    text-align: center;
    margin: 20px;
  }
`

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const Icon = styled.div`
  background: ${COLORS.light};
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin: 0 10px;
  border-radius: 50%;
  padding: 5px;
`
