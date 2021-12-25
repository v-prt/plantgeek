import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usersArray } from '../../reducers/userReducer'
import { plantsArray } from '../../reducers/plantReducer.js'
import { UserContext } from '../../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn.js'
import { FaPaw } from 'react-icons/fa'
import placeholder from '../../assets/plant-placeholder.svg'
import skull from '../../assets/skull.svg'
import sun from '../../assets/sun.svg'
import water from '../../assets/water.svg'
import temp from '../../assets/temp.svg'
import humidity from '../../assets/humidity.svg'

import { ActionBar } from '../ActionBar'
import { FeaturedPlants } from '../FeaturedPlants'

export const DetailedPlantList = ({ title }) => {
  const plants = useSelector(plantsArray)
  const users = useSelector(usersArray)
  const [user, setUser] = useState(undefined)
  const [list, setList] = useState(undefined)
  const { username } = useParams()
  const { currentUser } = useContext(UserContext)

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
      {user && (
        <FadeIn>
          <Heading>
            {currentUser && user.username === currentUser.username ? (
              <>
                your {title} - {user[title].length} plants
              </>
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
                    <Plant key={plant?._id}>
                      <Div>
                        {plant?.toxic ? (
                          <Toxicity toxic={true}>
                            <img src={skull} alt='toxic' />
                          </Toxicity>
                        ) : (
                          <Toxicity toxic={false}>
                            <FaPaw />
                          </Toxicity>
                        )}
                        <InfoLink to={`/plant-profile/${plant?._id}`}>
                          {plant?.imageUrl ? (
                            <img src={plant.imageUrl} alt='' />
                          ) : (
                            <img className='placeholder' src={placeholder} alt='' />
                          )}
                        </InfoLink>
                        <Name>{plant?.species}</Name>
                      </Div>
                      <Needs>
                        <Row>
                          {/* <FaSun /> */}
                          <img src={sun} alt='light' />
                          <Bar>
                            {plant?.light === 'low to bright indirect' && <Indicator level={'2'} />}
                            {plant?.light === 'medium indirect' && <Indicator level={'2'} />}
                            {plant?.light === 'medium to bright indirect' && (
                              <Indicator level={'2-3'} />
                            )}
                            {plant?.light === 'bright indirect' && <Indicator level={'3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          {/* <ImDroplet /> */}
                          <img src={water} alt='water' />
                          <Bar>
                            {plant?.water === 'low' && <Indicator level={'1'} />}
                            {plant?.water === 'low to medium' && <Indicator level={'1-2'} />}
                            {plant?.water === 'medium' && <Indicator level={'2'} />}
                            {plant?.water === 'medium to high' && <Indicator level={'2-3'} />}
                            {plant?.water === 'high' && <Indicator level={'3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          {/* <RiTempColdFill /> */}
                          <img src={temp} alt='temperature' />
                          <Bar>
                            {plant?.temperature === 'average' && <Indicator level={'1-2'} />}
                            {plant?.temperature === 'above average' && <Indicator level={'2-3'} />}
                          </Bar>
                        </Row>
                        <Row>
                          {/* <RiCloudWindyLine /> */}
                          <img src={humidity} alt='humidity' />
                          <Bar>
                            {plant?.humidity === 'average' && <Indicator level={'1-2'} />}
                            {plant?.humidity === 'above average' && <Indicator level={'2-3'} />}
                          </Bar>
                        </Row>
                      </Needs>
                      <ActionBar id={plant?._id} />
                    </Plant>
                  )
                })}
            </Plants>
          ) : (
            <Alert>
              {title === 'collection' && <p className='msg'>Your collection is empty</p>}
              {title === 'favorites' && <p className='msg'>You have no favorite plants</p>}
              {title === 'wishlist' && <p className='msg'>Your wishlist is empty</p>}
              <FeaturedPlants />
            </Alert>
          )}
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLink = styled(Link)`
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  img {
    max-height: 100%;
    max-width: 100%;
    &.placeholder {
      height: 150px;
    }
  }
`

const Name = styled.p`
  font-size: 1.1rem;
  align-self: center;
  margin: 5px 0;
`

const Toxicity = styled.div`
  color: ${COLORS.light};
  position: absolute;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-items: center;
  img {
    width: 20px;
  }
`

const Needs = styled.div`
  padding: 0 10px 10px 10px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  img {
    height: 25px;
  }
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
  .msg {
    text-align: center;
    margin: 20px;
  }
`
