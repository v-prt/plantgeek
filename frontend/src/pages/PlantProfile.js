import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { FaPaw } from 'react-icons/fa'
import placeholder from '../assets/plant-placeholder.svg'
import skull from '../assets/skull.svg'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'

import { ActionBar } from '../components/ActionBar'

export const PlantProfile = () => {
  const plants = useSelector(plantsArray)
  const [plant, setPlant] = useState([])
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const [difficulty, setDifficulty] = useState()

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setPlant(plants.find((plant) => plant._id === id))
  }, [plants, plant, id])

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
        setDifficulty('Medium')
      } else if (total <= 12) {
        setDifficulty('Hard')
      }
    }
  }, [plant])

  return (
    <Wrapper>
      {plant && (
        <FadeIn>
          <Div>
            <div className='plant-details-wrapper'>
              <div className='image-wrapper'>
                {plant.imageUrl ? (
                  <Image src={plant.imageUrl} alt='' />
                ) : (
                  <Image className='placeholder' src={placeholder} alt='' />
                )}
              </div>
              <div className='details'>
                <h1>{plant?.primaryName?.toLowerCase()}</h1>
                <p className='secondary-name'>{plant?.secondaryName}</p>
                {/* <p className='region'>region</p> */}
                {/* <p className='type'>type (desert/tropical/etc)</p> */}
                {plant.toxic ? (
                  <>
                    <Toxicity toxic='true'>
                      <img src={skull} alt='' /> <p>toxic</p>
                      <span className='tooltip' toxic='true'>
                        Don't let the skull scare you! Though this plant may be toxic if ingested,
                        it can still make a great addition to your home. Simply keep it out of reach
                        of pets and children, and wear gloves during pruning to prevent skin
                        irritation.
                      </span>
                    </Toxicity>
                  </>
                ) : (
                  <>
                    <Toxicity toxic='false'>
                      <FaPaw /> <p>nontoxic</p>
                      <span className='tooltip'>
                        This plant is nontoxic and considered to be pet-friendly and child-safe.
                        However, anything can be dangerous when consumed in large quantities. Please
                        use your judgment and seek emergency care when necessary.
                      </span>
                    </Toxicity>
                  </>
                )}
              </div>
            </div>
            <Needs>
              <h2>
                needs <span className='difficulty'>Difficulty: {difficulty}</span>
              </h2>
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
              {plant.sourceUrl && (
                <p className='sources'>
                  Source(s):{' '}
                  <a href={plant.sourceUrl} target='_blank' rel='noopenner noreferrer'>
                    [1]
                  </a>
                </p>
              )}
              {/* TODO: move action bar out of needs section, make more detailed */}
              {currentUser && (
                <Sizer>
                  <ActionBar id={plant._id} style={{ background: '#fff' }} />
                </Sizer>
              )}
            </Needs>
          </Div>
        </FadeIn>
        // TODO: similar plants section (genus)
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const Div = styled.div`
  width: 80%;
  position: relative;
  top: -70px;
  display: flex;
  flex-direction: column;
  margin: auto;
  .plant-details-wrapper {
    display: flex;
    margin-bottom: 50px;
    .image-wrapper {
      height: 500px;
      width: 500px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: white;
      overflow: hidden;
      margin-right: 30px;
    }
    .details {
      max-width: 500px;
      h1 {
        line-height: 1.5;
        margin-top: 100px;
      }
      .latin-name {
        color: #666;
        font-style: italic;
        font-size: 0.9rem;
      }
    }
  }
`

const Image = styled.img`
  max-height: 100%;
  max-width: 100%;
  &.placeholder {
    height: 200px;
  }
`

const Needs = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  margin: 15px;
  border-radius: 20px;
  overflow: hidden;
  flex: 1;
  h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .difficulty {
      color: #999;
      font-size: 0.9rem;
    }
  }
  .row {
    display: flex;
    align-items: center;
    margin: 10px 0;
    img {
      height: 40px;
      margin-right: 15px;
    }
    .column {
      flex: 1;
    }
  }
  .sources {
    color: #999;
    font-size: 0.8rem;
    margin: 10px 0;
  }
  @media only screen and (min-width: 500px) {
    min-width: 400px;
  }
`

const Toxicity = styled.div`
  color: ${(props) => (props.toxic === 'true' ? `${COLORS.medium}` : '#68b234}')};
  display: flex;
  align-items: center;
  width: fit-content;
  position: relative;
  margin-top: 20px;
  cursor: default;
  img {
    width: 20px;
  }
  p {
    margin-left: 10px;
    font-weight: 700;
  }
  .tooltip {
    background: ${(props) => (props.toxic === 'true' ? `${COLORS.medium}` : `${COLORS.light}`)};
    color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    width: 300px;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 40px;
    left: 0;
    padding: 10px;
    border-radius: 10px;
    font-size: 0.9rem;
    z-index: 1;
    transition: 0.2s ease-in-out;
    transition-delay: 0.2s;
  }
  &:hover {
    .tooltip {
      visibility: visible;
      opacity: 1;
    }
  }
`

const Sizer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid #fff;
  margin-top: 10px;
  padding-top: 10px;
`

const Bar = styled.div`
  background: white;
  height: 20px;
  border-radius: 10px;
  margin: 5px 0;
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light});
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.level === '1' && '25%'};
  width: ${(props) => props.level === '1-2' && '50%'};
  width: ${(props) => props.level === '1-3' && '100%'};
  width: ${(props) => props.level === '2' && '50%'};
  width: ${(props) => props.level === '2-3' && '75%'};
  width: ${(props) => props.level === '3' && '100%'};
`
