import React, { createContext, useState, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import axios from 'axios'

export const UserContext = createContext(null)
export const UserProvider = ({ children }) => {
  const queryClient = new useQueryClient()
  const [token, setToken] = useState(localStorage.getItem('plantgeekToken'))
  const [checkedToken, setCheckedToken] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentUserId, setCurrentUserId] = useState(undefined)

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
  const verifyToken = async token => {
    try {
      const res = await axios.post('/token', { token })
      if (res.status === 200) {
        setCurrentUser(res.data.user)
        setCurrentUserId(res.data.user._id)
        setCheckedToken(true)
      } else {
        // something wrong with token
        localStorage.removeItem('plantgeekToken')
        window.location.replace('/')
        setCurrentUser(undefined)
        setCurrentUserId(undefined)
      }
    } catch (err) {
      // something wrong with token
      localStorage.removeItem('plantgeekToken')
      window.location.replace('/')
      setCurrentUser(undefined)
      setCurrentUserId(undefined)
    }
  }

  useEffect(() => {
    if (token) {
      verifyToken(token)
    } else setCheckedToken(true)
  }, [token])

  // GET USER BY ID
  const getUserById = async id => {
    await axios
      .get(`/users/${id}`)
      .then(res => res.data.user)
      .catch(err => console.log(err))
  }

  // UPDATE CURRENT USER DATA
  const updateCurrentUser = async data => {
    try {
      const res = await axios.put(`users/${currentUser._id}`, data)
      queryClient.invalidateQueries('current-user')
      return res.data
    } catch (err) {
      console.log(err.response)
      return { error: err.response.data.msg }
    }
  }

  return (
    <UserContext.Provider
      value={{
        token,
        checkedToken,
        handleSignup,
        handleLogin,
        handleLogout,
        getUserById,
        currentUser,
        currentUserId,
        updateCurrentUser,
      }}>
      {children}
    </UserContext.Provider>
  )
}
