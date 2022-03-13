import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { UserContext } from '../contexts/UserContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestPlants, receivePlants } from '../actions'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text, Select } from '../components/forms/FormItems'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS, DropZone, DropBox, Button } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { Ellipsis } from '../components/loaders/Ellipsis'
import checkmark from '../assets/checkmark.svg'
import { RiImageAddFill, RiImageAddLine } from 'react-icons/ri'
import { ImCross } from 'react-icons/im'
import monstera from '../assets/monstera.jpeg'
import placeholder from '../assets/plant-placeholder.svg'
import { PlantCard } from '../components/PlantCard'

export const Contribute = () => {
  const dispatch = useDispatch()
  // TODO: reward users with badges for approved submissions? (display # of submissions)
  const { currentUser } = useContext(UserContext)
  const plants = useSelector(plantsArray)
  const [status, setStatus] = useState(undefined)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const PlantSchema = Yup.object().shape({
    primaryName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('*required'),
    // secondaryName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('*required'),
    light: Yup.string().required('*required'),
    water: Yup.string().required('*required'),
    temperature: Yup.string().required('*required'),
    humidity: Yup.string().required('*required'),
    toxic: Yup.string().required('*required'),
    sourceUrl: Yup.string().required('*required'),
  })

  // DROPZONE
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
  const [images, setImages] = useState()
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
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

  // UPDATES STORE AFTER NEW PLANT ADDED TO DB
  const [newPlant, setNewPlant] = useState()
  useEffect(() => {
    if (newPlant) {
      dispatch(requestPlants())
      axios
        .get('/plants')
        .then(res => dispatch(receivePlants(res.data.data)))
        .catch(err => console.log(err))
    }
  }, [dispatch, newPlant])

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setStatus(undefined)
    const existingPlant = plants.find(
      plant => plant.primaryName.toLowerCase() === values.primaryName.toLowerCase()
    )
    if (existingPlant) {
      setStatus('Oops, this plant already exists.')
      setSubmitting(false)
    } else if (!images) {
      setStatus('You must upload an image.')
      setSubmitting(false)
    } else if (currentUser.role === 'admin') {
      // upload image to cloudinary via dropzone
      images.forEach(async image => {
        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
        // FIXME: Moderation parameter is not allowed when using unsigned upload
        // formData.append('moderation', 'manual')
        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        })
        const cloudinaryResponse = await response.json()
        // submit data to mongodb
        await fetch('/plants', {
          method: 'POST',
          body: JSON.stringify({
            primaryName: values.primaryName,
            secondaryName: values.secondaryName,
            light: values.light,
            water: values.water,
            temperature: values.temperature,
            humidity: values.humidity,
            toxic: values.toxic === 'yes' ? true : false,
            imageUrl: cloudinaryResponse.url,
            sourceUrl: values.sourceUrl,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(json => {
            if (json.status === 201) {
              setNewPlant(json.data.ops[0])
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
    } else {
      // TODO: submit for review
      setStatus(`You're not an admin`)
      setSubmitting(false)
    }
  }

  return (
    <Wrapper>
      <FadeIn>
        {/* TODO: adjust wording & plant card interactions based on review status */}
        {newPlant && (
          <section className='confirmation'>
            <div className='msg'>
              <h2>
                <img className='checkmark' src={checkmark} alt='' />
                new plant submitted
              </h2>
              <p>
                Thank you! Your submission will be reviewed shortly and, if approved, you will see
                the new plant on site soon. In the meantime, you may submit additional plant
                information below.
              </p>
            </div>
            <PlantCard key={newPlant._id} plant={newPlant} approved={false} viewNeeds={true} />
          </section>
        )}
      </FadeIn>
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
          <h2>houseplant info</h2>
          <Formik
            initialValues={{
              primaryName: '',
              secondaryName: '',
              light: '',
              water: '',
              temperature: '',
              humidity: '',
              toxic: '',
              imageUrl: '',
              sourceUrl: '',
            }}
            validationSchema={PlantSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting, resetForm }) => (
              <Form>
                <Text
                  label='Primary name'
                  name='primaryName'
                  type='text'
                  placeholder='e.g. Monstera deliciosa'
                />
                <Text
                  label='Secondary name'
                  name='secondaryName'
                  type='text'
                  placeholder='e.g. Swiss cheese plant'
                />
                <Select
                  label='Light'
                  name='light'
                  type='select'
                  options={[
                    'low to bright indirect',
                    'medium indirect',
                    'medium to bright indirect',
                    'bright indirect',
                    'bright',
                  ]}
                />
                <Select
                  label='Water'
                  name='water'
                  type='select'
                  options={['low', 'low to medium', 'medium', 'medium to high', 'high']}
                />
                <Select
                  label='Temperature'
                  name='temperature'
                  type='select'
                  options={['average', 'warm']}
                />
                <Select
                  label='Humidity'
                  name='humidity'
                  type='select'
                  options={['average', 'high']}
                />
                <Select
                  label='Is this plant toxic?'
                  name='toxic'
                  type='select'
                  options={['yes', 'no']}
                />
                <DropZone>
                  {/* TODO:
                  - set up signed uploads with cloudinary
                  - set up a way to approve images before saving to db (cloudinary analysis using amazon rekognition, must be plant and pass guidelines, no offensive content) */}
                  <div className='guidelines-wrapper'>
                    <div className='guidelines'>
                      <p>
                        Upload image{' '}
                        <span className='info-text'>(please follow our guidelines)</span>
                      </p>
                      <ul>
                        <li key={1}>houseplants only</li>
                        <li key={2}>1:1 aspect ratio (square)</li>
                        <li key={3}>display the whole plant in a plain pot</li>
                        <li key={4}>white background</li>
                        <li>well lit & in focus (no blurry images)</li>
                        <li>full color (no filters)</li>
                        <li>max 1 image (up to 1mb)</li>
                      </ul>
                    </div>
                    <div className='example'>
                      <p className='info-text'>Example:</p>
                      <img style={{ height: '200px' }} src={monstera} alt='' />
                    </div>
                  </div>
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
                {/* TODO: accept multiple source links? */}
                <Text label='Source' name='sourceUrl' type='text' placeholder='Insert URL' />
                <div className='buttons'>
                  <Button
                    type='reset'
                    className='secondary'
                    onClick={() => {
                      setImages()
                      resetForm()
                    }}>
                    RESET
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <Ellipsis /> : 'SUBMIT'}
                  </Button>
                </div>
                {status && <div className='status'>{status}</div>}
              </Form>
            )}
          </Formik>
        </FormWrapper>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  section {
    margin: 10px 0;
    padding: 20px;
    border-radius: 20px;
    &.introduction {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      p {
        max-width: 600px;
        margin-bottom: 50px;
      }
      img {
        width: 100px;
        align-self: flex-end;
        margin-left: auto;
      }
    }
    &.confirmation {
      background: ${COLORS.light};
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-evenly;
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
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    section {
      margin: 20px;
      padding: 40px;
    }
  }
`

export const FormWrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  h2 {
    box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
    padding: 0 20px 10px 20px;
    margin-bottom: 10px;
    text-align: center;
  }
`
