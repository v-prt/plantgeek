import React, { useState, useEffect, useContext, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import moment from 'moment'
import { API_URL } from '../constants'

import { Formik, Form, useFormikContext } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Saving } from '../components/forms/Saving'
import { Input } from 'formik-antd'
import * as Yup from 'yup'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Button, Alert } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn'
import { Image } from './UserProfile'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const AutoSave = () => {
  useDocumentTitle('plantgeek | Settings')

  const { dirty, values, errors, submitForm } = useFormikContext()

  useEffect(() => {
    // auto saves only if form has been interacted with and there are no errors
    // dirty is false by default, becomes true once form has been interacted with
    if (dirty && !Object.keys(errors).length) {
      submitForm()
    }
  }, [dirty, values, errors, submitForm])

  return null
}

export const Settings = () => {
  const submitRef = useRef(0)
  const { currentUser, updateCurrentUser } = useContext(UserContext)
  const [savingStatus, setSavingStatus] = useState(undefined)
  const [passwordEditMode, setPasswordEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successStatus, setSuccessStatus] = useState('')

  // makes window scroll to top between renders
  // const pathname = window.location.pathname
  // useEffect(() => {
  //   if (pathname) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [pathname])

  // #region Initial Values
  const accountInitialValues = {
    firstName: currentUser?.firstName ? currentUser?.firstName : '',
    lastName: currentUser?.lastName ? currentUser?.lastName : '',
    email: currentUser?.email ? currentUser?.email : '',
    username: currentUser?.username ? currentUser?.username : '',
  }

  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }
  // #endregion Initial Values

  // #region Schemas
  const accountSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too short').required('First name required'),
    lastName: Yup.string().min(2, 'Too short').required('Last name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    username: Yup.string()
      .min(4, 'Too short')
      .max(20, 'Too long')
      .required('Username required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
  })

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password required'),
    newPassword: Yup.string()
      .min(6, 'Too short')
      .minNumbers(1, 'Must include at least 1 number')
      .minSymbols(1, 'Must include at least 1 symbol')
      .required('New password required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], "Passwords don't match")
      .required('You must confirm your new password'),
  })
  // #endregion Schemas

  // #region Functions
  const updateAccount = (values, { setStatus }) => {
    const data = {
      ...values,
      lowerCaseUsername: values.username.toLowerCase(),
    }
    setSavingStatus('saving')
    // increment submitRef
    submitRef.current++
    // get current submitRef id
    const thisSubmit = submitRef.current
    setTimeout(async () => {
      // check if this is still the latest submit
      if (thisSubmit === submitRef.current) {
        setStatus('')
        const result = await updateCurrentUser(data)
        if (result.error) {
          setStatus(result.error)
          setSavingStatus('error')
          setTimeout(() => {
            setSavingStatus(undefined)
          }, 2000)
        } else {
          setSavingStatus('saved')
          setTimeout(() => {
            setSavingStatus(false)
          }, 2000)
        }
      }
    }, 300)
  }

  const changePassword = async (values, { setStatus }) => {
    setLoading(true)
    setStatus('')
    setSuccessStatus('')
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
      setLoading(false)
    } else {
      setSuccessStatus('Password changed')
      setLoading(false)
      setPasswordEditMode(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      localStorage.removeItem('plantgeekToken')
      window.location.replace('/login')
      axios.delete(`${API_URL}/users/${currentUser._id}`).catch(err => console.log(err))
    }
  }
  // #endregion Functions

  return !currentUser ? (
    <Redirect to='/signup' />
  ) : (
    <Wrapper>
      <FadeIn>
        <section className='user-info'>
          <Image src={currentUser.image ? currentUser.image[0] : placeholder} alt='' />
          <div className='text'>
            <h1>
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p className='username'>{currentUser.username}</p>
            <p>Member since {moment(currentUser.joined).format('ll')}</p>
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <section className='settings'>
          <Heading>
            account details <Saving savingStatus={savingStatus} />
          </Heading>
          <Formik
            initialValues={accountInitialValues}
            validationSchema={accountSchema}
            onSubmit={updateAccount}>
            {({ status }) => (
              <Form>
                {status && <Alert type='error' message={status} showIcon />}
                <FormItem name='firstName' label='First name'>
                  <Input name='firstName' />
                </FormItem>
                <FormItem name='lastName' label='Last name'>
                  <Input name='lastName' />
                </FormItem>
                <FormItem name='email' label='Email address'>
                  <Input name='email' />
                </FormItem>
                <FormItem name='username' label='Username'>
                  <Input name='username' />
                </FormItem>
                {/* TODO: upload profile image */}
                <AutoSave />
              </Form>
            )}
          </Formik>
          <div className='zone'>
            {successStatus && <Alert type='success' message={successStatus} showIcon closable />}
            <div className='password'>
              <p>Change password</p>
              <Button
                type='secondary'
                onClick={() => setPasswordEditMode(!passwordEditMode)}
                className={passwordEditMode && 'hidden'}>
                CHANGE
              </Button>
            </div>
            <Formik
              initialValues={passwordInitialValues}
              validationSchema={passwordSchema}
              onSubmit={changePassword}>
              {({ status, isSubmitting, submitForm }) => (
                <Form className={passwordEditMode ? 'expanded' : 'hidden'}>
                  {status && <Alert type='error' message={status} showIcon />}
                  <FormItem name='currentPassword'>
                    <Input.Password
                      name='currentPassword'
                      type='password'
                      placeholder='Current password'
                    />
                  </FormItem>
                  <FormItem
                    name='newPassword'
                    sublabel='New password must be at least 6 characters long, and include 1 number and 1 symbol.'>
                    <Input.Password name='newPassword' type='password' placeholder='New password' />
                  </FormItem>
                  <FormItem name='confirmNewPassword'>
                    <Input.Password
                      name='confirmNewPassword'
                      type='password'
                      placeholder='Confirm new password'
                    />
                  </FormItem>
                  <div className='buttons'>
                    <Button type='secondary' onClick={() => setPasswordEditMode(!passwordEditMode)}>
                      CANCEL
                    </Button>
                    <Button
                      htmlType='submit'
                      type='primary'
                      disabled={loading || isSubmitting}
                      loading={loading || isSubmitting}>
                      SUBMIT
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className='zone'>
            <div className='danger'>
              <p>Danger zone</p>
              <Button type='danger' onClick={handleDelete} icon={<DeleteOutlined />}>
                DELETE ACCOUNT
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .user-info {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      text-align: center;
      .username {
        font-weight: bold;
        font-size: 1.2rem;
      }
    }
  }
  .settings {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    form {
      display: flex;
      flex-direction: column;
      margin: 20px;
      &.hidden {
        display: none;
      }
      &.expanded {
        display: flex;
      }
      .buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
      }
    }
    .zone {
      background: #fff;
      padding: 20px;
      border: 1px dotted #ccc;
      border-radius: 5px;
      margin: 20px;
      .password,
      .danger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        p {
          font-weight: bold;
          margin: 5px 0;
        }
        button {
          margin: 5px 0;
          &.hidden {
            display: none;
          }
        }
      }
      .danger {
        border-color: ${COLORS.danger};
        p {
          color: ${COLORS.danger};
        }
      }
      form {
        margin: 20px 0;
      }
    }
  }

  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .user-info {
      flex-direction: row;
      .text {
        margin-left: 30px;
        text-align: left;
      }
    }
    .settings {
      .zone {
        .password,
        .danger {
          flex-direction: row;
        }
      }
    }
  }
`

const Heading = styled.h2`
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .saving {
    margin-left: 5px;
  }
`
