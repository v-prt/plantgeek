import React, { useState, useRef, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'

import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { GhostPlantCard } from '../components/GhostPlantCard'
import { Formik, Form } from 'formik'
import { Select } from 'formik-antd'
import { Button, Empty, Drawer, Tag } from 'antd'
import { FilterOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import numeral from 'numeral'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { PlantFilters } from '../components/PlantFilters'
const { Option } = Select

export const Browse = () => {
  useDocumentTitle('Browse • plantgeek')

  const submitRef = useRef(0)
  const scrollRef = useRef()
  const { formData, setFormData, fetchPlants } = useContext(PlantContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useContext(UserContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const genera = [
    'Aglaonema',
    'Alocasia',
    'Aloe',
    'Anthurium',
    'Bromeliad',
    'Cactus',
    'Calathea',
    'Croton',
    'Ctenanthe',
    'Dieffenbachia',
    'Dracaena',
    'Fern',
    'Ficus',
    'Goeppertia',
    'Homalomena',
    'Hoya',
    'Ivy',
    'Maranta',
    'Monstera',
    'Palm',
    'Peperomia',
    'Philodendron',
    'Pilea',
    'Pothos',
    'Sansevieria',
    'Scindapsus',
    'Stromanthe',
    'Syngonium',
    'Tradescantia',
    'Spathiphyllum',
    'Zamioculcas',
  ]

  const handleScroll = () => {
    const scrollDistance = scrollRef.current.scrollTop
    const outerHeight = scrollRef.current.offsetHeight
    const innerHeight = scrollRef.current.scrollHeight
    const actualDistance = innerHeight - (scrollDistance + outerHeight)
    if (actualDistance < 400 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  const handleSubmit = async values => {
    submitRef.current++
    const thisSubmit = submitRef.current
    setTimeout(() => {
      if (thisSubmit === submitRef.current) {
        setFormData({ ...formData, ...values })
      }
    }, 400)
  }

  return (
    <Wrapper>
      <FadeIn>
        <main className='browse-content'>
          <Formik initialValues={formData} onSubmit={handleSubmit}>
            {({ values, setValues, setFieldValue, submitForm, resetForm }) => (
              <Form className='filter-bar'>
                {/* FIXME: allowClear doesn't work on mobile */}
                <div className='filter-bar-upper'>
                  <div className='search'>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      // fixes issue with scrolling on mobile moving entire page
                      virtual={false}
                      name='search'
                      value={formData.search}
                      showSearch
                      showArrow
                      allowClear
                      mode='tags'
                      placeholder='Search plants'
                      onChange={e => {
                        setValues({ ...values, search: e })
                        submitForm()
                      }}
                      style={{ width: '100%' }}>
                      {genera.map(genus => (
                        <Option key={genus} value={genus}>
                          {genus}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className='sort'>
                    <span className='label'>Sort</span>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      name='sort'
                      value={formData.sort}
                      onChange={e => {
                        setValues({ ...values, sort: e })
                        submitForm()
                      }}
                      placeholder='Select'
                      style={{ width: '300px' }}>
                      <Option value='name-asc'>Name (A-Z)</Option>
                      <Option value='name-desc'>Name (Z-A)</Option>
                      <Option value='most-hearts'>Most liked</Option>
                      <Option value='most-owned'>Most owned</Option>
                      <Option value='most-wanted'>Most wanted</Option>
                    </Select>
                  </div>
                  <button
                    className='filter-menu-btn'
                    type='primary'
                    onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <CloseCircleOutlined /> : <FilterOutlined />}
                  </button>
                </div>
                <div className='tags'>
                  {values?.light && (
                    <Tag
                      closable
                      onClose={() => {
                        setFieldValue('light', null)
                        submitForm()
                      }}>
                      <b>Light:</b> {values.light}
                    </Tag>
                  )}
                  {values?.water && (
                    <Tag
                      closable
                      onClose={() => {
                        setFieldValue('water', null)
                        submitForm()
                      }}>
                      <b>Water:</b> {values.water}
                    </Tag>
                  )}
                  {values?.temperature && (
                    <Tag
                      closable
                      onClose={() => {
                        setFieldValue('temperature', null)
                        submitForm()
                      }}>
                      <b>Temp:</b> {values.temperature}
                    </Tag>
                  )}
                  {values?.humidity && (
                    <Tag
                      closable
                      onClose={() => {
                        setFieldValue('humidity', null)
                        submitForm()
                      }}>
                      <b>Humidity:</b> {values.humidity}
                    </Tag>
                  )}
                  {values?.toxicity && (
                    <Tag
                      closable
                      onClose={() => {
                        setFieldValue('toxicity', null)
                        submitForm()
                      }}>
                      <b>Toxicity:</b> {values.toxicity}
                    </Tag>
                  )}
                </div>
                {/* MOBILE/TABLET FILTERS MENU */}
                <Drawer
                  visible={sidebarOpen}
                  placement='right'
                  title='Filters'
                  onClose={() => setSidebarOpen(false)}
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {status === 'success' ? (
                        <p
                          className='num-results'
                          style={{
                            fontWeight: 'bold',
                            color: data.pages[0].totalResults > 0 ? COLORS.accent : '#999',
                          }}>
                          {numeral(data?.pages[0]?.totalResults || 0).format('0a')} result
                          {data?.pages[0]?.totalResults !== 1 && 's'}
                        </p>
                      ) : (
                        <LoadingOutlined spin />
                      )}
                      <Button
                        type='primary'
                        onClick={() => {
                          resetForm()
                          setFormData({ sort: 'name-asc' })
                          setValues({ sort: 'name-asc' })
                        }}>
                        Reset
                      </Button>
                    </div>
                  }>
                  <PlantFilters
                    setValues={setValues}
                    submitForm={submitForm}
                    currentUser={currentUser}
                    formData={formData}
                  />
                </Drawer>
              </Form>
            )}
          </Formik>
          <div className='browse-content-inner'>
            <Results onScroll={handleScroll} ref={scrollRef}>
              {status === 'success' ? (
                data?.pages[0]?.totalResults > 0 ? (
                  <>
                    <div className='plants'>
                      {data.pages.map((group, i) =>
                        group.plants.map(plant => <PlantCard key={plant._id} plant={plant} />)
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
                <div className='loading'>
                  {Array.from(Array(12).keys()).map(item => (
                    <GhostPlantCard key={item} />
                  ))}
                </div>
              )}
            </Results>
            {/* DESKTOP FILTERS SIDEBAR */}
            <Formik initialValues={formData} onSubmit={handleSubmit}>
              {({ values, setValues, submitForm, resetForm }) => (
                <Form className='filters-sidebar'>
                  <PlantFilters
                    setValues={setValues}
                    submitForm={submitForm}
                    currentUser={currentUser}
                    formData={formData}
                  />
                  <div className='results-info'>
                    {status === 'success' ? (
                      <p
                        className='num-results'
                        style={{
                          fontWeight: 'bold',
                          color: data.pages[0].totalResults > 0 ? COLORS.accent : '#999',
                        }}>
                        {numeral(data?.pages[0]?.totalResults || 0).format('0a')} result
                        {data?.pages[0]?.totalResults !== 1 && 's'}
                      </p>
                    ) : (
                      <LoadingOutlined spin />
                    )}
                    <Button
                      type='primary'
                      onClick={() => {
                        resetForm()
                        setFormData({ sort: 'name-asc' })
                        setValues({ sort: 'name-asc' })
                      }}>
                      Reset
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </main>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .browse-content {
    background: #f2f2f2;
    gap: 0;
    padding: 0;
    height: calc(100vh - 53px);
    overflow: hidden;
    position: fixed;
    top: 0;
    .filter-bar {
      background: #f2f2f2;
      box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
      width: 100%;
      padding: 10px 20px;
      z-index: 10;
      .filter-bar-upper {
        display: flex;
        gap: 10px;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        .ant-tag {
          margin: 5px 5px 0 0;
        }
      }
      .search {
        flex: 1;
      }
      .sort {
        display: none;
      }
      .filter-menu-btn {
        background: ${COLORS.accent};
        color: #fff;
        display: grid;
        place-content: center;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        .anticon {
          margin: 0;
        }
      }
    }
  }
  .browse-content-inner {
    height: 100%;
    width: 100%;
    display: flex;
    .filters-sidebar {
      display: none;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .browse-content {
      height: calc(100vh - 110px);
      top: 110px;
      right: 0;
      max-width: calc(100vw - 241px);
      .filter-bar {
        padding: 20px;
        .sort {
          display: block;
          .label {
            font-weight: bold;
            margin: 0 8px 0 20px;
          }
        }
        .filter-menu-btn {
          display: none;
        }
      }
      .tags {
        display: none;
      }
    }
    .browse-content-inner {
      // results and desktop filters sidebar
      .filters-sidebar {
        display: block;
        width: 400px;
        background: #fff;
        padding: 20px;
        .results-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        }
      }
    }
  }
`

const Results = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 100px 10px;
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
  .plants,
  .loading {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  .plants {
    padding-bottom: 80px;
  }
  .fetching-more {
    display: grid;
    place-content: center;
    margin-top: 20px;
  }
  .ant-empty {
    display: grid;
    place-content: center;
    margin: auto;
  }
`
