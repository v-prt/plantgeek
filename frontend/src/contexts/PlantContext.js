import React, { createContext, useState } from 'react'
import { API_URL } from '../constants'
import axios from 'axios'

export const PlantContext = createContext(null)
export const PlantProvider = ({ children }) => {
  const [formData, setFormData] = useState({ sort: 'name-asc' })

  const fetchPlants = async ({ pageParam = 1 }) => {
    const res = await axios.get(`${API_URL}/plants/${pageParam}`, {
      params: formData,
    })
    return res.data
  }

  return (
    <PlantContext.Provider
      value={{
        formData,
        setFormData,
        fetchPlants,
      }}>
      {children}
    </PlantContext.Provider>
  )
}
