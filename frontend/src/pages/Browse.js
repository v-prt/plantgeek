import React, { useState, useEffect, useRef, useContext } from 'react'
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
import { Button, Empty, Drawer } from 'antd'
import {
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
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

  // makes window scroll to top between renders
  // const pathname = window.location.pathname
  // useEffect(() => {
  //   if (pathname) {
  //     window.scrollTo(0, 0)
  //   }
  // }, [pathname])

  // fetch plants with pagination
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const { data: searchTerms, status: searchTermsStatus } = useQuery('search-terms', async () => {
    const { data } = await axios.get(`${API_URL}/search-terms`)
    return data.data
  })

  const { data: filterValues, status: filterValuesStatus } = useQuery('filter-values', async () => {
    const { data } = await axios.get(`${API_URL}/filter-values`)
    return data.data
  })

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
        setFormData(values)
      }
    }, 400)
  }

  return (
    <Wrapper>
      <FadeIn>
        <main className='browse-content'>
          <Formik initialValues={formData} onSubmit={handleSubmit}>
            {({ setValues, submitForm, resetForm }) => (
              <Form className='filter-bar'>
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
                    // autoFocus={true}
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
                <button
                  className='filter-menu-btn'
                  type='primary'
                  onClick={() => setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? <CloseCircleOutlined /> : <FilterOutlined />}
                </button>
                {/* TODO: display filter sidebar on right side on desktop */}
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
                          {data?.pages[0]?.totalResults === 1 ? '' : 's'}
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
                  <Filters>
                    {/* TODO: most/least liked/owned/wanted */}
                    <div className='toggle-wrapper'>
                      <span className='toggle-option'>Show needs</span>
                      <Toggle>
                        <input
                          id='needs-toggle'
                          type='checkbox'
                          onChange={ev => setViewNeeds(ev.target.checked)}
                        />
                        <span className='slider'></span>
                      </Toggle>
                    </div>
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
                    <FormItem label='Light'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='light'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        loading={filterValuesStatus === 'loading'}
                        allowClear>
                        {filterValuesStatus === 'success' &&
                          filterValues.light.map(value => (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                    <FormItem label='Water'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='water'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        loading={filterValuesStatus === 'loading'}
                        allowClear>
                        {filterValuesStatus === 'success' &&
                          filterValues.water.map(value => (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                    <FormItem label='Temperature'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='temperature'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        loading={filterValuesStatus === 'loading'}
                        allowClear>
                        {filterValuesStatus === 'success' &&
                          filterValues.temperature.map(value => (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                    <FormItem label='Humidity'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='humidity'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        loading={filterValuesStatus === 'loading'}
                        allowClear>
                        {filterValuesStatus === 'success' &&
                          filterValues.humidity.map(value => (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                    <FormItem label='Toxicity'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='toxic'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value={true}>Toxic</Option>
                        <Option value={false}>Nontoxic</Option>
                        <Option value='unknown'>Unknown</Option>
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
                  </Filters>
                </Drawer>
              </Form>
            )}
          </Formik>
          <Results onScroll={handleScroll} ref={scrollRef}>
            {status === 'success' ? (
              data?.pages[0]?.totalResults > 0 ? (
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
      display: flex;
      gap: 10px;
      padding: 10px;
      z-index: 10;
      .search {
        flex: 1;
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
    @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
      height: calc(100vh - 110px);
      top: 110px;
      right: 0;
      max-width: calc(100vw - 241px);
      padding: 0 40px;
    }
  }
`

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  .num-results {
    color: ${COLORS.accent};
    text-align: center;
    font-weight: bold;
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
`

const Results = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
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
    padding: 30px 30px 100px 30px;
  }
  .ant-empty {
    display: grid;
    place-content: center;
    margin: auto;
  }
`
