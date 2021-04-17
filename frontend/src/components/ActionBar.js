import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { LoginContext } from "../context/LoginContext";
import { plantsArray } from "../reducers/plantReducer";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { RiPlantLine } from "react-icons/ri";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";

export const ActionBar = ({ id }) => {
  const { loggedIn } = useContext(LoginContext);
  const plants = useSelector(plantsArray);
  const plant = plants.find((plant) => plant._id === id);

  // FIXME: condense handleCollection/Favorites/Wishlist into 1 function
  const handleCollection = () => {
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        // FIXME: need to push new data instead of replace
        collection: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's collection!`);
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  const handleFavorites = () => {
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        // FIXME: need to push new data instead of replace
        favorites: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's favorites!`);
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  const handleWishlist = () => {
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        // FIXME: need to push new data instead of replace
        wishlist: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's wishlist!`);
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  return (
    <Wrapper>
      <Action onClick={handleCollection}>
        <RiPlantLine />
      </Action>
      <Action onClick={handleFavorites}>
        <TiHeartOutline />
      </Action>
      <Action onClick={handleWishlist}>
        <MdStarBorder />
      </Action>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #f2f2f2;
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5px;
  border-radius: 20px;
  padding: 5px;
`;

const Action = styled.button`
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding-top: 5px;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 1.3rem;
  // TODO: make hover/focus style stay active if in user's lists
  &:hover {
    background: ${COLORS.light};
    color: #fff;
  }
  &:focus {
    background: ${COLORS.light};
  }
`;
