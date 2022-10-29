import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { Alert, Empty } from 'antd'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const Review = () => {
  useDocumentTitle('Review contributions | plantgeek')

  const { currentUser } = useContext(UserContext)

  const { data, status } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

  return !currentUser || !currentUser.role === 'admin' ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      {status === 'success' ? (
        <FadeIn>
          <section className='inner'>
            {data.length > 0 ? (
              <>
                <Alert message='New plant submissions to review.' type='warning' showIcon />
                <div className='plants'>
                  {data.map(plant => (
                    <PlantCard key={plant._id} plant={plant} viewNeeds={true} />
                  ))}
                </div>
              </>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No plants to review' />
            )}
          </section>
        </FadeIn>
      ) : (
        <BeatingHeart />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .inner {
    background: #fff;
    .plants {
      background: #f2f2f2;
      margin: 20px 0;
      padding: 20px;
      border-radius: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
  }
`
