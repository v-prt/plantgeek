import React, { useState, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { FormItem } from '../components/forms/FormItem.js'
import { Input } from 'formik-antd'
import { Button, Alert } from 'antd'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import plantgeekLogo from '../assets/logo.webp'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

YupPassword(Yup) // extend yup

export const SignUp = () => {
  useDocumentTitle('Sign up • plantgeek')

  const { currentUser, handleSignup } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    lastName: Yup.string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string()
      .min(4, `That's too short`)
      .max(20, `That's too long`)
      .required('Required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
    password: Yup.string().min(6, `That's too short`).required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  })

  const handleSubmit = async (values, { setStatus }) => {
    setLoading(true)
    setStatus(undefined)
    const result = await handleSignup(values)
    if (result.error) {
      setStatus(result.error.message)
      setLoading(false)
    } else {
      localStorage.setItem('plantgeekToken', result.token)
    }
  }

  return currentUser ? (
    <Redirect to='/welcome' />
  ) : (
    <Wrapper>
      <FadeIn>
        <Card>
          <div className='header'>
            <img src={plantgeekLogo} alt='' />
            <h1>welcome!</h1>
          </div>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              username: '',
              password: '',
            }}
            validationSchema={SignUpSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ status, isSubmitting }) => (
              <Form>
                <FormItem name='firstName' label='First name'>
                  <Input name='firstName' type='text' autoFocus />
                </FormItem>
                <FormItem name='lastName' label='Last name'>
                  <Input name='lastName' type='text' />
                </FormItem>
                <FormItem name='username' label='Username'>
                  <Input name='username' type='text' autoComplete='off' />
                </FormItem>
                <FormItem name='email' label='Email'>
                  <Input name='email' type='text' />
                </FormItem>
                <FormItem name='password' label='Password' sublabel='(at least 6 characters)'>
                  <Input.Password name='password' type='password' autoComplete='off' />
                </FormItem>
                <FormItem name='confirmPassword' label='Confirm password'>
                  <Input.Password name='confirmPassword' type='password' autoComplete='off' />
                </FormItem>
                <Button
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={loading || isSubmitting}
                  loading={loading || isSubmitting}>
                  CREATE ACCOUNT
                </Button>
                {status && <Alert type='error' message={status} showIcon />}
              </Form>
            )}
          </Formik>
          <p className='subtext'>
            Already have an account? <Link to='/login'>Log in</Link>
          </p>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}

export const Wrapper = styled.main`
  justify-content: center;
`

export const Card = styled.div`
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  .header {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    img {
      height: 30px;
    }
    li {
      display: flex;
      font-size: 0.9rem;
      margin: 10px;
    }
  }
  .body {
    margin: 20px;
    text-align: center;
  }
  form {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    margin: 20px auto;
  }
  a {
    text-decoration: underline;
  }
  .ant-btn {
    width: 100%;
    margin-top: 20px;
  }
  .ant-alert {
    margin-top: 10px;
    text-align: left;
  }
  .info-text {
    font-weight: bold;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  .subtext {
    text-align: center;
    margin-bottom: 20px;
  }
  .password-changed {
    margin: 20px auto;
  }
  .welcome {
    p {
      margin: 20px 0;
    }
  }
  .success {
    height: 40px;
    width: 40px;
  }
  .email-verification {
    p {
      margin: 20px 0 0 0;
    }
    .buttons {
      display: flex;
      gap: 12px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    margin: auto;
    max-width: 400px;
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .header {
      min-width: 310px;
      padding: 20px;
      h1 {
        font-size: 1.8rem;
      }
      li {
        font-size: 1rem;
      }
    }
  }
`
