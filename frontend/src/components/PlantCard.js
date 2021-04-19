import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { LoginContext } from "../context/LoginContext";
import { ActionBar } from "./ActionBar";

export const PlantCard = ({ plant }) => {
  const { loggedIn } = useContext(LoginContext);

  return (
    <Card key={plant._id} loggedIn={loggedIn}>
      <Link to={`/plant-profile/${plant._id}`}>
        <Image src={plant.image} />
      </Link>
      <Name>{plant.name}</Name>
      {loggedIn && <ActionBar id={plant._id} />}
    </Card>
  );
};

const Card = styled.div`
  background: #fff;
  height: ${(props) => (props.loggedIn ? "310px" : "250px")};
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 10px;
  border-radius: 20px;
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 10px ${COLORS.light};
  }
`;

const Image = styled.img`
  height: 200px;
`;

const Name = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
`;
