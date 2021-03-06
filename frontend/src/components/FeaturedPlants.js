import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../constants'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS } from '../GlobalStyles'
import { Ellipsis } from './loaders/Ellipsis'
import { FadeIn } from './loaders/FadeIn.js'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import { PlantCard } from './PlantCard'

export const FeaturedPlants = ({ currentUser }) => {
  const [plants, setPlants] = useState([])

  const { data, status } = useInfiniteQuery('random-plants', async () => {
    const { data } = await axios.get(`${API_URL}/random-plants`)
    return data.plants
  })

  useEffect(() => {
    if (data) {
      let pages = data.pages
      const array = Array.prototype.concat.apply([], pages)
      setPlants(
        [array][0].map(plant => <PlantCard key={plant._id} plant={plant} viewNeeds={true} />)
      )
    }
  }, [data])

  return (
    <Wrapper>
      {status === 'success' ? (
        <FadeIn>
          <Heading>featured houseplants</Heading>
          {currentUser && (
            <div className='info-box'>
              <Info>
                <Icon className='collection'>
                  <RiPlantLine />
                </Icon>
                <div>
                  <b>Have a plant?</b>
                  <p>Add it to your collection</p>
                </div>
              </Info>
              <Info>
                <Icon className='wishlist'>
                  <AiOutlineStar />
                </Icon>
                <div>
                  <b>Want a plant?</b>
                  <p>Add it to your wishlist</p>
                </div>
              </Info>
              <Info>
                <Icon className='favorite'>
                  <TiHeartOutline />
                </Icon>
                <div>
                  <b>Love a plant?</b>
                  <p>Add it to your favorites</p>
                </div>
              </Info>
            </div>
          )}
          <Plants>{plants}</Plants>
          <h3>
            <Link to='/browse'>
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
              browse more
            </Link>
          </h3>
        </FadeIn>
      ) : (
        <Ellipsis />
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
    margin: 20px 0;
  }
  h3 {
    width: fit-content;
    margin: 20px auto 0 auto;
    a {
      display: flex;
      align-items: center;
    }
  }
`

const Heading = styled.h2`
  text-align: center;
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    text-align: center;
    margin: 20px;
  }
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  margin: 10px;
  border-radius: 50%;
  padding: 10px;
  &.collection {
    background: ${COLORS.light};
  }
  &.wishlist {
    background: #ffd24d;
  }
  &.favorite {
    background: #b493e6;
  }
`
