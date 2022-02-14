import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions.js'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { Text, Checkbox } from '../components/forms/FormItems.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'

YupPassword(Yup) // extend yup

export const SignUp = () => {
  const dispatch = useDispatch()
  const { currentUser } = useContext(UserContext)
  const [status, setStatus] = useState()
  const [firstName, setFirstName] = useState()
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('First name required'),
    lastName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('Last name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    username: Yup.string()
      .min(4, 'Too short')
      .max(20, 'Too long')
      .required('Username required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
    password: Yup.string()
      .min(6, 'Too short')
      .minLowercase(1, 'Must include at least 1 lowercase letter')
      .minUppercase(1, 'Must include at least 1 uppercase letter')
      .minNumbers(1, 'Must include at least 1 number')
      .minSymbols(1, 'Must include at least 1 symbol')
      .required('Password required'),
    acceptedTerms: Yup.boolean()
      .required('Required')
      .oneOf([true], 'You must accept the Terms and Conditions'),
  })

  // UPDATES STORE AFTER NEW USER ADDED TO DB
  useEffect(() => {
    if (username) {
      dispatch(requestUsers())
      axios
        .get('/users')
        .then(res => dispatch(receiveUsers(res.data.data)))
        .catch(err => console.log(err))
    }
  }, [dispatch, username])

  const handleSignup = async (values, { setSubmitting }) => {
    // FIXME: use axios
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
      .then(res => res.json())
      .then(json => {
        if (json.status === 201) {
          console.log('Signup successful!')
          setSubmitting(false)
          setFirstName(values.firstName)
          setEmail(values.email)
          setUsername(values.username)
          setPassword(values.password)
        } else if (json.status === 409) {
          setStatus(json.message)
          setSubmitting(false)
        } else if (json.status === 500) {
          console.log(json.message)
          setSubmitting(false)
        }
      })
  }

  return currentUser ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn duration={700} delay={150}>
        <Card>
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
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSignup}>
              {({ isSubmitting }) => (
                <Form>
                  {/* TODO: improve error status message (show beside specific input - email/username) */}
                  {status && <div className='status'>{status}</div>}
                  <Text label='First name' name='firstName' type='text' />
                  <Text label='Last name' name='lastName' type='text' />
                  <Text label='Email' name='email' type='email' />
                  <Text label='Username' name='username' type='text' />
                  {/* TODO: add password visibility toggle button */}
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
                  <button type='submit' disabled>
                    {isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                  </button>
                  {/* <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                  </button> */}
                  <p className='subtext'>
                    Already have an account? <Link to='/login'>Log in</Link>
                  </p>
                </Form>
              )}
            </Formik>
          )}
        </Card>
      </FadeIn>
    </Wrapper>
  )
}

export const Wrapper = styled.main`
  @media only screen and (min-width: 500px) {
    place-content: center;
  }
`

export const Card = styled.div`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  .welcome-header {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    h1 {
      margin: 10px;
      font-size: 1.2rem;
    }
    p {
      font-size: 0.9rem;
    }
    li {
      display: flex;
      font-size: 0.9rem;
      margin: 10px;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    .status {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid #ff0000;
      border-radius: 5px;
      color: #ff0000;
      text-align: center;
      margin-top: 10px;
    }
    // TODO: error styling for labels & inputs (red border, red font color, smooth transitions)
    .form-item {
      .text-wrapper {
        display: flex;
        flex-direction: column;
      }
    }
    .text-label {
      background: #f2f2f2;
      color: ${COLORS.dark};
      width: fit-content;
      position: relative;
      top: 15px;
      left: 30px;
      padding: 0 10px;
      font-size: 0.9rem;
      border-radius: 10px;
    }
    .text-input {
      background: #f2f2f2;
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
      font-size: 0.7rem;
      white-space: pre;
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
      height: 50px;
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
  a {
    text-decoration: underline;
  }
  .subtext {
    margin: auto auto 30px auto;
  }
  @media only screen and (min-width: 500px) {
    width: 400px;
    margin: auto;
    .welcome-header {
      h1 {
        font-size: 1.8rem;
      }
      p {
        font-size: 1.1rem;
      }
      li {
        font-size: 1.1rem;
      }
    }
    form {
      padding: 0 20px;
      .checkbox-label {
        font-size: 0.8rem;
      }
    }
  }
  @media only screen and (min-width: 1000px) {
    width: 500px;
    form {
      padding: 0 30px;
    }
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
  background: #f2f2f2;
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
