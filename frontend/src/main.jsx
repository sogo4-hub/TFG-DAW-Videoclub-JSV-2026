//punto de entrasa de la app.
//carga el html y decide q componente mostrar primero en la pantalla

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import { BrowserRouter } from 'react-router-dom' //--agregar rutas para enlaces
import './index.css';
import App from './App.jsx';
import Dashboard from "./pages/dashboard/dashboard.jsx";
import PrivateAdminRoute from "./components/PrivateAdminRoute.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />

        <Route
          path="/dashboard"
          element={
            <PrivateAdminRoute>
              <Dashboard />
            </PrivateAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
