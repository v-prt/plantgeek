import React, { createContext, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'

export const UserContext = createContext(null)
export const UserProvider = ({ children }) => {
  const queryClient = new useQueryClient()
  const [token, setToken] = useState(localStorage.getItem('plantgeekToken'))
  const [checkedToken, setCheckedToken] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const [currentUserId, setCurrentUserId] = useState()

  const { data: userData, status: userStatus } = useQuery(
    ['current-user', currentUserId],
    async () => {
      if (currentUserId) {
        const { data } = await axios.get(`${API_URL}/users/${currentUserId}`)
        return data.user
      } else return null
    }
  )

  useEffect(() => {
    if (userData) {
      setCurrentUser(userData)
    } else return null
  }, [userData])

  // SIGNUP
  const handleSignup = async values => {
    try {
      const res = await axios.post(`${API_URL}/users`, values)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      return { error: err.response.data }
    }
  }

  // LOGIN
  const handleLogin = async values => {
    try {
      const res = await axios.post(`${API_URL}/login`, values)
      setToken(res.data.token)
      return res.data
    } catch (err) {
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
      const res = await axios.post(`${API_URL}/token`, { token })
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
      .get(`${API_URL}/users/${id}`)
      .then(res => res.data.user)
      .catch(err => console.log(err))
  }

  // UPDATE CURRENT USER DATA
  const updateCurrentUser = async data => {
    try {
      const res = await axios.put(`${API_URL}/users/${currentUser._id}`, data)
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
        userStatus,
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
