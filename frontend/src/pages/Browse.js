import React, { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { BREAKPOINTS, Toggle } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { Formik, Form } from 'formik'
import { Input, Select } from 'formik-antd'
import { Button } from 'antd'
import { BiSearch } from 'react-icons/bi'
const { Option } = Select

export const Browse = () => {
  const submitRef = useRef(0)
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [viewNeeds, setViewNeeds] = useState(false)
  const [viewFilters, setViewFilters] = useState(false)
  const [plants, setPlants] = useState([])

  const { data, status } = useInfiniteQuery(
    ['plants', formData],
    async ({ pageParam, queryKey }) => {
      const { data } = await axios.get(`/plants/${pageParam ? pageParam : 0}`, {
        params: queryKey[1],
      })
      return data.plants
    }
  )

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (data) {
      let pages = data.pages
      const array = Array.prototype.concat.apply([], pages)
      setPlants(
        [array][0].map(plant => <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />)
      )
    }
  }, [data, viewNeeds])

  const handleSubmit = async values => {
    submitRef.current++
    const thisSubmit = submitRef.current
    setTimeout(() => {
      if (thisSubmit === submitRef.current) {
        setFormData(values)
      }
    }, 400)
  }

  return (
    <Wrapper>
      <FadeIn>
        <section className='inner'>
          <>
            <Formik initialValues={formData} onSubmit={handleSubmit}>
              {({ submitForm }) => (
                <Form>
                  {/* TODO: add filter menu drawer for mobile */}
                  {/* <Button className='filter-menu-btn' type='primary' onClick={setViewFilters}>
                    Filters
                  </Button> */}
                  <div className='filters'>
                    <div className='form-section'>
                      <Input
                        name='primaryName'
                        placeholder='Search'
                        prefix={<BiSearch />}
                        onChange={submitForm}
                        style={{ width: 200 }}
                        allowClear
                      />
                    </div>
                    <div className='form-section'>
                      <Select
                        name='toxic'
                        onChange={submitForm}
                        placeholder='Filter'
                        allowClear
                        style={{ width: 200 }}>
                        <Option value={true}>Toxic</Option>
                        <Option value={false}>Non-toxic</Option>
                      </Select>
                    </div>
                    <div className='form-section'>
                      <Select
                        name='sort'
                        onChange={submitForm}
                        placeholder='Sort'
                        style={{ width: 200 }}>
                        <Option value='name-asc'>Name (A-Z)</Option>
                        <Option value='name-desc'>Name (Z-A)</Option>
                        {/* TODO: difficulty level */}
                      </Select>
                    </div>
                  </div>
                  <div className='filters'>
                    <p>{plants.length} results</p>
                    <div className='toggle-wrapper'>
                      <span className='toggle-option'>View needs</span>
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
                </Form>
              )}
            </Formik>
            <Results>{status === 'success' ? plants : <Ellipsis />}</Results>
          </>
        </section>
      </FadeIn>
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
    form {
      background: #f2f2f2;
      box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
      .filter-menu-btn {
        @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
          display: none;
        }
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .form-section {
          display: flex;
          align-items: center;
          margin: 10px;
        }
        .toggle-wrapper {
          background: #fff;
          width: fit-content;
          display: flex;
          align-items: center;
          border-radius: 20px;
          padding: 5px 10px;
          margin-left: 10px;
          .toggle-option {
            margin-right: 20px;
            line-height: 1;
          }
        }
      }
    }
  }
`

const Results = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    min-height: calc(100vh - 280px);
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    min-height: calc(100vh - 320px);
  }
`
