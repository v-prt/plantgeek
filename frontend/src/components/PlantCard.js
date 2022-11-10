import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { ImageLoader } from './loaders/ImageLoader'
import { ActionBar } from './ActionBar'
import { ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { FaPaw } from 'react-icons/fa'
import placeholder from '../assets/plant-placeholder.svg'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'

export const PlantCard = ({ plant }) => {
  return (
    <Wrapper key={plant._id} className='plant-card'>
      <InfoLink to={`/plant/${plant.slug}`}>
        {plant.review === 'pending' && (
          <div className='review-status pending'>
            PENDING <ExclamationCircleOutlined />
          </div>
        )}
        {plant.review === 'rejected' && (
          <div className='review-status rejected'>
            REJECTED <CloseCircleOutlined />
          </div>
        )}
        {plant.toxic === false && (
          <Stamp>
            <FaPaw />
          </Stamp>
        )}
        <div className='thumbnail'>
          <ImageLoader src={plant.imageUrl} alt='' placeholder={placeholder} />
        </div>
        <div className='name'>
          <p className='primary-name'>{plant.primaryName.toLowerCase()}</p>
          <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
        </div>
        <Needs>
          <Row>
            <img src={sun} alt='light' />
            <Bar>
              {plant.light === 'low to bright indirect' && <Indicator level={'1'} />}
              {plant.light === 'medium to bright indirect' && <Indicator level={'2'} />}
              {plant.light === 'bright indirect' && <Indicator level={'3'} />}
            </Bar>
          </Row>
          <Row>
            <img src={water} alt='water' />
            <Bar>
              {plant.water === 'low' && <Indicator level={'1'} />}
              {plant.water === 'low to medium' && <Indicator level={'1-2'} />}
              {plant.water === 'medium' && <Indicator level={'2'} />}
              {plant.water === 'medium to high' && <Indicator level={'2-3'} />}
              {plant.water === 'high' && <Indicator level={'3'} />}
            </Bar>
          </Row>
          <Row>
            <img src={temp} alt='temperature' />
            <Bar>
              {plant.temperature === 'average' && <Indicator level={'1-2'} />}
              {plant.temperature === 'above average' && <Indicator level={'3'} />}
            </Bar>
          </Row>
          <Row>
            <img src={humidity} alt='humidity' />
            <Bar>
              {plant.humidity === 'low' && <Indicator level={'1'} />}
              {plant.humidity === 'medium' && <Indicator level={'2'} />}
              {plant.humidity === 'high' && <Indicator level={'3'} />}
            </Bar>
          </Row>
        </Needs>
      </InfoLink>
      <ActionBar plant={plant} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  padding: 15px;
  transition: 0.2s ease-in-out;
  position: relative;
  width: 100%;
  max-width: 300px;
  transition: 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .review-status {
    background: #fff;
    color: ${COLORS.alert};
    border: 1px dotted;
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1;
    font-size: 0.8rem;
    padding: 3px 10px;
    font-weight: bold;
    border-radius: 20px;
    &.rejected {
      color: ${COLORS.danger};
    }
  }
`

const Stamp = styled.div`
  background: #c4c4c4;
  color: #fff;
  position: absolute;
  border-radius: 50%;
  display: grid;
  padding: 5px;
  z-index: 0;
  img {
    height: 15px;
    width: 15px;
  }
`

const InfoLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  height: 100%;
  .thumbnail {
    width: 100%;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    img {
      width: 100%;
      border-radius: 50%;
      object-fit: cover;
      &.placeholder {
        width: 80%;
        object-fit: contain;
      }
    }
  }

  .name {
    color: ${COLORS.darkest};
    text-align: center;
    transition: 0.2s ease-in-out;
    display: grid;
    place-content: center;
  }
  .primary-name {
    font-weight: bold;
  }
  .secondary-name {
    font-style: italic;
    font-size: 0.8rem;
  }
`

const Needs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto 0 10px 0;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 25px;
  }
`

const Bar = styled.div`
  background: #f2f2f2;
  height: 15px;
  flex: 1;
  margin-left: 5px;
  border-radius: 10px;
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.light}, ${COLORS.mediumLight});
  height: 100%;
  border-radius: 10px;
  width: ${props => props.level === '1' && '20%'};
  width: ${props => props.level === '1-2' && '50%'};
  width: ${props => props.level === '1-3' && '100%'};
  width: ${props => props.level === '2' && '50%'};
  width: ${props => props.level === '2-3' && '80%'};
  width: ${props => props.level === '3' && '100%'};
`
