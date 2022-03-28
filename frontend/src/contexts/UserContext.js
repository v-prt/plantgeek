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

  // VERIFY TOKEN AND SET CURRENT USER ID
  useEffect(() => {
    if (token) {
      try {
        axios.post('/token', { token }).then(res => {
          if (res.status === 200) {
            setCurrentUser(res.data.user)
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
  }, [token])

  // GET USER BY ID AND SET AS CURRENT USER
  const getUser = async id => {
    await axios
      .get(`/users/${id}`)
      .then(res => setCurrentUser(res.data.user))
      .catch(err => console.log(err))
  }

  // UPDATE CURRENT USER DATA
  const updateCurrentUser = async data => {
    try {
      const res = await axios.put(`users/${currentUser._id}`, data)
      // TODO:
      // queryClient.invalidateQueries('current-user')
      return res.data
    } catch (err) {
      return { error: 'Oops, something went wrong.' }
    }
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
        updateCurrentUser,
      }}>
      {children}
    </UserContext.Provider>
  )
}
