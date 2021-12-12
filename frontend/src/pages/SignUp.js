import React, { useState, useEffect, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
// import { usersArray } from '../reducers/userReducer'
import { requestUsers, receiveUsers } from '../actions.js'
import { LoginContext } from '../context/LoginContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text, Checkbox } from '../components/forms/FormItems.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import background from '../assets/monstera-bg.jpg'
import { Ellipsis } from '../components/loaders/Ellipsis'

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too short').max(50, 'Too long').required('First name required'),
  lastName: Yup.string().min(2, 'Too short').max(50, 'Too long').required('Last name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  username: Yup.string().min(4, 'Too short').max(20, 'Too long').required('Username required'),
  password: Yup.string().min(6, 'Too short').max(50, 'Too long').required('Password required'),
  acceptedTerms: Yup.boolean()
    .required('Required')
    .oneOf([true], 'You must accept the Terms and Conditions'),
})

export const SignUp = () => {
  const dispatch = useDispatch()
  const { loggedIn } = useContext(LoginContext)
  // const users = useSelector(usersArray)
  const [firstName, setFirstName] = useState()
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // TODO: check for existing username and email
  // const [existingUser, setExistingUser] = useState(false)
  // useEffect(() => {
  //   setExistingUser(
  //     users.find((user) => {
  //       return user.lowerCaseUsername.toLowerCase() === username.toLowerCase()
  //     })
  //   )
  // }, [users, username])

  // UPDATES STORE AFTER NEW USER ADDED TO DB
  useEffect(() => {
    if (username) {
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
  }, [dispatch, username])

  const handleSignUp = async (values, { setSubmitting }) => {
    await fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        username: values.username,
        password: values.password,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 500) {
          console.error('Signup error!')
          setSubmitting(false)
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          console.log('Signup successful!')
          setSubmitting(false)
          setFirstName(values.firstName)
          setEmail(values.email)
          setUsername(values.username)
          setPassword(values.password)
        }
      })
  }

  // checks if user is logged in (has token), if so then redirects to homepage
  return loggedIn ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <Card>
        <StyledLink to='/login'>Have an account? Log in</StyledLink>
        <div className='welcome-header'>
          <h1>welcome to plantgeek!</h1>
          {!username && (
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
        </div>
        {username ? (
          <Confirmation>
            <div className='message'>
              <p>Thanks for signing up, {firstName}!</p>
              <p>Please save your credentials in a safe place.</p>
            </div>
            <div className='box'>
              <p className='tag'>email</p>
              <p>{email}</p>
            </div>
            <div className='box'>
              <p className='tag'>username</p>
              <p>{username}</p>
            </div>
            <div className='box'>
              <p className='tag'>password</p>
              {/* TODO: toggle hide/show password (use password type input?) */}
              <p>{password}</p>
            </div>
          </Confirmation>
        ) : (
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              username: '',
              password: '',
              acceptedTerms: false,
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleSignUp}>
            {({ isSubmitting }) => (
              <Form>
                <Text label='First name' name='firstName' type='text' autoFocus />
                <Text label='Last name' name='lastName' type='text' />
                <Text label='Email address' name='email' type='email' />
                <Text label='Username' name='username' type='text' />
                <Text label='Password' name='password' type='password' />
                <Checkbox name='acceptedTerms'>
                  I have read and agree to the{' '}
                  <a
                    href='https://www.plantgeek.co/terms'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Terms and Conditions
                  </a>
                </Checkbox>
                {/* TEMPORARILY DISABLED FOR LIVE SITE */}
                {/* <button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                </button> */}
                <button type='submit' disabled>
                  {isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </Card>
    </Wrapper>
  )
}

export const Wrapper = styled.div`
  background: url(${background}) center center / cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  .welcome-header {
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
  }
  form {
    background: ${COLORS.lightest};
    display: flex;
    flex-direction: column;
    padding: 0 30px;
    // TODO: error styling for labels & inputs (red border, red font color, smooth transitions)
    .text-label {
      background: ${COLORS.lightest};
      width: fit-content;
      position: relative;
      top: 15px;
      left: 30px;
      padding: 0 10px;
      font-size: 0.9rem;
      border-radius: 10px;
    }
    .text-input {
      background: ${COLORS.lightest};
      border-radius: 15px;
      border: 2px solid ${COLORS.light};
      text-align: right;
      transition: 0.2s ease-in-out;
      &:focus {
        border: 2px solid ${COLORS.dark};
        outline: none;
      }
    }
    // TODO: improve checkbox styling
    .checkbox-label {
      display: flex;
      align-items: center;
      margin-top: 10px;
      font-size: 0.8rem;
      white-space: pre;
      a {
        text-decoration: underline;
      }
    }
    .checkbox-input {
      margin-right: 10px;
    }
    .error {
      color: #ff0000;
      font-size: 0.8rem;
    }
    button {
      background: ${COLORS.darkest};
      color: ${COLORS.lightest};
      margin: 30px 0;
      border-radius: 15px;
      padding: 10px;
      &:hover {
        background: ${COLORS.medium};
      }
      &:focus {
        background: ${COLORS.medium};
      }
      &:disabled:hover {
        background: ${COLORS.darkest};
      }
    }
  }
`

export const StyledLink = styled(Link)`
  background: ${COLORS.medium};
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: center;
  &:hover {
    background: #1a1a1a;
    color: #fff;
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
  .message {
    text-align: center;
    margin-bottom: 30px;
  }
  .box {
    background: #f2f2f2;
    width: 80%;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin: 10px;
    border: 1px solid ${COLORS.light};
    border-radius: 10px;
    .tag {
      background: ${COLORS.light};
      width: 90px;
      text-align: center;
      margin-right: 10px;
      padding: 5px 10px;
      font-weight: bold;
    }
  }
`
