import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../reducers/plantReducer";
import styled from "styled-components";

export const PlantInfo = () => {
  const plants = useSelector(plantsArray);
  const [plant, setPlant] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setPlant(plants.find((plant) => plant._id === id));
  }, [plants, plant, id]);

  return (
    <Wrapper>
      {plant && (
        <>
          <Image src={plant.image} alt="" />
          <Name>{plant.name}</Name>
          <Info>LIGHT: {plant.light}</Info>
          <Info>WATER: {plant.water}</Info>
          <Info>TEMPERATURE: {plant.temperature}</Info>
          <Info>HUMIDITY: {plant.humidity}</Info>
          {plant.toxic && <Info>TOXIC</Info>}
          {!plant.toxic && <Info>NOT TOXIC</Info>}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  background: white;
  height: 400px;
  width: 400px;
  margin: 30px 50px;
  border-radius: 50%;
`;

const Name = styled.h1``;

const Info = styled.p``;
