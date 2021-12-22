import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext(null)
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('plantgeekToken'))
  const [incorrectUsername, setIncorrectUsername] = useState(false)
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)

  // LOGIN
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
            setSubmitting(false)
            setCurrentUser(json.data)
            // set token in local storage (not best practice)
            localStorage.setItem('plantgeekToken', json.token)
            setToken(json.token)
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

  // VERIFY USER WITH TOKEN
  const verifyUser = async (token) => {
    try {
      fetch('/verify', {
        method: 'POST',
        body: JSON.stringify({
          token: token,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 200) {
            setCurrentUser(json.data)
          } else {
            // delete token? set current user undefined?
            localStorage.removeItem('plantgeekToken')
            setToken(false)
            setCurrentUser(undefined)
            console.log(json)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (token) {
      verifyUser(token)
    }
  }, [token])

  // LOGOUT
  const handleLogout = (ev) => {
    ev.preventDefault()
    window.location.replace('/login')
    localStorage.removeItem('plantgeekToken')
    setCurrentUser(undefined)
  }

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
