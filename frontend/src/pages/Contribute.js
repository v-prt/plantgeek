import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
// import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { UserContext } from '../contexts/UserContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormItem } from '../components/forms/FormItem'
import { Input, Select } from 'formik-antd'
import { Button, Alert } from 'antd'

import styled from 'styled-components/macro'
import { COLORS, DropZone, DropBox } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import checkmark from '../assets/checkmark.svg'
import { RiImageAddFill, RiImageAddLine } from 'react-icons/ri'
import { ImCross } from 'react-icons/im'
import placeholder from '../assets/plant-placeholder.svg'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
const { Option } = Select

export const Contribute = () => {
  useDocumentTitle('plantgeek | Contribute')

  const { currentUser } = useContext(UserContext)
  const [status, setStatus] = useState(undefined)
  const [newPlant, setNewPlant] = useState(null)

  // makes window scroll to top between renders
  // const pathname = window.location.pathname
  // useEffect(() => {
  //   if (pathname) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [pathname])

  const initialValues = {
    primaryName: '',
    secondaryName: '',
    imageUrl: '',
    light: '',
    water: '',
    temperature: '',
    humidity: '',
    toxic: '',
    sourceUrl: '',
  }

  const schema = Yup.object().shape({
    primaryName: Yup.string().min(2, 'Too short').required('Required'),
    secondaryName: Yup.string().min(2, 'Too short'),
    light: Yup.string().required('Required'),
    water: Yup.string().required('Required'),
    temperature: Yup.string().required('Required'),
    humidity: Yup.string().required('Required'),
    toxic: Yup.string().required('Required'),
    sourceUrl: Yup.string().url('Invalid URL').required('Required'),
  })

  // DROPZONE
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
  const [images, setImages] = useState()
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    minSize: 0,
    maxSize: 1242880, // up to 1mb
    multiple: false, // accepts only 1 image
    onDrop: acceptedFiles => {
      setImages(
        acceptedFiles.map(image =>
          Object.assign(image, {
            preview: URL.createObjectURL(image),
          })
        )
      )
    },
  })
  useEffect(() => {
    if (images) {
      // revokes the data uris to avoid memory leaks
      images.forEach(image => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setStatus(undefined)
    if (!images) {
      setStatus('You must upload an image.')
      setSubmitting(false)
    } else {
      // upload image to cloudinary via dropzone
      images.forEach(async image => {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
        // FIXME: Moderation parameter is not allowed when using unsigned upload
        // formData.append('moderation', 'manual')
        // TODO: axios
        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        })
        const cloudinaryResponse = await response.json()
        // submit data to mongodb
        const review = currentUser.role === 'admin' ? 'approved' : 'pending'
        // TODO: axios
        await fetch(`${API_URL}/plants`, {
          method: 'POST',
          body: JSON.stringify({
            primaryName: values.primaryName,
            secondaryName: values.secondaryName,
            light: values.light,
            water: values.water,
            temperature: values.temperature,
            humidity: values.humidity,
            toxic: values.toxic === 'toxic' ? true : false,
            imageUrl: cloudinaryResponse.url,
            sourceUrl: values.sourceUrl,
            contributorId: currentUser._id,
            review: review,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(json => {
            if (json.status === 409) {
              setStatus('This plant already exists.')
              setSubmitting(false)
            } else if (json.status === 201) {
              setNewPlant(json.plant)
              setStatus(undefined)
              setSubmitting(false)
              setImages()
              resetForm()
              window.scrollTo(0, 0)
            } else if (json.status === 500) {
              setStatus('Oops, something went wrong.')
              setSubmitting(false)
            }
          })
      })
    }
  }

  return !currentUser ? (
    <Redirect to='/signup' />
  ) : (
    <Wrapper>
      {newPlant && (
        <FadeIn>
          <section className='confirmation'>
            <div className='msg'>
              <h2>
                <img className='checkmark' src={checkmark} alt='' />
                new plant submitted
              </h2>
              {newPlant.review === 'approved' ? (
                <p>
                  Thank you! Since you're an admin, your submission has been automatically approved.
                </p>
              ) : (
                <p>
                  Thank you! Your submission will be reviewed shortly and, if approved, you will see
                  the new plant on site soon. In the meantime, you may submit additional plants
                  below.
                </p>
              )}
            </div>
            <PlantCard key={newPlant._id} plant={newPlant} viewNeeds={true} />
          </section>
        </FadeIn>
      )}
      <FadeIn>
        <section className='introduction'>
          <div>
            <h2>help us grow</h2>
            <p>
              Submit new data through the form below so we can all take better care of our beloved
              houseplants! Please include a link to a reliable source to help verify the information
              you provide. We review all submissions prior to uploading in order to maintain the
              integrity of our database.
            </p>
          </div>
          <img src={placeholder} alt='' />
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <FormWrapper>
          <h2>new houseplant info</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ isSubmitting, resetForm }) => (
              <Form>
                <FormItem label='Scientific name' name='primaryName'>
                  <Input name='primaryName' placeholder='Monstera deliciosa' />
                </FormItem>

                <FormItem label='Common name' sublabel='(optional)' name='secondaryName'>
                  <Input name='secondaryName' placeholder='Swiss cheese plant' />
                </FormItem>

                <FormItem label='Upload image' sublabel='(max 1mb)' name=''>
                  <DropZone>
                    {/* TODO:
                  - set up signed uploads with cloudinary
                  - (STRETCH GOAL) set up a way to approve images before saving to db (cloudinary analysis using amazon rekognition, must be plant and pass guidelines, no offensive content) */}
                    <DropBox
                      {...getRootProps()}
                      isDragAccept={isDragAccept}
                      isDragReject={isDragReject}>
                      <input {...getInputProps()} name='images' />
                      <div className='icon'>
                        {isDragAccept && <RiImageAddFill />}
                        {isDragReject && <ImCross />}
                        {!isDragActive && <RiImageAddLine />}
                      </div>
                    </DropBox>
                    <div className='preview-container'>
                      {images &&
                        images.map(image => (
                          <div className='thumbnail' key={image.name}>
                            <div className='thumbnail-inner'>
                              <img src={image.preview} alt={image.name} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </DropZone>
                </FormItem>

                <FormItem label='Light' name='light'>
                  <Select name='light' placeholder='Select'>
                    <Option value='low to bright indirect'>low to bright indirect</Option>
                    <Option value='medium indirect'>medium indirect</Option>
                    <Option value='medium to bright indirect'>medium to bright indirect</Option>
                    <Option value='bright indirect'>bright indirect</Option>
                    <Option value='bright'>bright</Option>
                  </Select>
                </FormItem>

                <FormItem label='Water' name='water'>
                  <Select name='water' placeholder='Select'>
                    <Option value='low'>low</Option>
                    <Option value='low to medium'>low to medium</Option>
                    <Option value='medium'>medium</Option>
                    <Option value='medium to high'>medium to high</Option>
                    <Option value='high'>high</Option>
                  </Select>
                </FormItem>

                <FormItem label='Temperature' name='temperature'>
                  <Select name='temperature' placeholder='Select'>
                    <Option value='average'>average</Option>
                    <Option value='warm'>warm</Option>
                  </Select>
                </FormItem>

                <FormItem label='Humidity' name='humidity'>
                  <Select name='humidity' placeholder='Select'>
                    <Option value='average'>average</Option>
                    <Option value='high'>high</Option>
                  </Select>
                </FormItem>

                <FormItem label='Toxicity' name='toxic'>
                  <Select name='toxic' placeholder='Select'>
                    <Option value='toxic'>toxic</Option>
                    <Option value='nontoxic'>nontoxic</Option>
                  </Select>
                </FormItem>

                <FormItem label='Source URL' name='sourceUrl'>
                  <Input
                    name='sourceUrl'
                    placeholder='https://www.plantpedia.com/monstera-deliciosa'
                  />
                </FormItem>

                <div className='buttons'>
                  <Button
                    type='secondary'
                    onClick={() => {
                      setImages()
                      resetForm()
                    }}>
                    RESET
                  </Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    disabled={isSubmitting}
                    loading={isSubmitting}>
                    SUBMIT
                  </Button>
                </div>
                {status && <Alert type='error' message={status} showIcon />}
              </Form>
            )}
          </Formik>
        </FormWrapper>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  section {
    &.introduction {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      h2 {
        margin-bottom: 10px;
      }
      p {
        max-width: 600px;
        margin-bottom: 50px;
      }
      img {
        width: 100px;
        align-self: flex-end;
        margin-top: 20px;
        margin-left: auto;
      }
    }
    &.confirmation {
      background: ${COLORS.light};
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-evenly;
      gap: 20px;
      .msg {
        h2 {
          display: flex;
          align-items: center;
          .checkmark {
            background: ${COLORS.lightest};
            padding: 2px;
            border-radius: 50%;
            height: 40px;
            margin-right: 10px;
          }
        }
        p {
          max-width: 400px;
          margin: 20px 0;
        }
      }
    }
  }
`

export const FormWrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
  h2 {
    box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
    padding: 0 20px 10px 20px;
    margin-bottom: 10px;
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    .ant-select {
      width: 100%;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
  }
`
