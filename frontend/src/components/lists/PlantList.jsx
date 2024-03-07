import styled from 'styled-components'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { GhostPlantCard } from '../GhostPlantCard'
import { Empty } from 'antd'
import { BREAKPOINTS } from '../../GlobalStyles'

export const PlantList = ({ data, status }) => {
  return (
    <ListWrapper>
      <FadeIn>
        <div className='inner'>
          <Plants>
            {status === 'success' ? (
              data?.length ? (
                data.map(plant => <PlantCard key={plant._id} plant={plant} />)
              ) : (
                <div className='empty'>
                  <Empty description='Nothing here yet!' />
                </div>
              )
            ) : (
              Array.from(Array(6).keys()).map(item => <GhostPlantCard key={item} />)
            )}
          </Plants>
        </div>
      </FadeIn>
    </ListWrapper>
  )
}

export const ListWrapper = styled.div`
  background: #f4f4f4;
  border-radius: 0 20px 20px 20px;
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

export const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    padding: 30px 20px;
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    padding: 40px 20px;
  }
`
