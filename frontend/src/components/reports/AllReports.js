import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../constants'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import moment from 'moment'
import styled from 'styled-components/macro'
import { COLORS, BREAKPOINTS } from '../../GlobalStyles'
import { Formik, Form } from 'formik'
import { Select } from 'formik-antd'
import { Empty, message } from 'antd'
import { FormItem } from '../forms/FormItem'
import { Ellipsis } from '../loaders/Ellipsis'
import { ClockCircleOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
const { Option } = Select

export const AllReports = () => {
  const submitRef = useRef(0)
  const scrollRef = useRef()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({ sort: 'date-desc' })

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(
      ['reports', formData],
      async ({ pageParam }) => {
        const res = await axios.get(`${API_URL}/reports/${pageParam || 1}`, {
          params: formData,
        })
        return res.data
      },
      {
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      }
    )

  const handleScroll = () => {
    const scrollDistance = scrollRef.current.scrollTop
    const outerHeight = scrollRef.current.offsetHeight
    const innerHeight = scrollRef.current.scrollHeight
    const actualDistance = innerHeight - (scrollDistance + outerHeight)
    if (actualDistance < 100 && hasNextPage && !isFetching) {
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
      <div className='header'>
        <Formik initialValues={formData} onSubmit={handleSubmit}>
          {({ values, setValues, submitForm }) => (
            <Form className='filters'>
              <Select
                name='status'
                placeholder='Status'
                allowClear
                onChange={e => {
                  setValues({ ...values, status: e })
                  submitForm()
                }}
                style={{ width: '100%' }}>
                <Option value='pending'>Pending</Option>
                <Option value='resolved'>Resolved</Option>
                <Option value='rejected'>Rejected</Option>
              </Select>
              <Select
                name='sort'
                placeholder='Sort'
                allowClear
                onChange={e => {
                  setValues({ ...values, sort: e })
                  submitForm()
                }}
                style={{ width: '100%' }}>
                <Option value='date-asc'>Date (oldest)</Option>
                <Option value='date-desc'>Date (newest)</Option>
              </Select>
            </Form>
          )}
        </Formik>
      </div>
      {status === 'success' ? (
        data?.pages[0]?.totalResults > 0 ? (
          <>
            <div className='reports' onScroll={handleScroll} ref={scrollRef}>
              {data.pages.map((group, i) =>
                group.reports.map((report, i) => (
                  <div className='report' key={i}>
                    <div className='user'>
                      <div className='avatar'>
                        {report.user.imageUrl ? (
                          <img src={report.user.imageUrl} alt='' />
                        ) : (
                          <span className='initials'>
                            {report.user.firstName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className='username'>{report.user.username}</p>
                        <p className='date'>{moment(report.createdAt).format('lll')}</p>{' '}
                      </div>
                    </div>
                    <Link className='plant-link' to={`/plant/${report.plant.slug}`}>
                      #{report.plant.slug}
                    </Link>
                    <p className='text'>{report.message}</p>
                    {report.sourceUrl ? (
                      <a
                        className='source'
                        href={report.sourceUrl}
                        target='_blank'
                        rel='noopener noreferrer'>
                        Source
                      </a>
                    ) : (
                      <p style={{ color: '#999', fontSize: '0.8rem' }}>No source.</p>
                    )}
                    <Formik
                      initialValues={{ status: report.status }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await axios.put(`${API_URL}/reports/${report._id}`, {
                            status: values.status,
                          })
                          message.success('Report status updated')
                          queryClient.invalidateQueries('reports')
                          queryClient.invalidateQueries('pending-reports')
                          setSubmitting(false)
                        } catch (err) {
                          console.log(err)
                          message.error('Oops, something went wrong')
                        }
                      }}>
                      {({ submitForm }) => (
                        <Form>
                          <FormItem name='status'>
                            <Select
                              name='status'
                              placeholder='Set status'
                              onChange={submitForm}
                              style={{ width: '100%', maxWidth: '300px' }}>
                              <Option value='pending'>
                                <ClockCircleOutlined /> Pending
                              </Option>
                              <Option value='resolved'>
                                <LikeOutlined /> Resolved
                              </Option>
                              <Option value='rejected'>
                                <DislikeOutlined /> Rejected
                              </Option>
                            </Select>
                          </FormItem>
                        </Form>
                      )}
                    </Formik>
                  </div>
                ))
              )}
              {isFetchingNextPage && (
                <div className='fetching-more'>
                  <Ellipsis />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='empty'>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No reports.`} />
          </div>
        )
      ) : (
        <div className='loading'>
          <Ellipsis />
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #f2f2f2;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  .empty,
  .loading {
    display: grid;
    place-content: center;
  }
  .empty,
  .loading,
  .reports {
    background: #fff;
    height: 100%;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    padding-bottom: 60px;
  }
  .fetching-more,
  .loading {
    padding: 20px;
    display: grid;
    place-content: center;
  }
  .fetching-more {
    border-top: 1px solid #e6e6e6;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    .filters {
      width: 100%;
      display: flex;
      gap: 12px;
    }
  }
  .reports {
    overflow: auto;
    display: flex;
    flex-direction: column;
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
  }
  .report {
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .user {
      display: flex;
      align-items: center;
      gap: 8px;
      .avatar {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        display: flex;
        img {
          border-radius: 50%;
          max-height: 100%;
          max-width: 100%;
          object-fit: cover;
          flex: 1;
        }
        .initials {
          background: ${COLORS.light};
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: bold;
          color: ${COLORS.darkest};
          height: 100%;
          width: 100%;
          display: grid;
          place-content: center;
        }
      }
      .username {
        font-weight: bold;
      }
      .date {
        font-size: 0.8rem;
      }
    }
    .plant-link {
      font-weight: bold;
      font-style: italic;
    }
    .text {
      margin: 5px 0;
    }
    .source {
      text-decoration: underline;
      font-size: 0.8rem;
    }
    .ant-select {
      width: 100%;
      max-width: 200px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    padding: 30px 20px;
    .header .filters {
      max-width: 400px;
      margin-left: auto;
    }
    .empty,
    .loading,
    .reports {
      padding: 0;
    }
  }
`
