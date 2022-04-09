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
import { FilterFilled } from '@ant-design/icons'
import { BiSearch } from 'react-icons/bi'
const { Option } = Select

export const Browse = () => {
  const submitRef = useRef(0)
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [viewNeeds, setViewNeeds] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
                  <div className='filter'>
                    <Input
                      name='primaryName'
                      placeholder='Search'
                      prefix={<BiSearch />}
                      onChange={submitForm}
                      style={{ width: '100%' }}
                      allowClear
                    />
                  </div>
                  <Button
                    className='filter-menu-btn'
                    type='primary'
                    onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FilterFilled />
                  </Button>
                  <div className={`filter-menu-wrapper ${sidebarOpen && 'open'}`}>
                    <div className='filter-menu-inner'>
                      <p className='num-results'>{plants.length} results</p>
                      <div className='filter'>
                        <p>Filter by</p>
                        <Select
                          name='toxic'
                          onChange={submitForm}
                          placeholder='Toxicity'
                          style={{ width: '100%' }}
                          allowClear>
                          <Option value={true}>Toxic</Option>
                          <Option value={false}>Non-toxic</Option>
                        </Select>
                      </div>
                      <div className='filter'>
                        <p>Sort by</p>
                        <Select
                          name='sort'
                          onChange={submitForm}
                          placeholder='Sort'
                          style={{ width: '100%' }}>
                          {/* FIXME: Z-A doesn't work */}
                          <Option value='name-asc'>Name (A-Z)</Option>
                          <Option value='name-desc'>Name (Z-A)</Option>
                          {/* TODO: difficulty level */}
                        </Select>
                      </div>
                      <div className='toggle-wrapper'>
                        <Toggle>
                          <input
                            id='needs-toggle'
                            type='checkbox'
                            onChange={ev => setViewNeeds(ev.target.checked)}
                          />
                          <span className='slider'></span>
                        </Toggle>
                        <span className='toggle-option'>Show needs</span>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <Results disabled={sidebarOpen}>
              {status === 'success' ? plants : <Ellipsis color='#222' />}
            </Results>
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
      padding-bottom: 5px;
      top: 50px;
      z-index: 10;
      grid-gap: 10px;
      .filter-menu-wrapper {
        background: #fff;
        width: 100%;
        max-width: 300px;
        position: absolute;
        top: 57px;
        right: 0;
        visibility: hidden;
        opacity: 0;
        transition: 0.2s ease-in-out;
        border-radius: 0 0 5px 5px;
        padding: 20px;
        &.open {
          visibility: visible;
          opacity: 1;
          box-shadow: 0 3px 5px rgb(0 0 0 / 10%);
        }
      }
      .filter-menu-inner {
        background: #fff;
        display: flex;
        flex-direction: column;
      }
      .num-results {
        text-align: center;
        font-size: 0.8rem;
      }
      .filter {
        margin: 10px 0;
        flex: 1;
      }
      .toggle-wrapper {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .toggle-option {
          margin-left: 10px;
          line-height: 1;
        }
      }
      @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
        top: 0;
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
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  transition: 0.2s ease-in-out;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    min-height: calc(100vh - 280px);
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    min-height: calc(100vh - 320px);
  }
`
