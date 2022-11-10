import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { PlantCard } from './PlantCard'
import { GhostPlantCard } from './GhostPlantCard'
import { Button } from 'antd'

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
      <h2>featured houseplants</h2>
      {/* TODO: carousel */}
      <Plants>
        {status === 'success'
          ? data?.map(plant => <PlantCard key={plant._id} plant={plant} />)
          : Array.from(Array(6).keys()).map(item => <GhostPlantCard key={item} />)}
      </Plants>
      <div className='cta'>
        <Link to='/browse'>
          <Button type='primary'>BROWSE PLANTS</Button>
        </Link>
      </div>
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
  .cta {
    margin: 40px auto 0 auto;
  }
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`
