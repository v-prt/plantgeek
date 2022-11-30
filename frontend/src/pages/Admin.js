import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { Empty } from 'antd'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AllReports } from '../components/reports/AllReports'

export const Admin = () => {
  useDocumentTitle('Admin • plantgeek')

  const { currentUser } = useContext(UserContext)

  // TODO: pagination for plants to review
  const { data, status } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  return !currentUser || currentUser.role !== 'admin' ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn>
        <section className='contributions-section'>
          <h2>contributions</h2>
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
      <FadeIn delay={200}>
        <AllReports />
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  h2 {
    margin-bottom: 30px;
    text-align: center;
  }
  .contributions-section {
    background: #f2f2f2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    .plants {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
  }
`
