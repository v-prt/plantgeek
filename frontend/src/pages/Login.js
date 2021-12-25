import React, { useEffect, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text } from '../components/forms/FormItems.js'
import { Wrapper, Card } from './SignUp.js'

import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/FadeIn.js'

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
      <FadeIn duration={900} delay={200}>
        <Card>
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
            validateOnBlur={false}
            onSubmit={handleLogin}>
            {({ isSubmitting }) => (
              <Form>
                <Text label='Username' name='username' type='text' autoFocus />
                {incorrectUsername && <div className='error'>Username not found</div>}
                {/* TODO: add password visibility toggle button */}
                <Text label='Password' name='password' type='password' />
                {incorrectPassword && <div className='error'>Password is incorrect</div>}
                <button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Ellipsis /> : 'LOG IN'}
                </button>
              </Form>
            )}
          </Formik>
          <p className='subtext'>
            Don't have an account yet? <Link to='/signup'>Sign up</Link>
          </p>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
