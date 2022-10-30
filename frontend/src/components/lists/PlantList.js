import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import { API_URL } from '../../constants'
import axios from 'axios'
import styled from 'styled-components/macro'
import { BREAKPOINTS } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { DownOutlined, LoadingOutlined } from '@ant-design/icons'
import numeral from 'numeral'

export const PlantList = ({ list, title }) => {
  const [plants, setPlants] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const { data, status } = useInfiniteQuery(
    [`'user-${title}`, { ids: list }],
    async ({ pageParam, queryKey }) => {
      const { data } = await axios.get(`${API_URL}/user-plants/${pageParam ? pageParam : 0}`, {
        params: queryKey[1],
      })
      return data.plants
    }
  )

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
    <ListWrapper className={title}>
      <FadeIn>
        <div className='inner'>
          <div
            className={`header ${expanded && 'expanded'}`}
            onClick={() => setExpanded(!expanded)}>
            <h2>
              <span className={`icon ${title}`}>
                {title === 'collection' ? (
                  <RiPlantLine />
                ) : title === 'favorites' ? (
                  <TiHeartOutline />
                ) : (
                  title === 'wishlist' && <AiOutlineStar />
                )}
              </span>
              {title}
            </h2>
            <div className='num-plants'>
              {status === 'success' ? (
                <>
                  <p>{numeral(plants?.length).format('0a')} plants</p>
                  <span className={`arrow ${expanded && 'expanded'}`}>
                    <DownOutlined />
                  </span>
                </>
              ) : (
                <LoadingOutlined spin />
              )}
            </div>
          </div>
          <Plants className={expanded && 'expanded'}>{plants}</Plants>
        </div>
      </FadeIn>
    </ListWrapper>
  )
}

export const ListWrapper = styled.div`
  .inner {
    .header {
      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px;
      padding: 10px 20px;
      border-radius: 20px;
      position: sticky;
      top: 50px;
      z-index: 2;
      cursor: pointer;
      transition: 0.2s ease-in-out;
      &:hover:not(.expanded) {
        background: #e6e6e6;
      }
      &.expanded {
        margin: 5px 5px 0 5px;
        box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
        border-radius: 20px 20px 0 0;
      }
      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.2rem;
        .icon {
          display: grid;
        }
      }
      .num-plants {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        .arrow {
          transition: 0.2s ease-in-out;
          &.expanded {
            transform: rotate(-180deg);
          }
        }
      }
      @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
        h2 {
          font-size: 1.4rem;
        }
      }
      @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
        top: 0;
      }
    }
    .empty {
      display: grid;
      place-content: center;
      text-align: center;
      .ant-empty {
        margin: 20px 0;
      }
      .ant-btn {
        margin: auto;
      }
    }
  }
`

const Plants = styled.div`
  background: #eee;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  transition: 0.4s ease-in-out;
  grid-column-gap: 20px;
  .plant-card {
    max-height: 0;
    padding: 0 10px;
    transition: 0.4s ease-in-out;
  }
  &.expanded {
    gap: 20px;
    padding: 20px;
    .plant-card {
      padding: 10px;
      max-height: 1000px;
    }
  }
`
