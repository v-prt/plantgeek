import { ListWrapper, Plants } from './Collection'
import { FadeIn } from '../loaders/FadeIn'
import { PlantCard } from '../PlantCard'
import { GhostPlantCard } from '../GhostPlantCard'
import { Empty } from 'antd'

export const Wishlist = ({ data, status }) => {
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
