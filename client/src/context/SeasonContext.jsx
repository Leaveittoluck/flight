import { createContext, useContext, useState } from 'react'

const SeasonContext = createContext({ season: '', setSeason: () => {} })

export function SeasonProvider({ children }) {
  const [season, setSeason] = useState('')
  return (
    <SeasonContext.Provider value={{ season, setSeason }}>
      {children}
    </SeasonContext.Provider>
  )
}

export function useActiveSeason() {
  return useContext(SeasonContext)
}
