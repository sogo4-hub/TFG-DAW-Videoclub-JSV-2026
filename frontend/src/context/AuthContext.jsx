import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  
  const [authData, setAuthData] = useState({ token: null, rol: null })
  
  const login = ({ token, rol }) => {
    setAuthData({ token, rol })
    localStorage.setItem('auth', JSON.stringify({ token, rol }))
  }
  
  const logout = () => {
    setAuthData({ token: null, rol: null })
    localStorage.removeItem('auth')
  }

  
  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      setAuthData(JSON.parse(saved))
    }
  }, [])


  return (
    <AuthContext.Provider value={{ 
      token: authData.token, 
      rol: authData.rol, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
