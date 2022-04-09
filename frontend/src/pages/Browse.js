import React, { useState, useEffect, useRef, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS, Toggle } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { Formik, Form } from 'formik'
import { Input, Select } from 'formik-antd'
import { Button } from 'antd'
import { ScrollButton } from '../components/general/ScrollButton'
import { BiSearch } from 'react-icons/bi'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import { FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
const { Option } = Select

export const Browse = () => {
  const submitRef = useRef(0)
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [viewNeeds, setViewNeeds] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [plants, setPlants] = useState([])
  const { currentUser } = useContext(UserContext)

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
        {currentUser && (
          <div className='info-box'>
            <Info>
              <Icon className='collection'>
                <RiPlantLine />
              </Icon>
              <b>Have a plant?</b>
              <p>Add it to your collection</p>
            </Info>
            <Info>
              <Icon className='wishlist'>
                <AiOutlineStar />
              </Icon>
              <b>Want a plant?</b>
              <p>Add it to your wishlist</p>
            </Info>
            <Info>
              <Icon className='favorite'>
                <TiHeartOutline />
              </Icon>
              <b>Love a plant?</b>
              <p>Add it to your favorites</p>
            </Info>
          </div>
        )}
        <section className='inner'>
          <Formik initialValues={formData} onSubmit={handleSubmit}>
            {({ values, submitForm, resetForm }) => (
              <Form>
                <div className='filter'>
                  <Input
                    name='primaryName'
                    placeholder='Search'
                    value={values.primaryName}
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
                  <FilterOutlined />
                  <span className='label'> Filter & Sort</span>
                </Button>
                <ScrollButton />
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
                        <Option value='name-asc'>
                          <ArrowDownOutlined /> Name (A-Z)
                        </Option>
                        <Option value='name-desc'>
                          <ArrowUpOutlined /> Name (Z-A)
                        </Option>
                        {/* TODO: difficulty level */}
                      </Select>
                    </div>
                    <div className='filter'>
                      <p>Display</p>
                      <div className='toggle-wrapper'>
                        <span className='toggle-option'>Need levels</span>
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
                    <Button
                      type='secondary'
                      className='reset-filters'
                      onClick={() => {
                        resetForm()
                        setFormData({ sort: 'name-asc' })
                        setSidebarOpen(false)
                      }}>
                      Reset Filters
                    </Button>
                  </div>
                  <div className='overlay' onClick={() => setSidebarOpen(false)}></div>
                </div>
              </Form>
            )}
          </Formik>
          <Results disabled={sidebarOpen}>
            {status === 'success' ? plants : <Ellipsis color='#222' />}
          </Results>
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  .info-box {
    background: #fff;
    border: 1px dotted #ccc;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    margin: 20px 0;
  }
  .inner {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    flex: 1;
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
      .filter-menu-btn {
        z-index: 10;
        .label {
          display: none;
        }
      }
      .filter-menu-wrapper {
        width: 100%;
        max-width: 300px;
        position: absolute;
        top: 50px;
        right: 0;
        visibility: hidden;
        opacity: 0;
        transition: 0.2s ease-in-out;
        .overlay {
          background-color: rgba(0, 0, 0, 0.2);
          position: fixed;
          visibility: hidden;
          opacity: 0;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transition: 0.2s ease-in-out;
          z-index: -1;
          cursor: pointer;
        }
        &.open {
          visibility: visible;
          opacity: 1;
          .overlay {
            visibility: visible;
            opacity: 1;
          }
        }
      }
      .filter-menu-inner {
        background: #fff;
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        .reset-filters {
          margin-top: 20px;
        }
      }
      .num-results {
        text-align: center;
        font-size: 0.8rem;
        color: #999;
      }
      .filter {
        margin: 10px 0;
        flex: 1;
        z-index: 10;
      }
      .toggle-wrapper {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        justify-content: space-between;
        .toggle-option {
          margin-right: 10px;
          line-height: 1;
        }
      }
      @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
        top: 0;
        .filter-menu-btn {
          .label {
            display: block;
          }
        }
      }
    }
  }
`

const Results = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  transition: 0.2s ease-in-out;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  margin: 10px;
  border-radius: 50%;
  padding: 10px;
  &.collection {
    background: ${COLORS.light};
  }
  &.wishlist {
    background: #ffd24d;
  }
  &.favorite {
    background: #b493e6;
  }
`
