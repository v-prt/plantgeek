import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { Alert, Empty } from 'antd'
import { BeatingHeart } from '../components/loaders/BeatingHeart'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'

export const Review = () => {
  const { currentUser } = useContext(UserContext)

  const { data, status } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`/plants-to-review`)
    return data.plants
  })

  return !currentUser || !currentUser.role === 'admin' ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      {status === 'loading' ? (
        <BeatingHeart />
      ) : (
        <FadeIn>
          <section className='inner'>
            {data.length > 0 ? (
              <>
                <Alert message='New plant submissions to review' type='warning' showIcon />
                <div className='plants'>
                  {data.map(plant => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      pendingReview={plant.review === 'pending'}
                      viewNeeds={true}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No plants to review' />
            )}
          </section>
        </FadeIn>
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
      padding: 10px;
      border-radius: 20px;
      display: flex;
      flex-wrap: wrap;
    }
  }
`
