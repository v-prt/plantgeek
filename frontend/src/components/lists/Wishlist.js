import { useQuery } from 'react-query'
import { API_URL } from '../../constants'
import axios from 'axios'
import styled from 'styled-components/macro'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { GhostPlantCard } from '../GhostPlantCard'
import { Empty } from 'antd'

export const Wishlist = ({ user }) => {
  const { data, status } = useQuery(['wishlist', user.wishlist], async () => {
    try {
      const { data } = await axios.get(`${API_URL}/wishlist/${user._id}`)
      return data.wishlist
    } catch (err) {
      return null
    }
  })

  return (
    <ListWrapper>
      <FadeIn>
        <div className='inner'>
          <Plants>
            {status === 'success' ? (
              data?.length ? (
                data.map(plant => <PlantCard key={plant._id} plant={plant} viewNeeds={true} />)
              ) : (
                <div className='empty'>
                  <Empty description='Nothing here yet!' />
                </div>
              )
            ) : (
              Array.from(Array(6).keys()).map(item => (
                <GhostPlantCard key={item} viewNeeds={true} />
              ))
            )}
          </Plants>
        </div>
      </FadeIn>
    </ListWrapper>
  )
}

export const ListWrapper = styled.div`
  .inner {
    .empty {
      display: grid;
      place-content: center;
      text-align: center;
      .ant-empty {
        margin: 20px 0;
      }
      .ant-btn {
        margin: auto;
      }
    }
  }
`

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
`
