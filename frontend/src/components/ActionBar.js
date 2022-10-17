import React, { useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../constants'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { LoadingOutlined } from '@ant-design/icons'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBar = ({ plantId }) => {
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)
  const [submitting, setSubmitting] = useState(false)

  const handleList = list => {
    let data
    if (list === currentUser.collection) {
      setSubmitting('collection')
      data = { collection: plantId }
    } else if (list === currentUser.favorites) {
      setSubmitting('favorites')
      data = { favorites: plantId }
    } else if (list === currentUser.wishlist) {
      setSubmitting('wishlist')
      data = { wishlist: plantId }
    }
    if (list && list.find(id => id === plantId)) {
      // REMOVES PLANT
      axios.put(`${API_URL}/${currentUser.username}/remove`, data).then(res => {
        if (res.status === 200) {
          queryClient.invalidateQueries('current-user')
          setSubmitting(false)
        } else if (res.status === 404) {
          console.log('Error removing plant from list')
          setSubmitting(false)
        }
      })
    } else {
      // ADDS PLANT
      axios.put(`${API_URL}/${currentUser.username}/add`, data).then(res => {
        if (res.status === 200) {
          queryClient.invalidateQueries('current-user')
          setSubmitting(false)
        } else if (res.status === 404) {
          console.log('Error adding plant to list')
          setSubmitting(false)
        }
      })
    }
  }

  return (
    <>
      {currentUser && (
        <Wrapper>
          <Action
            className='collection'
            aria-label='collect'
            onClick={() => handleList(currentUser.collection)}
            disabled={submitting === 'collection'}
            added={currentUser.collection.find(id => id === plantId)}>
            {submitting === 'collection' ? <LoadingOutlined spin /> : <RiPlantLine />}
          </Action>
          <Action
            className='wishlist'
            aria-label='wishlist'
            onClick={() => handleList(currentUser.wishlist)}
            disabled={submitting === 'wishlist'}
            added={currentUser.wishlist.find(id => id === plantId)}>
            {submitting === 'wishlist' ? <LoadingOutlined spin /> : <AiOutlineStar />}
          </Action>
          <Action
            className='favorites'
            aria-label='favorite'
            onClick={() => handleList(currentUser.favorites)}
            disabled={submitting === 'favorites'}
            added={currentUser.favorites.find(id => id === plantId)}>
            {submitting === 'favorites' ? <LoadingOutlined spin /> : <TiHeartOutline />}
          </Action>
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  background: #f7f7f7;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-self: center;
  margin: 5px 0;
  border-radius: 20px;
  padding: 5px;
`

const Action = styled.button`
  color: #000;
  opacity: ${props => (props.added ? '1' : '0.5')};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-content: center;
  font-size: 1.3rem;
  &:hover,
  &:focus {
    background: #ccc;
  }
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  &.collection {
    background: ${props => (props.added ? COLORS.light : '')};
  }
  &.wishlist {
    background: ${props => (props.added ? '#ffd24d' : '')};
  }
  &.favorites {
    background: ${props => (props.added ? '#b493e6' : '')};
  }
`
