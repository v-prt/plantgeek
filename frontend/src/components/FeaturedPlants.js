import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { BeatingHeart } from './loaders/BeatingHeart'
import { FadeIn } from './loaders/FadeIn.js'
import { RiArrowRightSFill } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'

import { PlantCard } from './PlantCard'

export const FeaturedPlants = () => {
  const plants = useSelector(plantsArray)
  const [featuredPlants, setFeaturedPlants] = useState(undefined)

  // SETS FEATURED PLANTS (random plants change each time you load)
  useEffect(() => {
    // if (plants) {
    //   console.log('setting featured plants')
    const getRandomPlant = () => {
      const randomIndex = Math.floor(Math.random() * plants.length)
      const randomPlant = plants[randomIndex]
      return randomPlant
    }
    // only run function if there are more than 6 plants in db
    let randomPlants = plants.length > 6 ? [] : undefined
    if (randomPlants) {
      while (randomPlants.length < 6) {
        let randomPlant = getRandomPlant(plants)
        if (!randomPlants.find((plant) => plant.species === randomPlant.species)) {
          randomPlants.push(randomPlant)
        }
      }
      setFeaturedPlants(randomPlants)
    } else {
      setFeaturedPlants(plants)
    }
    // }
  }, [plants])

  return (
    <Wrapper>
      {featuredPlants && featuredPlants.length > 0 ? (
        <FadeIn>
          <Heading>featured houseplants</Heading>
          <div className='info-box'>
            <Info>
              <Icon>
                <RiPlantLine />
              </Icon>
              <p>Have a plant?</p>
              <p>Add it to your collection</p>
            </Info>
            <Info>
              <Icon>
                <TiHeartOutline />
              </Icon>
              <p>Love a plant?</p>
              <p>Add it to your favorites</p>
            </Info>
            <Info>
              <Icon>
                <AiOutlineStar />
              </Icon>
              <p>Want a plant?</p>
              <p>Add it to your wishlist</p>
            </Info>
          </div>
          <Plants>
            {featuredPlants.map((plant) => {
              return <PlantCard key={plant._id} plant={plant} />
            })}
          </Plants>
          <Link to='/browse'>
            <BrowseLink>
              browse more <RiArrowRightSFill />
            </BrowseLink>
          </Link>
        </FadeIn>
      ) : (
        <BeatingHeart />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: grid;
  place-content: center;
  margin: 20px;
  border-radius: 20px;
  .info-box {
    background: #fff;
    border: 1px dotted #ccc;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    margin: 20px 75px;
  }
`

const Heading = styled.h2`
  text-align: center;
`

const BrowseLink = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  max-width: 900px;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
`

const Icon = styled.div`
  background: ${COLORS.light};
  display: flex;
  align-items: center;
  font-size: 2rem;
  margin: 0 10px;
  border-radius: 50%;
  padding: 10px;
`
