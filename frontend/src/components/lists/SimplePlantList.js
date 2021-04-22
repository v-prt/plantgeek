import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { usersArray } from "../../reducers/userReducer";
import { plantsArray } from "../../reducers/plantReducer.js";
import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

import styled from "styled-components";
import { COLORS } from "../../GlobalStyles";

export const SimplePlantList = ({ username, list, title }) => {
  const plants = useSelector(plantsArray);
  const users = useSelector(usersArray);
  const [user, setUser] = useState([]);
  const { loggedIn } = useContext(LoginContext);

  useEffect(() => {
    setUser(users.find((user) => user.username === username));
  }, [users, user, username]);

  // SETS USER'S PLANTS TO ACCESS THEIR PLANTS' DATA
  const [userPlants, setUserPlants] = useState(undefined);
  useEffect(() => {
    if (plants && list && list.length > 0) {
      let tempArr = [];
      list.forEach((id) => {
        tempArr.push(plants.find((plant) => plant._id === id));
      });
      setUserPlants(tempArr);
    } else {
      setUserPlants(undefined);
    }
  }, [list, plants]);

  return (
    <Wrapper>
      <Heading to={`/user-${title}/${user.username}/`}>
        {loggedIn && username === loggedIn.username ? (
          <h2>
            <>your {title}</>
          </h2>
        ) : (
          <h2>their {title}</h2>
        )}
      </Heading>
      <Plants>
        {userPlants &&
          userPlants.map((plant) => {
            return (
              <Plant key={plant._id}>
                <Link to={`/plant-profile/${plant._id}`}>
                  <img src={plant.image} alt={plant.name} />
                </Link>
              </Plant>
            );
          })}
      </Plants>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${COLORS.lightest};
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
`;

const Heading = styled(Link)`
  background: ${COLORS.light};
  text-align: center;
  &:hover {
    color: #fff;
  }
`;

const Plants = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const Plant = styled.div`
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 10px;
  border-radius: 20px;
  padding: 10px;
  img {
    height: 150px;
    width: 150px;
  }
  &:hover {
    color: ${COLORS.darkest};
    box-shadow: 0 0 10px ${COLORS.light};
  }
`;
