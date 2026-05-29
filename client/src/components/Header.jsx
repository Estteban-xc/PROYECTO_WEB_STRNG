import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { authLeer, authLimpiar } from '../pages/LoginPage.jsx'

const NAV = [
  { to: '/',               label: 'Inicio' },
  { to: '/rutinas',        label: 'Rutinas' },
  { to: '/alimentacion',   label: 'Alimentación' },
  { to: '/suplementacion', label: 'Suplementación' },
  { to: '/implementos',    label: 'Implementos' },
  { to: '/imc',            label: 'Calc. IMC' },
  { to: '/contacto',       label: 'Contacto' },
  { to: '/tienda',         label: '🛒 Tienda' },
  { to: '/rastreo',        label: '📦 Rastrear' },
  { to: '/admin',          label: '⚙️ Admin', admin: true },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [light,    setLight]    = useState(false)
  const [sesion,   setSesion]   = useState(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    document.body.classList.toggle('light', light)
  }, [light])

  /* Actualizar sesión en cada cambio de ruta */
  useEffect(() => {
    setSesion(authLeer())
  }, [location])

  const handleLogout = async () => {
    try {
      const data = authLeer()
      if (data) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${data.token}` },
        })
      }
    } catch { /* ignorar */ }
    authLimpiar()
    setSesion(null)
    navigate('/login', { replace: true })
  }

  const cls = ({ isActive }) => isActive ? 'active' : undefined

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <NavLink to="/" className="logo-wrap">
          <img
            src="/assets/images/logo.png"
            alt="STRNG"
            className="logo-img"
            onError={e => { e.target.style.display = 'none' }}
          />
          <span className="logo-text">STRNG</span>
        </NavLink>

        {/* Desktop nav */}
        <nav>
          <ul className="nav-links">
            {NAV.map(({ to, label, admin }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) =>
                  [cls({ isActive }), admin ? 'admin-link' : ''].filter(Boolean).join(' ')
                }>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Controls */}
        <div className="header-controls">
          <button className="theme-btn" onClick={() => setLight(l => !l)}>
            {light ? '🌙 OSCURO' : '☀ CLARO'}
          </button>

          {sesion && (
            <button
              className="theme-btn"
              onClick={handleLogout}
              title={`Cerrar sesión (${sesion.user?.username})`}
              style={{ borderColor: 'rgba(214,48,49,0.4)', color: '#ff4757' }}
            >
              🚪 SALIR
            </button>
          )}

          <button
            className="hamburger"
            aria-label="Menú"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {NAV.map(({ to, label, admin }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [isActive ? 'active' : '', admin ? 'admin-link' : ''].filter(Boolean).join(' ')
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        {sesion && (
          <button
            onClick={() => { setMenuOpen(false); handleLogout() }}
            style={{
              background: 'none', border: '1px solid rgba(214,48,49,0.3)',
              color: '#ff4757', padding: '10px 20px', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9rem',
              letterSpacing: '2px', margin: '8px 16px', borderRadius: '4px',
            }}
          >
            🚪 CERRAR SESIÓN ({sesion.user?.username})
          </button>
        )}
      </nav>
    </header>
  )
}
