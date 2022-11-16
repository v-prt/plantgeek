import { Link } from 'react-router-dom'
import { API_URL } from '../../constants'
import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import moment from 'moment'
import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { Formik, Form } from 'formik'
import { FormItem } from '../forms/FormItem'
import { Select } from 'formik-antd'
import { message } from 'antd'
import { Ellipsis } from '../loaders/Ellipsis'
import { ClockCircleOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { RiPlantLine } from 'react-icons/ri'
const { Option } = Select

export const SinglePlantReports = ({ plantId }) => {
  const queryClient = useQueryClient()

  // TODO: filter reports by status, pagination
  const { data: reports, status: reportsStatus } = useQuery(
    ['plant-reports', plantId],
    async () => {
      const { data } = await axios.get(`${API_URL}/reports/${plantId}`)
      return data.reports
    }
  )

  return (
    <Wrapper>
      <h4>Reports</h4>
      {reportsStatus === 'success' ? (
        reports?.length > 0 ? (
          reports.map((report, i) => (
            <div className='report' key={i}>
              <Link className='plant-link' to={`/plant/${report.plant.slug}`}>
                <RiPlantLine /> {report.plant.primaryName.toLowerCase()}
              </Link>
              <p className='user'>
                @{report.user?.username} <span className='id'>- User ID {report.userId}</span>
              </p>
              <p className='date'>{moment(report.createdAt).format('lll')}</p>
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
                <p style={{ color: '#999' }}>No source.</p>
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
                      <Select name='status' placeholder='Set status' onChange={submitForm}>
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
          <p className='no-reports'>No reports.</p>
        )
      ) : (
        <Ellipsis />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  .report {
    font-size: 0.8rem;
    padding-top: 20px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
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
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .text {
      font-size: 1rem;
      margin: 10px 0;
      font-style: italic;
    }
    .source {
      color: ${COLORS.accent};
      text-decoration: underline;
    }
    .ant-select {
      width: 100%;
      max-width: 200px;
    }
  }
  .no-reports {
    opacity: 0.5;
  }
`
