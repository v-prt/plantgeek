import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import { useSelector, useDispatch } from 'react-redux'
import { usersArray } from '../reducers/userReducer.js'
import { requestUsers, receiveUsers } from '../actions.js'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import placeholder from '../assets/avatar-placeholder.png'

export const Friends = () => {
  const dispatch = useDispatch()
  const { username } = useParams()
  const { getUser, currentUser } = useContext(UserContext)
  const users = useSelector(usersArray)
  const [loading, setLoading] = useState(false)

  // SETS THE USER TO ACCESS THEIR FRIENDS
  const [user, setUser] = useState()
  useEffect(() => {
    setUser(users.find((user) => user.username === username))
  }, [users, user, username])

  // CHECKS IF USERS ARE ALREADY FRIENDS
  const [alreadyFriends, setAlreadyFriends] = useState(undefined)
  useEffect(() => {
    if (currentUser && currentUser.friends && currentUser.friends.length > 0) {
      if (currentUser.friends.find((friend) => friend === username)) {
        setAlreadyFriends(true)
      }
    } else {
      setAlreadyFriends(false)
    }
  }, [currentUser, username])

  // SETS USER'S FRIENDS TO ACCESS THEIR FRIENDS' DATA
  const [friends, setFriends] = useState(undefined)
  useEffect(() => {
    if (user && user.friends && user.friends.length > 0) {
      let foundFriends = []
      user.friends.forEach((friend) => {
        // FIXME: don't include friends that aren't found in user db
        foundFriends.push(users.find((user) => user.username === friend))
      })
      setFriends(foundFriends)
    } else {
      setFriends(undefined)
    }
  }, [user, users])

  // SETS SUGGESTED FRIENDS
  const [suggestedFriends, setSuggestedFriends] = useState(undefined)
  useEffect(() => {
    if (users.length > 3) {
      const getRandomUser = () => {
        const randomIndex = Math.floor(Math.random() * users.length)
        const randomUser = users[randomIndex]
        return randomUser
      }
      // only run function when users length > 0
      let randomUsers = users.length > 0 ? [] : undefined
      if (randomUsers) {
        while (randomUsers.length < 3) {
          let randomUser = getRandomUser(users)
          if (!randomUsers.find((user) => user.username === randomUser.username)) {
            randomUsers.push(randomUser)
          }
        }
      }
      setSuggestedFriends(randomUsers)
    }
    // FIXME: don't include current friends
    else
      setSuggestedFriends(
        users.filter(
          (user) => user.username !== currentUser?.username && user.username !== username
        )
      )
  }, [users, currentUser, username])

  // FIXME: add/remove friend takes too long
  // TODO: send friend request instead of forced add
  const addFriend = () => {
    setLoading(true)
    // ADDS OTHER USER TO CURRENT USER'S FRIENDS LIST
    // FIXME: use axios
    fetch(`/${currentUser.username}/add`, {
      method: 'PUT',
      body: JSON.stringify({
        friends: user.username,
      }),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
        // ADDS CURRENT USER TO OTHER USER'S FRIENDS LIST
        // FIXME: use axios
        fetch(`/${user.username}/add`, {
          // FIXME: save user ID instead of username
          method: 'PUT',
          body: JSON.stringify({
            friends: currentUser.username,
          }),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        }).then((res) => {
          if (res.status === 200) {
            console.log(`${user.username} and ${currentUser.username} are now friends!`)
            dispatch(requestUsers())
            axios
              .get('/users')
              .then((res) => dispatch(receiveUsers(res.data.data)))
              .catch((err) => console.log(err))
            getUser(currentUser._id)
            setTimeout(() => {
              setLoading(false)
            }, 2000)
          } else if (res.status === 404) {
            console.log('Something went wrong')
            setTimeout(() => {
              setLoading(false)
            }, 2000)
          }
        })
      } else if (res.status === 404) {
        console.log('Something went wrong')
      }
    })
  }

  const removeFriend = () => {
    setLoading(true)
    // REMOVES OTHER USER FROM CURRENT USER'S FRIENDS LIST
    // FIXME: use axios
    fetch(`/${currentUser.username}/remove`, {
      method: 'PUT',
      body: JSON.stringify({
        friends: user.username,
      }),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    }).then((res) => {
      if (res.status === 200) {
        // REMOVES CURRENT USER FROM OTHER USER'S FRIENDS LIST
        // FIXME: use axios
        fetch(`/${user.username}/remove`, {
          method: 'PUT',
          body: JSON.stringify({
            friends: currentUser.username,
          }),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        }).then((res) => {
          if (res.status === 200) {
            console.log(`${user.username} and ${currentUser.username} are not friends anymore!`)
            dispatch(requestUsers())
            axios
              .get('/users')
              .then((res) => dispatch(receiveUsers(res.data.data)))
              .catch((err) => console.log(err))
            getUser(currentUser._id)
            setTimeout(() => {
              setLoading(false)
            }, 2000)
          } else if (res.status === 404) {
            console.log('Something went wrong')
          }
        })
      } else if (res.status === 404) {
        console.log('Something went wrong')
      }
    })
  }

  return (
    <Wrapper>
      <Card>
        <Heading>
          {currentUser && currentUser.username === username ? <>my friends</> : <>their friends</>}
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
                  )
                })}
                {currentUser && currentUser.username !== user.username && (
                  <>
                    {alreadyFriends ? (
                      <FriendBtn onClick={removeFriend} disabled={loading}>
                        REMOVE FRIEND
                      </FriendBtn>
                    ) : (
                      <FriendBtn onClick={addFriend} disabled={loading}>
                        ADD FRIEND
                      </FriendBtn>
                    )}
                  </>
                )}
                {suggestedFriends?.length > 0 && (
                  <GreyCard>
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
                      )
                    })}
                  </GreyCard>
                )}
              </>
            ) : (
              <>
                {currentUser && currentUser.username === user.username ? (
                  <>
                    <p>You have no friends yet.</p>
                    {suggestedFriends?.length > 0 && (
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
                          )
                        })}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p>{user.username} has no friends yet.</p>
                    {currentUser && (
                      <FriendBtn onClick={addFriend} disabled={loading}>
                        ADD FRIEND
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
  )
}

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  color: ${COLORS.darkest};
`

const Card = styled.div`
  background: #fff;
  width: 270px;
  display: flex;
  flex-direction: column;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  h3 {
    text-align: center;
    margin: 10px 0;
  }
  p {
    text-align: center;
    margin-bottom: 10px;
  }
`

const GreyCard = styled.div`
  background: #f2f2f2;
`

const Heading = styled.h2`
  background: ${COLORS.light};
  text-align: center;
  margin-bottom: 10px;
`

const User = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px 10px 10px;
  a {
    line-height: 1;
  }
`

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  margin: 5px 10px;
  border-radius: 50%;
`

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
    pointer-events: none;
    background: ${COLORS.darkest};
  }
`
