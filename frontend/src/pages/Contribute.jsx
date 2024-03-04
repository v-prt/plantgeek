import React, { useContext, useState } from 'react'
import { redirect } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import Resizer from 'react-image-file-resizer'
import { API_URL } from '../constants'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormItem } from '../components/forms/FormItem'
import { Input, Select } from 'formik-antd'
import { Button, Alert, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import styled from 'styled-components'
import { COLORS } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { ImageLoader } from '../components/loaders/ImageLoader'
import success from '../assets/success.svg'
import placeholder from '../assets/plant-placeholder.svg'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
const { Option } = Select

export const Contribute = () => {
  useDocumentTitle('Contribute • plantgeek')

  const queryClient = useQueryClient()
  const { currentUser } = useContext(UserContext)
  const { duplicatePlant, setDuplicatePlant } = useContext(PlantContext)
  const [status, setStatus] = useState(undefined)
  const [newPlant, setNewPlant] = useState(null)

  const initialValues = {
    primaryName: duplicatePlant?.primaryName || '',
    secondaryName: duplicatePlant?.secondaryName || '',
    light: duplicatePlant?.light || '',
    water: duplicatePlant?.water || '',
    temperature: duplicatePlant?.temperature || '',
    humidity: duplicatePlant?.humidity || '',
    toxic: duplicatePlant?.toxic,
    origin: duplicatePlant?.origin || '',
    climate: duplicatePlant?.climate || '',
    rarity: duplicatePlant?.rarity || '',
    sourceUrl: duplicatePlant?.sourceUrl || '',
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

  // IMAGE UPLOAD
  const [uploading, setUploading] = useState(false)
  const fileList = []
  const uploadButton = <div>{uploading ? <Ellipsis /> : <UploadOutlined />}</div>
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME
  }/upload`

  // resize file before upload
  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file, // file to be resized
        1200, // maxWidth of the resized image
        1200, // maxHeight of the resized image
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

  const [newImage, setNewImage] = useState(false)
  const handleNewImage = async fileData => {
    setUploading(true)
    const image = await resizeFile(fileData.file)
    setNewImage(image)
    setUploading(false)
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setStatus(undefined)
    if (!currentUser.emailVerified) {
      return
    }
    if (!newImage) {
      setStatus('You must upload an image.')
      setSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', newImage)
      formData.append('upload_preset', import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET)

      // upload new image to cloudinary
      const cloudinaryRes = await axios.post(cloudinaryUrl, formData)
      values.imageUrl = cloudinaryRes.data.secure_url

      const data = {
        ...values,
        slug: values.primaryName.replace(/\s+/g, '-').toLowerCase(),
        contributorId: currentUser._id,
        review: currentUser?.role === 'admin' ? 'approved' : 'pending',
      }

      //  upload plant to db
      axios
        .post(`${API_URL}/plants`, data)
        .then(res => {
          setSubmitting(false)
          setNewPlant(res.data.plant)
          resetForm()
          setNewImage(false)
          setDuplicatePlant(undefined)
          queryClient.invalidateQueries('plants-to-review')
          queryClient.invalidateQueries('pending-plants')
          window.scrollTo(0, 0)
        })
        .catch(err => {
          setStatus(err.response.data.message)
          setSubmitting(false)
        })
    } catch (err) {
      console.log(err)
      setStatus('Sorry, something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (!currentUser) redirect('/login')

  return (
    <Wrapper>
      {newPlant && (
        <FadeIn>
          <section className='confirmation'>
            <div className='msg'>
              <h2>
                <img className='success' src={success} alt='' />
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
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <h3>Basic Info</h3>
                <FormItem
                  label='Botanical name'
                  subtext='Please include the variety or cultivar.'
                  name='primaryName'
                >
                  <Input name='primaryName' placeholder='e.g. Monstera deliciosa' />
                </FormItem>

                <FormItem label='Common name' sublabel='(optional)' name='secondaryName'>
                  <Input name='secondaryName' placeholder='e.g. Swiss Cheese Plant' />
                </FormItem>

                <FormItem
                  label='Image'
                  subtext='Please upload a high-quality image. The plant should be the only subject in view, preferrably with a white or plain background.'
                >
                  <div className='primary-image'>
                    <Upload
                      multiple={false}
                      maxCount={1}
                      name='imageUrl'
                      customRequest={handleNewImage}
                      fileList={fileList}
                      listType='picture-card'
                      accept='.png, .jpg, .jpeg, .webp'
                      showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: false,
                      }}
                    >
                      {!uploading && newImage ? (
                        <>
                          <ImageLoader
                            src={newImage}
                            alt=''
                            placeholder={placeholder}
                            borderRadius='50%'
                          />
                          <div className='overlay'>
                            <UploadOutlined />
                          </div>
                        </>
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </div>
                </FormItem>

                <h3>Care Info</h3>

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

                <h3 style={{ marginTop: '20px' }}>Miscellaneous Info</h3>

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

                <FormItem label='Rarity' sublabel='(optional)' name='rarity'>
                  <Select name='rarity' placeholder='Select'>
                    <Option value='common'>common</Option>
                    <Option value='uncommon'>uncommon</Option>
                    <Option value='rare'>rare</Option>
                    <Option value='very rare'>very rare</Option>
                    <Option value='unicorn'>unicorn</Option>
                  </Select>
                </FormItem>

                <FormItem
                  label='Source'
                  subtext='Please provide a link to your source to help validate your information.'
                  name='sourceUrl'
                >
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
                      setNewImage(false)
                      resetForm()
                    }}
                  >
                    RESET
                  </Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    disabled={isSubmitting || !currentUser.emailVerified}
                    loading={isSubmitting}
                  >
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
      max-width: 600px;
      margin: auto;
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
      max-width: 600px;
      margin: auto;
      .msg {
        h2 {
          display: flex;
          align-items: center;
          .success {
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
    .primary-image {
      display: flex;
      flex: 1;
      width: 100%;
      max-width: 300px;
      margin: 10px auto;
      aspect-ratio: 1 / 1;
      margin-bottom: 20px;
      position: relative;
      .ant-upload-list {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        .ant-upload {
          font-size: 1.5rem;
          transition: 0.2s ease-in-out;
          &:hover {
            color: ${COLORS.accent};
          }
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
          font-size: 1.5rem;
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
        }
      }
      img {
        object-fit: cover;
        width: 100%;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        &.placeholder {
          border-radius: 0;
          width: 80%;
          object-fit: contain;
        }
      }
    }
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
