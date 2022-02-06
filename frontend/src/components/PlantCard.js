import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { ActionBar } from './ActionBar'
import { FaPaw } from 'react-icons/fa'
import placeholder from '../assets/plant-placeholder.svg'
import skull from '../assets/skull.svg'

export const PlantCard = ({ plant }) => {
  return (
    <Wrapper>
      <Div>
        {plant.toxic ? (
          <Toxicity toxic={true}>
            <img src={skull} alt='toxic' />
          </Toxicity>
        ) : (
          <Toxicity toxic={false}>
            <FaPaw />
          </Toxicity>
        )}
        <InfoLink to={`/plant-profile/${plant._id}`}>
          {plant.imageUrl ? (
            <img src={plant.imageUrl} alt='' />
          ) : (
            <img className='placeholder' src={placeholder} alt='' />
          )}
          <Name>{plant.species}</Name>
        </InfoLink>
      </Div>
      <ActionBar id={plant._id} />
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
  // FIXME: inconsistent size based on plant name length
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

const InfoLink = styled(Link)`
  display: grid;
  place-items: center;
  img {
    height: 200px;
    width: 200px;
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

const Toxicity = styled.div`
  color: ${COLORS.light};
  position: absolute;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-items: center;
  img {
    height: 20px;
    width: 20px;
  }
`
