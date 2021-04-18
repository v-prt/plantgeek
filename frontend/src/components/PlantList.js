import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";

export const PlantList = ({ username, list, title }) => {
  const { loggedIn } = useContext(LoginContext);

  return (
    <Wrapper>
      <Heading>
        <h1>
          {loggedIn && username === loggedIn.username ? (
            <>your {title}</>
          ) : (
            <>
              {username}'s {title}
            </>
          )}
        </h1>
        <span>{list.length} plants</span>
      </Heading>
      <Plants>
        {list &&
          list.map((plant) => {
            return (
              <Plant key={plant._id} to={`/plants/${plant._id}`}>
                <Image src={plant.image} />
                <Name>{plant.name}</Name>
              </Plant>
            );
          })}
      </Plants>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 30px 0;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px dotted ${COLORS.medium};
`;

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Plant = styled(Link)`
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 10px;
  border-radius: 20px;
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 10px ${COLORS.light};
  }
`;

const Image = styled.img`
  height: 150px;
`;

const Name = styled.p`
  margin: 10px;
`;
