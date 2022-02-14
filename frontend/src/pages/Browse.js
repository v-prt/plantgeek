import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer'

import styled from 'styled-components/macro'
import { COLORS, Switch } from '../GlobalStyles'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { BiSearch } from 'react-icons/bi'

export const Browse = () => {
  const plants = useSelector(plantsArray)
  const [viewNeeds, setViewNeeds] = useState(false)

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (document.getElementById('needs-toggle').checked) {
      setViewNeeds(true)
    } else setViewNeeds(false)
  }, [])

  // SORTS ALL PLANTS ALPHABETICALLY BY NAME
  const compare = (a, b) => {
    const plantA = a.primaryName.toLowerCase()
    const plantB = b.primaryName.toLowerCase()
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
    let genera = []
    plants.forEach(plant => {
      // skip genus/type if already added to array
      if (!genera.includes(plant.secondaryName)) {
        genera.push(plant.secondaryName)
      }
    })
    setTypes(genera)
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
  const handleFilter = type => {
    if (type === 'nontoxic') {
      setFilteredPlants(plants.filter(plant => plant.toxic === false))
      setSelectedType('nontoxic')
    } else {
      let foundPlants = []
      plants.forEach(plant => {
        if (plant.secondaryName === type) {
          foundPlants.push(plant)
        }
      })
      setFilteredPlants(foundPlants)
      setSelectedType(type)
    }
  }
  const removeFilter = () => {
    setFilteredPlants(plants)
    setSelectedType('all')
  }

  // SETS THE SEARCH VALUE
  const [query, setQuery] = useState('')
  const handleQuery = ev => {
    setQuery(ev.target.value.toLowerCase())
  }

  const handleSearch = ev => {
    ev.preventDefault()
    setFilteredPlants(
      plants.filter(
        plant =>
          plant.primaryName.toLowerCase().includes(query) ||
          plant.secondaryName.toLowerCase().includes(query)
      )
    )
    setSelectedType('all')
  }

  return (
    <Wrapper>
      {plants && types && filteredPlants && (
        <FadeIn>
          <Div>
            <Actions>
              <div className='search-toggle-wrapper'>
                <Search>
                  <input type='text' placeholder='Search houseplants' onChange={handleQuery} />
                  <button type='submit' onClick={handleSearch}>
                    <BiSearch />
                  </button>
                </Search>
                <div className='toggle-wrapper'>
                  <span className='toggle-option'>Detailed view</span>
                  <Switch>
                    <input
                      id='needs-toggle'
                      type='checkbox'
                      onChange={ev => setViewNeeds(ev.target.checked)}
                    />
                    <span className='slider'></span>
                  </Switch>
                </div>
              </div>
              {/* <Filter className='filters'>
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
              </Filter> */}
            </Actions>
            <Results>
              {plants.length > 0 && filteredPlants ? (
                filteredPlants.map(plant => {
                  return <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />
                })
              ) : (
                <BeatingHeart />
              )}
            </Results>
          </Div>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
`

const Div = styled.div`
  display: flex;
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
  }
`

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .toggle-wrapper {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    padding: 5px 10px;
    border-radius: 20px;
    .toggle-option {
      margin-right: 20px;
    }
  }
  @media only screen and (min-width: 500px) {
    flex-direction: row;
    .search-toggle-wrapper {
      flex: 1;
      margin: 0 20px 0 0;
    }
    .filters {
      flex: 1;
      margin: 0 0 0 20px;
    }
  }
  @media only screen and (min-width: 1000px) {
    width: 250px;
    flex-direction: column;
    padding: 20px;
    .search-toggle-wrapper {
      flex: inherit;
      margin: 0 0 20px 0;
    }
    .filters {
      flex: inherit;
      margin: 0;
    }
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
    font-size: 1.3rem;
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
    @media only screen and (max-width: 1000px) {
      flex-direction: row;
    }
  }
`

const Type = styled.li`
  background: ${props => (props.active ? `${COLORS.light}` : '#f2f2f2')};
  border-radius: 20px;
  margin: 5px;
  padding: 0 10px;
  font-weight: ${props => (props.active ? '700' : '')};
  transition: 0.2s ease-in-out;
  &:hover {
    background: ${COLORS.light};
    cursor: pointer;
  }
`

const Results = styled.div`
  background: #f2f2f2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  margin: 20px 0;
  border-radius: 20px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
`
