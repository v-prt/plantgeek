import { useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import moment from 'moment'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { Formik, Form } from 'formik'
import { FormItem } from '../components/forms/FormItem'
import { Select } from 'formik-antd'
import { Empty, message } from 'antd'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ClockCircleOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
const { Option } = Select

export const Admin = () => {
  useDocumentTitle('Admin • plantgeek')

  const { currentUser } = useContext(UserContext)

  const { data, status } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  const { data: suggestions, status: suggestionsStatus } = useQuery(['suggestions'], async () => {
    const { data } = await axios.get(`${API_URL}/suggestions`)
    return data.suggestions
  })

  return !currentUser || currentUser.role !== 'admin' ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn>
        <section className='review-contributions'>
          <h2>review contributions</h2>
          {status === 'success' ? (
            data.length > 0 ? (
              <>
                <div className='plants'>
                  {data.map(plant => (
                    <PlantCard key={plant._id} plant={plant} />
                  ))}
                </div>
              </>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No contributions pending' />
            )
          ) : (
            <Ellipsis />
          )}
        </section>
      </FadeIn>
      <FadeIn>
        <section className='review-suggestions'>
          <h2>review suggestions</h2>
          <div className='suggestions-list'>
            {suggestionsStatus === 'success' ? (
              suggestions?.length > 0 ? (
                suggestions.map((suggestion, i) => (
                  <div className='suggestion' key={i}>
                    <p className='user'>
                      @{suggestion.user?.username}{' '}
                      <span className='id'>- User ID {suggestion.userId}</span>
                    </p>
                    <p className='date'>{moment(suggestion.dateSubmitted).format('lll')}</p>
                    <Link className='plant-link' to={`/plant/${suggestion.plant.slug}`}>
                      {suggestion.plant.primaryName.toLowerCase()}
                    </Link>
                    <p className='text'>"{suggestion.suggestion}"</p>
                    {suggestion.sourceUrl ? (
                      <a
                        className='source'
                        href={suggestion.sourceUrl}
                        target='_blank'
                        rel='noopener noreferrer'>
                        Source
                      </a>
                    ) : (
                      <p style={{ color: '#999' }}>No source.</p>
                    )}
                    <Formik
                      initialValues={{ status: suggestion.status }}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await axios.put(`${API_URL}/suggestions/${suggestion._id}`, {
                            status: values.status,
                          })
                          message.success('Suggestion status updated!')
                          setSubmitting(false)
                        } catch (err) {
                          console.log(err)
                          message.error('Oops, something went wrong.')
                        }
                      }}>
                      {({ submitForm }) => (
                        <Form>
                          <FormItem name='status'>
                            <Select
                              name='status'
                              placeholder='Set status'
                              onChange={() => submitForm()}>
                              <Option value='pending'>
                                <ClockCircleOutlined /> Pending
                              </Option>
                              <Option value='approved'>
                                <LikeOutlined /> Approved
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
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No suggestions' />
              )
            ) : (
              <Ellipsis />
            )}
          </div>
        </section>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  h2 {
    margin-bottom: 30px;
    text-align: center;
  }
  section {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  .review-contributions {
    .plants {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
  }
  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .suggestion {
      background: #fff;
      border-radius: 10px;
      font-size: 0.8rem;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      .user {
        color: ${COLORS.accent};
        font-weight: bold;
        .id {
          color: #999;
          font-weight: normal;
        }
      }
      .plant-link {
        padding: 2px 5px;
        border-radius: 5px;
        background: ${COLORS.lightest};
        color: ${COLORS.mediumLight};
        width: fit-content;
      }
      .text {
        font-size: 1rem;
      }
      .source {
        color: ${COLORS.accent};
        text-decoration: underline;
      }
      .ant-select {
        max-width: 200px;
      }
    }
  }
`
