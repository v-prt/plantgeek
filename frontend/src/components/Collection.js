import React from "react";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

export const Collection = ({ username }) => {
  const users = useSelector(usersArray);
  const user = users.find((user) => user.username === username);
  const userCollection = user.collection;

  // FIXME: check render method
  return (
    <ul>
      {userCollection &&
        userCollection.map((plant) => {
          return <li key={plant._id}>{plant.name}</li>;
        })}
    </ul>
  );
};
