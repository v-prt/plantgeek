import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBar = ({ plantId }) => {
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)
  const [inCollection, setInCollection] = useState(false)
  const [inFavorites, setInFavorites] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  // FIXME: need to improve loading state of action buttons (don't use set timeout)
  const [clicked1, setClicked1] = useState(false)
  const [clicked2, setClicked2] = useState(false)
  const [clicked3, setClicked3] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setInCollection(currentUser.collection.find(id => id === plantId))
      setInFavorites(currentUser.favorites.find(id => id === plantId))
      setInWishlist(currentUser.wishlist.find(id => id === plantId))
    }
  }, [plantId, currentUser])

  const handleList = list => {
    let data
    if (list === currentUser.collection) {
      setClicked1(true)
      setTimeout(() => {
        setClicked1(false)
      }, 3000)
      data = { collection: plantId }
    } else if (list === currentUser.favorites) {
      setClicked2(true)
      setTimeout(() => {
        setClicked2(false)
      }, 3000)
      data = { favorites: plantId }
    } else if (list === currentUser.wishlist) {
      setClicked3(true)
      setTimeout(() => {
        setClicked3(false)
      }, 3000)
      data = { wishlist: plantId }
    }
    if (list && list.find(id => id === plantId)) {
      // REMOVES PLANT
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then(res => {
        if (res.status === 200) {
          console.log(res)
          console.log(`Removed ${plantId} from user's list!`)
          queryClient.invalidateQueries('current-user')
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
      }).then(res => {
        if (res.status === 200) {
          console.log(res)
          console.log(`Added ${plantId} to user's list!`)
          queryClient.invalidateQueries('current-user')
        } else if (res.status === 404) {
          console.log('Something went wrong')
        }
      })
    }
  }

  return (
    <>
      {currentUser && (
        <Wrapper>
          <Action
            aria-label='collect'
            onClick={() => handleList(currentUser.collection)}
            disabled={clicked1}
            added={inCollection}>
            <RiPlantLine />
          </Action>
          <Action
            className='wishlist'
            aria-label='wishlist'
            onClick={() => handleList(currentUser.wishlist)}
            disabled={clicked3}
            added={inWishlist}>
            <AiOutlineStar />
          </Action>
          <Action
            className='favorite'
            aria-label='favorite'
            onClick={() => handleList(currentUser.favorites)}
            disabled={clicked2}
            added={inFavorites}>
            <TiHeartOutline />
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
  background: ${props => (props.added ? `${COLORS.light}` : '')};
  color: #000;
  opacity: ${props => (props.added ? '1' : '0.5')};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-content: center;
  font-size: 1.3rem;
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
    background: ${props => (props.added ? '#ffd24d' : '')};
    &:hover,
    &:focus,
    &:disabled {
      background: #ffd24d;
    }
  }
  &.favorite {
    background: ${props => (props.added ? '#b493e6' : '')};
    &:hover,
    &:focus,
    &:disabled {
      background: #b493e6;
    }
  }
`
