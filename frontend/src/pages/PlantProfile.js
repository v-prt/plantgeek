import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery, useQueryClient } from 'react-query'
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
  LoadingOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ImageLoader } from '../components/loaders/ImageLoader'
import placeholder from '../assets/plant-placeholder.svg'
import { WarningOutlined, SafetyOutlined, MailOutlined } from '@ant-design/icons'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'
import { ActionBox } from '../components/ActionBox'
const { Option } = Select

export const PlantProfile = () => {
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const [difficulty, setDifficulty] = useState()
  const queryClient = new useQueryClient()
  const [image, setImage] = useState(undefined)
  const [suggestionModal, setSuggestionModal] = useState(false)

  const { data: plant } = useQuery(['plant', id], async () => {
    const { data } = await axios.get(`${API_URL}/plant/${id}`)
    return data.plant
  })

  const { data: suggestions } = useQuery(['suggestions', id], async () => {
    const { data } = await axios.get(`${API_URL}/suggestions/${id}`)
    return data.suggestions
  })

  useEffect(() => {
    if (plant) {
      setImage(plant.imageUrl)
    }
  }, [plant])

  // makes window scroll to top between renders
  const pathname = window.location.pathname
  useEffect(() => {
    if (pathname) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  // setting plant care difficulty
  useEffect(() => {
    if (plant && plant.light && plant.water && plant.temperature && plant.humidity) {
      let lightLevel = 0
      let waterLevel = 0
      let temperatureLevel = 0
      let humidityLevel = 0
      if (plant.light === 'low to bright indirect') {
        lightLevel = 0
      } else if (plant.light === 'medium indirect') {
        lightLevel = 1
      } else if (plant.light === 'medium to bright indirect') {
        lightLevel = 2
      } else if (plant.light === 'bright indirect') {
        lightLevel = 3
      } else if (plant.light === 'bright') {
        lightLevel = 4
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
      } else if (plant.temperature === 'warm') {
        temperatureLevel = 2
      }
      if (plant.humidity === 'average') {
        humidityLevel = 0
      } else if (plant.humidity === 'high') {
        humidityLevel = 2
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
  const uploadButton = <div>{uploading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`

  // checking file size before upload
  const checkSize = file => {
    const underLimit = file.size / 1024 / 1024 < 1
    if (!underLimit) {
      message.error('Image must be under 1 MB.')
    }
    return underLimit
  }

  // handling image upload
  const handleImageUpload = async fileData => {
    setUploading(true)

    const formData = new FormData()
    formData.append('file', fileData.file)
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)

    await axios
      // uploading image to cloudinary
      .post(cloudinaryUrl, formData)
      .then(res => {
        const imageUrl = res.data.secure_url
        // updating plant with new image url
        axios
          .put(`${API_URL}/plants/${id}`, { imageUrl })
          .then(() => {
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
  }

  const schema = Yup.object().shape({
    primaryName: Yup.string().min(2, 'Too short').required('Required'),
    secondaryName: Yup.string().min(2, 'Too short').required('Required'),
    light: Yup.string().required('Required'),
    water: Yup.string().required('Required'),
    temperature: Yup.string().required('Required'),
    humidity: Yup.string().required('Required'),
    toxic: Yup.string().required('Required'),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    // TODO: show when new info is loading after changes saved
    setSubmitting(true)
    try {
      await axios.put(`${API_URL}/plants/${id}`, values)
      queryClient.invalidateQueries('plant')
      queryClient.invalidateQueries('plants')
      message.success('Plant updated successfully!')
      setEditMode(false)
    } catch (err) {
      console.log(err)
      message.error('Something went wrong on the server. Please try again.')
    }
    setSubmitting(false)
  }

  const removeImage = async () => {
    // set to default placeholder image url from cloudinary
    try {
      await axios.put(`${API_URL}/plants/${id}`, {
        imageUrl:
          'https://res.cloudinary.com/plantgeek/image/upload/v1664931643/plantgeek-plants/plant-placeholder_z8s1n7.png',
      })
      queryClient.invalidateQueries('plant')
      queryClient.invalidateQueries('plants')
      message.success('Image removed.')
    } catch (err) {
      console.log(err)
      message.error('Something went wrong on the server. Please try again.')
    }
  }

  // DELETE PLANT
  const handleDelete = plantId => {
    if (
      window.confirm(
        'Are you sure you want to delete this plant from the database? This cannot be undone!'
      )
    ) {
      window.location.replace('/browse')
      axios.delete(`${API_URL}/plants/${plantId}`).catch(err => console.log(err))
    }
  }

  // #endregion ADMIN ACTIONS

  return (
    <Wrapper>
      {plant ? (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ submitForm, isSubmitting }) => (
              <Form>
                <FadeIn>
                  {plant.review === 'pending' && (
                    <Alert type='warning' message='This plant is pending review' showIcon />
                  )}
                  <section className='heading'>
                    {editMode ? (
                      <>
                        <FormItem
                          label='Latin name'
                          sublabel='(genus and species)'
                          name='primaryName'>
                          <Input
                            name='primaryName'
                            placeholder='Monstera deliciosa'
                            prefix={<EditOutlined />}
                          />
                        </FormItem>
                        <FormItem label='Common name' name='secondaryName'>
                          <Input
                            name='secondaryName'
                            placeholder='Swiss cheese plant'
                            prefix={<EditOutlined />}
                          />
                        </FormItem>
                      </>
                    ) : (
                      <>
                        <h1>{plant.primaryName?.toLowerCase()}</h1>
                        <div className='secondary-name-wrapper'>
                          <b className='aka'>Also known as: </b>
                          <span className='secondary-name'>
                            {plant.secondaryName ? plant.secondaryName : 'N/A'}
                          </span>
                        </div>
                      </>
                    )}
                    {currentUser?.role === 'admin' &&
                      (editMode ? (
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

                <FadeIn>
                  <section className='plant-info'>
                    {currentUser?.role === 'admin' && editMode ? (
                      <div className='upload-wrapper'>
                        <div className='primary-image'>
                          <Upload
                            multiple={false}
                            maxCount={1}
                            name='plantImage'
                            beforeUpload={checkSize}
                            customRequest={handleImageUpload}
                            fileList={fileList}
                            listType='picture-card'
                            accept='.png, .jpg, .jpeg'
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
                      </div>
                    )}
                    <Needs>
                      <h2>Care information</h2>
                      <div className='row'>
                        <img src={sun} alt='' />
                        <div className='column'>
                          {editMode ? (
                            <Select name='light' placeholder='Select'>
                              <Option value='low to bright indirect'>
                                light: low to bright indirect
                              </Option>
                              <Option value='medium indirect'>light: medium indirect</Option>
                              <Option value='medium to bright indirect'>
                                light: medium to bright indirect
                              </Option>
                              <Option value='bright indirect'>light: bright indirect</Option>
                              <Option value='bright'>light: bright</Option>
                            </Select>
                          ) : (
                            <p>light: {plant.light}</p>
                          )}
                          <Bar>
                            {plant.light === 'low to bright indirect' && <Indicator level={'1'} />}
                            {plant.light === 'medium indirect' && <Indicator level={'1-2'} />}
                            {plant.light === 'medium to bright indirect' && (
                              <Indicator level={'2'} />
                            )}
                            {plant.light === 'bright indirect' && <Indicator level={'2-3'} />}
                            {plant.light === 'bright' && <Indicator level={'3'} />}
                          </Bar>
                        </div>
                      </div>
                      <div className='row'>
                        <img src={water} alt='' />
                        <div className='column'>
                          {editMode ? (
                            <Select name='water' placeholder='Select'>
                              <Option value='low'>water: low</Option>
                              <Option value='low to medium'>water: low to medium</Option>
                              <Option value='medium'>water: medium</Option>
                              <Option value='medium to high'>water: medium to high</Option>
                              <Option value='high'>water: high</Option>
                            </Select>
                          ) : (
                            <p>water: {plant.water}</p>
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
                            <Select name='temperature' placeholder='Select'>
                              <Option value='average'>temperature: average</Option>
                              <Option value='warm'>temperature: warm</Option>
                            </Select>
                          ) : (
                            <p>temperature: {plant.temperature}</p>
                          )}
                          <Bar>
                            {plant.temperature === 'average' && <Indicator level={'1-2'} />}
                            {plant.temperature === 'warm' && <Indicator level={'3'} />}
                          </Bar>
                        </div>
                      </div>
                      <div className='row'>
                        <img src={humidity} alt='' />
                        <div className='column'>
                          {editMode ? (
                            <Select name='humidity' placeholder='Select'>
                              <Option value='average'>humidity: average</Option>
                              <Option value='high'>humidity: high</Option>
                            </Select>
                          ) : (
                            <p>humidity: {plant.humidity}</p>
                          )}
                          <Bar>
                            {plant.humidity === 'average' && <Indicator level={'1-2'} />}
                            {plant.humidity === 'high' && <Indicator level={'3'} />}
                          </Bar>
                        </div>
                      </div>
                      <div className='misc-info'>
                        <div className='difficulty'>
                          Difficulty:{' '}
                          <span className={difficulty?.toLowerCase()}>{difficulty}</span>
                        </div>
                        <div className='toxicity'>
                          Toxicity:{' '}
                          {editMode ? (
                            <Select name='toxic' placeholder='Select'>
                              <Option value={true}>toxic</Option>
                              <Option value={false}>nontoxic</Option>
                            </Select>
                          ) : plant.toxic ? (
                            <span className='toxic'>
                              <WarningOutlined /> Not pet friendly
                            </span>
                          ) : (
                            <span className='nontoxic'>
                              <SafetyOutlined /> Pet friendly
                            </span>
                          )}
                        </div>
                        {plant.sourceUrl && (
                          <div className='sources'>
                            Source(s):{' '}
                            <a href={plant.sourceUrl} target='_blank' rel='noopenner noreferrer'>
                              [1]
                            </a>
                          </div>
                        )}
                      </div>
                    </Needs>
                  </section>
                </FadeIn>
              </Form>
            )}
          </Formik>
          {currentUser && (
            <>
              <FadeIn>
                <ActionBox plantId={plant._id} />
              </FadeIn>
              <FadeIn>
                <section className='suggestions-section-user'>
                  <h3>Have a suggestion?</h3>
                  <p>
                    If you have a suggestion for a change to this plant's information, please let us
                    know!
                  </p>
                  <Button type='primary' onClick={() => setSuggestionModal(true)}>
                    <MailOutlined /> SEND SUGGESTION
                  </Button>
                  <Modal
                    visible={suggestionModal}
                    footer={null}
                    onCancel={() => setSuggestionModal(false)}>
                    <SuggestionSubmission>
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
                          try {
                            await axios.post(`${API_URL}/suggestions/${plant._id}`, {
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
                        }}>
                        {({ isSubmitting, submitForm }) => (
                          <Form>
                            <h3>Submit a suggestion</h3>
                            <div className='instructions'>
                              <p>
                                Please note any incorrect information on this plant and include your
                                suggested change. If possible, include a source to help us validate
                                your information.
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
                            <Button
                              type='primary'
                              disabled={isSubmitting}
                              loading={isSubmitting}
                              onClick={() => submitForm()}>
                              SUBMIT
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </SuggestionSubmission>
                  </Modal>
                </section>
              </FadeIn>
            </>
          )}
          {currentUser?.role === 'admin' && (
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
                  onClick={() => handleDelete(plant._id)}
                  icon={<DeleteOutlined />}>
                  DELETE PLANT
                </Button>
              </div>
            </AdminSection>
          )}
        </>
      ) : (
        // FIXME: should be right in center
        <BeatingHeart />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  form {
    width: 100%;
    .ant-input-affix-wrapper {
      width: 100%;
      max-width: 300px;
    }
    .ant-select {
      width: 100%;
    }
  }
  .heading {
    background: ${COLORS.light};
    h1 {
      line-height: 1;
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    .secondary-name-wrapper {
      font-size: 0.8rem;
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
  .suggestions-section-user {
    background: ${COLORS.mutedMedium};
    button {
      margin-top: 20px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .heading {
      h1 {
        font-size: 2rem;
      }
      .secondary-name-wrapper {
        font-size: 1rem;
      }
    }
    .plant-info {
      gap: 40px;
    }
  }
  @media only screen and (min-width: 1200px) {
    .plant-info {
      flex-direction: row;
    }
  }
`

const Needs = styled.div`
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 20px;
  flex: 1;
  h2 {
    font-size: 1.2rem;
    margin-bottom: 10px;
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
  .misc-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    font-size: 0.9rem;
    color: #999;
    font-weight: bold;
    margin-top: 10px;
    p {
      margin-right: 20px;
    }
    .difficulty,
    .toxicity,
    .sources {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .difficulty {
      .easy {
        color: ${COLORS.light};
      }
      .moderate {
        color: orange;
      }
      .hard {
        color: red;
      }
    }
    .toxicity {
      .ant-select {
        width: 150px;
      }
      .toxic {
        color: orange;
      }
      .nontoxic {
        color: ${COLORS.light};
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
  /* background: white; */
  background: rgba(0, 0, 0, 0.1);
  height: 15px;
  border-radius: 10px;
  margin-top: 5px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    height: 20px;
  }
`

const Indicator = styled.div`
  /* background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light}); */
  background: ${COLORS.light};
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
