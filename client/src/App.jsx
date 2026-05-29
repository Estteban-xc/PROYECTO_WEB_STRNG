import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header  from './components/Header.jsx'
import Ticker  from './components/Ticker.jsx'
import Footer  from './components/Footer.jsx'

import HomePage         from './pages/HomePage.jsx'
import RutinasPage      from './pages/RutinasPage.jsx'
import AlimentacionPage from './pages/AlimentacionPage.jsx'
import SuplementsPage   from './pages/SuplementsPage.jsx'
import ImplementosPage  from './pages/ImplementosPage.jsx'
import IMCPage          from './pages/IMCPage.jsx'
import ContactoPage     from './pages/ContactoPage.jsx'
import TiendaPage       from './pages/TiendaPage.jsx'
import RastreoPage      from './pages/RastreoPage.jsx'
import AdminPage        from './pages/AdminPage.jsx'
import LoginPage, { authLeer } from './pages/LoginPage.jsx'

/* ── Ruta protegida: redirige a /login si no hay sesión ─ */
function ProtectedRoute({ children }) {
  const data = authLeer()
  if (!data) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <>
      <Header />
      <Ticker />

      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/rutinas"        element={<RutinasPage />} />
        <Route path="/alimentacion"   element={<AlimentacionPage />} />
        <Route path="/suplementacion" element={<SuplementsPage />} />
        <Route path="/implementos"    element={<ImplementosPage />} />
        <Route path="/imc"            element={<IMCPage />} />
        <Route path="/contacto"       element={<ContactoPage />} />
        <Route path="/tienda"         element={<TiendaPage />} />
        <Route path="/rastreo"        element={<RastreoPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/admin"          element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  )
}
