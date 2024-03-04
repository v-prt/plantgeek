import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components'
import { PlantCard } from './PlantCard'
import { GhostPlantCard } from './GhostPlantCard'
import { Button, Carousel } from 'antd'

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Wrapper>
      <h2>featured houseplants</h2>
      <Plants>
        <Carousel {...settings}>
          {status === 'success'
            ? data?.map(plant => <PlantCard key={plant._id} plant={plant} />)
            : Array.from(Array(6).keys()).map(item => <GhostPlantCard key={item} />)}
        </Carousel>
      </Plants>
      <div className='cta'>
        <Link to='/browse'>
          <Button type='primary'>BROWSE ALL PLANTS</Button>
        </Link>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    text-align: center;
    margin-bottom: 30px;
  }
  .cta {
    margin: 60px auto 20px auto;
  }
`

const Plants = styled.div`
  width: 100%;
  max-width: 960px;
  .slick-slide {
    padding: 10px;
  }
  .slick-dots {
    bottom: -20px;
    li button {
      background: #999 !important;
    }
  }
  @media only screen and (max-width: 768px) {
    max-width: 640px;
  }
  @media only screen and (max-width: 550px) {
    max-width: 320px;
  }
`
