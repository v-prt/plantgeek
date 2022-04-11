import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Text, Select } from './FormItems'
import { Button } from 'antd'

import { RiImageAddFill, RiImageAddLine } from 'react-icons/ri'
import { ImCross } from 'react-icons/im'
import monstera from '../../assets/monstera.jpeg'
import { DropZone, DropBox } from '../../GlobalStyles'
import { FormWrapper } from '../../pages/Contribute'

// TODO: wip
export const UpdatePlant = ({ currentUser, plant }) => {
  const [status, setStatus] = useState(undefined)

  const PlantSchema = Yup.object().shape({
    primaryName: Yup.string().min(2, 'Too short').max(30, 'Too long').required('*required'),
    light: Yup.string().required('*required'),
    water: Yup.string().required('*required'),
    temperature: Yup.string().required('*required'),
    humidity: Yup.string().required('*required'),
    toxic: Yup.string().required('*required'),
    sourceUrl: Yup.string().required('*required'),
  })

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

  const handleUpdate = (values, { setSubmitting, resetForm }) => {
    setStatus(undefined)
    if (currentUser.role === 'admin') {
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
        await fetch(`/plants/${plant._id}`, {
          method: 'PUT',
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
              // setNewPlant(json.data.ops[0])
              setStatus(undefined)
              setSubmitting(false)
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
    <FormWrapper>
      <h2>Update Plant Information</h2>
      <Formik initialValues={plant} validationSchema={PlantSchema} onSubmit={handleUpdate}>
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
            <Select label='Humidity' name='humidity' type='select' options={['average', 'high']} />
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
                    New image <span className='info-text'>(please follow our guidelines)</span>
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
              <DropBox {...getRootProps()} isDragAccept={isDragAccept} isDragReject={isDragReject}>
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
            {status && <div className='status'>{status}</div>}
          </Form>
        )}
      </Formik>
    </FormWrapper>
  )
}
