import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { Ellipsis } from '../loaders/Ellipsis'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const PlantList = ({ list, title }) => {
  const [plants, setPlants] = useState(null)

  const { data } = useInfiniteQuery(
    [`'user-${title}`, { ids: list }],
    async ({ pageParam, queryKey }) => {
      const { data } = await axios.get(`/user-plants/${pageParam ? pageParam : 0}`, {
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

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <ListWrapper className={title}>
      <FadeIn>
        <div className='inner'>
          <div className='header'>
            <h2>
              <span className='icon'>
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
          </div>
          <Plants>{plants ? plants : <Ellipsis />}</Plants>
        </div>
      </FadeIn>
    </ListWrapper>
  )
}

export const ListWrapper = styled.section`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  /* &.collection {
    border: 2px solid ${COLORS.light};
  }
  &.wishlist {
    border: 2px solid #ffd24d;
  }
  &.favorites {
    border: 2px solid #b493e6;
  } */
  .inner {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
      padding: 0 20px 10px 20px;
      margin-bottom: 10px;
      h2 {
        display: flex;
        align-items: center;
        .icon {
          display: grid;
          margin-right: 10px;
        }
      }
    }
    .empty {
      text-align: center;
      margin-top: 20px;
    }
  }
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`
