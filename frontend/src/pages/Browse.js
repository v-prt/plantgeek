import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { plantsArray } from '../reducers/plantReducer'

import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS, Toggle } from '../GlobalStyles'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { BiSearch } from 'react-icons/bi'
import { IoFilter } from 'react-icons/io5'

export const Browse = () => {
  const plants = useSelector(plantsArray)
  const [viewNeeds, setViewNeeds] = useState(false)
  const [viewFilters, setViewFilters] = useState(false)

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
          <section className='inner'>
            <Actions>
              {/* TODO: formik, query database not redux */}
              {/* <Input
                name='search'
                // onChange={submitForm}
                placeholder='Search houseplants'
                suffix={<SearchOutlined />}
              /> */}
              {/* <Select
                name='filters'
                onChange={submitForm}
                allowClear
                placeholder='Filter'
                showArrow
                >
                <Select.Option value='nontoxic'>Non-toxic</Select.Option>
                <Select.Option value='details'>Detailed view</Select.Option>
              </Select> */}
              <Search>
                <input type='text' placeholder='Search houseplants' onChange={handleQuery} />
                <button type='submit' onClick={handleSearch}>
                  <BiSearch />
                </button>
              </Search>
              <Filters>
                <div className='heading'>
                  <p>Filters</p>
                  <span className='filter-icon' onClick={() => setViewFilters(!viewFilters)}>
                    <IoFilter />
                  </span>
                </div>
                <div className={`toggles ${viewFilters && 'view'}`}>
                  <div className='toggle-wrapper'>
                    <span className='toggle-option'>Non-toxic only</span>
                    <Toggle>
                      <input
                        id='toxic-toggle'
                        type='checkbox'
                        onChange={ev =>
                          ev.target.checked ? handleFilter('nontoxic') : removeFilter()
                        }
                      />
                      <span className='slider'></span>
                    </Toggle>
                  </div>
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
              </Filters>
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
          </section>
        </FadeIn>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  .inner {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  }
`

const Actions = styled.div`
  background: #f2f2f2;
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  position: sticky;
  top: 0;
  z-index: 10;
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    flex-direction: row;
  }
`

const Search = styled.div`
  background: #fff;
  width: 100%;
  box-shadow: 0 0 0 1px #e6e6e6;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: 5px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
  &:hover {
    border: 1px solid ${COLORS.darkest};
  }
  &:focus-within {
    box-shadow: 0 0 0 1px ${COLORS.light};
    border: 1px solid ${COLORS.light};
  }
  input {
    border: none;
    padding: 10px;
    ::placeholder {
      color: #ccc;
    }
    &:focus {
      outline: none;
    }
  }
  button {
    margin-right: 10px;
    padding-top: 5px;
    color: #000;
    &:hover {
      color: ${COLORS.light};
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    width: 300px;
  }
`

const Filters = styled.div`
  background: #fff;
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p,
    .filter-icon {
      padding: 10px;
    }
    .filter-icon {
      cursor: pointer;
      transition: 0.2s ease-in-out;
      &:hover {
        color: ${COLORS.light};
      }
    }
  }
  .toggles {
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    position: absolute;
    top: 50px;
    right: 0;
    transition: 0.2s ease-in-out;
    &.view {
      visibility: visible;
      opacity: 1;
      max-height: 5000px;
    }
    .toggle-wrapper {
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 5px;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      .toggle-option {
        margin-right: 10px;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    width: 200px;
  }
`

const Results = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
`
