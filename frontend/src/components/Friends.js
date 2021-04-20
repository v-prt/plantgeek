import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../reducers/userReducer.js";
import { requestUsers, receiveUsers } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import placeholder from "../assets/avatar-placeholder.png";

export const Friends = () => {
  const dispatch = useDispatch();
  const { loggedIn } = useContext(LoginContext);
  const users = useSelector(usersArray);
  const [user, setUser] = useState();
  const { username } = useParams();

  useEffect(() => {
    setUser(users.find((user) => user.username === username));
  }, [users, user, username]);

  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    if (loggedIn) {
      setCurrentUser(users.find((user) => user.username === loggedIn.username));
    }
  }, [users, loggedIn]);

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

  const handleFriend = () => {
    if (
      currentUser.friends &&
      currentUser.friends.find((friend) => friend.username === user.username)
    ) {
      // REMOVES FRIEND
      fetch(`/${loggedIn.username}/remove`, {
        method: "PUT",
        body: JSON.stringify({
          friends: user,
        }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(
            `${user.username} and ${loggedIn.username} are not friends anymore!`
          );
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
      fetch(`/${user.username}/remove`, {
        method: "PUT",
        body: JSON.stringify({
          friends: currentUser,
        }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(
            `${user.username} and ${loggedIn.username} are not friends anymore!`
          );
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
      // ADDS FRIEND
      fetch(`/${loggedIn.username}/add`, {
        method: "PUT",
        body: JSON.stringify({
          friends: user,
        }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(
            `${user.username} and ${loggedIn.username} are now friends!`
          );
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
      fetch(`/${user.username}/add`, {
        method: "PUT",
        body: JSON.stringify({
          friends: currentUser,
        }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log(
            `${user.username} and ${loggedIn.username} are now friends!`
          );
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
    <Wrapper>
      <Card>
        <Heading>friends</Heading>
        {user && (
          <>
            {user.friends ? (
              <>
                {user.friends.map((user) => {
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
            ) : (
              <>
                {loggedIn && loggedIn.username === user.username ? (
                  <>
                    <p>you have no friends yet</p>
                    {suggestedFriends && (
                      <>
                        <h3>people you may know</h3>
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
                    <FriendBtn onClick={handleFriend} disabled={!loggedIn}>
                      + Add Friend
                    </FriendBtn>
                  </>
                )}
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
  &:disabled {
    cursor: not-allowed;
    background: ${COLORS.darkest};
  }
`;
