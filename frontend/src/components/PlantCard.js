import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { ActionBar } from './ActionBar'
import { FaPaw } from 'react-icons/fa'
import placeholder from '../assets/plant-placeholder.svg'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'

export const PlantCard = ({ plant, viewNeeds }) => {
  return (
    <Wrapper key={plant?._id}>
      <Div>
        {!plant?.toxic && (
          <Stamp>
            <FaPaw />
          </Stamp>
        )}
        <InfoLink to={`/plant-profile/${plant?._id}`}>
          {plant?.imageUrl ? (
            <img src={plant?.imageUrl} alt='' />
          ) : (
            <img className='placeholder' src={placeholder} alt='' />
          )}
          <Name>
            {plant?.primaryName.length > 25
              ? plant?.primaryName.toLowerCase().substring(0, 23) + '...'
              : plant?.primaryName.toLowerCase()}
          </Name>
        </InfoLink>
      </Div>
      <Needs expanded={viewNeeds}>
        <Row>
          <img src={sun} alt='light' />
          <Bar>
            {plant?.light === 'low to bright indirect' && <Indicator level={'1'} />}
            {plant?.light === 'medium indirect' && <Indicator level={'1-2'} />}
            {plant?.light === 'medium to bright indirect' && <Indicator level={'2'} />}
            {plant?.light === 'bright indirect' && <Indicator level={'2-3'} />}
            {plant?.light === 'bright' && <Indicator level={'3'} />}
          </Bar>
        </Row>
        <Row>
          <img src={water} alt='water' />
          <Bar>
            {plant?.water === 'low' && <Indicator level={'1'} />}
            {plant?.water === 'low to medium' && <Indicator level={'1-2'} />}
            {plant?.water === 'medium' && <Indicator level={'2'} />}
            {plant?.water === 'medium to high' && <Indicator level={'2-3'} />}
            {plant?.water === 'high' && <Indicator level={'3'} />}
          </Bar>
        </Row>
        <Row>
          <img src={temp} alt='temperature' />
          <Bar>
            {plant?.temperature === 'average' && <Indicator level={'1-2'} />}
            {plant?.temperature === 'warm' && <Indicator level={'3'} />}
          </Bar>
        </Row>
        <Row>
          <img src={humidity} alt='humidity' />
          <Bar>
            {plant?.humidity === 'average' && <Indicator level={'1-2'} />}
            {plant?.humidity === 'high' && <Indicator level={'3'} />}
          </Bar>
        </Row>
      </Needs>
      <ActionBar id={plant?._id} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  height: fit-content;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  transition: 0.2s ease-in-out;
  min-height: 250px;
  width: 250px;
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
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
  display: grid;
  place-items: center;
  img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    &.placeholder {
      height: 200px;
      width: 150px;
    }
  }
  &:hover {
    p {
      color: ${COLORS.darkest};
    }
  }
`

const Name = styled.p`
  color: ${COLORS.darkest};
  font-size: 1.1rem;
  align-self: center;
  text-align: center;
  max-width: 230px;
  margin: 5px;
`

const Needs = styled.div`
  padding: 0 10px 10px 10px;
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
  height: 20px;
  flex: 1;
  margin-left: 5px;
  border-radius: 10px;
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light});
  height: 100%;
  border-radius: 10px;
  width: ${props => props.level === '1' && '20%'};
  width: ${props => props.level === '1-2' && '50%'};
  width: ${props => props.level === '1-3' && '100%'};
  width: ${props => props.level === '2' && '50%'};
  width: ${props => props.level === '2-3' && '80%'};
  width: ${props => props.level === '3' && '100%'};
`
