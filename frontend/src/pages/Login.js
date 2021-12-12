import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'
import { Redirect } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { usersArray } from '../reducers/userReducer'
import { LoginContext } from '../context/LoginContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text } from '../components/forms/FormItems.js'
import { Wrapper, Card, StyledLink } from './SignUp.js'

import { Ellipsis } from '../components/loaders/Ellipsis'

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().required('Password required'),
})

// TODO: formik, jwt authentication token
export const Login = () => {
  const history = useHistory()
  // const users = useSelector(usersArray)
  const [incorrectUsername, setIncorrectUsername] = useState(false)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const { loggedIn, setLoggedIn } = useContext(LoginContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleLogin = async (values, { setSubmitting }) => {
    // TODO: set up plantgeekToken on login using jwt authentication
    // FIXME: improve incorrect username/password error messages
    setIncorrectUsername(false)
    setIncorrectPassword(false)
    await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
        setLoggedIn({
          username: values.username,
          timestamp: new Date().getTime(),
        })
        setSubmitting(false)
        // TODO: push to profile using lowercase username?
        history.push(`/user-profile/${values.username}`)
      } else if (res.status === 403) {
        console.log('Incorrect password!')
        setIncorrectPassword(true)
        setSubmitting(false)
      } else if (res.status === 401) {
        console.log('Incorrect username!')
        setIncorrectUsername(true)
        setSubmitting(false)
      } else if (res.status === 500) {
        console.log('Internal server error!')
      }
    })
  }

  return loggedIn ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <Card>
        <StyledLink to='/signup'>Don't have an account? Sign up</StyledLink>
        <div className='welcome-header'>
          <h1>welcome back!</h1>
        </div>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}>
          {({ isSubmitting }) => (
            <Form>
              <Text label='Username' name='username' type='text' />
              {incorrectUsername && <div className='error'>Username not found</div>}
              <Text label='Password' name='password' type='password' />
              {incorrectPassword && <div className='error'>Password is incorrect</div>}
              <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Ellipsis /> : 'LOG IN'}
              </button>
            </Form>
          )}
        </Formik>
      </Card>
    </Wrapper>
  )
}
