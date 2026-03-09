import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  
  const [authData, setAuthData] = useState({ token: null, rol: null, nombre:null })
  
  const login = ({ token, rol, nombre }) => {
    setAuthData({ token, rol, nombre })
    localStorage.setItem('auth', JSON.stringify({ token, rol, nombre }))
  }
  
  const logout = () => {
    setAuthData({ token: null, rol: null, nombre:null })
    localStorage.removeItem('auth')
  }

  
  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      setAuthData(JSON.parse(saved))
    }
  }, [])


  //guardar el token y rol del user----
  return (
    <AuthContext.Provider value={{ 
      token: authData.token, 
      rol: authData.rol, 
      nombre: authData.nombre,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
