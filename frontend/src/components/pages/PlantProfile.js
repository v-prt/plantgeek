import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../../reducers/plantReducer";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import { ActionBar } from "../ActionBar";

export const PlantProfile = () => {
  const plants = useSelector(plantsArray);
  const [plant, setPlant] = useState([]);
  const { id } = useParams();
  const { loggedIn } = useContext(LoginContext);

  useEffect(() => {
    setPlant(plants.find((plant) => plant._id === id));
  }, [plants, plant, id]);

  return (
    <Wrapper>
      {plant && (
        <>
          <Image src={plant.image} alt="" />
          <Name>{plant.name}</Name>
          {loggedIn && (
            <Sizer>
              <ActionBar id={plant._id} />
            </Sizer>
          )}
          <Info>LIGHT: {plant.light}</Info>
          <Bar>
            {plant.light === "low to bright indirect" && (
              <Indicator level={"1-3"} />
            )}
            {plant.light === "medium indirect" && <Indicator level={"2"} />}
            {plant.light === "medium to bright indirect" && (
              <Indicator level={"2-3"} />
            )}
            {plant.light === "bright indirect" && <Indicator level={"3"} />}
          </Bar>
          <Info>WATER: {plant.water}</Info>
          <Bar>
            {plant.water === "low" && <Indicator level={"1"} />}
            {plant.water === "low to medium" && <Indicator level={"1-2"} />}
            {plant.water === "medium" && <Indicator level={"2"} />}
            {plant.water === "medium to high" && <Indicator level={"2-3"} />}
            {plant.water === "high" && <Indicator level={"3"} />}
          </Bar>
          <Info>TEMPERATURE: {plant.temperature}</Info>
          <Bar>
            {plant.temperature === "average" && <Indicator level={"1-2"} />}
            {plant.temperature === "above average" && (
              <Indicator level={"2-3"} />
            )}
          </Bar>
          <Info>HUMIDITY: {plant.humidity}</Info>
          <Bar>
            {plant.humidity === "average" && <Indicator level={"1-2"} />}
            {plant.humidity === "above average" && <Indicator level={"2-3"} />}
          </Bar>
          <Info>
            {/* TODO: make this look better (use icons?) */}
            PET FRIENDLY: {plant.toxic ? <span>no</span> : <span>yes</span>}
          </Info>
        </>
      )}
    </Wrapper>
  );
};

// TODO: make this page look better in desktop mode
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  background: white;
  height: 350px;
  width: 350px;
  margin: 30px 50px;
  border-radius: 50%;
`;

const Name = styled.h1``;

const Sizer = styled.div`
  // TODO: improve contrast of actionbar on this page
  width: 300px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px dotted grey;
  padding: 0 50px 20px 50px;
`;

const Info = styled.p``;

const Bar = styled.div`
  background: white;
  height: 20px;
  width: 300px;
  border-radius: 10px;
  margin: 5px 0;
`;

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.lightest}, ${COLORS.light});
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.level === "1" && "20%"};
  width: ${(props) => props.level === "1-2" && "50%"};
  width: ${(props) => props.level === "1-3" && "100%"};
  width: ${(props) => props.level === "2" && "50%"};
  width: ${(props) => props.level === "2-3" && "80%"};
  width: ${(props) => props.level === "3" && "100%"};
`;
