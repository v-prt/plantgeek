import React, { useState, useRef, useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'

import styled from 'styled-components/macro'
import { BREAKPOINTS, COLORS, Toggle } from '../GlobalStyles'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { GhostPlantCard } from '../components/GhostPlantCard'
import { FormItem } from '../components/forms/FormItem'
import { Formik, Form } from 'formik'
import { Select, Input } from 'formik-antd'
import { Button, Empty, Drawer, Tag } from 'antd'
import {
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import numeral from 'numeral'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
const { Option } = Select

export const Browse = () => {
  useDocumentTitle('Browse | plantgeek')

  const submitRef = useRef(0)
  const scrollRef = useRef()
  const { formData, setFormData, viewNeeds, setViewNeeds, fetchPlants } = useContext(PlantContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useContext(UserContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const commonGenera = [
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
        setFormData(values)
      }
    }, 400)
  }

  return (
    <Wrapper>
      <FadeIn>
        <main className='browse-content'>
          <Formik initialValues={formData} onSubmit={handleSubmit}>
            {({ values, setValues, submitForm, resetForm }) => (
              <Form className='filter-bar'>
                {/* FIXME: allowClear doesn't work on mobile */}
                <div className='filter-bar-upper'>
                  <div className='search'>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      // fixes issue with scrolling on mobile moving entire page
                      virtual={false}
                      name='search'
                      showSearch
                      showArrow
                      allowClear
                      mode='tags'
                      placeholder='Search plants'
                      onChange={submitForm}
                      style={{ width: '100%' }}>
                      {commonGenera.map(term => (
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
                </div>
                <div className='tags'>
                  {values?.light && (
                    <Tag
                      closable
                      onClose={() => {
                        setValues({ light: '', ...values })
                        submitForm()
                      }}>
                      <b>Light:</b> {values.light}
                    </Tag>
                  )}
                  {values?.water && (
                    <Tag
                      closable
                      onClose={() => {
                        setValues({ water: '', ...values })
                        submitForm()
                      }}>
                      <b>Water:</b> {values.water}
                    </Tag>
                  )}
                  {values?.temperature && (
                    <Tag
                      closable
                      onClose={() => {
                        setValues({ temperature: '', ...values })
                        submitForm()
                      }}>
                      <b>Temp:</b> {values.temperature}
                    </Tag>
                  )}
                  {values?.humidity && (
                    <Tag
                      closable
                      onClose={() => {
                        setValues({ humidity: '', ...values })
                        submitForm()
                      }}>
                      <b>Humidity:</b> {values.humidity}
                    </Tag>
                  )}
                  {values?.toxicity && (
                    <Tag
                      closable
                      onClose={() => {
                        setValues({ toxicity: '', ...values })
                        submitForm()
                      }}>
                      <b>Toxicity:</b> {values.toxicity}
                    </Tag>
                  )}
                </div>
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
                        <Option value='most-hearts'>
                          <ArrowUpOutlined /> Most liked
                        </Option>
                        <Option value='most-owned'>
                          <ArrowUpOutlined /> Most owned
                        </Option>
                        <Option value='most-wanted'>
                          <ArrowUpOutlined /> Most wanted
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
                        allowClear>
                        <Option value='low to bright indirect'>low to bright indirect</Option>
                        <Option value='medium to bright indirect'>medium to bright indirect</Option>
                        <Option value='bright indirect'>bright indirect</Option>
                        <Option value='unknown'>unknown</Option>
                      </Select>
                    </FormItem>
                    <FormItem label='Water'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='water'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value='low'>low</Option>
                        <Option value='low to medium'>low to medium</Option>
                        <Option value='medium'>medium</Option>
                        <Option value='medium to high'>medium to high</Option>
                        <Option value='high'>high</Option>
                        <Option value='unknown'>unknown</Option>
                      </Select>
                    </FormItem>
                    <FormItem label='Temperature'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='temperature'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value='average'>average</Option>
                        <Option value='above average'>above average</Option>
                        <Option value='unknown'>unknown</Option>
                      </Select>
                    </FormItem>
                    <FormItem label='Humidity'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='humidity'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value='low'>low</Option>
                        <Option value='medium'>medium</Option>
                        <Option value='high'>high</Option>
                        <Option value='unknown'>unknown</Option>
                      </Select>
                    </FormItem>
                    <FormItem label='Toxicity'>
                      <Select
                        getPopupContainer={trigger => trigger.parentNode}
                        name='toxicity'
                        onChange={submitForm}
                        placeholder='Select'
                        style={{ width: '100%' }}
                        allowClear>
                        <Option value='toxic'>toxic</Option>
                        <Option value='nontoxic'>nontoxic</Option>
                        <Option value='unknown'>unknown</Option>
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
                          <Option value='approved'>approved</Option>
                          <Option value='pending'>pending</Option>
                          <Option value='rejected'>rejected</Option>
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
              <div className='loading'>
                {Array.from(Array(12).keys()).map(item => (
                  <GhostPlantCard key={item} viewNeeds={viewNeeds} />
                ))}
              </div>
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
      padding: 10px;
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
