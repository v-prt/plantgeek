import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions.js'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS, Button } from '../GlobalStyles'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn.js'
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
  const handleUrl = (ev) => {
    setUrl(ev.target.value)
  }

  const handleUpload = (ev) => {
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
    // FIXME: use axios
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
      {currentUser && (
        <FadeIn>
          <Div>
            <Avatar src={currentUser?.image ? currentUser?.image[0] : placeholder} alt='' />
            <h1>{currentUser?.username}</h1>
            <p>Member since {moment(currentUser?.joined).format('ll')}</p>
            <Options>
              <Heading>account settings</Heading>
              <Option key='upload-image'>
                {currentUser && currentUser.image ? (
                  <p>Change your profile image</p>
                ) : (
                  <p>Upload a profile image</p>
                )}
                <form>
                  <input type='text' placeholder='Image URL' onChange={handleUrl} />
                  <Button type='submit' onClick={handleUpload}>
                    Upload
                  </Button>
                </form>
              </Option>
              <Option key='change-username'>
                {currentUser && currentUser.username && <p>Change your username</p>}
                <form>
                  <input type='text' placeholder='New username' onChange={handleUsername} />
                  <Button type='submit' onClick={changeUsername} disabled={true}>
                    Change
                  </Button>
                </form>
              </Option>
              <Option key='change-password'>
                {currentUser && currentUser.password && <p>Change your password</p>}
                <form>
                  <input type='text' placeholder='New password' onChange={handlePassword} />
                  <Button type='submit' onClick={changePassword} disabled={true}>
                    Change
                  </Button>
                </form>
              </Option>
              <Option last={true}>
                <p>Delete your account</p>
                <form>
                  <input className='hidden' type='text' />
                  <Button onClick={deleteAccount} disabled={true}>
                    Delete
                  </Button>
                </form>
              </Option>
            </Options>
          </Div>
        </FadeIn>
      )}
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
    justify-content: space-between;
    margin: 10px 0;
    input {
      flex: 3;
      border: none;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 0.8rem;
      &.hidden {
        visibility: hidden;
      }
    }
    button {
      flex: 1;
      font-size: 0.8rem;
    }
  }
  @media only screen and (min-width: 500px) {
    font-size: 1rem;
    form {
      input {
        font-size: 1rem;
      }
      button {
        font-size: 1rem;
      }
    }
  }
  @media only screen and (min-width: 1000px) {
    form input {
      margin-left: 20px;
      min-width: 300px;
    }
  }
`

const Div = styled.div`
  width: 100%;
  position: relative;
  top: -70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  border: 5px solid ${COLORS.light};
  padding: 5px;
`

const Options = styled.ul`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 60px 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  @media only screen and (min-width: 500px) {
    font-size: 1rem;
  }
`

const Heading = styled.h2`
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  margin-bottom: 10px;
  text-align: center;
`

const Option = styled.li`
  color: ${(props) => (props.last ? '#cc0000' : '')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: ${(props) => (props.last ? 'none' : '1px dotted #ccc')};
  padding: 10px 20px;
  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    align-items: center;
  }
`
