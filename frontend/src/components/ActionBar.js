import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LoginContext } from "../context/LoginContext";
import { plantsArray } from "../reducers/plantReducer";
import { usersArray } from "../reducers/userReducer";
import { requestUsers, receiveUsers } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import { RiPlantLine } from "react-icons/ri";
import { TiHeartOutline } from "react-icons/ti";
import { MdStarBorder } from "react-icons/md";

export const ActionBar = ({ id }) => {
  const dispatch = useDispatch();
  const { loggedIn } = useContext(LoginContext);
  const users = useSelector(usersArray);
  const user = users.find((user) => user.username === loggedIn.username);
  const plants = useSelector(plantsArray);
  const plant = plants.find((plant) => plant._id === id);
  const [clicked, setClicked] = useState(false);

  // FIXME: condense addToCollection/Favorites/Wishlist into 1 function
  const addToCollection = () => {
    // temporarily disables button to prevent spam
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        collection: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's collection!`);
        dispatch(requestUsers());
        fetch("/users")
          .then((res) => res.json())
          .then((json) => {
            dispatch(receiveUsers(json.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  const addToFavorites = () => {
    // temporarily disables button to prevent spam
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        favorites: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's favorites!`);
        dispatch(requestUsers());
        fetch("/users")
          .then((res) => res.json())
          .then((json) => {
            dispatch(receiveUsers(json.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  const addToWishlist = () => {
    // temporarily disables button to prevent spam
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    fetch(`/${loggedIn.username}`, {
      method: "PUT",
      body: JSON.stringify({
        wishlist: plant.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(`Added ${plant.name} to user's wishlist!`);
        dispatch(requestUsers());
        fetch("/users")
          .then((res) => res.json())
          .then((json) => {
            dispatch(receiveUsers(json.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (res.status === 404) {
        console.log("Something went wrong");
      }
    });
  };

  return (
    <Wrapper>
      {user && (
        <>
          <Action
            onClick={addToCollection}
            disabled={
              (user.collection && user.collection.includes(plant.name)) ||
              clicked
            }
            added={user.collection && user.collection.includes(plant.name)}
          >
            <RiPlantLine />
          </Action>
          <Action
            onClick={addToFavorites}
            disabled={
              (user.favorites && user.favorites.includes(plant.name)) || clicked
            }
            added={user.favorites && user.favorites.includes(plant.name)}
          >
            <TiHeartOutline />
          </Action>
          <Action
            onClick={addToWishlist}
            disabled={
              (user.wishlist && user.wishlist.includes(plant.name)) || clicked
            }
            added={user.wishlist && user.wishlist.includes(plant.name)}
          >
            <MdStarBorder />
          </Action>
        </>
      )}
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

// TODO: improve styles of disabled/added buttons
const Action = styled.button`
  /* background: ${(props) => (props.added ? `${COLORS.light}` : "")}; */
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding-top: 5px;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 1.3rem;
  &:hover {
    background: ${COLORS.light};
  }
  &:focus {
    background: ${COLORS.light};
  }
  &:disabled:hover {
    background: transparent;
  }
`;
