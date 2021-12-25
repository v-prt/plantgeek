import React, { useContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { UserContext } from '../contexts/UserContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestPlants, receivePlants } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn'
import { Ellipsis } from '../components/loaders/Ellipsis'
import checkmark from '../assets/checkmark.svg'
import { RiImageAddFill, RiImageAddLine } from 'react-icons/ri'
import { ImCross } from 'react-icons/im'
import maranta from '../assets/maranta.jpeg'

import { PlantCard } from '../components/PlantCard'

// TODO: formik
export const Contribute = () => {
  const dispatch = useDispatch()
  // TODO: reward users with badges for approved submissions? (display # of submissions)
  const { currentUser } = useContext(UserContext)
  const plants = useSelector(plantsArray)
  const [loading, setLoading] = useState(false)

  // plant data
  const [species, setSpecies] = useState('')
  const [genus, setGenus] = useState('')
  const [light, setLight] = useState('')
  const [water, setWater] = useState('')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [toxic, setToxic] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // check if plant data already exists in db to prevent duplicates
  const [existingPlant, setExistingPlant] = useState(false)
  useEffect(() => {
    setExistingPlant(
      plants.find((plant) => {
        return plant.species === species.toLowerCase()
      })
    )
  }, [plants, species])

  // DROPZONE
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
  const [images, setImages] = useState()
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    multiple: false, // accepts only 1 image
    onDrop: (acceptedFiles) => {
      setImages(
        acceptedFiles.map((image) =>
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
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  // prevent form submission unless all fields have been completed
  const [completeForm, setCompleteForm] = useState(false)
  useEffect(() => {
    if (
      species &&
      genus &&
      light &&
      water &&
      temperature &&
      humidity &&
      toxic &&
      images &&
      sourceUrl
    ) {
      setCompleteForm(true)
    } else {
      setCompleteForm(false)
    }
  }, [species, genus, light, water, temperature, humidity, toxic, images, sourceUrl])

  // UPDATES STORE AFTER NEW PLANT ADDED TO DB
  const [newPlant, setNewPlant] = useState()
  useEffect(() => {
    if (newPlant) {
      dispatch(requestPlants())
      fetch('/plants')
        .then((res) => res.json())
        .then((json) => {
          dispatch(receivePlants(json.data))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [dispatch, newPlant])

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (completeForm) {
      setLoading(true)
      if (currentUser.role === 'admin') {
        // upload image to cloudinary via dropzone
        images.forEach(async (image) => {
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
          fetch('/plants', {
            method: 'POST',
            body: JSON.stringify({
              species: species,
              genus: genus,
              light: light,
              water: water,
              temperature: temperature,
              humidity: humidity,
              toxic: toxic === 'true' ? true : false,
              imageUrl: cloudinaryResponse.url,
              sourceUrl: sourceUrl,
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((res) => {
              if (res.status === 500) {
                // TODO: display error to user?
                console.error('An error occured when submitting plant data.')
                setLoading(false)
              }
              return res.json()
            })
            .then((data) => {
              if (data) {
                // console.log(data.data.ops[0])
                console.log('New plant successfully added to database.')
                setNewPlant(data.data.ops[0])
                // reset form and clear state
                document.getElementById('plant-submission-form').reset()
                setSpecies('')
                setGenus('')
                setLight('')
                setWater('')
                setTemperature('')
                setHumidity('')
                setToxic('')
                setImages()
                setSourceUrl('')
                setLoading(false)
                // scroll to top
                window.scrollTo(0, 0)
              }
            })
        })
      } else {
        // TODO:
        console.log('not admin')
      }
    }
  }

  return (
    <Wrapper>
      <FadeIn>
        <Heading>contribute</Heading>
        <div className='content'>
          {newPlant && (
            <section className='confirmation'>
              <div className='msg'>
                <h2>
                  <img className='checkmark' src={checkmark} alt='' />
                  New plant submitted
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
          <section className='introduction'>
            <h2>Help us grow</h2>
            <p>
              Submit new data through the form below so we can all take better care of our beloved
              houseplants! Please include a link to a reliable source to help verify the information
              you provide. We review all submissions prior to uploading in order to maintain the
              integrity of our database.
            </p>
          </section>
          <Form id='plant-submission-form' autoComplete='off'>
            <h2>Houseplant Info</h2>
            <p className='info-text'>Note: all fields required.</p>
            <div className='form-group text'>
              <label htmlFor='species'>Species</label>
              <input
                required
                type='text'
                id='species'
                placeholder='e.g. Monstera deliciosa'
                onChange={(ev) => setSpecies(ev.target.value.toLowerCase())}
                autoFocus
              />
              <Error error={existingPlant}>This plant has already been registered.</Error>
            </div>
            {/* TODO: choose from existing genus or input new */}
            <div className='form-group text'>
              <label htmlFor='genus'>Genus</label>
              <input
                required
                type='text'
                id='genus'
                placeholder='e.g. Monstera'
                onChange={(ev) => setGenus(ev.target.value.toLowerCase())}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='light'>Light</label>
              <select required name='light' id='light' onChange={(ev) => setLight(ev.target.value)}>
                {/* FIXME: Warning: Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>. */}
                <option value='DEFAULT' selected disabled>
                  select
                </option>
                <option value='low to bright indirect'>low to bright indirect</option>
                <option value='medium indirect'>medium indirect</option>
                <option value='medium to bright indirect'>medium to bright indirect</option>
                <option value='bright indirect'>bright indirect</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='water'>Water</label>
              <select required name='water' id='water' onChange={(ev) => setWater(ev.target.value)}>
                <option value='DEFAULT' selected disabled>
                  select
                </option>
                <option value='low'>low</option>
                <option value='low to medium'>low to medium</option>
                <option value='medium'>medium</option>
                <option value='medium to high'>medium to high</option>
                <option value='high'>high</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='temperature'>Temperature</label>
              <select
                required
                name='temperature'
                id='temperature'
                onChange={(ev) => setTemperature(ev.target.value)}>
                <option value='DEFAULT' selected disabled>
                  select
                </option>
                <option value='average'>average</option>
                <option value='above average'>above average</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='humidity'>Humidity</label>
              <select
                required
                name='humidity'
                id='humidity'
                onChange={(ev) => setHumidity(ev.target.value)}>
                <option value='DEFAULT' selected disabled>
                  select
                </option>
                <option value='average'>average</option>
                <option value='above average'>above average</option>
              </select>
            </div>
            <div className='form-group'>
              <p>Toxic?</p>
              <div>
                <input
                  name='toxic'
                  id='toxic'
                  type='radio'
                  value={true}
                  onChange={(ev) => setToxic(ev.target.value)}
                />
                <label htmlFor='toxic' style={{ margin: '0 30px 0 5px' }}>
                  Yes
                </label>
                <input
                  name='toxic'
                  id='nontoxic'
                  type='radio'
                  value={false}
                  onChange={(ev) => setToxic(ev.target.value)}
                />
                <label htmlFor='nontoxic' style={{ marginLeft: '5px' }}>
                  No
                </label>
              </div>
            </div>
            <DropZone>
              {/* TODO:
              - set up signed uploads with cloudinary
              - set up a way to approve images before saving to db (cloudinary analysis using amazon rekognition, must be plant and pass guidelines, no offensive content) */}
              <p>
                Upload image <span className='info-text'>(please follow our guidelines)</span>
              </p>
              <ul className='guidelines'>
                <li key={1}>houseplants only</li>
                <li key={2}>1:1 aspect ratio (square)</li>
                <li key={3}>display the whole plant in a plain pot</li>
                <li key={4}>white background</li>
                <li>well lit & in focus (no blurry images)</li>
                <li>full color (no filters)</li>
                <li>max 1 image (up to 1mb)</li>
              </ul>
              <p className='info-text'>Example:</p>
              <img style={{ height: '200px' }} src={maranta} alt='' />
              <DropBox {...getRootProps()} isDragAccept={isDragAccept} isDragReject={isDragReject}>
                <input {...getInputProps()} />
                <div className='icon'>
                  {isDragAccept && <RiImageAddFill />}
                  {isDragReject && <ImCross />}
                  {!isDragActive && <RiImageAddLine />}
                </div>
              </DropBox>
              <div className='preview-container'>
                {images &&
                  images.map((image) => (
                    <div className='thumbnail' key={image.name}>
                      <div className='thumbnail-inner'>
                        <img src={image.preview} alt={image.name} />
                      </div>
                    </div>
                  ))}
              </div>
            </DropZone>
            {/* TODO: accept multiple source links? */}
            <div className='form-group text'>
              <label htmlFor='source'>Source</label>
              <input
                required
                type='url'
                id='source'
                placeholder='Insert URL'
                onChange={(ev) => setSourceUrl(ev.target.value)}
              />
            </div>
            <Button
              type='submit'
              onClick={handleSubmit}
              disabled={!completeForm || existingPlant || loading}>
              {loading ? <Ellipsis /> : 'SUBMIT'}
            </Button>
          </Form>
          {/* TODO: background/decorative image */}
        </div>
      </FadeIn>
    </Wrapper>
  )
}

// TODO: cleanup css code
const Wrapper = styled.main`
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    section {
      background: #fff;
      width: 80%;
      margin-top: 30px;
      border-radius: 20px;
      padding: 30px;
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
  }
`

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid ${COLORS.light};
`

const Form = styled.form`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 30px 0;
  padding: 30px;
  border-radius: 20px;
  .form-group {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #fff;
    &:last-child {
      border: none;
    }
    input,
    select {
      border: 2px solid transparent;
      border-radius: 10px;
      padding: 5px;
      font-size: 0.9rem;
      transition: 0.2s ease-in-out;
      &:focus {
        border: 2px solid ${COLORS.light};
        /* TODO: improve focus style of radio buttons (use a custom styled span?) */
        &:not([type='radio']) {
          outline: none;
        }
      }
      ::placeholder {
        font-style: italic;
      }
    }
    &.text {
      flex-direction: column;
      label {
        align-self: flex-start;
      }
      input {
        width: 100%;
      }
    }
  }
  .info-text {
    color: #666;
    font-style: italic;
    font-size: 0.8rem;
  }
`

const Error = styled.p`
  visibility: ${(props) => (props.error ? 'visible' : 'hidden')};
  max-height: ${(props) => (props.error ? '100px' : '0')};
  opacity: ${(props) => (props.error ? '1' : '0')};
  color: #ff0000;
  text-align: center;
  transition: 0.2s ease-in-out;
`

const Button = styled.button`
  background: ${COLORS.darkest};
  color: ${COLORS.lightest};
  margin: 30px 0;
  border-radius: 15px;
  padding: 10px;
  &:hover {
    background: ${COLORS.medium};
  }
  &:focus {
    background: ${COLORS.medium};
  }
  &:disabled:hover {
    background: ${COLORS.darkest};
  }
`

const DropZone = styled.div`
  width: 80%;
  padding: 15px 0;
  border-bottom: 1px solid #fff;
  .guidelines {
    font-size: 0.9rem;
    list-style: disc inside;
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
  background: ${(props) =>
    props.isDragAccept ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.4)`};
  border: ${(props) => (props.isDragAccept ? `2px solid ${COLORS.light}` : `2px dotted #ccc`)};
  color: ${(props) => (props.isDragAccept ? `${COLORS.light}` : '#ccc')};
  margin: 10px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 150px;
  cursor: pointer;
  .icon {
    font-size: 4rem;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${COLORS.light};
    color: ${COLORS.light};
  }
`
