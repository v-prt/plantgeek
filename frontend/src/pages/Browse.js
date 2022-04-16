import React, { useState, useEffect, useRef, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { PlantContext } from '../contexts/PlantContext'

import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS, Toggle } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { Formik, Form } from 'formik'
import { Input, Select } from 'formik-antd'
import { Button, Empty } from 'antd'
import { BiSearch } from 'react-icons/bi'
import { TiHeartOutline } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
import { RiPlantLine } from 'react-icons/ri'
import {
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
const { Option } = Select

export const Browse = () => {
  const submitRef = useRef(0)
  const { formData, setFormData, viewNeeds, setViewNeeds } = useContext(PlantContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [plants, setPlants] = useState(null)

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
        <section className='heading'>
          <h1>browse houseplants</h1>
          <p>
            Search hundreds of houseplants by name or genus. Use the filters to refine your results
            and sort to quickly find any plant.
          </p>
          <p>
            Can't find a specific plant? Please contribute it to our database. You'll earn badges
            for approved submissions. If you notice any corrupt or duplicate information please
            report it.
          </p>
          <Link to='/contribute'>
            <Button type='primary'>
              <PlusCircleOutlined /> Contribute
            </Button>
          </Link>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <div className='info-box'>
          <Info>
            <Icon className='collection'>
              <RiPlantLine />
            </Icon>
            <div>
              <b>Have a plant?</b>
              <p>Add it to your collection</p>
            </div>
          </Info>
          <Info>
            <Icon className='wishlist'>
              <AiOutlineStar />
            </Icon>
            <div>
              <b>Want a plant?</b>
              <p>Add it to your wishlist</p>
            </div>
          </Info>
          <Info>
            <Icon className='favorite'>
              <TiHeartOutline />
            </Icon>
            <div>
              <b>Love a plant?</b>
              <p>Add it to your favorites</p>
            </div>
          </Info>
        </div>
      </FadeIn>
      <section className='browse-content'>
        <Formik initialValues={formData} onSubmit={handleSubmit}>
          {({ values, setValues, submitForm, resetForm }) => (
            <Form className='filter-bar'>
              <div className='form-upper'>
                <div className='search'>
                  <Input
                    name='primaryName'
                    placeholder='Search by name or genus'
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
                  <span className='label'> SORT & FILTER</span>
                </Button>
              </div>
              <div className={`filter-menu-wrapper ${sidebarOpen && 'open'}`}>
                <div className='overlay' onClick={() => setSidebarOpen(false)}></div>
                <div className='filter-menu-inner'>
                  <p className='num-results'>{plants?.length} results</p>
                  <div className='filter'>
                    <p>Sort by</p>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      name='sort'
                      onChange={submitForm}
                      placeholder='Sort'
                      style={{ width: '100%' }}>
                      <Option value='name-asc'>
                        <ArrowDownOutlined /> Name (A-Z)
                      </Option>
                      <Option value='name-desc'>
                        <ArrowUpOutlined /> Name (Z-A)
                      </Option>
                    </Select>
                  </div>
                  <div className='filter'>
                    <p>Filter by</p>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
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
                      setValues({ sort: 'name-asc' })
                      setSidebarOpen(false)
                    }}>
                    RESET FILTERS
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <Results disabled={sidebarOpen}>
          {status === 'success' && plants ? (
            plants.length > 0 ? (
              plants
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No results.' />
            )
          ) : (
            <Ellipsis />
          )}
        </Results>
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  .heading {
    background: ${COLORS.light};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 1.8rem;
    }
    p {
      max-width: 600px;
      margin: 10px;
    }
    a {
      font-weight: bold;
    }
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      h1 {
        font-size: 2rem;
      }
    }
  }
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
  .browse-content {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    form {
      background: #f2f2f2;
      box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      grid-gap: 10px;
      position: relative;
      z-index: 10;
      position: sticky;
      top: 50px;
      @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
        top: -30px;
      }
      .form-upper {
        width: 100%;
        display: flex;
        grid-gap: 10px;
        margin: 10px 0;
      }
      .search {
        flex: 1;
      }
      .filter-menu-btn {
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
        z-index: 100;
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
          cursor: pointer;
          z-index: -1;
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
        .num-results {
          text-align: center;
          font-size: 0.8rem;
          color: #999;
        }
        .filter {
          margin: 10px 0;
          flex: 1;
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
        .reset-filters {
          margin-top: 20px;
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
  background: #e6e6e6;
  min-height: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  transition: 0.2s ease-in-out;
  .ant-empty {
    display: grid;
    place-content: center;
  }
`

const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    flex-direction: column;
    text-align: center;
    margin: 20px;
  }
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
