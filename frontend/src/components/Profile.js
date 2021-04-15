import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer";
import styled from "styled-components";
import background from "../assets/monstera-bg.jpg";
import placeholder from "../assets/avatar-placeholder.png";

export const Profile = () => {
  const users = useSelector(usersArray);
  const [user, setUser] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setUser(users.find((user) => user._id === id));
  }, [users, user, id]);

  return (
    <Wrapper>
      <Banner />
      {user && (
        <>
          <Avatar src={user.avatar ? user.avatar : placeholder} alt="" />
          <Name>{user.name}</Name>
          {/* <Username>{user.username}</Username> */}
          {user.collection && <Collection />}
          {user.favorites && <Favorites />}
          {user.wishlist && <Wishlist />}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`;

const Avatar = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
  position: relative;
  top: -70px;
`;

const Name = styled.h1`
  position: relative;
  top: -60px;
`;

const Username = styled.p``;

const Collection = styled.ul``;

const Favorites = styled.ul``;

const Wishlist = styled.ul``;
