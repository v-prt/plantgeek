import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import Resizer from 'react-image-file-resizer'
import { API_URL } from '../constants'
import { message, Upload, Modal, Alert, Button } from 'antd'
import moment from 'moment'
import { Formik, Form } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Input, Select } from 'formik-antd'
import * as Yup from 'yup'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { BiLogInCircle } from 'react-icons/bi'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ImageLoader } from '../components/loaders/ImageLoader'
import placeholder from '../assets/plant-placeholder.svg'
import { MailOutlined } from '@ant-design/icons'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'
import { ActionBox } from '../components/ActionBox'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { PlantCard } from '../components/PlantCard'
import { Ellipsis } from '../components/loaders/Ellipsis'
const { Option } = Select

export const PlantProfile = () => {
  const { slug } = useParams()
  const [plantId, setPlantId] = useState('')
  const { currentUser } = useContext(UserContext)
  const history = useHistory()
  const [difficulty, setDifficulty] = useState()
  const queryClient = new useQueryClient()
  const [image, setImage] = useState(undefined)
  const [suggestionModal, setSuggestionModal] = useState(false)

  const { data: plant, status } = useQuery(['plant', slug], async () => {
    try {
      const { data } = await axios.get(`${API_URL}/plant/${slug}`)
      return data.plant
    } catch (err) {
      if (err.response.status === 404) return null
    }
  })

  const { data: suggestions } = useQuery(['suggestions', slug], async () => {
    const { data } = await axios.get(`${API_URL}/suggestions/${slug}`)
    return data.suggestions
  })

  const { data: similarPlants, status: similarPlantsStatus } = useQuery(
    ['similar-plants', slug],
    async () => {
      const { data } = await axios.get(`${API_URL}/similar-plants/${slug}`)
      return data.similarPlants
    }
  )

  useEffect(() => {
    if (plant) {
      setPlantId(plant._id)
      setImage(plant.imageUrl)
    }
  }, [plant])

  useDocumentTitle(plant?.primaryName ? `${plant?.primaryName} • plantgeek` : 'plantgeek')

  // setting plant care difficulty
  useEffect(() => {
    if (plant && plant.light && plant.water && plant.temperature && plant.humidity) {
      let lightLevel = 0
      let waterLevel = 0
      let temperatureLevel = 0
      let humidityLevel = 0
      if (plant.light === 'low to bright indirect') {
        lightLevel = 0
      } else if (plant.light === 'medium to bright indirect') {
        lightLevel = 1
      } else if (plant.light === 'bright indirect') {
        lightLevel = 3
      }
      if (plant.water === 'low') {
        waterLevel = 0
      } else if (plant.water === 'low to medium') {
        waterLevel = 1
      } else if (plant.water === 'medium') {
        waterLevel = 2
      } else if (plant.water === 'medium to high') {
        waterLevel = 3
      } else if (plant.water === 'high') {
        waterLevel = 4
      }
      if (plant.temperature === 'average') {
        temperatureLevel = 0
      } else if (plant.temperature === 'above average') {
        temperatureLevel = 2
      }
      if (plant.humidity === 'low') {
        humidityLevel = 1
      } else if (plant.humidity === 'medium') {
        humidityLevel = 2
      } else if (plant.humidity === 'high') {
        humidityLevel = 3
      }
      let total = lightLevel + waterLevel + temperatureLevel + humidityLevel
      // lowest = 0
      // highest = 12
      if (total <= 3) {
        setDifficulty('Easy')
      } else if (total <= 6) {
        setDifficulty('Moderate')
      } else if (total <= 12) {
        setDifficulty('Hard')
      }
    }
  }, [plant])

  // #region ADMIN ACTIONS

  // IMAGE UPLOAD
  const [uploading, setUploading] = useState(false)
  const fileList = []
  const uploadButton = <div>{uploading ? <Ellipsis /> : <PlusOutlined />}</div>
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`

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

  // handling image upload
  const handleImageUpload = async fileData => {
    setUploading(true)
    const image = await resizeFile(fileData.file)

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)

    await axios
      // uploading image to cloudinary
      .post(cloudinaryUrl, formData)
      .then(res => {
        const imageUrl = res.data.secure_url
        // updating plant with new image url
        axios
          .put(`${API_URL}/plants/${plantId}`, { imageUrl })
          .then(() => {
            message.success('Image uploaded.')
            setImage(imageUrl)
            queryClient.invalidateQueries('plant')
            queryClient.invalidateQueries('plants')
            setUploading(false)
          })
          .catch(err => {
            console.log(err)
            message.error('Something went wrong on the server. Please try again.')
            setUploading(false)
          })
      })
      .catch(err => {
        console.log(err)
        message.error('Something went wrong with cloudinary. Please try again.')
        setUploading(false)
      })
  }

  // UPDATE PLANT
  const [editMode, setEditMode] = useState(false)

  const initialValues = {
    primaryName: plant?.primaryName,
    secondaryName: plant?.secondaryName,
    light: plant?.light,
    water: plant?.water,
    temperature: plant?.temperature,
    humidity: plant?.humidity,
    toxic: plant?.toxic,
    review: plant?.review,
    sourceUrl: plant?.sourceUrl,
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
  })

  const handleSubmit = async (values, { setStatus, setSubmitting }) => {
    setStatus('')
    setSubmitting(true)
    const data = {
      slug: values.primaryName.replace(/\s+/g, '-').toLowerCase(),
      ...values,
    }
    try {
      await axios.put(`${API_URL}/plants/${plantId}`, data)

      message.success('Plant updated.')
      setEditMode(false)

      // push to new route if primaryName/slug changed
      if (data.slug !== slug) {
        history.push(`/plant/${data.slug}`)
      } else {
        queryClient.invalidateQueries('plant')
        queryClient.invalidateQueries('similar-plants')
      }
      queryClient.invalidateQueries('plants')
    } catch (err) {
      setStatus(err.response.data.message)
    }
    setSubmitting(false)
  }

  const removeImage = async () => {
    try {
      // TODO: test
      await axios.put(`${API_URL}/plants/${plantId}`, {
        imageUrl:
          // 'https://res.cloudinary.com/plantgeek/image/upload/v1664931643/plantgeek-plants/plant-placeholder_z8s1n7.png',
          null,
      })
      queryClient.invalidateQueries('plant')
      queryClient.invalidateQueries('plants')
      message.success('Image removed.')
    } catch (err) {
      console.log(err)
      message.error('Sorry, something went wrong.')
    }
  }

  // DELETE PLANT
  const handleDelete = plantId => {
    if (
      window.confirm(
        'Are you sure you want to delete this plant from the database? This cannot be undone!'
      )
    ) {
      history.push('/browse')
      axios.delete(`${API_URL}/plants/${plantId}`).catch(err => console.log(err))
    }
  }

  // #endregion ADMIN ACTIONS

  return (
    <Wrapper>
      {status === 'success' ? (
        plant ? (
          <>
            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSubmit}>
              {({ status, submitForm, isSubmitting }) => (
                <Form>
                  <FadeIn>
                    <section className='heading'>
                      {plant.review === 'pending' && (
                        <div className='review-pending'>
                          <Alert
                            type='warning'
                            message='This plant is pending review by an admin.'
                            showIcon
                          />
                        </div>
                      )}
                      {plant.review === 'rejected' && (
                        <div className='review-pending'>
                          <Alert
                            type='error'
                            message='This plant has been rejected by an admin. The information may be incorrect or is a duplicate.'
                            showIcon
                          />
                        </div>
                      )}
                      {editMode ? (
                        <div className='basic-info-form'>
                          <FormItem label='Botanical name' name='primaryName'>
                            <Input
                              name='primaryName'
                              placeholder='Monstera deliciosa'
                              style={{ width: '100%' }}
                              prefix={<EditOutlined />}
                            />
                          </FormItem>
                          <FormItem label='Common name' sublabel='(optional)' name='secondaryName'>
                            <Input
                              name='secondaryName'
                              placeholder='Swiss cheese plant'
                              style={{ width: '100%' }}
                              prefix={<EditOutlined />}
                            />
                          </FormItem>
                          <FormItem label='Review status' sublabel='(optional)' name='review'>
                            <Select name='review' placeholder='Select' style={{ width: '100%' }}>
                              <Option value='pending'>Pending</Option>
                              <Option value='approved'>Approved</Option>
                              <Option value='rejected'>Rejected</Option>
                            </Select>
                          </FormItem>
                        </div>
                      ) : (
                        <>
                          <h1>{plant.primaryName?.toLowerCase()}</h1>
                          <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
                        </>
                      )}
                      {currentUser?.role === 'admin' &&
                        (editMode ? (
                          <>
                            {status && <Alert type='error' message={status} showIcon />}
                            <div className='buttons'>
                              <Button
                                type='primary'
                                icon={<SaveOutlined />}
                                loading={isSubmitting}
                                onClick={() => submitForm()}>
                                SAVE
                              </Button>
                              <Button
                                type='secondary'
                                icon={<CloseCircleOutlined />}
                                onClick={() => setEditMode(false)}>
                                CANCEL
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => setEditMode(true)}>
                            EDIT
                          </Button>
                        ))}
                    </section>
                  </FadeIn>
                  <FadeIn delay={200}>
                    <section className='plant-info'>
                      {currentUser?.role === 'admin' && editMode ? (
                        <div className='upload-wrapper'>
                          <div className='primary-image'>
                            <Upload
                              multiple={false}
                              maxCount={1}
                              name='plantImage'
                              customRequest={handleImageUpload}
                              fileList={fileList}
                              listType='picture-card'
                              accept='.png, .jpg, .jpeg, .webp'
                              showUploadList={{
                                showPreviewIcon: false,
                                showRemoveIcon: false,
                              }}>
                              {!uploading && image ? (
                                <ImageLoader src={image} alt={''} placeholder={placeholder} />
                              ) : (
                                uploadButton
                              )}
                              {!uploading && (
                                <div className='overlay'>
                                  <EditOutlined />
                                </div>
                              )}
                            </Upload>
                          </div>
                          <button
                            type='button'
                            onClick={() => removeImage()}
                            style={{ color: 'red' }}>
                            <DeleteOutlined /> Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className='primary-image'>
                          <ImageLoader src={image} alt={''} placeholder={placeholder} />
                          {/* TODO: gallery here */}
                        </div>
                      )}

                      {/* PLANT NEEDS */}
                      <Info>
                        <div className='needs'>
                          <div className='row'>
                            <img src={sun} alt='' />
                            <div className='column'>
                              {editMode ? (
                                <Select name='light' placeholder='Select' style={{ width: '100%' }}>
                                  <Option value='low to bright indirect'>
                                    low to bright indirect
                                  </Option>
                                  <Option value='medium to bright indirect'>
                                    medium to bright indirect
                                  </Option>
                                  <Option value='bright indirect'>bright indirect</Option>
                                </Select>
                              ) : (
                                <p>{plant.light || 'unknown'}</p>
                              )}
                              <Bar>
                                {plant.light === 'low to bright indirect' && (
                                  <Indicator level={'1'} />
                                )}
                                {plant.light === 'medium to bright indirect' && (
                                  <Indicator level={'2'} />
                                )}
                                {plant.light === 'bright indirect' && <Indicator level={'3'} />}
                              </Bar>
                            </div>
                          </div>
                          <div className='row'>
                            <img src={water} alt='' />
                            <div className='column'>
                              {editMode ? (
                                <Select name='water' placeholder='Select' style={{ width: '100%' }}>
                                  <Option value='low'>low</Option>
                                  <Option value='low to medium'>low to medium</Option>
                                  <Option value='medium'>medium</Option>
                                  <Option value='medium to high'>medium to high</Option>
                                  <Option value='high'>high</Option>
                                </Select>
                              ) : (
                                <p>{plant.water || 'unknown'}</p>
                              )}
                              <Bar>
                                {plant.water === 'low' && <Indicator level={'1'} />}
                                {plant.water === 'low to medium' && <Indicator level={'1-2'} />}
                                {plant.water === 'medium' && <Indicator level={'2'} />}
                                {plant.water === 'medium to high' && <Indicator level={'2-3'} />}
                                {plant.water === 'high' && <Indicator level={'3'} />}
                              </Bar>
                            </div>
                          </div>
                          <div className='row'>
                            <img src={temp} alt='' />
                            <div className='column'>
                              {editMode ? (
                                <Select
                                  name='temperature'
                                  placeholder='Select'
                                  style={{ width: '100%' }}>
                                  <Option value='average'>average (55-75°F)</Option>
                                  <Option value='above average'>above average (65-85°F)</Option>
                                </Select>
                              ) : (
                                <p>
                                  {plant.temperature === 'average'
                                    ? 'average (55-75°F)'
                                    : plant.temperature === 'above average'
                                    ? 'above average (65-85°F)'
                                    : plant.temperature || 'unknown'}
                                </p>
                              )}
                              <Bar>
                                {plant.temperature === 'average' && <Indicator level={'1-2'} />}
                                {plant.temperature === 'above average' && <Indicator level={'3'} />}
                              </Bar>
                            </div>
                          </div>
                          <div className='row'>
                            <img src={humidity} alt='' />
                            <div className='column'>
                              {editMode ? (
                                <Select
                                  name='humidity'
                                  placeholder='Select'
                                  style={{ width: '100%' }}>
                                  <Option value='low'>low (30-40%)</Option>
                                  <Option value='medium'>medium (40-50%)</Option>
                                  <Option value='high'>high (50-60%+)</Option>
                                </Select>
                              ) : (
                                <p>
                                  {plant.humidity === 'low'
                                    ? 'low (30-40%)'
                                    : plant.humidity === 'medium'
                                    ? 'medium (40-50%)'
                                    : plant.humidity === 'high'
                                    ? 'high (50-60%+)'
                                    : plant.humidity || 'unknown'}
                                </p>
                              )}
                              <Bar>
                                {plant.humidity === 'low' && <Indicator level={'1'} />}
                                {plant.humidity === 'medium' && <Indicator level={'2'} />}
                                {plant.humidity === 'high' && <Indicator level={'3'} />}
                              </Bar>
                            </div>
                          </div>
                          <Link to='/guidelines' className='link'>
                            <p>Care Tips</p>
                          </Link>
                        </div>
                        <div className='misc-info'>
                          <div className='difficulty'>
                            Difficulty:{' '}
                            <span className={difficulty?.toLowerCase()}>{difficulty || 'N/A'}</span>
                          </div>
                          {editMode ? (
                            <>
                              <FormItem name='toxic' label='Toxicity'>
                                <Select name='toxic' placeholder='Select' style={{ width: '100%' }}>
                                  <Option value={true}>toxic</Option>
                                  <Option value={false}>nontoxic</Option>
                                </Select>
                              </FormItem>
                              <FormItem name='sourceUrl' label='Source URL'>
                                <Input
                                  name='sourceUrl'
                                  placeholder='https://www.plantpedia.com/monstera-deliciosa'
                                  style={{ width: '100%' }}
                                />
                              </FormItem>
                            </>
                          ) : (
                            <>
                              <div className='toxicity'>
                                Toxicity:{' '}
                                {plant.toxic === false ? (
                                  <span className='nontoxic'>Pet friendly</span>
                                ) : plant.toxic === true ? (
                                  <span className='toxic'>Not pet friendly</span>
                                ) : (
                                  <span className='unknown'>Unknown</span>
                                )}
                              </div>
                              {plant.sourceUrl && (
                                <div className='sources'>
                                  Source:{' '}
                                  <a
                                    href={plant.sourceUrl}
                                    target='_blank'
                                    rel='noopenner noreferrer'>
                                    [1]
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </Info>
                    </section>
                  </FadeIn>
                </Form>
              )}
            </Formik>

            <FadeIn delay={400}>
              <div className='actions'>
                {/* COLLECTION / WISHLIST / HEARTS */}
                {plant.review !== 'pending' && plant.review !== 'rejected' && (
                  <ActionBox plant={plant} />
                )}

                {/* SUGGESTION SUBMISSION */}
                <section className='suggestions-section-user'>
                  <h3>Have a suggestion?</h3>
                  <p>
                    Please let us know if you have a suggestion for this plant or want to report
                    incorrect information.
                  </p>
                  <Button type='primary' onClick={() => setSuggestionModal(true)}>
                    <MailOutlined /> SEND SUGGESTION
                  </Button>
                  <Modal
                    visible={suggestionModal}
                    footer={null}
                    onCancel={() => setSuggestionModal(false)}>
                    <SuggestionSubmission>
                      {currentUser ? (
                        <Formik
                          initialValues={{
                            suggestion: '',
                            sourceUrl: '',
                          }}
                          validationSchema={Yup.object({
                            suggestion: Yup.string().required('Required'),
                            sourceUrl: Yup.string().url('Invalid URL'),
                          })}
                          onSubmit={async (values, { setSubmitting }) => {
                            if (currentUser.emailVerified) {
                              try {
                                await axios.post(`${API_URL}/suggestions/${plantId}`, {
                                  suggestion: values.suggestion,
                                  sourceUrl: values.sourceUrl,
                                  userId: currentUser._id,
                                })
                                message.success('Suggestion submitted! Thank you.')
                                setSuggestionModal(false)
                              } catch (err) {
                                console.log(err)
                                message.error(
                                  'Oops, something went wrong when submitting your suggestion.'
                                )
                              }
                            }
                          }}>
                          {({ isSubmitting, submitForm }) => (
                            <Form>
                              <h3>Submit a suggestion</h3>
                              <div className='instructions'>
                                <p>
                                  Please note any incorrect information on this plant and include
                                  your suggested change. If possible, include a source to help us
                                  validate your information.
                                </p>
                                <p>
                                  We also welcome suggestions for additional information to add to
                                  this plant's page. Thank you for your contribution!
                                </p>
                              </div>

                              <FormItem name='suggestion'>
                                <Input.TextArea
                                  name='suggestion'
                                  placeholder='Enter your suggestion'
                                  rows={4}
                                  style={{ resize: 'none' }}
                                />
                              </FormItem>
                              <FormItem name='source'>
                                <Input name='sourceUrl' placeholder='Source URL' />
                              </FormItem>
                              {!currentUser.emailVerified && (
                                <Alert
                                  type='warning'
                                  message='Please verify your email address to submit a suggestion.'
                                  showIcon
                                />
                              )}
                              <Button
                                type='primary'
                                disabled={isSubmitting || !currentUser.emailVerified}
                                loading={isSubmitting}
                                onClick={submitForm}>
                                SUBMIT
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      ) : (
                        // TODO: add redirect to return user here after they log in
                        <div className='login'>
                          <p>Please log in to submit a suggestion.</p>
                          <Link to='/login'>
                            <Button type='primary'>
                              <BiLogInCircle /> LOG IN
                            </Button>
                          </Link>
                        </div>
                      )}
                    </SuggestionSubmission>
                  </Modal>
                </section>
              </div>
            </FadeIn>

            {/* SIMILAR PLANTS */}
            <FadeIn delay={600}>
              <section className='similar-plants'>
                <h2>similar plants</h2>
                {/* TODO: carousel (1 at a time on mobile, 2 on tablet, 3 on desktop) */}
                <div className='similar-plants-container'>
                  {similarPlantsStatus === 'success' ? (
                    similarPlants?.length > 0 ? (
                      similarPlants.map(plant => <PlantCard key={plant._id} plant={plant} />)
                    ) : (
                      <p>No similar plants found.</p>
                    )
                  ) : (
                    <div className='loading'>
                      <Ellipsis />
                    </div>
                  )}
                </div>
              </section>
            </FadeIn>

            {/* ADMIN ONLY */}
            {currentUser?.role === 'admin' && (
              <FadeIn delay={700}>
                <AdminSection>
                  <h3>Admin</h3>
                  <div className='suggestions-admin'>
                    <h4>Suggestions from users</h4>
                    {/* TODO: filter suggestions by status */}
                    <div className='suggestions-list'>
                      {suggestions?.length > 0 ? (
                        suggestions.map((suggestion, i) => (
                          <div className='suggestion' key={i}>
                            <p className='user'>
                              {suggestion.user?.username}{' '}
                              <span className='id'>- User ID {suggestion.userId}</span>
                            </p>
                            <p className='date'>{moment(suggestion.dateSubmitted).format('lll')}</p>
                            <p className='text'>"{suggestion.suggestion}"</p>
                            {suggestion.sourceUrl ? (
                              <a
                                className='source'
                                href={suggestion.sourceUrl}
                                target='_blank'
                                rel='noopener noreferrer'>
                                Source
                              </a>
                            ) : (
                              <p style={{ color: '#999' }}>No source.</p>
                            )}
                            <Formik
                              initialValues={{ status: suggestion.status }}
                              onSubmit={async (values, { setSubmitting }) => {
                                try {
                                  await axios.put(`${API_URL}/suggestions/${suggestion._id}`, {
                                    status: values.status,
                                  })
                                  message.success('Suggestion status updated!')
                                  setSubmitting(false)
                                } catch (err) {
                                  console.log(err)
                                  message.error('Oops, something went wrong.')
                                }
                              }}>
                              {({ submitForm }) => (
                                <Form>
                                  <FormItem name='status'>
                                    <Select
                                      name='status'
                                      placeholder='Set status'
                                      onChange={() => submitForm()}>
                                      <Option value='pending'>
                                        <ClockCircleOutlined /> Pending
                                      </Option>
                                      <Option value='approved'>
                                        <LikeOutlined /> Approved
                                      </Option>
                                      <Option value='rejected'>
                                        <DislikeOutlined /> Rejected
                                      </Option>
                                    </Select>
                                  </FormItem>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#999' }}>No suggestions.</p>
                      )}
                    </div>
                  </div>
                  <div className='danger-zone'>
                    <p>DANGER ZONE</p>
                    <Button
                      type='danger'
                      onClick={() => handleDelete(plantId)}
                      icon={<DeleteOutlined />}>
                      DELETE PLANT
                    </Button>
                  </div>
                </AdminSection>
              </FadeIn>
            )}
          </>
        ) : (
          <section className='not-found'>
            <img src={placeholder} alt='' />
            <p>Plant not found.</p>
            <Link to='/'>
              <Button type='primary'>Go Home</Button>
            </Link>
          </section>
        )
      ) : (
        <section className='loading'>
          <BeatingHeart />
        </section>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  form {
    width: 100%;
    .basic-info-form {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 400px;
    }
  }
  .heading {
    background: ${COLORS.light};
    margin-bottom: 10px;
    .review-pending {
      margin-bottom: 20px;
    }
    h1 {
      line-height: 1;
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    .secondary-name {
      font-size: 1rem;
      font-style: italic;
    }
    .buttons {
      display: flex;
      gap: 10px;
    }
    button {
      margin-top: 20px;
    }
  }
  .plant-info {
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    .upload-wrapper {
      flex: 1;
      width: 100%;
      max-width: 400px;
      text-align: center;
      button {
        margin-top: 20px;
      }
    }
    .primary-image {
      display: flex;
      flex: 1;
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1 / 1;
      margin: auto;
      .ant-upload-list {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
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
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .suggestions-section-user {
    background: ${COLORS.mutedMedium};
    button {
      margin-top: 20px;
    }
  }
  .similar-plants {
    background: #f2f2f2;
    h2 {
      text-align: center;
      margin-bottom: 30px;
    }
    .similar-plants-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
  }
  .loading,
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  .not-found {
    background: #fff;
    gap: 20px;
    img {
      height: 100px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .heading {
      margin-bottom: 20px;
      h1 {
        font-size: 2rem;
      }
      .secondary-name-wrapper {
        font-size: 1rem;
      }
    }
    .plant-info {
      flex-direction: row;
      gap: 40px;
    }
    .actions {
      flex-direction: row;
      gap: 20px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .heading {
      margin-bottom: 30px;
    }
    .actions {
      gap: 30px;
    }
  }
`

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  .needs,
  .misc-info {
    background: #f2f2f2;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    align-items: center;
    margin: 10px 0;
    img {
      background: #fff;
      padding: 5px;
      border-radius: 50%;
      height: 40px;
      margin-right: 10px;
    }
    .column {
      flex: 1;
      p {
        font-size: 0.8rem;
      }
    }
  }
  .link {
    font-size: 0.8rem;
    color: ${COLORS.accent};
    margin-top: 10px;
    text-decoration: underline;
    width: fit-content;
  }
  .misc-info {
    gap: 10px;
    font-size: 0.9rem;
    color: #999;
    p {
      margin-right: 20px;
    }
    .difficulty,
    .toxicity,
    .sources {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: bold;
    }
    .difficulty {
      .easy {
        color: ${COLORS.mediumLight};
      }
      .moderate {
        color: ${COLORS.alert};
      }
      .hard {
        color: ${COLORS.danger};
      }
    }
    .toxicity {
      .ant-select {
        width: 150px;
      }
      .toxic {
        color: ${COLORS.alert};
      }
      .nontoxic {
        color: ${COLORS.light};
      }
      .unknown {
        color: #999;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .row {
      img {
        height: 45px;
        margin-right: 15px;
      }
      .column {
        p {
          font-size: 1rem;
        }
      }
    }
  }
`

const Bar = styled.div`
  background: rgba(0, 0, 0, 0.1);
  height: 15px;
  border-radius: 10px;
  margin-top: 5px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    height: 20px;
  }
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.light}, ${COLORS.mediumLight});
  height: 100%;
  border-radius: 10px;
  width: ${props => props.level === '1' && '25%'};
  width: ${props => props.level === '1-2' && '50%'};
  width: ${props => props.level === '1-3' && '100%'};
  width: ${props => props.level === '2' && '50%'};
  width: ${props => props.level === '2-3' && '75%'};
  width: ${props => props.level === '3' && '100%'};
`

const SuggestionSubmission = styled.div`
  padding: 20px 0;
  h3 {
    margin-bottom: 20px;
  }
  .instructions {
    p {
      margin-bottom: 20px;
    }
  }
  .info-text {
    font-size: 0.8rem;
    margin-bottom: 5px;
    opacity: 0.7;
  }
  button {
    margin: 20px auto 0 auto;
  }
  .login {
    text-align: center;
    button {
      display: flex;
      gap: 8px;
    }
  }
`

const AdminSection = styled.section`
  background: #fff;
  .suggestions-admin {
    margin: 20px 0;
  }
  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .suggestion {
      font-size: 0.8rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 10px 0;
      .user {
        color: ${COLORS.accent};
        font-weight: bold;
        .id {
          color: #999;
          font-weight: normal;
        }
      }
      .text {
        font-size: 1rem;
      }
      .source {
        color: ${COLORS.accent};
        text-decoration: underline;
      }
      .ant-select {
        max-width: 200px;
      }
    }
  }
  .danger-zone {
    background: #fff;
    width: 100%;
    margin-top: 30px;
    padding: 20px 0;
    border-top: 1px dotted #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      color: red;
    }
  }
`
