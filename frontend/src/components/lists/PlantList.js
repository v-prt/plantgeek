import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { plantsArray } from '../../reducers/plantReducer'

import styled from 'styled-components/macro'
import { Toggle } from '../../GlobalStyles'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'

export const PlantList = ({ user, list, title }) => {
  const plants = useSelector(plantsArray)
  const [viewNeeds, setViewNeeds] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // SETS USER'S PLANTS TO ACCESS THEIR PLANTS' DATA
  // TODO: react-query
  const [userPlants, setUserPlants] = useState(undefined)
  useEffect(() => {
    if (plants && list && list.length > 0) {
      let foundPlants = []
      list.forEach(id => {
        // don't include IDs that aren't found in plant db
        if (plants.find(plant => plant._id === id)) {
          foundPlants.push(plants.find(plant => plant._id === id))
        } else return
      })
      setUserPlants(foundPlants)
    } else {
      setUserPlants(undefined)
    }
  }, [list, plants])

  return (
    <Wrapper>
      <FadeIn>
        <div className='inner'>
          <div className='header'>
            <h2>{title.toLowerCase()}</h2>
            <div className='info'>
              <span className='num-plants'>{list.length} plants</span>
              <div className='toggle-wrapper'>
                <span className='toggle-option'>Detailed view</span>
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
          {list && list.length > 0 ? (
            <Plants>
              {user &&
                userPlants?.length > 0 &&
                userPlants.map(plant => {
                  return <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />
                })}
            </Plants>
          ) : (
            <p className='empty'>{title} is empty.</p>
          )}
        </div>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.section`
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
  }
  .empty {
    text-align: center;
    margin-top: 20px;
  }
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`
