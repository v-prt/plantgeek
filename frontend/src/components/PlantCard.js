import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { ActionBar } from './ActionBar'
import { FaPaw, FaSkullCrossbones } from 'react-icons/fa'
import plantSilhouette from '../assets/plant-silhouette.png'

export const PlantCard = ({ plant }) => {
  return (
    <Plant key={plant._id}>
      <Div>
        {plant.toxic ? (
          <Toxicity toxic={true}>
            <FaSkullCrossbones />
          </Toxicity>
        ) : (
          <Toxicity toxic={false}>
            <FaPaw />
          </Toxicity>
        )}
        <InfoLink to={`/plant-profile/${plant._id}`}>
          <img src={plant.imageUrl ? plant.imageUrl : plantSilhouette} alt={plant.species} />
        </InfoLink>
        <Name>{plant.species}</Name>
      </Div>
      <ActionBar id={plant._id} />
    </Plant>
  )
}

const Plant = styled.div`
  background: #fff;
  height: fit-content;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  transition: 0.2s ease-in-out;
  img {
    height: 200px;
    width: 200px;
    align-self: center;
    border-radius: 20px;
  }
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 5px ${COLORS.light};
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLink = styled(Link)`
  display: flex;
  justify-content: center;
`

const Name = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  align-self: center;
  margin: 5px 0;
`

const Toxicity = styled.div`
  color: ${(props) => (props.toxic ? `${COLORS.medium}` : '#68b234}')};
  position: absolute;
  background: ${COLORS.lightest};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`
