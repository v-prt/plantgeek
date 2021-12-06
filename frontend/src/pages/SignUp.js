import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { usersArray } from '../reducers/userReducer'
import { requestUsers, receiveUsers } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import background from '../assets/monstera-bg.jpg'
import { GoEye, GoEyeClosed } from 'react-icons/go'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { Form, Label, Input, Error, Button } from './Login'

export const SignUp = () => {
  const dispatch = useDispatch()
  const users = useSelector(usersArray)
  const [loading, setLoading] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // FOCUSES ON FIRST INPUT ON LOAD
  const input = useRef(null)
  useEffect(() => {
    input.current.focus()
  }, [input])

  const [username, setUsername] = useState('')
  const handleUsername = (ev) => {
    setUsername(ev.target.value)
  }

  const [existingUser, setExistingUser] = useState(false)
  useEffect(() => {
    setExistingUser(
      users.find((user) => {
        return user.lowerCaseUsername.toLowerCase() === username.toLowerCase()
      })
    )
  }, [users, username])

  const [password, setPassword] = useState('')
  const handlePassword = (ev) => {
    setPassword(ev.target.value)
  }

  // DISABLES BUTTON UNTIL FORM HAS BEEN COMPLETED
  // const [completeForm, setCompleteForm] = useState(false)
  // useEffect(() => {
  //   if (username.length > 3 && password.length > 5) {
  //     setCompleteForm(true)
  //   } else {
  //     setCompleteForm(false)
  //   }
  // }, [username, password])

  // UPDATES STORE AFTER NEW USER ADDED TO DB
  const [newUser, setNewUser] = useState(false)
  useEffect(() => {
    if (newUser) {
      dispatch(requestUsers())
      fetch('/users')
        .then((res) => res.json())
        .then((json) => {
          dispatch(receiveUsers(json.data))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [dispatch, newUser])

  const handleSignUp = (ev) => {
    ev.preventDefault()
    setLoading(true)
    fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 500) {
          // TODO: display error to user?
          console.error('Signup error!')
          setLoading(false)
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          console.log('Signup successful!')
          setNewUser(true)
          setLoading(false)
        }
      })
  }

  const [passwordVisible, setPasswordVisible] = useState(false)
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <Wrapper>
      <Card>
        <LoginLink to='/login'>Have an account? Log in</LoginLink>
        <Info>
          <h1>welcome to plantgeek!</h1>
          {!newUser && (
            <>
              <p>You may create an account in order to...</p>
              <ul>
                <li>
                  <Icon>
                    <RiPlantLine />
                  </Icon>
                  show off your collection
                </li>
                <li>
                  <Icon>
                    <TiHeartOutline />
                  </Icon>
                  save your favorite plants
                </li>
                <li>
                  <Icon>
                    <AiOutlineStar />
                  </Icon>
                  create a wishlist
                </li>
              </ul>
            </>
          )}
        </Info>
        {newUser ? (
          <Confirmation>
            <Message>
              <p>Thank you for creating an account!</p>
              <p>Please save your credentials in a safe place.</p>
            </Message>
            <Box>
              <Tag>username</Tag>
              <Username>{username}</Username>
            </Box>
            <Box>
              <Tag>password</Tag>
              <Div>
                <Password show={passwordVisible}>{password}</Password>
                <Toggle onClick={togglePassword}>
                  {passwordVisible ? <GoEyeClosed /> : <GoEye />}
                </Toggle>
              </Div>
            </Box>
          </Confirmation>
        ) : (
          <Form autoComplete='off'>
            <Label htmlFor='username'>username</Label>
            <Input
              required
              type='text'
              name='signup'
              id='username'
              maxLength='15'
              onChange={handleUsername}
              error={existingUser}
              ref={input}
            />
            <Error error={existingUser}>Sorry, this username is taken.</Error>
            <Label htmlFor='password'>password</Label>
            <Input required type='password' name='signup' id='password' onChange={handlePassword} />
            {/* TEMPORARILY DISABLED FOR LIVE SITE */}
            <Button type='submit' onClick={handleSignUp} disabled>
              {loading ? <Ellipsis /> : 'CREATE ACCOUNT'}
            </Button>
            {/* <Button
              type='submit'
              onClick={handleSignUp}
              disabled={!completeForm || existingUser || loading}>
              {loading ? <Ellipsis /> : 'CREATE ACCOUNT'}
            </Button> */}
          </Form>
        )}
      </Card>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: url(${background}) center center / cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`

const LoginLink = styled(Link)`
  background: ${COLORS.medium};
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: center;
  font-weight: bold;
  &:hover {
    background: #1a1a1a;
    color: #fff;
  }
`

const Info = styled.section`
  background: ${COLORS.light};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  h1 {
    margin: 10px;
  }
  li {
    display: flex;
    font-size: 1.1rem;
    margin: 10px;
  }
`

const Icon = styled.div`
  background: ${COLORS.lightest};
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 50%;
  font-size: 1.3rem;
`

const Confirmation = styled.div`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`

const Message = styled.div`
  text-align: center;
  margin-bottom: 30px;
`

const Box = styled.div`
  background: #f2f2f2;
  width: 80%;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 10px;
  border: 1px solid ${COLORS.light};
  border-radius: 10px;
`

const Tag = styled.p`
  background: ${COLORS.light};
  width: 90px;
  text-align: center;
  margin-right: 10px;
  padding: 5px 10px;
  font-weight: bold;
`

const Username = styled.p``

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`

// FIXME: need to account for long passwords pushing toggle button out of sight
const Password = styled.p`
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
`

const Toggle = styled.button`
  color: #808080;
  position: relative;
  top: 2px;
  margin-right: 10px;
  font-size: 1.1rem;
  &:focus {
    color: ${COLORS.light};
  }
`
