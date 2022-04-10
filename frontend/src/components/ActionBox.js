import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const ActionBox = ({ plantId }) => {
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)
  const [submitting, setSubmitting] = useState(false)

  const handleList = list => {
    setSubmitting(true)
    let data
    if (list === currentUser.collection) {
      data = { collection: plantId }
    } else if (list === currentUser.favorites) {
      data = { favorites: plantId }
    } else if (list === currentUser.wishlist) {
      data = { wishlist: plantId }
    }
    if (list && list.find(id => id === plantId)) {
      // REMOVES PLANT
      axios.put(`/${currentUser.username}/remove`, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          console.log(`Removed ${plantId} from user's list!`)
          queryClient.invalidateQueries('current-user')
          setSubmitting(false)
        } else if (res.status === 404) {
          console.log('Something went wrong')
          setSubmitting(false)
        }
      })
    } else {
      // ADDS PLANT
      axios.put(`/${currentUser.username}/add`, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          console.log(`Added ${plantId} to user's list!`)
          queryClient.invalidateQueries('current-user')
          setSubmitting(false)
        } else if (res.status === 404) {
          console.log('Something went wrong')
          setSubmitting(false)
        }
      })
    }
  }

  return (
    <Wrapper>
      <div className='action-wrapper'>
        <Action
          className='collection'
          aria-label='collect'
          disabled={submitting}
          added={currentUser.collection.find(id => id === plantId)}
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
          disabled={submitting}
          added={currentUser.wishlist.find(id => id === plantId)}>
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
          className='favorites'
          aria-label='favorite'
          onClick={() => handleList(currentUser.favorites)}
          disabled={submitting}
          added={currentUser.favorites.find(id => id === plantId)}>
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
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    grid-gap: 30px;
  }
  @media only screen and (min-width: 1200px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const Action = styled.button`
  background: #e6e6e6;
  width: 100%;
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
    font-weight: bold;
  }
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
