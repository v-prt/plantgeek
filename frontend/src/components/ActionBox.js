import React, { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestUsers, receiveUsers } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBox = ({ id }) => {
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
    setPlant(plants.find(plant => plant._id === id))
    // CLEANUP - PREVENTS MEMORY LEAK
    return () => {
      setPlant(undefined)
    }
  }, [plants, id])

  useEffect(() => {
    if (currentUser && plant) {
      setInCollection(currentUser.collection.find(id => id === plant._id))
      setInFavorites(currentUser.favorites.find(id => id === plant._id))
      setInWishlist(currentUser.wishlist.find(id => id === plant._id))
    }
  }, [currentUser, plant])

  const handleList = list => {
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
    if (list && list.find(id => id === plant._id)) {
      // REMOVES PLANT
      // FIXME: use axios
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then(res => {
        if (res.status === 200) {
          console.log(`Removed ${plant.primaryName} from user's list!`)
          // FIXME: updating store causes plants to reload (use react query instead?)
          dispatch(requestUsers())
          axios
            .get('/users')
            .then(res => dispatch(receiveUsers(res.data.data)))
            .catch(err => console.log(err))
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
      }).then(res => {
        if (res.status === 200) {
          console.log(`Added ${plant.primaryName} to user's list!`)
          // FIXME: updating store causes plants to reload (use react query instead?)
          dispatch(requestUsers())
          axios
            .get('/users')
            .then(res => dispatch(receiveUsers(res.data.data)))
            .catch(err => console.log(err))
          getUser(currentUser._id)
        } else if (res.status === 404) {
          console.log('Something went wrong')
        }
      })
    }
  }

  return (
    <Wrapper>
      <div className='action-wrapper'>
        <Action
          aria-label='collect'
          disabled={clicked1}
          added={inCollection}
          onClick={() => handleList(currentUser.collection)}>
          <RiPlantLine />
          <span>Have it</span>
        </Action>
        <p>Do you own this plant?</p>
        <p>
          Keep track of your personal houseplant collection and see an overview of their needs via
          your profile.
        </p>
      </div>
      <div className='action-wrapper'>
        <Action
          className='wishlist'
          aria-label='wishlist'
          onClick={() => handleList(currentUser.wishlist)}
          disabled={clicked3}
          added={inWishlist}>
          <AiOutlineStar />
          <span>Want it</span>
        </Action>
        <p>Found an awesome new plant?</p>
        <p>Add it to your wishlist and look out for it next time you go plant shopping!</p>
        <p className='disclaimer'>
          *Disclaimer: we are not responsible for any debts that may incur from excessive plant
          shopping
        </p>
      </div>
      <div className='action-wrapper'>
        <Action
          className='favorite'
          aria-label='favorite'
          onClick={() => handleList(currentUser.favorites)}
          disabled={clicked2}
          added={inFavorites}>
          <TiHeartOutline />
          <span>Love it</span>
        </Action>
        <p>Is this one of your favorite plants?</p>
        <p>
          Upvote it and save it to your favorites!{' '}
          <Link to='/browse'>Browse most popular plants</Link>
        </p>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  place-content: center;
  grid-gap: 20px;
  margin: 20px;
  .action-wrapper {
    min-width: 200px;
    max-width: 300px;
    background: #fff;
    flex: 1;
    padding: 20px;
    border-radius: 20px;
    border: 1px dotted #ccc;
    p {
      margin: 10px 0;
    }
    a {
      text-decoration: underline;
    }
    .disclaimer {
      font-size: 0.8rem;
      color: #666;
    }
  }
  @media only screen and (min-width: 500px) {
    grid-gap: 30px;
  }
  @media only screen and (min-width: 1200px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const Action = styled.button`
  width: 100%;
  background: ${props => (props.added ? `${COLORS.light}` : '#d9d9d9')};
  color: #000;
  opacity: ${props => (props.added ? '1' : '0.5')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
  padding: 0 20px;
  border-radius: 20px;
  span {
    margin-left: 10px;
  }
  &:hover,
  &:focus,
  &:disabled {
    background: ${COLORS.light};
    color: #000;
    opacity: 0.5;
  }
  &:disabled {
    pointer-events: none;
  }
  &.wishlist {
    background: ${props => (props.added ? '#ffd24d' : '#d9d9d9')};
    &:hover,
    &:focus,
    &:disabled {
      background: #ffd24d;
    }
  }
  &.favorite {
    background: ${props => (props.added ? '#b493e6' : '#d9d9d9')};
    &:hover,
    &:focus,
    &:disabled {
      background: #b493e6;
    }
  }
`
