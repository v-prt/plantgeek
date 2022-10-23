import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'

import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS, Toggle } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { FormItem } from '../components/forms/FormItem'
import { Formik, Form } from 'formik'
import { Select } from 'formik-antd'
import { Button, Empty } from 'antd'
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
import placeholder from '../assets/plant-placeholder.svg'
import numeral from 'numeral'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
const { Option } = Select

export const Browse = () => {
  useDocumentTitle('plantgeek | Browse')

  const submitRef = useRef(0)
  const scrollRef = useRef()
  const { formData, setFormData, viewNeeds, setViewNeeds, fetchPlants } = useContext(PlantContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useContext(UserContext)
  const [totalResults, setTotalResults] = useState(undefined)

  // makes window scroll to top between renders
  const pathname = window.location.pathname
  useEffect(() => {
    if (pathname) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  // fetch plants with pagination
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const { data: searchTerms, status: searchTermsStatus } = useQuery('search-terms', async () => {
    const { data } = await axios.get(`${API_URL}/search-terms`)
    return data.data
  })

  const handleScroll = () => {
    const scrollDistance = scrollRef.current.scrollTop
    const outerHeight = scrollRef.current.offsetHeight
    const innerHeight = scrollRef.current.scrollHeight
    const actualDistance = innerHeight - (scrollDistance + outerHeight)
    if (actualDistance < 300 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  const handleSubmit = async values => {
    submitRef.current++
    const thisSubmit = submitRef.current
    setTimeout(() => {
      if (thisSubmit === submitRef.current) {
        setFormData(values)
      }
    }, 400)
  }

  useEffect(() => {
    if (data) {
      setTotalResults(data.pages[0].totalResults)
    }
  }, [data])

  return (
    <Wrapper>
      <FadeIn>
        <section className='heading'>
          <h1>browse houseplants</h1>
          <p>
            Search hundreds of houseplants by name or genus. Use the filters to refine your results
            and sort to quickly find any plant.
          </p>
        </section>
      </FadeIn>
      <FadeIn delay={200}>
        <section className='info-box'>
          <div>
            <span className='icon collection'>
              <RiPlantLine />
            </span>
            <span>
              <b>Have a plant?</b>
              <p>Add it to your collection</p>
            </span>
          </div>
          <div>
            <span className='icon wishlist'>
              <AiOutlineStar />
            </span>
            <span>
              <b>Want a plant?</b>
              <p>Add it to your wishlist</p>
            </span>
          </div>
          <div>
            <span className='icon favorites'>
              <TiHeartOutline />
            </span>
            <span>
              <b>Love a plant?</b>
              <p>Add it to your favorites</p>
            </span>
          </div>
        </section>
      </FadeIn>
      <FadeIn delay={300}>
        <section className='browse-content'>
          <Formik initialValues={formData} onSubmit={handleSubmit}>
            {({ values, setValues, submitForm, resetForm }) => (
              <Form className='filter-bar'>
                <div className='form-upper'>
                  <div className='search'>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      name='search'
                      showSearch
                      showArrow
                      allowClear
                      mode='tags'
                      placeholder='Search plants'
                      onChange={submitForm}
                      autoFocus={true}
                      loading={searchTermsStatus === 'loading'}
                      style={{ width: '100%' }}>
                      {searchTermsStatus === 'success' &&
                        searchTerms.map(term => (
                          <Option key={term} value={term}>
                            {term}
                          </Option>
                        ))}
                    </Select>
                  </div>
                  <Button
                    className='filter-menu-btn'
                    type='primary'
                    onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span className='label'> SORT & FILTER</span>
                    {sidebarOpen ? <CloseCircleOutlined /> : <FilterOutlined />}
                  </Button>
                </div>
                <div className={`filter-menu-wrapper ${sidebarOpen && 'open'}`}>
                  <div className='overlay' onClick={() => setSidebarOpen(false)}></div>
                  <div className='filter-menu-inner'>
                    <p className='num-results'>{numeral(totalResults || 0).format('0a')} results</p>
                    {/* TODO: most/least liked/owned/wanted */}
                    <FormItem label='Sort'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='sort'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}>
                        <Option value='name-asc'>
                          <ArrowDownOutlined /> Name (A-Z)
                        </Option>
                        <Option value='name-desc'>
                          <ArrowUpOutlined /> Name (Z-A)
                        </Option>
                      </Select>
                    </FormItem>
                    {/* TODO: filter by light, water, humidity, temperature */}
                    <FormItem label='Toxicity'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='toxic'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value={true}>Toxic</Option>
                        <Option value={false}>Non-toxic</Option>
                      </Select>
                    </FormItem>
                    {currentUser?.role === 'admin' && (
                      <FormItem label='Review status' sublabel='(Admin)'>
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                          name='review'
                          onChange={submitForm}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          allowClear>
                          <Option value='approved'>Approved</Option>
                          <Option value='pending'>Pending</Option>
                          <Option value='rejected'>Rejected</Option>
                        </Select>
                      </FormItem>
                    )}
                    <div className='toggle-wrapper'>
                      <span className='toggle-option'>Show details</span>
                      <Toggle>
                        <input
                          id='needs-toggle'
                          type='checkbox'
                          onChange={ev => setViewNeeds(ev.target.checked)}
                        />
                        <span className='slider'></span>
                      </Toggle>
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
          <Results disabled={sidebarOpen} onScroll={handleScroll} ref={scrollRef}>
            {status === 'success' ? (
              data && totalResults > 0 ? (
                <>
                  <div className='plants'>
                    {data.pages.map((group, i) =>
                      group.plants.map(plant => (
                        <PlantCard key={plant._id} plant={plant} viewNeeds={viewNeeds} />
                      ))
                    )}
                  </div>
                  {isFetchingNextPage && (
                    <div className='fetching-more'>
                      <Ellipsis />
                    </div>
                  )}
                </>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No results.' />
              )
            ) : (
              // TODO: loading skeleton
              <Ellipsis />
            )}
          </Results>
        </section>
      </FadeIn>
      <FadeIn delay={400}>
        <section className='contributions-info'>
          <div>
            <h2>contribute to our database</h2>
            <p>
              Can't find a specific plant? Contribute it to our database - you'll earn badges for
              approved submissions! Please help us by reporting any duplicate or incorrect
              information.
            </p>
            <Link to='contribute'>
              <Button type='secondary' icon={<PlusCircleOutlined />}>
                CONTRIBUTE
              </Button>
            </Link>
          </div>
          <img src={placeholder} alt='' />
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
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
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      h1 {
        font-size: 2rem;
      }
    }
  }
  .contributions-info {
    background: ${COLORS.mutedMedium};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    h2 {
      margin-bottom: 10px;
    }
    p {
      max-width: 600px;
      margin-bottom: 50px;
    }
    img {
      width: 100px;
      align-self: flex-end;
      margin-top: 20px;
      margin-left: auto;
      filter: invert(1);
      opacity: 0.2;
    }
  }
  .info-box {
    background: #fff;
    border: 1px dotted #ccc;
    display: flex;
    flex-direction: column;
    gap: 20px;
    div {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .icon {
      display: flex;
      align-items: center;
      font-size: 2rem;
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
    @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
      flex-direction: row;
      justify-content: space-around;
      div {
        flex-direction: column;
        text-align: center;
      }
    }
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
        display: flex;
        align-items: center;
        gap: 5px;
        .anticon {
          margin: 0;
        }
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
        .label {
          font-weight: bold;
        }
        .toggle-wrapper {
          display: flex;
          align-items: center;
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          justify-content: space-between;
          margin: 10px 0;
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
  height: 500px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  transition: 0.2s ease-in-out;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #eee;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 5px;
    cursor: pointer;
  }
  .plants {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  .fetching-more {
    display: grid;
    place-content: center;
    padding: 10px;
  }
  .ant-empty {
    display: grid;
    place-content: center;
    margin: auto;
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    height: 800px;
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    height: 1000px;
  }
`
