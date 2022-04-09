import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'

import styled from 'styled-components/macro'
import { Toggle } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { Ellipsis } from '../loaders/Ellipsis'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'

export const PlantList = ({ list, title }) => {
  const [plants, setPlants] = useState([])
  const [viewNeeds, setViewNeeds] = useState(false)

  const { data, status } = useInfiniteQuery(
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
        [array][0].map(plant => <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />)
      )
    }
  }, [data, viewNeeds])

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <ListWrapper>
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
            <div className='info'>
              <span className='num-plants'>{list.length} plants</span>
              <div className='toggle-wrapper'>
                <span className='toggle-option'>Show needs</span>
                <Toggle>
                  <input
                    id='needs-toggle'
                    type='checkbox'
                    onChange={ev => setViewNeeds(ev.target.checked)}
                  />
                  <span className='slider'></span>
                </Toggle>
              </div>
            </div>
          </div>
          <Plants>{status === 'success' ? plants : <Ellipsis />}</Plants>
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
      .info {
        display: flex;
        align-items: center;
        .num-plants {
          margin-right: 10px;
          color: #666;
        }
        .toggle-wrapper {
          background: #fff;
          width: fit-content;
          display: flex;
          align-items: center;
          border-radius: 20px;
          padding: 5px 10px;
          .toggle-option {
            margin-right: 20px;
            line-height: 1;
          }
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
