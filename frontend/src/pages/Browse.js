import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import background from '../assets/monstera-bg.jpg'
import { PlantCard } from '../components/PlantCard'
import { BiSearch } from 'react-icons/bi'
import { FadeIn } from '../components/FadeIn.js'
import { BeatingHeart } from '../components/loaders/BeatingHeart'

export const Browse = () => {
  const plants = useSelector(plantsArray)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // SORTS ALL PLANTS ALPHABETICALLY BY NAME
  const compare = (a, b) => {
    const plantA = a.species.toLowerCase()
    const plantB = b.species.toLowerCase()
    let comparison = 0
    if (plantA > plantB) {
      comparison = 1
    } else if (plantA < plantB) {
      comparison = -1
    }
    return comparison
  }
  plants.sort(compare)

  // GETS ALL TYPES OF PLANTS AND SORTS ALPHABETICALLY
  const [types, setTypes] = useState([])
  useEffect(() => {
    let tempArr = []
    plants.forEach((plant) => {
      // skip genus/type if already added to array
      if (!tempArr.includes(plant.genus)) {
        tempArr.push(plant.genus)
      }
    })
    setTypes(tempArr)
  }, [plants])
  types.sort()

  // FILTERS PLANTS BASED ON SELECTED TYPE
  // FIXME: make filter not reset after using action bar
  // TODO: filters should be checkboxes
  const [filteredPlants, setFilteredPlants] = useState(plants)
  const [selectedType, setSelectedType] = useState('all')
  // initially sets filter to all plants in db
  useEffect(() => {
    setFilteredPlants(plants)
  }, [plants])
  const handleFilter = (type) => {
    if (type === 'nontoxic') {
      setFilteredPlants(plants.filter((plant) => plant.toxic === false))
      setSelectedType('nontoxic')
    } else {
      let tempArr = []
      plants.forEach((plant) => {
        if (plant.genus === type) {
          tempArr.push(plant)
        }
      })
      setFilteredPlants(tempArr)
      setSelectedType(type)
    }
  }
  const removeFilter = () => {
    setFilteredPlants(plants)
    setSelectedType('all')
  }

  // SETS THE SEARCH VALUE
  const [query, setQuery] = useState('')
  const handleQuery = (ev) => {
    setQuery(ev.target.value)
  }

  const handleSearch = (ev) => {
    ev.preventDefault()
    setFilteredPlants(
      plants.filter((plant) => plant.species.includes(query) || plant.genus.includes(query))
    )
    setSelectedType('all')
  }

  return (
    <>
      {plants && types && filteredPlants && (
        <Wrapper>
          <Banner />
          <Main>
            <Actions>
              <Search>
                <input type='text' placeholder='Search houseplants' onChange={handleQuery} />
                <button type='submit' onClick={handleSearch}>
                  <BiSearch />
                </button>
              </Search>
              <Filter>
                <h2>filters</h2>
                <Types>
                  <div>
                    <Type key='all' onClick={() => removeFilter()} active={selectedType === 'all'}>
                      all
                    </Type>
                    <Type
                      key='nontoxic'
                      onClick={() => handleFilter('nontoxic')}
                      active={selectedType === 'nontoxic'}>
                      nontoxic
                    </Type>
                  </div>
                  <h3>by genus</h3>
                  <div>
                    {types.map((type) => {
                      return (
                        <Type
                          key={type}
                          onClick={() => handleFilter(type)}
                          active={type === selectedType}>
                          {type}
                        </Type>
                      )
                    })}
                  </div>
                </Types>
              </Filter>
            </Actions>
            <Results>
              {plants.length > 0 && filteredPlants ? (
                filteredPlants.map((plant) => {
                  return (
                    // FIXME: each child in list needs unique key
                    <FadeIn>
                      <PlantCard key={plant._id} plant={plant} />
                    </FadeIn>
                  )
                })
              ) : (
                <BeatingHeart />
              )}
            </Results>
          </Main>
        </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`

const Main = styled.main`
  display: flex;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`

const Actions = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (max-width: 1000px) {
    width: calc(100% - 50px);
  }
`

const Search = styled.form`
  background: #fff;
  width: 100%;
  height: 50px;
  border: 2px solid ${COLORS.light};
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  input {
    width: 90%;
    border: none;
    &:focus {
      outline: none;
    }
  }
  button {
    margin-right: 10px;
    padding-top: 5px;
    font-size: 1.7rem;
    &:hover {
      color: ${COLORS.light};
    }
  }
`

const Filter = styled.div`
  width: 100%;
  margin-top: 20px;
  h2 {
    margin-left: 5px;
  }
  h3 {
    margin: 5px 0 0 5px;
  }
`

const Types = styled.ul`
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    @media (max-width: 1000px) {
      flex-direction: row;
    }
  }
`

const Type = styled.li`
  background: ${(props) => (props.active ? `${COLORS.light}` : '#f2f2f2')};
  border-radius: 20px;
  margin: 2px;
  padding: 0 10px;
  font-weight: ${(props) => (props.active ? '700' : '')};
  transition: 0.2s ease-in-out;
  &:hover {
    background: ${COLORS.light};
    cursor: pointer;
  }
`

const Results = styled.div`
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  margin: auto;
  @media (max-width: 1000px) {
    width: 100%;
  }
`
