import React, { useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text } from '../components/forms/FormItems.js'
import { Wrapper, Card, StyledLink } from './SignUp.js'

import { Ellipsis } from '../components/loaders/Ellipsis'

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username required'),
  password: Yup.string().required('Password required'),
})

export const Login = () => {
  const { handleLogin, incorrectUsername, incorrectPassword, currentUser } = useContext(UserContext)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return currentUser ? (
    <Redirect to={`/user-profile/${currentUser.username}`} />
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
          validateOnChange={false}
          onSubmit={handleLogin}>
          {({ isSubmitting }) => (
            <Form>
              <Text label='Username' name='username' type='text' autoFocus />
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
