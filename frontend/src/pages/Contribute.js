import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { UserContext } from '../contexts/UserContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestPlants, receivePlants } from '../actions'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text, Select, Checkbox } from '../components/forms/FormItems'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
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
  const [status, setStatus] = useState()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const PlantSchema = Yup.object().shape({
    primaryName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('Required'),
    secondaryName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('Required'),
    light: Yup.string().required('Required'),
    water: Yup.string().required('Required'),
    temperature: Yup.string().required('Required'),
    humidity: Yup.string().required('Required'),
    toxic: Yup.boolean(),
    // TODO: imageUrl: Yup.string().required('Required'),
    sourceUrl: Yup.string().required('Required'),
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

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values)
    // if (currentUser.role === 'admin') {
    //   // upload image to cloudinary via dropzone
    //   images.forEach(async (image) => {
    //     const formData = new FormData()
    //     formData.append('file', image)
    //     formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
    //     // FIXME: Moderation parameter is not allowed when using unsigned upload
    //     // formData.append('moderation', 'manual')
    //     const response = await fetch(cloudinaryUrl, {
    //       method: 'POST',
    //       body: formData,
    //     })
    //     const cloudinaryResponse = await response.json()
    //     // submit data to mongodb
    //     await fetch('/plants', {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         primaryName: primaryName,
    //         secondaryName: secondaryName,
    //         light: light,
    //         water: water,
    //         temperature: temperature,
    //         humidity: humidity,
    //         toxic: toxic === 'true' ? true : false,
    //         imageUrl: cloudinaryResponse.url,
    //         sourceUrl: sourceUrl,
    //       }),
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //     })
    //       .then((res) => {
    //         if (res.status === 500) {
    //           // TODO: display error to user?
    //           console.error('An error occured when submitting plant data.')
    //         }
    //         return res.json()
    //       })
    //       .then((data) => {
    //         if (data) {
    //           // console.log(data.data.ops[0])
    //           console.log('New plant successfully added to database.')
    //           setNewPlant(data.data.ops[0])
    //           // reset form and clear state
    //           setPrimaryName('')
    //           setSecondaryName('')
    //           setLight('')
    //           setWater('')
    //           setTemperature('')
    //           setHumidity('')
    //           setToxic('')
    //           setImages()
    //           setSourceUrl('')
    //           // scroll to top
    //           window.scrollTo(0, 0)
    //         }
    //       })
    //   })
    // } else {
    //   // TODO:
    //   console.log('not admin')
    // }
  }

  return (
    <Wrapper>
      <FadeIn>
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
            <PlantCard key={newPlant._id} plant={newPlant} />
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
          <Heading>houseplant info</Heading>
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
            // validateOnChange={false}
            // validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                {status && <div className='status'>{status}</div>}
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
                  options={['average', 'above average']}
                />
                <Select
                  label='Humidity'
                  name='humidity'
                  type='select'
                  options={['average', 'above average']}
                />
                {/* FIXME: radio instead of checkbox? */}
                <Checkbox name='toxic'>This plant is toxic</Checkbox>
                <DropZone>
                  {/* TODO:
                    - make this work with formik
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
                  <button className='secondary' disabled onClick={() => console.log('clear form')}>
                    CLEAR
                  </button>
                  <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <Ellipsis /> : 'SUBMIT'}
                  </button>
                </div>
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
      align-items: center;
      justify-content: space-evenly;
      .msg {
        h2 {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
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
        }
      }
    }
  }
  @media only screen and (min-width: 500px) {
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
  form {
    display: flex;
    flex-direction: column;
    .form-item {
      padding: 15px 0;
      border-bottom: 1px solid #fff;
      &:last-child {
        border: none;
      }
    }
    .text-wrapper {
      display: flex;
      flex-direction: column;
    }
    .select-wrapper {
      display: flex;
      justify-content: space-between;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      white-space: pre;
      a {
        text-decoration: underline;
      }
    }
    .checkbox-input {
      margin-right: 10px;
    }
    input,
    select {
      border: 2px solid transparent;
      border-radius: 10px;
      padding: 10px;
      transition: 0.2s ease-in-out;
      &:focus {
        border: 2px solid ${COLORS.light};
        &:not([type='radio']) {
          outline: none;
        }
      }
      ::placeholder {
        font-style: italic;
      }
    }
    .info-text {
      color: #666;
      font-style: italic;
      font-size: 0.8rem;
    }
    .error {
      color: #ff0000;
      font-size: 0.8rem;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
    }
    button {
      background: ${COLORS.darkest};
      color: ${COLORS.lightest};
      height: 50px;
      margin: 20px 0;
      border-radius: 10px;
      padding: 10px 20px;
      &:hover {
        background: ${COLORS.medium};
      }
      &:focus {
        background: ${COLORS.medium};
      }
      &:disabled {
        pointer-events: none;
      }
      &.secondary {
        background: transparent;
        border: 2px solid ${COLORS.darkest};
        color: ${COLORS.darkest};
      }
    }
  }
`

const Heading = styled.h2`
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  padding: 0 20px 10px 20px;
  margin-bottom: 10px;
  text-align: center;
`

const DropZone = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #fff;
  .guidelines-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .guidelines {
      margin-right: 50px;
      ul {
        font-size: 0.9rem;
        list-style: disc inside;
      }
    }
    @media only screen and (min-width: 1000px) {
      flex-direction: row;
    }
  }
  .preview-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    .thumbnail {
      display: inline-flex;
      border-radius: 2px;
      border: 1px solid #eaeaea;
      margin-bottom: 8px;
      margin-right: 8px;
      width: 100px;
      height: 100px;
      padding: 4px;
      box-sizing: border-box;
      .thumbnail-inner {
        display: flex;
        min-width: 0px;
        overflow: hidden;
        img {
          display: block;
          width: auto;
          height: 100%;
        }
      }
    }
  }
`

const DropBox = styled.div`
  background: ${props => (props.isDragAccept ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.4)`)};
  border: ${props => (props.isDragAccept ? `2px solid ${COLORS.light}` : `2px dotted #ccc`)};
  color: ${props => (props.isDragAccept ? `${COLORS.light}` : '#ccc')};
  margin: 10px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 150px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  .icon {
    font-size: 4rem;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${COLORS.light};
    color: ${COLORS.light};
  }
`
