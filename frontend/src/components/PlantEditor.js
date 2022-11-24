import { useState } from 'react'
import styled from 'styled-components'
import Resizer from 'react-image-file-resizer'
import { useHistory } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { API_URL } from '../constants'
import { message, Upload, Alert, Button } from 'antd'
import { Formik, Form } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Input, Select } from 'formik-antd'
import * as Yup from 'yup'
import axios from 'axios'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ImageLoader } from '../components/loaders/ImageLoader'
import placeholder from '../assets/plant-placeholder.svg'
import { Ellipsis } from '../components/loaders/Ellipsis'
const { Option } = Select

export const PlantEditor = ({ plant, slug, currentUser, setEditDrawerOpen }) => {
  const history = useHistory()
  const queryClient = new useQueryClient()

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

  const [newImage, setNewImage] = useState(false)
  const handleNewImage = async fileData => {
    setUploading(true)
    const image = await resizeFile(fileData.file)
    setNewImage(image)
    setUploading(false)
  }

  const initialValues = {
    imageUrl: plant.imageUrl,
    primaryName: plant.primaryName,
    secondaryName: plant.secondaryName,
    light: plant.light,
    water: plant.water,
    temperature: plant.temperature,
    humidity: plant.humidity,
    toxic: plant.toxic,
    review: plant.review,
    sourceUrl: plant.sourceUrl,
  }

  const schema = Yup.object().shape({
    imageUrl: Yup.string().required('Required'),
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

    try {
      const formData = new FormData()
      formData.append('file', newImage)
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)

      if (newImage) {
        // upload new image to cloudinary
        const cloudinaryRes = await axios.post(cloudinaryUrl, formData)
        values.imageUrl = cloudinaryRes.data.secure_url
      }

      const data = {
        slug: values.primaryName.replace(/\s+/g, '-').toLowerCase(),
        ...values,
      }

      // update plant data in db
      await axios
        .put(`${API_URL}/plants/${plant._id}`, data)
        .then(() => {
          message.success('Plant updated')
          setEditDrawerOpen(false)
          // push to new route if primaryName/slug changed
          if (data.slug !== slug) {
            history.push(`/plant/${data.slug}`)
          } else {
            queryClient.invalidateQueries('plant')
            queryClient.invalidateQueries('similar-plants')
          }
          queryClient.invalidateQueries('plants-to-review')
          queryClient.invalidateQueries('pending-plants')
          queryClient.invalidateQueries('plants')
          window.scrollTo(0, 0)
        })
        .catch(err => {
          setStatus(err.response.data.message)
        })
    } catch (err) {
      setStatus(err.response.data.message)
    }
    setSubmitting(false)
  }

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}>
        {({ status, setValues, isSubmitting, resetForm, submitForm }) => (
          <Form>
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
                }}>
                {!uploading && (newImage || plant.imageUrl) ? (
                  <ImageLoader src={newImage || plant.imageUrl} alt='' placeholder={placeholder} />
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

            <FormItem label='Botanical name' name='primaryName'>
              <Input name='primaryName' placeholder='Monstera deliciosa' />
            </FormItem>

            <FormItem label='Common name' sublabel='(optional)' name='secondaryName'>
              <Input name='secondaryName' placeholder='Swiss Cheese Plant' />
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

            <FormItem name='toxic' label='Toxicity'>
              <Select name='toxic' placeholder='Select'>
                <Option value={true}>toxic</Option>
                <Option value={false}>nontoxic</Option>
              </Select>
            </FormItem>

            <FormItem label='Source URL' name='sourceUrl'>
              <Input name='sourceUrl' placeholder='https://www.plantpedia.com/monstera-deliciosa' />
            </FormItem>

            <FormItem label='Review status' sublabel='(optional)' name='review'>
              <Select name='review' placeholder='Select'>
                <Option value='pending'>Pending</Option>
                <Option value='approved'>Approved</Option>
                <Option value='rejected'>Rejected</Option>
              </Select>
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
                  setValues(initialValues)
                  resetForm()
                }}>
                RESET
              </Button>
              <Button
                type='primary'
                disabled={isSubmitting || !currentUser.emailVerified}
                loading={isSubmitting}
                onClick={submitForm}>
                SAVE
              </Button>
            </div>
            {status && <Alert type='error' message={status} showIcon />}
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  form {
    display: flex;
    flex-direction: column;
    .primary-image {
      display: flex;
      flex: 1;
      width: 100%;
      aspect-ratio: 1 / 1;
      margin-bottom: 20px;
      position: relative;
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
