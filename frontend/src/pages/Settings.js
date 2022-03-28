import React, { useState, useEffect, useContext, useRef } from 'react'
import { useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import moment from 'moment'

import { Formik, Form, useFormikContext } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Saving } from '../components/forms/Saving'
import { Input } from 'formik-antd'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Button } from 'antd'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FiEdit } from 'react-icons/fi'
import { MdOutlineCancel } from 'react-icons/md'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn'
import { Image } from './UserProfile'

const AutoSave = () => {
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
  const [editMode, setEditMode] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const initialValues = {
    firstName: currentUser?.firstName ? currentUser?.firstName : '',
    lastName: currentUser?.lastName ? currentUser?.lastName : '',
    email: currentUser?.email ? currentUser?.email : '',
    username: currentUser?.username ? currentUser?.username : '',
  }

  const accountSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too short').required('First name required'),
    lastName: Yup.string().min(2, 'Too short').required('Last name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    username: Yup.string()
      .min(4, 'Too short')
      .max(20, 'Too long')
      .required('Username required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
    // password: Yup.string()
    //   .min(6, 'Too short')
    //   .minLowercase(1, 'Must include at least 1 lowercase letter')
    //   .minUppercase(1, 'Must include at least 1 uppercase letter')
    //   .minNumbers(1, 'Must include at least 1 number')
    //   .minSymbols(1, 'Must include at least 1 symbol')
    //   .required('Password required'),
  })

  const handleSubmit = (values, { setStatus }) => {
    setSavingStatus('saving')
    // increment submitRef
    submitRef.current++
    // get current submitRef id
    const thisSubmit = submitRef.current
    setTimeout(async () => {
      // check if this is still the latest submit
      if (thisSubmit === submitRef.current) {
        setStatus('')
        const result = await updateCurrentUser(values)
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

  return (
    <Wrapper>
      {currentUser ? (
        <>
          <FadeIn>
            <section className='user-info'>
              <Image src={currentUser?.image ? currentUser?.image[0] : placeholder} alt='' />
              <div className='text'>
                <h1>{currentUser?.username}</h1>
                <p>Member since {moment(currentUser?.joined).format('ll')}</p>
              </div>
            </section>
          </FadeIn>
          <FadeIn>
            <section className='settings'>
              <Heading>
                <span className='heading-text'>
                  account details <Saving savingStatus={savingStatus} />
                </span>
                <Button type='text' onClick={() => setEditMode(!editMode)}>
                  <span className='icon'>{editMode ? <MdOutlineCancel /> : <FiEdit />}</span>
                </Button>
              </Heading>
              <Formik
                initialValues={initialValues}
                validationSchema={accountSchema}
                onSubmit={handleSubmit}>
                {({ status, submitForm }) => (
                  <Form>
                    {status && <div className='status'>{status}</div>}
                    <FormItem name='firstName' label='First name'>
                      <Input name='firstName' disabled={!editMode} />
                    </FormItem>
                    <FormItem name='lastName' label='Last name'>
                      <Input name='lastName' disabled={!editMode} />
                    </FormItem>
                    <FormItem name='email' label='Email address'>
                      <Input name='email' disabled={!editMode} />
                    </FormItem>
                    <FormItem name='username' label='Username'>
                      <Input name='username' disabled={!editMode} />
                    </FormItem>
                    {/* TODO: upload profile image, change password, delete account (danger zone) */}
                    <AutoSave />
                  </Form>
                )}
              </Formik>
            </section>
          </FadeIn>
        </>
      ) : (
        <BeatingHeart />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-info {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      text-align: center;
    }
  }
  .settings {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    max-width: 600px;
    form {
      padding: 0 20px;
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
  }
`

const Heading = styled.h2`
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .heading-text {
    display: flex;
    align-items: center;
    .saving {
      margin-left: 5px;
    }
  }
  button {
    display: flex;
    align-items: center;
    .icon {
      margin-left: 5px;
      display: grid;
    }
  }
`
