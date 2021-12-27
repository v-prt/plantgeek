import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions.js'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, Button } from '../GlobalStyles'
import placeholder from '../assets/avatar-placeholder.png'

export const Settings = () => {
  const dispatch = useDispatch()
  // const history = useHistory();
  const { getUser, currentUser } = useContext(UserContext)

  const [existingImage, setExistingImage] = useState(undefined)
  useEffect(() => {
    if (currentUser && currentUser.image) {
      setExistingImage(currentUser.image[0])
    }
  }, [currentUser])

  const [url, setUrl] = useState('')
  const handleUrl = (ev) => {
    setUrl(ev.target.value)
  }

  const handleUpload = (ev) => {
    ev.preventDefault()
    // REMOVES EXISTING IMAGE
    if (existingImage) {
      fetch(`/${currentUser.username}/remove`, {
        method: 'PUT',
        body: JSON.stringify({ image: existingImage }),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
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
    // ADDS NEW IMAGE
    fetch(`/${currentUser.username}/add`, {
      method: 'PUT',
      body: JSON.stringify({ image: url }),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
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

  const [username, setUsername] = useState('')
  const handleUsername = (ev) => {
    setUsername(ev.target.value)
    console.log(username)
  }

  const changeUsername = () => {
    // check if username is taken
    // if not, update username
    // else, show error
  }

  const [password, setPassword] = useState('')
  const handlePassword = (ev) => {
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
      <Heading>account settings</Heading>
      <UserDetails>
        {currentUser && (
          <>
            {currentUser.image ? (
              <img src={currentUser.image[0]} alt='' />
            ) : (
              <img src={placeholder} alt='' />
            )}
            <p>{currentUser.username}</p>
          </>
        )}
      </UserDetails>
      <Options>
        <Option key='upload-image'>
          {currentUser && currentUser.image ? (
            <p>Change your profile image</p>
          ) : (
            <p>Upload a profile image</p>
          )}
          <form>
            <Input type='text' placeholder='image url' onChange={handleUrl} />
            <Button type='submit' onClick={handleUpload}>
              Upload
            </Button>
          </form>
        </Option>
        <Option key='change-username'>
          {currentUser && currentUser.username && <p>Change your username</p>}
          <form>
            <Input type='text' placeholder='new username' onChange={handleUsername} />
            <Button type='submit' onClick={changeUsername} disabled={true}>
              Change
            </Button>
          </form>
        </Option>
        <Option key='change-password'>
          {currentUser && currentUser.password && <p>Change your password</p>}
          <form>
            <Input type='text' placeholder='new password' onChange={handlePassword} />
            <Button type='submit' onClick={changePassword} disabled={true}>
              Change
            </Button>
          </form>
        </Option>
        <Option last={true}>
          <p>Permanently delete your account</p>
          <Button style={{ width: '100px' }} onClick={deleteAccount} disabled={true}>
            Delete
          </Button>
        </Option>
      </Options>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  form {
    display: flex;
  }
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    height: 150px;
    border-radius: 50%;
    margin-top: 20px;
  }
  p {
    font-size: 1.5rem;
  }
`

const Options = styled.ul`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 20px;
  border-radius: 20px;
  @media (max-width: 800px) {
    width: 100%;
    border-radius: 0px;
  }
`

const Option = styled.li`
  color: ${(props) => (props.last ? '#cc0000' : '')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => (props.last ? 'none' : '1px dotted #ccc')};
  padding: 10px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  text-align: center;
  border-bottom: 3px solid ${COLORS.light};
`

const Input = styled.input`
  height: 40px;
  padding: 0 10px;
  margin: 5px;
  border: none;
  border-radius: 10px;
`
