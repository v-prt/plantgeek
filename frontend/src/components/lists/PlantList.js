import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import { API_URL } from '../../constants'
import axios from 'axios'
import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { Ellipsis } from '../loaders/Ellipsis'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import numeral from 'numeral'

export const PlantList = ({ list, title }) => {
  const [plants, setPlants] = useState(null)

  const { data } = useInfiniteQuery(
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
          <div className='header'>
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
            {plants && <p>{numeral(plants.length).format('0a')} plants</p>}
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
  .inner {
    .header {
      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      margin-bottom: 10px;
      position: sticky;
      top: 50px;
      z-index: 2;
      h2 {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.2rem;
        .icon {
          display: grid;
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
      }
      @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
        top: 0;
        h2 {
          font-size: 1.4rem;
        }
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`
