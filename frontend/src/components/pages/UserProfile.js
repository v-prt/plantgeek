import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersArray } from "../../reducers/userReducer";
import styled from "styled-components";
import background from "../../assets/monstera-bg.jpg";
import placeholder from "../../assets/avatar-placeholder.png";
import moment from "moment";

import { SimplePlantList } from "../lists/SimplePlantList";

export const UserProfile = () => {
  const users = useSelector(usersArray);
  const [user, setUser] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    setUser(users.find((user) => user.username === username));
  }, [users, user, username]);

  return (
    <Wrapper>
      <Banner />
      {user && (
        <Div>
          <Avatar src={user.avatar ? user.avatar : placeholder} alt="" />
          <Name>{user.username}</Name>
          <Joined>Joined: {moment(user.joined).format("ll")}</Joined>
          <Lists>
            {user.collection && (
              <SimplePlantList
                username={username}
                list={user.collection}
                title="collection"
              />
            )}
            {user.favorites && (
              <SimplePlantList
                username={username}
                list={user.favorites}
                title="favorites"
              />
            )}
            {user.wishlist && (
              <SimplePlantList
                username={username}
                list={user.wishlist}
                title="wishlist"
              />
            )}
          </Lists>
        </Div>
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

const Div = styled.div`
  width: 100%;
  position: absolute;
  top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  height: 200px;
  width: 200px;
  border-radius: 50%;
`;

const Name = styled.h1``;

const Joined = styled.p``;

const Lists = styled.section`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
