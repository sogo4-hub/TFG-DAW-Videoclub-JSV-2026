//punto de entrasa de la app.
//carga el html y decide q componente mostrar primero en la pantalla

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


//import { BrowserRouter } from 'react-router-dom' //--agregar rutas para enlaces
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>
)
