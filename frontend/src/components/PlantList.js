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

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
