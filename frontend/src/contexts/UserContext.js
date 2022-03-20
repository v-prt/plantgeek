import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const UserContext = createContext(null)
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('plantgeekToken'))
  const [currentUser, setCurrentUser] = useState(undefined)

  // SIGNUP
  const handleSignup = async values => {
    try {
      const res = await axios.post('/users', values)
      // TODO: log user in on success
      return res.data
    } catch (err) {
      console.log(err.response)
      return { error: err.response.data }
    }
  }

  // LOGIN
  const handleLogin = async values => {
    try {
      const res = await axios.post('/login', values)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      console.log(err.response)
      return { error: err.response.data }
    }
  }

  // LOGOUT
  const handleLogout = ev => {
    ev.preventDefault()
    localStorage.removeItem('plantgeekToken')
    window.location.replace('/login')
  }

  // VERIFY TOKEN AND SET CURRENT USER
  const verifyToken = async token => {
    try {
      axios.post('/token', { token }).then(res => {
        if (res.status === 200) {
          setCurrentUser(res.data.data)
        } else {
          // something wrong with token
          localStorage.removeItem('plantgeekToken')
          window.location.replace('/login')
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (token) {
      verifyToken(token)
    }
  }, [token])

  // GET USER BY ID AND SET AS CURRENT USER
  const getUser = async id => {
    await axios
      .get(`/users/${id}`)
      .then(res => setCurrentUser(res.data.data))
      .catch(err => console.log(err))
  }

  return (
    <UserContext.Provider
      value={{
        token,
        handleSignup,
        handleLogin,
        handleLogout,
        getUser,
        currentUser,
        setCurrentUser,
      }}>
      {children}
    </UserContext.Provider>
  )
}
