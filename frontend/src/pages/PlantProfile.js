import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery, useQueryClient } from 'react-query'
import { message, Upload } from 'antd'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { ImageLoader } from '../components/loaders/ImageLoader'
import placeholder from '../assets/plant-placeholder.svg'
import { Alert, Button } from 'antd'
import { WarningOutlined, SafetyOutlined } from '@ant-design/icons'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'

import { ActionBox } from '../components/ActionBox'

export const PlantProfile = () => {
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const [difficulty, setDifficulty] = useState()
  const queryClient = new useQueryClient()
  const [image, setImage] = useState(undefined)

  const { data: plant } = useQuery(['plant', id], async () => {
    const { data } = await axios.get(`${API_URL}/plant/${id}`)
    return data.plant
  })

  useEffect(() => {
    if (plant) {
      setImage(plant.imageUrl)
    }
  }, [plant])

  // makes window scroll to top between renders
  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // })

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

  // IMAGE UPLOAD (ADMIN ONLY)
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

  // DELETE PLANT (ADMINS ONLY)
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

  return (
    <Wrapper>
      {plant ? (
        <>
          <FadeIn>
            {plant.review === 'pending' && (
              <Alert type='warning' message='This plant is pending review' showIcon />
            )}
            <section className='heading'>
              <h1>{plant.primaryName?.toLowerCase()}</h1>
              <div className='secondary-name-wrapper'>
                <b className='aka'>Also known as: </b>
                <span className='secondary-name'>
                  {plant.secondaryName ? plant.secondaryName : 'N/A'}
                </span>
              </div>
            </section>
          </FadeIn>
          <FadeIn>
            <section className='plant-info'>
              <div className='primary-image'>
                {currentUser?.role === 'admin' ? (
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
                  </Upload>
                ) : (
                  <ImageLoader src={image} alt={''} placeholder={placeholder} />
                )}
              </div>
              <Needs>
                <h2>Care information</h2>
                <div className='row'>
                  <img src={sun} alt='' />
                  <div className='column'>
                    <p>{plant.light} light</p>
                    <Bar>
                      {plant.light === 'low to bright indirect' && <Indicator level={'1'} />}
                      {plant.light === 'medium indirect' && <Indicator level={'1-2'} />}
                      {plant.light === 'medium to bright indirect' && <Indicator level={'2'} />}
                      {plant.light === 'bright indirect' && <Indicator level={'2-3'} />}
                      {plant.light === 'bright' && <Indicator level={'3'} />}
                    </Bar>
                  </div>
                </div>
                <div className='row'>
                  <img src={water} alt='' />
                  <div className='column'>
                    <p>{plant.water} water</p>
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
                    <p>{plant.temperature} temperature</p>
                    <Bar>
                      {plant.temperature === 'average' && <Indicator level={'1-2'} />}
                      {plant.temperature === 'warm' && <Indicator level={'3'} />}
                    </Bar>
                  </div>
                </div>
                <div className='row'>
                  <img src={humidity} alt='' />
                  <div className='column'>
                    <p>{plant.humidity} humidity</p>
                    <Bar>
                      {plant.humidity === 'average' && <Indicator level={'1-2'} />}
                      {plant.humidity === 'high' && <Indicator level={'3'} />}
                    </Bar>
                  </div>
                </div>
                <div className='misc-info'>
                  <p className='difficulty'>
                    Difficulty: <span className={difficulty?.toLowerCase()}>{difficulty}</span>
                  </p>
                  <p className='toxicity'>
                    Toxicity:{' '}
                    {plant.toxic ? (
                      <span className='toxic'>
                        <WarningOutlined /> Not pet friendly
                      </span>
                    ) : (
                      <span className='nontoxic'>
                        <SafetyOutlined /> Pet friendly
                      </span>
                    )}
                  </p>
                  {plant.sourceUrl && (
                    <p className='sources'>
                      Source(s):{' '}
                      <a href={plant.sourceUrl} target='_blank' rel='noopenner noreferrer'>
                        [1]
                      </a>
                    </p>
                  )}
                </div>
              </Needs>
            </section>
          </FadeIn>
          {currentUser && (
            <FadeIn>
              <ActionBox plantId={plant._id} />
            </FadeIn>
          )}
          {currentUser?.role === 'admin' && (
            <DangerZone>
              <p>DANGER ZONE (ADMIN)</p>
              <Button type='danger' onClick={() => handleDelete(plant._id)}>
                DELETE PLANT
              </Button>
            </DangerZone>
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
  }
  .plant-info {
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 20px;
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
        &.placeholder {
          border-radius: 0;
        }
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .heading {
      text-align: right;
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
  padding: 20px 30px;
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
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: #999;
    font-weight: bold;
    margin-top: 10px;
    p {
      margin-right: 20px;
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
  background: white;
  height: 15px;
  border-radius: 10px;
  margin: 5px 0;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    height: 20px;
  }
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light});
  height: 100%;
  border-radius: 10px;
  width: ${props => props.level === '1' && '25%'};
  width: ${props => props.level === '1-2' && '50%'};
  width: ${props => props.level === '1-3' && '100%'};
  width: ${props => props.level === '2' && '50%'};
  width: ${props => props.level === '2-3' && '75%'};
  width: ${props => props.level === '3' && '100%'};
`

const DangerZone = styled.div`
  background: #fff;
  width: 100%;
  margin: 30px 0;
  border: 1px dotted red;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    color: red;
  }
`
