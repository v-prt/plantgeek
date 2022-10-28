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

export const PlantCard = ({ plant, viewNeeds }) => {
  const slug = plant.primaryName.replace(/\s+/g, '-').toLowerCase()

  return (
    <Wrapper key={plant._id}>
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
      <Div>
        {plant.toxic === false && (
          <Stamp>
            <FaPaw />
          </Stamp>
        )}
        <InfoLink to={`/plant/${slug}`}>
          <div className='thumbnail'>
            <ImageLoader src={plant.imageUrl} alt={''} placeholder={placeholder} />
          </div>
          <div className='name'>
            <p className='primary-name'>{plant.primaryName.toLowerCase()}</p>
            <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
          </div>
        </InfoLink>
      </Div>
      <Needs expanded={viewNeeds}>
        <Row>
          <img src={sun} alt='light' />
          <Bar>
            {plant.light === 'low to bright indirect' && <Indicator level={'1'} />}
            {plant.light === 'medium indirect' && <Indicator level={'1-2'} />}
            {plant.light === 'medium to bright indirect' && <Indicator level={'2'} />}
            {plant.light === 'bright indirect' && <Indicator level={'2-3'} />}
            {plant.light === 'bright' && <Indicator level={'3'} />}
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
            {plant.temperature === 'warm' && <Indicator level={'3'} />}
          </Bar>
        </Row>
        <Row>
          <img src={humidity} alt='humidity' />
          <Bar>
            {plant.humidity === 'average' && <Indicator level={'1-2'} />}
            {plant.humidity === 'high' && <Indicator level={'3'} />}
          </Bar>
        </Row>
      </Needs>
      <ActionBar plantId={plant._id} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 10px;
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
    top: 20px;
    right: 20px;
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

const Div = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
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
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  .thumbnail {
    width: 100%;
    max-width: 250px;
    aspect-ratio: 1 / 1;
  }
  img {
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
    &.placeholder {
      width: 80%;
      object-fit: contain;
    }
  }
  .name {
    color: ${COLORS.darkest};
    text-align: center;
    transition: 0.2s ease-in-out;
    min-height: 67px;
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
  padding: 0 10px;
  visibility: ${props => (props.expanded ? 'visible' : 'hidden')};
  opacity: ${props => (props.expanded ? '1' : '0')};
  max-height: ${props => (props.expanded ? '1000px' : '0')};
  transition: 0.3s ease-in-out;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
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
