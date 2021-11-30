import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import background from '../assets/monstera-bg.jpg'
import { DropZone } from '../hooks/DropZone.js'
import { Error } from './Login'

export const Contribute = () => {
  // TODO: reward users with badges for approved submissions?
  const plants = useSelector(plantsArray)

  // TODO: change all usage of plant.name to plant.species & plant.type to plant.genus
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

  const handleSubmit = (ev) => {
    // TODO: make sure next input focuses on enter
    ev.preventDefault()
    console.log(species, genus, light, water, temperature, humidity, toxic, imageUrl, sourceUrl)
  }

  return (
    <Wrapper>
      <Banner />
      <Heading>contribute</Heading>
      <div className='content'>
        <section>
          <h2>Help us grow</h2>
          <p>
            Submit new houseplant information below so we can all take better care of our beloved
            plants! Please
          </p>
          <em>*We review all submissions to ensure accuracy of information provided.</em>
        </section>
        <Form autoComplete='off'>
          <DropZone />
          {/* TODO: add form elements (make sure to keep human error to minimum) */}
          <div className='form-section'>
            <div className='form-group'>
              <label htmlFor='species'>Species</label>
              <input
                required
                type='text'
                id='species'
                placeholder='e.g., Monstera deliciosa'
                onChange={(ev) => setSpecies(ev.target.value)}
                autoFocus
              />
              <Error error={existingPlant}>This plant has already been registered.</Error>
            </div>
            <div className='form-group'>
              <label htmlFor='genus'>Genus</label>
              <input
                required
                type='text'
                id='genus'
                placeholder='e.g., Monstera'
                onChange={(ev) => setGenus(ev.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='light'>Light</label>
              <select required name='light' id='light' onChange={(ev) => setLight(ev.target.value)}>
                <option value='low to bright indirect'>low to bright indirect</option>
                <option value='medium indirect'>medium indirect</option>
                <option value='medium to bright indirect'>medium to bright indirect</option>
                <option value='bright indirect'>bright indirect</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='water'>Water</label>
              <select required name='water' id='water' onChange={(ev) => setWater(ev.target.value)}>
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
                <option value='average'>average</option>
                <option value='above average'>above average</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='toxic'>Toxic?</label>
              <select required name='toxic' id='toxic' onChange={(ev) => setToxic(ev.target.value)}>
                <option value={true}>yes</option>
                <option value={false}>no</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='image'>Image</label>
              <input
                required
                type='url'
                id='image'
                placeholder='URL'
                onChange={(ev) => setImageUrl(ev.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='source'>Source</label>
              <input
                required
                type='url'
                id='source'
                placeholder='Link to source'
                onChange={(ev) => setSourceUrl(ev.target.value)}
              />
            </div>
          </div>
          <button type='submit' onClick={handleSubmit}>
            Submit Info
          </button>
        </Form>
      </div>
    </Wrapper>
  )
}

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
  display: flex;
  justify-content: center;
  .form-section {
    margin: 50px;
    .form-group {
      width: 300px;
      display: flex;
      flex-direction: column;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
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
          outline: none;
        }
      }
    }
  }
`
