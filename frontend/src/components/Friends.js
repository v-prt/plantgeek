import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useSelector, useDispatch } from "react-redux";
import { usersArray } from "../reducers/userReducer.js";
import { requestUsers, receiveUsers } from "../actions.js";

import styled from "styled-components";
import { COLORS } from "../GlobalStyles";
import placeholder from "../assets/avatar-placeholder.png";

// FIXME: user always has PoisonIvy (currentUser's friend) as friend until you refresh
export const Friends = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const { loggedIn } = useContext(LoginContext);
  const users = useSelector(usersArray);
  const [clicked, setClicked] = useState(false);

  // SETS THE USER TO ACCESS THEIR FRIENDS
  const [user, setUser] = useState();
  useEffect(() => {
    setUser(users.find((user) => user.username === username));
  }, [users, user, username]);

  // SETS THE CURRENT USER IF THEY'RE LOGGED IN
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    if (loggedIn) {
      setCurrentUser(users.find((user) => user.username === loggedIn.username));
    }
  }, [users, loggedIn]);

  // SETS SUGGESTED FRIENDS
  // FIXME: don't include current user's existing friends
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

  // CHECKS IF USERS ARE ALREADY FRIENDS
  const [alreadyFriends, setAlreadyFriends] = useState(undefined);
  useEffect(() => {
    if (currentUser && currentUser.friends && currentUser.friends.length > 0) {
      if (currentUser.friends.find((friend) => friend === user.username)) {
        setAlreadyFriends(true);
      }
    } else {
      setAlreadyFriends(false);
    }
  }, [currentUser, user]);

  // SETS USER'S FRIENDS TO ACCESS THEIR FRIENDS' DATA
  // FIXME: make component re-render after removing friend
  const [friends, setFriends] = useState(undefined);
  useEffect(() => {
    if (user && user.friends && user.friends.length > 0) {
      let tempArr = [];
      user.friends.forEach((friend) => {
        tempArr.push(users.find((user) => user.username === friend));
      });
      setFriends(tempArr);
    }
  }, [user, users]);

  const addFriend = () => {
    // prevents spamming
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    // ADDS USER TO CURRENT USER'S FRIENDS
    fetch(`/${currentUser.username}/add`, {
      method: "PUT",
      body: JSON.stringify({
        friends: user.username,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(
          `${user.username} and ${currentUser.username} are now friends!`
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
    // ADDS CURRENT USER TO USER'S FRIENDS
    fetch(`/${user.username}/add`, {
      method: "PUT",
      body: JSON.stringify({
        friends: currentUser.username,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(
          `${user.username} and ${currentUser.username} are now friends!`
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
  };

  const removeFriend = () => {
    // prevents spamming
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
    // REMOVES USER FROM CURRENT USER'S FRIENDS
    fetch(`/${currentUser.username}/remove`, {
      method: "PUT",
      body: JSON.stringify({
        friends: user.username,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(
          `${user.username} and ${currentUser.username} are not friends anymore!`
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
    // REMOVES CURRENT USER FROM USER'S FRIENDS
    fetch(`/${user.username}/remove`, {
      method: "PUT",
      body: JSON.stringify({
        friends: currentUser.username,
      }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(
          `${user.username} and ${currentUser.username} are not friends anymore!`
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
  };

  return (
    <Wrapper>
      <Card>
        <Heading>
          {currentUser && currentUser.username === user.username ? (
            <>your friends</>
          ) : (
            <>their friends</>
          )}
        </Heading>
        {user && (
          <>
            {friends ? (
              <>
                {friends.map((friend) => {
                  return (
                    <User key={friend._id}>
                      <Link to={`/user-profile/${friend.username}`}>
                        {friend.image ? (
                          <Avatar src={friend.image} />
                        ) : (
                          <Avatar src={placeholder} />
                        )}
                      </Link>
                      {friend.username}
                    </User>
                  );
                })}
                {currentUser && currentUser.username !== user.username && (
                  <>
                    {alreadyFriends ? (
                      <FriendBtn onClick={removeFriend} disabled={clicked}>
                        Remove Friend
                      </FriendBtn>
                    ) : (
                      <FriendBtn onClick={addFriend}>Add Friend</FriendBtn>
                    )}
                  </>
                )}
                {currentUser &&
                  currentUser.username === user.username &&
                  suggestedFriends && (
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
                {currentUser && currentUser.username === user.username ? (
                  <>
                    <p>you have no friends yet</p>
                    {currentUser &&
                      currentUser.username === user.username &&
                      suggestedFriends && (
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
                    {loggedIn && (
                      <FriendBtn onClick={addFriend} disabled={clicked}>
                        Add Friend
                      </FriendBtn>
                    )}
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
  color: ${COLORS.darkest};
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
    padding: 10px;
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
