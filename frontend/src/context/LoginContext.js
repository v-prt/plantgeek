import React, { createContext, useEffect, useState } from 'react'
import usePersistedState from '../hooks/use-persisted-state.hook'
import { useSelector } from 'react-redux'
import { usersArray } from '../reducers/userReducer'

export const LoginContext = createContext(null)
export const LoginProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = usePersistedState('logged-in', false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const users = useSelector(usersArray)

  useEffect(() => {
    if (loggedIn) {
      setCurrentUser(users.find((user) => user.username === loggedIn.username))
      let timeElapsed = new Date().getTime() - loggedIn.timestamp
      let seconds = timeElapsed / 1000
      // makes login expire after 24 hours
      if (seconds >= 86400) {
        setCurrentUser(undefined)
        setLoggedIn(false)
      }
    }
  }, [loggedIn, setLoggedIn, users])

  return (
    <LoginContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        currentUser,
        setCurrentUser,
      }}>
      {children}
    </LoginContext.Provider>
  )
}
