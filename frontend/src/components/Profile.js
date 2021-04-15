import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";

export const Profile = () => {
  const users = useSelector(usersArray);
  const [user, setUser] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setUser(users.find((user) => user._id === id));
  }, [users, user, id]);

  return <div>{user && <>{user.name}'s profile</>}</div>;
};
