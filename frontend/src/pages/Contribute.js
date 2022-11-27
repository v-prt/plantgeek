import React, { useContext, useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import Resizer from 'react-image-file-resizer'
import { useDropzone } from 'react-dropzone'
import { API_URL } from '../constants'
import axios from 'axios'
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
  useDocumentTitle('Contribute • plantgeek')

  const queryClient = useQueryClient()
  const { currentUser } = useContext(UserContext)
  const [status, setStatus] = useState(undefined)
  const [newPlant, setNewPlant] = useState(null)

  const initialValues = {
    primaryName: '',
    secondaryName: '',
    light: '',
    water: '',
    temperature: '',
    humidity: '',
    toxic: '',
    origin: '',
    climate: '',
    rarity: '',
    sourceUrl: '',
  }

  const schema = Yup.object().shape({
    primaryName: Yup.string()
      .min(2, 'Too short')
      .required('Required')
      // no special characters except hyphens and apostrophes
      .matches(/^[a-zA-Z0-9-'\s]+$/, 'No special characters'),
    secondaryName: Yup.string()
      .min(2, 'Too short')
      .matches(/^[a-zA-Z0-9-'\s]+$/, 'No special characters'),
    light: Yup.string().required('Required'),
    water: Yup.string().required('Required'),
    temperature: Yup.string().required('Required'),
    humidity: Yup.string().required('Required'),
    toxic: Yup.string().required('Required'),
    origin: Yup.string(),
    climate: Yup.string(),
    rarity: Yup.string(),
    sourceUrl: Yup.string().url('Invalid URL').required('Required'),
  })

  // DROPZONE
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
  const [images, setImages] = useState()
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    minSize: 0,
    // maxSize: 1242880, // up to 1mb
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

  // resize file before upload
  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file, // file to be resized
        600, // maxWidth of the resized image
        600, // maxHeight of the resized image
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

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (currentUser.emailVerified) {
      setStatus(undefined)
      if (!images) {
        setStatus('You must upload an image.')
        setSubmitting(false)
      } else {
        images.forEach(async image => {
          const resizedImage = await resizeFile(image)

          const formData = new FormData()
          formData.append('file', resizedImage)
          formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)

          // upload image to cloudinary
          await axios.post(cloudinaryUrl, formData).then(res => {
            const imageUrl = res.data.secure_url

            const data = {
              slug: values.primaryName.replace(/\s+/g, '-').toLowerCase(),
              imageUrl,
              contributorId: currentUser._id,
              review: 'pending',
              ...values,
            }

            //  upload plant to db
            axios
              .post(`${API_URL}/plants`, data)
              .then(res => {
                setSubmitting(false)
                setNewPlant(res.data.plant)
                resetForm()
                setImages()
                queryClient.invalidateQueries('plants-to-review')
                queryClient.invalidateQueries('pending-plants')
                window.scrollTo(0, 0)
              })
              .catch(err => {
                setStatus(err.response.data.message)
                setSubmitting(false)
              })
          })
        })
      }
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
              {/* {newPlant.review === 'approved' ? (
                <p>
                  Thank you! Since you're an admin, your submission has been automatically approved.
                </p>
              ) : ( */}
              <p>
                Thank you! Your submission will be reviewed shortly and, if approved, you will see
                the new plant on site soon. In the meantime, you may submit additional plants below.
              </p>
              {/* )} */}
            </div>
            <PlantCard key={newPlant._id} plant={newPlant} />
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
          <h2>new houseplant</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ isSubmitting, resetForm }) => (
              <Form>
                <FormItem
                  label='Botanical name'
                  subtext='Please include the variety or cultivar.'
                  name='primaryName'>
                  <Input name='primaryName' placeholder='e.g. Monstera deliciosa' />
                </FormItem>

                <FormItem label='Common name' sublabel='(optional)' name='secondaryName'>
                  <Input name='secondaryName' placeholder='e.g. Swiss Cheese Plant' />
                </FormItem>

                <FormItem label='Upload image' sublabel='(max 1mb)' name=''>
                  <DropZone>
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
                            <img src={image.preview} alt={image.name} />
                          </div>
                        ))}
                    </div>
                  </DropZone>
                </FormItem>

                <FormItem label='Light' name='light'>
                  <Select name='light' placeholder='Select'>
                    <Option value='low to bright indirect'>low to bright indirect</Option>
                    <Option value='medium to bright indirect'>medium to bright indirect</Option>
                    <Option value='bright indirect'>bright indirect</Option>
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
                    <Option value='average'>average (55-75°F)</Option>
                    <Option value='above average'>above average (65-85°F)</Option>
                  </Select>
                </FormItem>

                <FormItem label='Humidity' name='humidity'>
                  <Select name='humidity' placeholder='Select'>
                    <Option value='low'>low (30-40%)</Option>
                    <Option value='medium'>medium (40-50%)</Option>
                    <Option value='high'>high (50-60%+)</Option>
                  </Select>
                </FormItem>

                <FormItem label='Toxicity' name='toxic'>
                  <Select name='toxic' placeholder='Select'>
                    <Option value={true}>toxic</Option>
                    <Option value={false}>nontoxic</Option>
                  </Select>
                </FormItem>

                <FormItem label='Region of origin' sublabel='(optional)' name='origin'>
                  <Input name='origin' placeholder='e.g. Central America' />
                </FormItem>

                <FormItem label='Native climate' sublabel='(optional)' name='climate'>
                  <Select name='climate' placeholder='Select'>
                    <Option value='tropical'>tropical</Option>
                    <Option value='subtropical'>subtropical</Option>
                    <Option value='temperate'>temperate</Option>
                    <Option value='desert'>desert</Option>
                  </Select>
                </FormItem>

                <FormItem label='Rarity' name='rarity'>
                  <Select name='rarity' placeholder='Select'>
                    <Option value='common'>common</Option>
                    <Option value='uncommon'>uncommon</Option>
                    <Option value='rare'>rare</Option>
                    <Option value='unicorn'>unicorn</Option>
                  </Select>
                </FormItem>

                <FormItem
                  label='Source'
                  subtext='Please provide a link to your source to help validate your information.'
                  name='sourceUrl'>
                  <Input
                    name='sourceUrl'
                    placeholder='e.g. https://www.plantpedia.com/monstera-deliciosa'
                  />
                </FormItem>

                {!currentUser.emailVerified && (
                  <Alert
                    type='warning'
                    message='Please verify your email address to contribute.'
                    showIcon
                  />
                )}
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
                    disabled={isSubmitting || !currentUser.emailVerified}
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
      background: linear-gradient(45deg, #a4e17d, #95d190);
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
    margin-bottom: 20px;
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
