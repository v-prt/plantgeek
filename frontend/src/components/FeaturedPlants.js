import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { FadeIn } from './loaders/FadeIn.js'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import { PlantCard } from './PlantCard'
import { GhostPlantCard } from './GhostPlantCard'

export const FeaturedPlants = () => {
  const { data, status } = useQuery(
    'random-plants',
    async () => {
      const { data } = await axios.get(`${API_URL}/random-plants`)
      return data.plants
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  return (
    <Wrapper>
      <FadeIn>
        <h2>featured houseplants</h2>
        {/* TODO: carousel */}
        <Plants>
          {status === 'success'
            ? data?.map(plant => <PlantCard key={plant._id} plant={plant} viewNeeds={true} />)
            : Array.from(Array(6).keys()).map(item => (
                <GhostPlantCard key={item} viewNeeds={true} />
              ))}
        </Plants>
        <h3>
          <Link to='/browse'>
            browse all plants
            <span className='icon'>
              <FaArrowAltCircleRight />
            </span>
          </Link>
        </h3>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: grid;
  place-content: center;
  h2 {
    text-align: center;
    margin-bottom: 30px;
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

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`
