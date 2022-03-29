import React, { useState, useEffect, useContext } from 'react'
import { Redirect, Link, useHistory } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { FormItem } from '../components/forms/FormItem.js'
import { Input, Checkbox } from 'formik-antd'
import { Button, Alert } from 'antd'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'

YupPassword(Yup) // extend yup

export const SignUp = () => {
  const history = useHistory()
  const { token, handleSignup } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (values, { setStatus }) => {
    setLoading(true)
    setStatus(undefined)
    const result = await handleSignup(values)
    if (result.error) {
      setStatus(result.error.message)
      setLoading(false)
    } else {
      // TODO: push to welcome page (needs more work)
      history.push('/login')
    }
  }

  return token ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn duration={700} delay={150}>
        <Card>
          <div className='header'>
            <h1>welcome!</h1>
            <>
              <p>Create an account in order to...</p>
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
          </div>
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
            onSubmit={handleSubmit}>
            {({ status, isSubmitting }) => (
              <Form>
                <FormItem name='firstName'>
                  <Input name='firstName' type='text' placeholder='First name' autoFocus />
                </FormItem>
                <FormItem name='lastName'>
                  <Input name='lastName' type='text' placeholder='Last name' />
                </FormItem>
                <FormItem name='email'>
                  <Input name='email' type='text' placeholder='Email address' />
                </FormItem>
                <FormItem name='username'>
                  <Input name='username' type='text' placeholder='Username' />
                </FormItem>
                <FormItem name='password'>
                  <Input.Password name='password' type='password' placeholder='Password' />
                </FormItem>
                <FormItem name='acceptedTerms'>
                  <Checkbox name='acceptedTerms'>
                    I have read and agree to the <Link to='/terms'>Terms and Conditions</Link>
                  </Checkbox>
                </FormItem>
                {/* TEMPORARILY DISABLED FOR LIVE SITE */}
                {/* <Button htmlType='submit' type='primary' size='large' disabled>
                    {loading || isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                  </Button> */}
                <Button
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={loading || isSubmitting}>
                  {loading || isSubmitting ? <Ellipsis /> : 'CREATE ACCOUNT'}
                </Button>
                {status && <Alert type='error' message={status} showIcon />}
                <p className='subtext'>
                  Already have an account? <Link to='/login'>Log in</Link>
                </p>
              </Form>
            )}
          </Formik>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}

export const Wrapper = styled.main`
  display: flex;
  place-content: center;
`

export const Card = styled.div`
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 10px auto;
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
    p {
      font-size: 0.9rem;
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
    display: flex;
    flex-direction: column;
    margin: 20px;
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
  }
  .subtext {
    text-align: center;
    margin-top: 20px;
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
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
  }
`

const Icon = styled.div`
  background: ${COLORS.lightest};
  color: #000;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 50%;
  font-size: 1.3rem;
`
