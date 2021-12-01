import React, { useContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LoginContext } from '../context/LoginContext'
import { plantsArray } from '../reducers/plantReducer'
import { requestPlants, receivePlants } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import background from '../assets/monstera-bg.jpg'
// import { DropZone } from '../hooks/DropZone.js'
import { Error, Button } from './Login'
import { Ellipsis } from '../components/loaders/Ellipsis'

export const Contribute = () => {
  const dispatch = useDispatch()
  // TODO: reward users with badges for approved submissions?
  const { currentUser } = useContext(LoginContext)
  const plants = useSelector(plantsArray)
  const [loading, setLoading] = useState(false)

  const [species, setSpecies] = useState('')
  const [genus, setGenus] = useState('')
  const [light, setLight] = useState('')
  const [water, setWater] = useState('')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [toxic, setToxic] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const [existingPlant, setExistingPlant] = useState(false)
  useEffect(() => {
    setExistingPlant(
      plants.find((plant) => {
        return plant.species === species.toLowerCase()
      })
    )
  }, [plants, species])

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
      imageUrl &&
      sourceUrl
    ) {
      setCompleteForm(true)
    } else {
      setCompleteForm(false)
    }
  }, [species, genus, light, water, temperature, humidity, toxic, imageUrl, sourceUrl])

  // UPDATES STORE AFTER NEW PLANT ADDED TO DB
  const [newPlant, setNewPlant] = useState(false)
  useEffect(() => {
    dispatch(requestPlants())
    fetch('/plants')
      .then((res) => res.json())
      .then((json) => {
        dispatch(receivePlants(json.data))
      })
      .catch((err) => {
        console.log(err)
      })
  }, [dispatch, newPlant])

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setLoading(true)
    if (currentUser.role === 'admin') {
      // submit data directly to plants collection in db
      console.log('admin, submitting to db')
      fetch('/plants', {
        method: 'POST',
        body: JSON.stringify({
          species: species,
          genus: genus,
          light: light,
          water: water,
          temperature: temperature,
          humidity: humidity,
          toxic: toxic,
          imageUrl: imageUrl,
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
            console.log('New plant successfully added to database.')
            setNewPlant(true)
            setLoading(false)
          }
        })
    } else {
      // TODO: submit data for review (create new collection in db for review?)
      console.log('not admin, submitting for review')
    }
  }

  return (
    <Wrapper>
      <Banner />
      <Heading>contribute</Heading>
      <div className='content'>
        <section>
          <h2>Help us grow</h2>
          <p>
            Submit new data through the form below so we can all take better care of our beloved
            houseplants! Please include a link to a reliable source to help verify the information
            you provide. We review all submissions prior to uploading in order to maintain the
            integrity of our database.
          </p>
        </section>
        {/* TODO: improve confirmation message */}
        {newPlant && 'Thanks for submitting new plant data!'}
        <Form autoComplete='off'>
          {/* <DropZone /> */}
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
          </div>
          <Error error={existingPlant}>This plant has already been registered.</Error>
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
          <div className='form-group text'>
            <label htmlFor='image'>Image</label>
            <input
              required
              type='url'
              id='image'
              placeholder='Insert URL'
              onChange={(ev) => setImageUrl(ev.target.value)}
            />
          </div>
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
        {/* TODO: find a nice illustration or photo of a plant and/or contribution vibes */}
      </div>
    </Wrapper>
  )
}

// TODO: cleanup css code
const Wrapper = styled.main`
  /* TODO: automatically get height of footer for calc */
  min-height: calc(100vh - 60px);
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
    }
  }
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  margin: 50px;
  padding: 20px 50px;
  border-radius: 20px;
  .form-group {
    width: 300px;
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
