import React, { useContext } from "react";
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
      <List>
        {list &&
          list.map((plant) => {
            return (
              <Plant key={plant._id}>
                <Image src={plant.image} />
                {/* <Name>{plant.name}</Name> */}
              </Plant>
            );
          })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dotted ${COLORS.medium};
  margin-bottom: 20px;
  h1 {
    margin: 0 20px;
  }
  span {
    margin: 0 20px;
  }
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* overflow: hidden;
  overflow-x: scroll; */
`;

const Plant = styled.div`
  margin: 5px 10px;
`;

const Image = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 20px;
`;

const Name = styled.p``;
