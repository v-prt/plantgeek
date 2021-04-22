import React, { useState, useContext, useEffect } from "react";
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
  const [user, setUser] = useState(undefined);
  const plants = useSelector(plantsArray);
  const [plant, setPlant] = useState(undefined);
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [clicked3, setClicked3] = useState(false);

  useEffect(() => {
    setUser(users.find((user) => user.username === loggedIn.username));
    setPlant(plants.find((plant) => plant._id === id));
    // CLEANUP - PREVENTS MEMORY LEAK
    return () => {
      setUser(undefined);
      setPlant(undefined);
    };
  }, [users, plants, id, loggedIn.username]);

  // FIXME: add plant id to user's lists, then access plant data by id (otherwise user's plant data would always be whatever it was at the time it was added)
  const handleList = (list) => {
    let data;
    if (list === user.collection) {
      // prevents spam
      setClicked1(true);
      setTimeout(() => {
        setClicked1(false);
      }, 3000);
      data = { collection: plant };
    } else if (list === user.favorites) {
      setClicked2(true);
      setTimeout(() => {
        setClicked2(false);
      }, 3000);
      data = { favorites: plant };
    } else if (list === user.wishlist) {
      setClicked3(true);
      setTimeout(() => {
        setClicked3(false);
      }, 3000);
      data = { wishlist: plant };
    }
    if (list && list.find((el) => el.name === plant.name)) {
      // REMOVES PLANT
      fetch(`/${loggedIn.username}/remove`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Removed ${plant.name} from user's list!`);
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
    } else {
      // ADDS PLANT
      fetch(`/${loggedIn.username}/add`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Added ${plant.name} to user's list!`);
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
    }
  };

  return (
    <>
      {user && plant && (
        <Wrapper>
          <>
            <Action
              onClick={() => handleList(user.collection)}
              disabled={clicked1}
              added={
                user.collection &&
                user.collection.find((el) => el.name === plant.name)
              }
            >
              <RiPlantLine />
            </Action>
            <Action
              onClick={() => handleList(user.favorites)}
              disabled={clicked2}
              added={
                user.favorites &&
                user.favorites.find((el) => el.name === plant.name)
              }
            >
              <TiHeartOutline />
            </Action>
            <Action
              onClick={() => handleList(user.wishlist)}
              disabled={clicked3}
              added={
                user.wishlist &&
                user.wishlist.find((el) => el.name === plant.name)
              }
            >
              <MdStarBorder />
            </Action>
          </>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  background: #f2f2f2;
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-self: center;
  margin: 5px 0;
  border-radius: 20px;
  padding: 5px;
`;

const Action = styled.button`
  background: ${(props) => (props.added ? `${COLORS.light}` : "")};
  opacity: ${(props) => (props.added ? "100%" : "30%")};
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
    opacity: 100%;
  }
  &:focus {
    background: ${COLORS.light};
    opacity: 100%;
  }
  &:disabled {
    background: ${COLORS.light};
    color: #000;
    opacity: 100%;
  }
`;
