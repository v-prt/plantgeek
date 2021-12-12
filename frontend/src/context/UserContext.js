import React, { createContext, useState } from 'react'
import { useHistory } from 'react-router'
// import usePersistedState from '../hooks/use-persisted-state.hook'
// import { useSelector } from 'react-redux'
// import { usersArray } from '../reducers/userReducer'

export const UserContext = createContext(null)
export const UserProvider = ({ children }) => {
  const history = useHistory()
  // const [token, setToken] = usePersistedState('plantgeekToken', false)
  const token = localStorage.getItem('plantgeekToken')
  const [incorrectUsername, setIncorrectUsername] = useState(false)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  // const users = useSelector(usersArray)

  const handleLogin = async (values, { setSubmitting }) => {
    // FIXME: improve incorrect username/password error messages
    setIncorrectUsername(false)
    setIncorrectPassword(false)
    try {
      await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 200) {
            // set token in local storage (not best practice)
            localStorage.setItem('plantgeekToken', json.token)
            setSubmitting(false)
            history.push(`/user-profile/${values.username}`)
          } else if (json.status === 401) {
            // username not found
            console.log(json.message)
            setIncorrectUsername(true)
            setSubmitting(false)
          } else if (json.status === 403) {
            // incorrect password
            console.log(json.message)
            setIncorrectPassword(true)
            setSubmitting(false)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = (ev) => {
    ev.preventDefault()
    localStorage.removeItem('plantgeekToken')
    setCurrentUser(undefined)
    history.push('/login')
  }

  // TODO: verify and set current user somehow (id from jwt token?)
  // useEffect(() => {
  //   if (token) {
  //     setCurrentUser(users.find((user) => user.username === loggedIn.username))
  //     let timeElapsed = new Date().getTime() - loggedIn.timestamp
  //     let seconds = timeElapsed / 1000
  //     // makes login expire after 24 hours
  //     if (seconds >= 86400) {
  //       setCurrentUser(undefined)
  //       setLoggedIn(false)
  //     }
  //   }
  // }, [])

  return (
    <UserContext.Provider
      value={{
        token,
        handleLogin,
        handleLogout,
        incorrectUsername,
        incorrectPassword,
        currentUser,
        setCurrentUser,
      }}>
      {children}
    </UserContext.Provider>
  )
}
