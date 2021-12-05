import React, { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LoginContext } from '../context/LoginContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestUsers, receiveUsers } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBar = ({ id }) => {
  const dispatch = useDispatch()
  const { currentUser } = useContext(LoginContext)
  const plants = useSelector(plantsArray)
  const [plant, setPlant] = useState(undefined)
  const [clicked1, setClicked1] = useState(false)
  const [clicked2, setClicked2] = useState(false)
  const [clicked3, setClicked3] = useState(false)

  useEffect(() => {
    setPlant(plants.find((plant) => plant._id === id))
    // CLEANUP - PREVENTS MEMORY LEAK
    return () => {
      setPlant(undefined)
    }
  }, [plants, id])

  const handleList = (list) => {
    let data
    if (list === currentUser.collection) {
      // prevents spam
      setClicked1(true)
      setTimeout(() => {
        setClicked1(false)
      }, 3000)
      data = { collection: plant._id }
    } else if (list === currentUser.favorites) {
      setClicked2(true)
      setTimeout(() => {
        setClicked2(false)
      }, 3000)
      data = { favorites: plant._id }
    } else if (list === currentUser.wishlist) {
      setClicked3(true)
      setTimeout(() => {
        setClicked3(false)
      }, 3000)
      data = { wishlist: plant._id }
    }
    if (list && list.find((el) => el === plant._id)) {
      // REMOVES PLANT
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Removed ${plant.species} from user's list!`)
          dispatch(requestUsers())
          fetch('/users')
            .then((res) => res.json())
            .then((json) => {
              dispatch(receiveUsers(json.data))
            })
            .catch((err) => {
              console.log(err)
            })
        } else if (res.status === 404) {
          console.log('Something went wrong')
        }
      })
    } else {
      // ADDS PLANT
      fetch(`/${currentUser.username}/add`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Added ${plant.species} to user's list!`)
          dispatch(requestUsers())
          fetch('/users')
            .then((res) => res.json())
            .then((json) => {
              dispatch(receiveUsers(json.data))
            })
            .catch((err) => {
              console.log(err)
            })
        } else if (res.status === 404) {
          console.log('Something went wrong')
        }
      })
    }
  }

  return (
    <>
      {currentUser && plant && (
        <Wrapper>
          <>
            {/* FIXME: change action buttons into checkboxes? need to fix issue with featured/filtered plants list reloading after action */}
            <Action
              onClick={() => handleList(currentUser.collection)}
              disabled={clicked1}
              added={
                currentUser.collection && currentUser.collection.find((el) => el === plant._id)
              }>
              <RiPlantLine />
            </Action>
            <Action
              onClick={() => handleList(currentUser.favorites)}
              disabled={clicked2}
              added={currentUser.favorites && currentUser.favorites.find((el) => el === plant._id)}>
              <TiHeartOutline />
            </Action>
            <Action
              onClick={() => handleList(currentUser.wishlist)}
              disabled={clicked3}
              added={currentUser.wishlist && currentUser.wishlist.find((el) => el === plant._id)}>
              <AiOutlineStar />
            </Action>
          </>
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  background: #f2f2f2;
  width: 90%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-self: center;
  margin: 5px 0;
  border-radius: 20px;
  padding: 5px;
`

const Action = styled.button`
  background: ${(props) => (props.added ? `${COLORS.light}` : '')};
  color: #000;
  opacity: ${(props) => (props.added ? '100%' : '30%')};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding-top: 5px;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 1.3rem;
  &:hover {
    background: ${COLORS.light};
    opacity: 100%;
  }
  &:focus {
    background: ${COLORS.light};
    opacity: 100%;
  }
  &:disabled {
    background: ${COLORS.light};
    color: #000;
    opacity: 100%;
  }
`
