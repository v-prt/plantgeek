import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { Text } from '../components/forms/FormItems.js'

import styled from 'styled-components/macro'
import { COLORS, Button } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FiEdit } from 'react-icons/fi'
import { MdOutlineCancel } from 'react-icons/md'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn'
import { Image } from './UserProfile'
import moment from 'moment'

export const Settings = () => {
  const dispatch = useDispatch()
  // const history = useHistory();
  const { getUser, currentUser } = useContext(UserContext)
  const [status, setStatus] = useState()
  const [editMode, setEditMode] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const AccountSchema = Yup.object().shape({
    profileImage: Yup.string(),
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
  })

  const saveSettings = () => {
    // TODO:
  }

  const deleteAccount = () => {
    // TODO:
  }

  // const [existingImage, setExistingImage] = useState(undefined)
  // useEffect(() => {
  //   if (currentUser && currentUser.image) {
  //     setExistingImage(currentUser.image[0])
  //   }
  // }, [currentUser])

  // const [url, setUrl] = useState('')
  // const handleUrl = ev => {
  //   setUrl(ev.target.value)
  // }

  // const changeImage = ev => {
  //   ev.preventDefault()
  //   // REMOVES EXISTING IMAGE
  //   if (existingImage) {
  //     fetch(`/${currentUser.username}/remove`, {
  //       method: 'PUT',
  //       body: JSON.stringify({ image: existingImage }),
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-type': 'application/json',
  //       },
  //     }).then(res => {
  //       if (res.status === 200) {
  //         dispatch(requestUsers())
  //         axios
  //           .get('/users')
  //           .then(res => dispatch(receiveUsers(res.data.data)))
  //           .catch(err => console.log(err))
  //         getUser(currentUser._id)
  //       } else if (res.status === 404) {
  //         console.log('Something went wrong')
  //       }
  //     })
  //   }
  //   // ADDS NEW IMAGE
  //   fetch(`/${currentUser.username}/add`, {
  //     method: 'PUT',
  //     body: JSON.stringify({ image: url }),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-type': 'application/json',
  //     },
  //   }).then(res => {
  //     if (res.status === 200) {
  //       dispatch(requestUsers())
  //       axios
  //         .get('/users')
  //         .then(res => dispatch(receiveUsers(res.data.data)))
  //         .catch(err => console.log(err))
  //       getUser(currentUser._id)
  //     } else if (res.status === 404) {
  //       console.log('Something went wrong')
  //     }
  //   })
  // }

  return (
    <Wrapper>
      {currentUser && (
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
                <span>account details</span>
                <button
                  className={editMode ? 'cancel' : 'edit'}
                  onClick={() => setEditMode(!editMode)}>
                  {editMode ? 'Cancel' : 'Edit'}
                  <span className='icon'>{editMode ? <MdOutlineCancel /> : <FiEdit />}</span>
                </button>
              </Heading>
              <Formik
                initialValues={{}}
                validationSchema={AccountSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={saveSettings}>
                {({ isSubmitting }) => (
                  <Form>
                    {status && <div className='status'>{status}</div>}
                    <Text
                      label='Profile image'
                      name='profileImage'
                      type='text'
                      placeholder='Insert URL'
                      disabled={!editMode}
                    />
                    <Text
                      label='Email'
                      name='email'
                      type='text'
                      placeholder={currentUser.email}
                      disabled={!editMode}
                    />
                    <Text
                      label='Username'
                      name='username'
                      type='text'
                      placeholder={currentUser.username}
                      disabled={!editMode}
                    />
                    <Text
                      label='Password'
                      name='password'
                      type='password'
                      // TODO: get hashed pass and decrypt it
                      placeholder={currentUser.password}
                      disabled={!editMode}
                    />
                    <div className='buttons'>
                      <Button
                        className='danger'
                        onClick={deleteAccount}
                        disabled={!editMode || isSubmitting}>
                        DELETE ACCOUNT
                      </Button>
                      <Button type='submit' disabled={!editMode || isSubmitting}>
                        {isSubmitting ? <Ellipsis /> : 'SAVE'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
          </FadeIn>
        </>
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
  }
  @media only screen and (min-width: 500px) {
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
  justify-content: space-between;
  button {
    display: flex;
    align-items: center;
    .icon {
      margin-left: 5px;
      display: grid;
    }
    &.edit {
    }
    &.cancel {
      color: ${COLORS.danger};
    }
  }
`
