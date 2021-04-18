import React from "react";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

export const Collection = ({ username }) => {
  const users = useSelector(usersArray);
  const user = users.find((user) => user.username === username);
  console.log(user.collection);

  // TODO: render plant info
  return (
    <ul>
      {user.collection &&
        user.collection.map((plant) => {
          return <li key={plant._id}>{plant.name}</li>;
        })}
    </ul>
  );
};
