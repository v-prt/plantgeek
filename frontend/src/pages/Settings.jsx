import React, { useState, useContext } from 'react'
import { useQueryClient } from 'react-query'
import { Redirect } from 'react-router-dom'
import Resizer from 'react-image-file-resizer'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import { API_URL } from '../constants'

import { Formik, Form } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Input } from 'formik-antd'
import * as Yup from 'yup'

import styled from 'styled-components'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { Button, Alert, Modal, Upload, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  RedoOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import placeholder from '../assets/avatar-placeholder.png'
import { FadeIn } from '../components/loaders/FadeIn'
import { ImageLoader } from '../components/loaders/ImageLoader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const Settings = () => {
  useDocumentTitle('Settings • plantgeek')

  const queryClient = new useQueryClient()
  const { currentUser, updateCurrentUser, resendVerificationEmail } = useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [passwordEditMode, setPasswordEditMode] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [image, setImage] = useState(currentUser.imageUrl)
  const [loading, setLoading] = useState(false)

  // #region Initial Values
  const accountInitialValues = {
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    email: currentUser?.email,
    username: currentUser?.username,
  }

  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  // #endregion Initial Values

  // #region Schemas
  const accountSchema = Yup.object().shape({
    firstName: Yup.string().min(2, `That's too short`).required('Required'),
    lastName: Yup.string().min(2, `That's too short`).required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string()
      .min(4, `That's too short`)
      .max(20, `That's too long`)
      .required('Required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
  })

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Required'),
    newPassword: Yup.string().min(6, `That's too short`).required('Required'),
    confirmPassword: Yup.string()
      .required('You must confirm your new password')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  })
  // #endregion Schemas

  // #region Functions
  // IMAGE UPLOAD
  const [uploading, setUploading] = useState(false)
  const fileList = []
  const uploadButton = (
    <div>
      {uploading ? (
        <LoadingOutlined spin />
      ) : (
        <img className='placeholder' src={placeholder} alt='' />
      )}
    </div>
  )
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME
  }/upload`

  // resize file before upload
  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file, // file to be resized
        300, // maxWidth of the resized image
        300, // maxHeight of the resized image
        'WEBP', // compressFormat of the resized image
        100, // quality of the resized image
        0, // degree of clockwise rotation to apply to the image
        uri => {
          // callback function of the resized image URI
          resolve(uri)
        },
        'base64' // outputType of the resized image
      )
    })

  const handleImageUpload = async fileData => {
    setUploading(true)
    const image = await resizeFile(fileData.file)

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET_USERS)

    await axios
      .post(cloudinaryUrl, formData)
      .then(res => {
        const imageUrl = res.data.secure_url
        axios
          .put(`${API_URL}/users/${currentUser._id}`, { imageUrl })
          .then(() => {
            setImage(imageUrl)
            queryClient.invalidateQueries('current-user')
            setUploading(false)
          })
          .catch(err => {
            console.log(err)
            message.error('Oops, something went wrong')
            setUploading(false)
          })
      })
      .catch(err => {
        console.log(err)
        message.error('Oops, something went wrong')
        setUploading(false)
      })
  }

  const updateAccount = async (values, { setStatus }) => {
    setStatus('')
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      setEditMode(false)
    }
  }

  const changePassword = async (values, { setStatus }) => {
    setStatus('')
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      message.success('Password updated')
      setPasswordEditMode(false)
    }
  }

  const handleDelete = () => {
    localStorage.removeItem('plantgeekToken')
    window.location.replace('/login')
    axios.delete(`${API_URL}/users/${currentUser._id}`).catch(err => console.log(err))
  }

  const handleVerificationEmail = async () => {
    setLoading(true)
    const result = await resendVerificationEmail()
    if (result.error) {
      message.error(result.error)
    } else {
      message.success('Verification email sent')
    }
    setLoading(false)
  }
  // #endregion Functions

  return !currentUser ? (
    <Redirect to='/signup' />
  ) : (
    <Wrapper>
      <FadeIn>
        <section className='settings'>
          <Formik
            initialValues={accountInitialValues}
            validationSchema={accountSchema}
            onSubmit={updateAccount}
          >
            {({ status, setStatus, setValues, isSubmitting }) => (
              <Form>
                <h1>account settings</h1>
                {status && <Alert type='error' message={status} showIcon />}
                <Upload
                  multiple={false}
                  maxCount={1}
                  name='userImage'
                  customRequest={handleImageUpload}
                  fileList={fileList}
                  listType='picture-card'
                  accept='.png, .jpg, .jpeg'
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                  }}
                >
                  {!uploading && image ? (
                    <ImageLoader
                      src={image}
                      alt={''}
                      placeholder={placeholder}
                      borderRadius='50%'
                    />
                  ) : (
                    uploadButton
                  )}
                  {!uploading && (
                    <div className='overlay'>
                      <EditOutlined />
                    </div>
                  )}
                </Upload>
                <div className='buttons'>
                  {editMode ? (
                    <>
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={isSubmitting}
                        icon={<SaveOutlined />}
                      >
                        SAVE
                      </Button>
                      <Button
                        type='secondary'
                        icon={<CloseOutlined />}
                        onClick={() => {
                          // reset form values
                          setStatus('')
                          setValues(accountInitialValues)
                          setEditMode(false)
                        }}
                      >
                        CANCEL
                      </Button>
                    </>
                  ) : (
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={e => {
                        e.preventDefault() // prevent form submission
                        setEditMode(true)
                      }}
                    >
                      EDIT PROFILE
                    </Button>
                  )}
                </div>

                <FormItem name='firstName' label='First name'>
                  <Input name='firstName' disabled={!editMode} />
                </FormItem>
                <FormItem name='lastName' label='Last name'>
                  <Input name='lastName' disabled={!editMode} />
                </FormItem>
                <FormItem name='username' label='Username'>
                  <Input name='username' disabled={!editMode} />
                </FormItem>
                <FormItem
                  name='email'
                  label='Email'
                  sublabel={!currentUser.emailVerified && '(not verified)'}
                >
                  <Input
                    name='email'
                    disabled={!editMode}
                    suffix={
                      currentUser.emailVerified && (
                        <CheckCircleOutlined style={{ color: '#966fd1' }} />
                      )
                    }
                  />
                </FormItem>
                {!currentUser.emailVerified && (
                  <div className='verify-email'>
                    <Alert
                      type='warning'
                      message={
                        <>
                          <p>Please check your email for the verification link.</p>
                          <Button
                            type='link'
                            icon={<RedoOutlined />}
                            onClick={handleVerificationEmail}
                            loading={loading}
                          >
                            RESEND EMAIL
                          </Button>
                        </>
                      }
                    />
                  </div>
                )}
              </Form>
            )}
          </Formik>
          <div className='zone'>
            <div className='password'>
              {/* TODO: add password recovery here */}
              <p>Password</p>
              <Button
                type='secondary'
                onClick={() => setPasswordEditMode(!passwordEditMode)}
                className={passwordEditMode && 'hidden'}
              >
                CHANGE...
              </Button>
            </div>
            <Formik
              initialValues={passwordInitialValues}
              validationSchema={passwordSchema}
              onSubmit={changePassword}
            >
              {({ status, isSubmitting, submitForm }) => (
                <Form className={passwordEditMode ? 'expanded' : 'hidden'}>
                  {status && <Alert type='error' message={status} showIcon />}
                  <FormItem name='currentPassword' label='Current password'>
                    <Input.Password name='currentPassword' type='password' />
                  </FormItem>
                  <FormItem name='newPassword' label='New password'>
                    <Input.Password name='newPassword' type='password' />
                  </FormItem>
                  <FormItem name='confirmPassword' label='Confirm new password'>
                    <Input.Password name='confirmPassword' type='password' />
                  </FormItem>
                  <div className='password-buttons'>
                    <Button type='secondary' onClick={() => setPasswordEditMode(!passwordEditMode)}>
                      CANCEL
                    </Button>
                    <Button
                      htmlType='submit'
                      type='primary'
                      icon={<SaveOutlined />}
                      loading={isSubmitting}
                    >
                      SAVE
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className='zone'>
            <div className='danger'>
              <p>Danger zone</p>
              <Button type='danger' onClick={() => setDeleteModalOpen(true)}>
                DELETE ACCOUNT...
              </Button>
              <Modal
                title='Delete account'
                open={deleteModalOpen}
                footer={false}
                onCancel={() => setDeleteModalOpen(false)}
              >
                <p>Are you sure you want to permanently delete your account?</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <Button type='danger' onClick={handleDelete} icon={<DeleteOutlined />}>
                    DELETE
                  </Button>
                  <Button type='secondary' onClick={() => setDeleteModalOpen(false)}>
                    CANCEL
                  </Button>
                </div>
              </Modal>
            </div>
          </div>
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .settings {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    max-width: 600px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    h1 {
      margin-bottom: 20px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 1.5rem;
    }
    form {
      display: flex;
      flex-direction: column;
      &.hidden {
        display: none;
      }
      &.expanded {
        display: flex;
      }
      .verify-email {
        button {
          padding: 0;
          margin: 0;
          border: 0;
        }
      }
      .password-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
      }
    }
    .buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      button {
        width: fit-content;
      }
    }
    .ant-upload-picture-card-wrapper {
      width: fit-content;
      margin: 20px 0;
    }
    .ant-upload-list {
      height: 150px;
      width: 150px;
      position: relative;
      overflow: hidden;
      .placeholder {
        height: 100%;
        width: 100%;
      }
      .overlay {
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
        visibility: hidden;
        opacity: 0;
        transition: 0.2s ease-in-out;
        position: absolute;
        display: grid;
        place-content: center;
        border-radius: 50%;
        font-size: 1.2rem;
      }
      &:hover {
        .overlay {
          visibility: visible;
          opacity: 1;
        }
      }
      .ant-upload-select-picture-card {
        border-radius: 50%;
        margin: auto;
        height: 100%;
        width: 100%;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
    }
    .zone {
      background: #fff;
      padding: 20px;
      border: 1px dotted #ccc;
      border-radius: 5px;
      .password,
      .danger {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          font-weight: bold;
          margin: 5px 0;
        }
        button {
          margin: 5px 0;
          width: fit-content;
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
      padding: 30px;
      gap: 20px;
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
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .user-info {
      padding: 40px;
    }
  }
`
