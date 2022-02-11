import React, { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestUsers, receiveUsers } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBar = ({ id }) => {
  const dispatch = useDispatch()
  const { getUser, currentUser } = useContext(UserContext)
  const plants = useSelector(plantsArray)
  const [plant, setPlant] = useState(undefined)
  const [inCollection, setInCollection] = useState(false)
  const [inFavorites, setInFavorites] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  // FIXME: need to improve loading state of action buttons (don't use set timeout)
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

  useEffect(() => {
    if (currentUser && plant) {
      setInCollection(currentUser.collection.find((id) => id === plant._id))
      setInFavorites(currentUser.favorites.find((id) => id === plant._id))
      setInWishlist(currentUser.wishlist.find((id) => id === plant._id))
    }
  }, [currentUser, plant])

  const handleList = (list) => {
    let data
    if (list === currentUser.collection) {
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
    if (list && list.find((id) => id === plant._id)) {
      // REMOVES PLANT
      // FIXME: use axios
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Removed ${plant.primaryName} from user's list!`)
          // FIXME: updating store causes plants to reload (use react query instead?)
          dispatch(requestUsers())
          axios
            .get('/users')
            .then((res) => dispatch(receiveUsers(res.data.data)))
            .catch((err) => console.log(err))
          getUser(currentUser._id)
        } else if (res.status === 404) {
          console.log('Something went wrong')
        }
      })
    } else {
      // ADDS PLANT
      // FIXME: use axios
      fetch(`/${currentUser.username}/add`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Added ${plant.primaryName} to user's list!`)
          // FIXME: updating store causes plants to reload (use react query instead?)
          dispatch(requestUsers())
          axios
            .get('/users')
            .then((res) => dispatch(receiveUsers(res.data.data)))
            .catch((err) => console.log(err))
          getUser(currentUser._id)
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
          <Action
            aria-label='collect'
            onClick={() => handleList(currentUser.collection)}
            disabled={clicked1}
            added={inCollection}>
            <RiPlantLine />
          </Action>
          <Action
            aria-label='favorite'
            onClick={() => handleList(currentUser.favorites)}
            disabled={clicked2}
            added={inFavorites}>
            <TiHeartOutline />
          </Action>
          <Action
            aria-label='wishlist'
            onClick={() => handleList(currentUser.wishlist)}
            disabled={clicked3}
            added={inWishlist}>
            <AiOutlineStar />
          </Action>
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
  display: grid;
  place-content: center;
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
    pointer-events: none;
    background: ${COLORS.light};
    color: #000;
    opacity: 100%;
  }
`
