import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { plantsArray } from "../../reducers/plantReducer";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";
import { FaPaw, FaSkullCrossbones } from "react-icons/fa";
import background from "../../assets/monstera-bg.jpg";

import { ActionBar } from "../ActionBar";

export const PlantProfile = () => {
  const plants = useSelector(plantsArray);
  const [plant, setPlant] = useState([]);
  const { id } = useParams();
  const { loggedIn } = useContext(LoginContext);

  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setPlant(plants.find((plant) => plant._id === id));
  }, [plants, plant, id]);

  return (
    <Wrapper>
      <Banner />
      {plant && (
        <Div>
          <Image src={plant.image} alt="" />
          <Name>{plant.name}</Name>
          <Needs>
            <h2>needs</h2>
            <Info>{plant.light} light</Info>
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
            <Info>{plant.water} water</Info>
            <Bar>
              {plant.water === "low" && <Indicator level={"1"} />}
              {plant.water === "low to medium" && <Indicator level={"1-2"} />}
              {plant.water === "medium" && <Indicator level={"2"} />}
              {plant.water === "medium to high" && <Indicator level={"2-3"} />}
              {plant.water === "high" && <Indicator level={"3"} />}
            </Bar>
            <Info>{plant.temperature} temperature</Info>
            <Bar>
              {plant.temperature === "average" && <Indicator level={"1-2"} />}
              {plant.temperature === "above average" && (
                <Indicator level={"2-3"} />
              )}
            </Bar>
            <Info>{plant.humidity} humidity</Info>
            <Bar>
              {plant.humidity === "average" && <Indicator level={"1-2"} />}
              {plant.humidity === "above average" && (
                <Indicator level={"2-3"} />
              )}
            </Bar>
            {plant.toxic ? (
              <Toxicity toxic={true}>
                <FaSkullCrossbones /> <p>not pet friendly</p>
              </Toxicity>
            ) : (
              <Toxicity toxic={false}>
                <FaPaw /> <p>pet friendly</p>
              </Toxicity>
            )}
            {loggedIn && (
              <Sizer>
                <ActionBar id={plant._id} />
              </Sizer>
            )}
          </Needs>
        </Div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`;

const Div = styled.div`
  width: 100%;
  position: relative;
  top: -70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  background: white;
  height: 300px;
  width: 300px;
  border-radius: 50%;
`;

const Name = styled.h1``;

const Needs = styled.div`
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  border-radius: 20px;
  overflow: hidden;
  h2 {
    margin: 10px 0 0 20px;
  }
`;

const Toxicity = styled.div`
  background: #fff;
  color: ${(props) => (props.toxic ? `${COLORS.medium}` : "#68b234}")};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 20px;
  p {
    margin: 0 10px;
  }
`;

const Sizer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid #ccc;
`;

const Info = styled.p`
  align-self: flex-start;
  margin: 10px 0 0 20px;
`;

const Bar = styled.div`
  background: white;
  height: 20px;
  width: 300px;
  border-radius: 10px;
  margin: 5px 20px;
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
