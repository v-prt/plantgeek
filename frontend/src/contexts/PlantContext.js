import React, { createContext, useState } from 'react'

export const PlantContext = createContext(null)
export const PlantProvider = ({ children }) => {
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [viewNeeds, setViewNeeds] = useState(false)

  return (
    <PlantContext.Provider
      value={{
        formData,
        setFormData,
        viewNeeds,
        setViewNeeds,
      }}>
      {children}
    </PlantContext.Provider>
  )
}
