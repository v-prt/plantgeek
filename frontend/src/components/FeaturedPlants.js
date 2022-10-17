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
          <div className='info-box'>
            <div>
              <span className='icon collection'>
                <RiPlantLine />
              </span>
              <span>
                <b>Have a plant?</b>
                <p>Add it to your collection</p>
              </span>
            </div>
            <div>
              <span className='icon wishlist'>
                <AiOutlineStar />
              </span>
              <span>
                <b>Want a plant?</b>
                <p>Add it to your wishlist</p>
              </span>
            </div>
            <div>
              <span className='icon favorites'>
                <TiHeartOutline />
              </span>
              <span>
                <b>Love a plant?</b>
                <p>Add it to your favorites</p>
              </span>
            </div>
          </div>
          {/* TODO: carousel */}
          <Plants>{plants}</Plants>
          <h3>
            <Link to='/browse'>
              browse all plants
              <span className='icon'>
                <FaArrowAltCircleRight />
              </span>
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
  display: grid;
  place-content: center;
  .info-box {
    background: #fff;
    border: 1px dotted #ccc;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;
    padding: 20px;
    div {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .icon {
      display: flex;
      align-items: center;
      font-size: 2rem;
      border-radius: 50%;
      padding: 10px;
      &.collection {
        background: ${COLORS.light};
      }
      &.wishlist {
        background: #ffd24d;
      }
      &.favorites {
        background: #b493e6;
      }
    }
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      flex-direction: row;
      justify-content: space-around;
      div {
        flex-direction: column;
        text-align: center;
      }
    }
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
  gap: 20px;
`
