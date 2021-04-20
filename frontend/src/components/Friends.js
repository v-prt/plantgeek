import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useSelector } from "react-redux";
import { usersArray } from "../reducers/userReducer.js";
import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import placeholder from "../assets/avatar-placeholder.png";

export const Friends = () => {
  const { loggedIn } = useContext(LoginContext);
  const users = useSelector(usersArray);
  const user = useParams();
  const [suggestedFriends, setSuggestedFriends] = useState(undefined);

  useEffect(() => {
    const getRandomUser = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomIndex];
      return randomUser;
    };
    // only run function when users length > 0
    let tempArray = users.length > 0 ? [] : undefined;
    if (users.length < 7) {
      tempArray = users;
    } else {
      if (tempArray)
        while (tempArray.length < 6) {
          let randomUser = getRandomUser(users);
          if (!tempArray.find((user) => user.username === randomUser.name)) {
            tempArray.push(randomUser);
          }
        }
    }
    setSuggestedFriends(tempArray);
  }, [users]);

  return (
    <Wrapper>
      <Card>
        <Heading>friends</Heading>
        {user.friends ? (
          <>
            {user.friends.map((user) => {
              return (
                <User>
                  {user.image ? (
                    <Avatar src={user.image} />
                  ) : (
                    <Avatar src={placeholder} />
                  )}
                  {user.username}
                </User>
              );
            })}
          </>
        ) : (
          <>
            {loggedIn && loggedIn.username === user.username ? (
              <>
                <p>you have no friends yet</p>
                {suggestedFriends && (
                  <>
                    <h3>users you may know</h3>
                    {suggestedFriends.map((user) => {
                      return (
                        <User key={user._id}>
                          <Link to={`/user-profile/${user.username}`}>
                            {user.image ? (
                              <Avatar src={user.image} />
                            ) : (
                              <Avatar src={placeholder} />
                            )}
                          </Link>
                          {user.username}
                        </User>
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <>
                <p>{user.username} has no friends yet</p>
                <FriendBtn>+ Add Friend</FriendBtn>
              </>
            )}
          </>
        )}
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: #f2f2f2;
  width: 270px;
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  p {
    text-align: center;
  }
  h3 {
    text-align: center;
    margin-top: 20px;
  }
`;

const Heading = styled.h2`
  background: ${COLORS.light};
  text-align: center;
  margin-bottom: 10px;
  padding: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const Avatar = styled.img`
  width: 40px;
  margin: 5px 10px;
  border-radius: 50%;
`;

const FriendBtn = styled.button`
  background: ${COLORS.darkest};
  color: #fff;
  margin: 10px;
  border-radius: 20px;
  padding: 5px;
  font-size: 0.9rem;
  &:hover {
    background: ${COLORS.medium};
  }
`;
