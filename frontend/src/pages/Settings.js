import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, Button } from '../GlobalStyles'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn'
import { Image } from './UserProfile'
import moment from 'moment'

export const Settings = () => {
  const dispatch = useDispatch()
  // const history = useHistory();
  const { getUser, currentUser } = useContext(UserContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [existingImage, setExistingImage] = useState(undefined)
  useEffect(() => {
    if (currentUser && currentUser.image) {
      setExistingImage(currentUser.image[0])
    }
  }, [currentUser])

  const [url, setUrl] = useState('')
  const handleUrl = ev => {
    setUrl(ev.target.value)
  }

  const changeImage = ev => {
    ev.preventDefault()
    // REMOVES EXISTING IMAGE
    if (existingImage) {
      // FIXME: use axios
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify({ image: existingImage }),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then(res => {
        if (res.status === 200) {
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
    // ADDS NEW IMAGE
    // FIXME: use axios
    fetch(`/${currentUser.username}/add`, {
      method: 'PUT',
      body: JSON.stringify({ image: url }),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    }).then(res => {
      if (res.status === 200) {
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

  const [username, setUsername] = useState('')
  const handleUsername = ev => {
    setUsername(ev.target.value)
    console.log(username)
  }

  const changeUsername = () => {
    // check if username is taken
    // if not, update username
    // else, show error
  }

  const [password, setPassword] = useState('')
  const handlePassword = ev => {
    setPassword(ev.target.value)
    console.log(password)
  }

  const changePassword = () => {
    // update password
  }

  const deleteAccount = () => {
    console.log(currentUser)
    // TODO: ask to confirm, delete account if yes
    // history push to homepage
  }

  return (
    <Wrapper>
      {currentUser && (
        <>
          <FadeIn>
            <section className='user-info'>
              <Image src={currentUser?.image ? currentUser?.image[0] : placeholder} alt='' />
              <div className='text'>
                <h1>{currentUser?.username}</h1>
                <p>Member since {moment(currentUser?.joined).format('ll')}</p>
              </div>
            </section>
          </FadeIn>
          <FadeIn>
            <section className='settings'>
              <Heading>account settings</Heading>
              <Option key='upload-image'>
                <input
                  type='text'
                  placeholder={`${
                    currentUser && currentUser.image
                      ? 'Change profile image'
                      : 'Upload profile image'
                  }`}
                  onChange={handleUrl}
                />
                <Button onClick={changeImage}>Submit</Button>
              </Option>
              <Option key='change-username'>
                <input type='text' placeholder='Change username' onChange={handleUsername} />
                <Button onClick={changeUsername}>Submit</Button>
              </Option>
              <Option key='change-password'>
                <input type='text' placeholder='Change password' onChange={handlePassword} />
                <Button onClick={changePassword}>Submit</Button>
              </Option>
              <Option last={true}>
                <Button className='delete-acc' onClick={deleteAccount}>
                  DELETE ACCOUNT
                </Button>
              </Option>
            </section>
          </FadeIn>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-info {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      text-align: center;
    }
  }
  .settings {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    max-width: 600px;
  }
`

const Heading = styled.h2`
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  margin-bottom: 10px;
  text-align: center;
`

const Option = styled.div`
  display: flex;
  border-bottom: ${props => (props.last ? 'none' : '1px dotted #ccc')};
  padding: 10px 0;
  input {
    border: 2px solid transparent;
    border-radius: 10px;
    margin-right: 10px;
    flex: 3;
    transition: 0.2s ease-in-out;
    &:focus {
      border: 2px solid ${COLORS.light};
      outline: none;
    }
  }
  button {
    background: ${COLORS.darkest};
    color: ${COLORS.lightest};
    flex: 1;
    border-radius: 10px;
    padding: 10px 20px;
    &:hover {
      background: ${COLORS.medium};
    }
    &:focus {
      background: ${COLORS.medium};
    }
    &:disabled {
      pointer-events: none;
    }
    &.delete-acc {
      background: #cc0000;
      height: 50px;
      max-width: 200px;
      margin: 20px auto auto auto;
    }
  }
`
