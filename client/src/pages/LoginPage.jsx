import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Auth helpers ─────────────────────────────────── */
export const authGuardar = (token, user) => {
  localStorage.setItem('strng_token', token)
  localStorage.setItem('strng_user',  JSON.stringify(user))
}

export const authLeer = () => {
  const token = localStorage.getItem('strng_token')
  const raw   = localStorage.getItem('strng_user')
  if (!token || !raw) return null
  try { return { token, user: JSON.parse(raw) } } catch { return null }
}

export const authLimpiar = () => {
  localStorage.removeItem('strng_token')
  localStorage.removeItem('strng_user')
}

export const authHeaders = () => {
  const data = authLeer()
  return data ? { Authorization: `Bearer ${data.token}` } : {}
}

/* ── Hook: verificar sesión activa ────────────────── */
export const useAuth = () => {
  const [autenticado, setAutenticado] = useState(null) // null = cargando
  const [user,        setUser]        = useState(null)

  useEffect(() => {
    const verificar = async () => {
      const data = authLeer()
      if (!data) { setAutenticado(false); return }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        if (res.ok) {
          const json = await res.json()
          setUser(json.user)
          setAutenticado(true)
        } else {
          authLimpiar()
          setAutenticado(false)
        }
      } catch {
        // Sin red: confiar en localStorage hasta expiración
        setUser(data.user)
        setAutenticado(true)
      }
    }
    verificar()
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method:  'POST',
        headers: authHeaders(),
      })
    } catch { /* ignorar errores de red en logout */ }
    authLimpiar()
    setAutenticado(false)
    setUser(null)
  }

  return { autenticado, user, logout }
}

/* ══════════════════════════════════════════════════
   LoginPage
   ══════════════════════════════════════════════════ */
export default function LoginPage() {
  const navigate = useNavigate()

  const [form,      setForm]      = useState({ username: '', password: '' })
  const [error,     setError]     = useState('')
  const [cargando,  setCargando]  = useState(false)
  const [mostrarPw, setMostrarPw] = useState(false)

  /* Redirigir si ya hay sesión */
  useEffect(() => {
    const data = authLeer()
    if (data) navigate('/admin', { replace: true })
  }, [navigate])

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password) {
      setError('Completa todos los campos.')
      return
    }

    setCargando(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión.')
        return
      }

      authGuardar(data.token, data.user)
      navigate('/admin', { replace: true })
    } catch {
      setError('Sin conexión con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Fondo animado */}
      <div style={s.bgGrid} aria-hidden />

      <div style={s.card}>
        {/* Logo / Header */}
        <div style={s.logoWrap}>
          <img
            src="/assets/images/logo.png"
            alt="STRNG"
            style={s.logoImg}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div>
            <h1 style={s.brand}>STRNG</h1>
            <p  style={s.brandSub}>PANEL ADMINISTRATIVO</p>
          </div>
        </div>

        <div style={s.divider} />

        <h2 style={s.title}>ACCESO ADMIN</h2>
        <p  style={s.subtitle}>Ingresa tus credenciales para continuar</p>

        {/* Formulario */}
        <div style={s.form} onSubmit={handleSubmit}>
          {/* Usuario */}
          <div style={s.fieldWrap}>
            <label style={s.label}>USUARIO</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>◉</span>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="admin"
                autoComplete="username"
                style={s.input}
                disabled={cargando}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div style={s.fieldWrap}>
            <label style={s.label}>CONTRASEÑA</label>
            <div style={s.inputWrap}>
              <span style={s.icon}>🔒</span>
              <input
                name="password"
                type={mostrarPw ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                style={s.input}
                disabled={cargando}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
              />
              <button
                type="button"
                onClick={() => setMostrarPw(p => !p)}
                style={s.togglePw}
                tabIndex={-1}
              >
                {mostrarPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              <span style={s.errorIcon}>⚠</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={cargando}
            style={{ ...s.btn, ...(cargando ? s.btnDisabled : {}) }}
          >
            {cargando
              ? <><span style={s.spinner} />VERIFICANDO...</>
              : '⚡ INGRESAR'}
          </button>
        </div>

        <p style={s.footer}>
          STRNG © 2025 · Solo personal autorizado
        </p>
      </div>
    </div>
  )
}

/* ── Estilos inline (sin deps externas) ──────────── */
const s = {
  page: {
    minHeight:       '100vh',
    background:      '#0c0c0c',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         '20px',
    fontFamily:      "'Barlow', sans-serif",
    position:        'relative',
    overflow:        'hidden',
  },
  bgGrid: {
    position:   'absolute',
    inset:      0,
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 39px,
        rgba(214,48,49,0.06) 40px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 39px,
        rgba(214,48,49,0.06) 40px
      )
    `,
    pointerEvents: 'none',
  },
  card: {
    position:        'relative',
    background:      '#141414',
    border:          '1px solid rgba(214,48,49,0.25)',
    borderRadius:    '6px',
    padding:         '48px 44px',
    width:           '100%',
    maxWidth:        '420px',
    boxShadow:       '0 0 60px rgba(214,48,49,0.12), 0 24px 64px rgba(0,0,0,0.7)',
  },
  logoWrap: {
    display:        'flex',
    alignItems:     'center',
    gap:            '14px',
    marginBottom:   '20px',
  },
  logoImg: {
    width:        '52px',
    height:       '52px',
    objectFit:    'contain',
    filter:       'drop-shadow(0 0 8px rgba(214,48,49,0.5))',
  },
  brand: {
    fontFamily:   "'Bebas Neue', sans-serif",
    fontSize:     '2rem',
    color:        '#ffffff',
    lineHeight:   1,
    letterSpacing: '3px',
  },
  brandSub: {
    fontFamily:   "'Barlow Condensed', sans-serif",
    fontSize:     '0.65rem',
    color:        '#d63031',
    letterSpacing: '4px',
    fontWeight:   700,
  },
  divider: {
    height:          '1px',
    background:      'linear-gradient(90deg, transparent, rgba(214,48,49,0.6), transparent)',
    margin:          '0 0 28px',
  },
  title: {
    fontFamily:   "'Bebas Neue', sans-serif",
    fontSize:     '1.8rem',
    color:        '#f0f0f0',
    letterSpacing: '4px',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize:     '0.82rem',
    color:        '#707070',
    marginBottom: '32px',
    fontFamily:   "'Barlow', sans-serif",
  },
  form: {
    display:        'flex',
    flexDirection:  'column',
    gap:            '20px',
  },
  fieldWrap: {
    display:        'flex',
    flexDirection:  'column',
    gap:            '8px',
  },
  label: {
    fontFamily:   "'Barlow Condensed', sans-serif",
    fontSize:     '0.72rem',
    fontWeight:   700,
    letterSpacing: '2px',
    color:        '#b0b0b0',
  },
  inputWrap: {
    position:       'relative',
    display:        'flex',
    alignItems:     'center',
  },
  icon: {
    position:   'absolute',
    left:       '14px',
    fontSize:   '0.85rem',
    color:      '#d63031',
    pointerEvents: 'none',
    zIndex:     1,
  },
  input: {
    width:           '100%',
    background:      '#111111',
    border:          '1px solid rgba(255,255,255,0.08)',
    borderRadius:    '4px',
    padding:         '13px 44px 13px 40px',
    color:           '#f0f0f0',
    fontSize:        '0.95rem',
    fontFamily:      "'Barlow', sans-serif",
    outline:         'none',
    transition:      'border-color 0.2s',
  },
  togglePw: {
    position:        'absolute',
    right:           '12px',
    background:      'none',
    border:          'none',
    cursor:          'pointer',
    fontSize:        '1rem',
    padding:         '4px',
    lineHeight:      1,
  },
  errorBox: {
    display:        'flex',
    alignItems:     'center',
    gap:            '10px',
    background:     'rgba(214,48,49,0.1)',
    border:         '1px solid rgba(214,48,49,0.3)',
    borderRadius:   '4px',
    padding:        '12px 16px',
    color:          '#ff4757',
    fontSize:       '0.85rem',
    fontFamily:     "'Barlow', sans-serif",
  },
  errorIcon: {
    fontSize:   '1rem',
    flexShrink: 0,
  },
  btn: {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             '10px',
    background:      'linear-gradient(135deg, #d63031 0%, #c0392b 100%)',
    color:           '#ffffff',
    border:          'none',
    borderRadius:    '4px',
    padding:         '15px',
    fontSize:        '0.9rem',
    fontFamily:      "'Bebas Neue', sans-serif",
    letterSpacing:   '3px',
    cursor:          'pointer',
    marginTop:       '8px',
    transition:      'opacity 0.2s, transform 0.1s',
    boxShadow:       '0 4px 20px rgba(214,48,49,0.35)',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor:  'not-allowed',
  },
  spinner: {
    display:      'inline-block',
    width:        '14px',
    height:       '14px',
    border:       '2px solid rgba(255,255,255,0.3)',
    borderTop:    '2px solid #fff',
    borderRadius: '50%',
    animation:    'spin 0.8s linear infinite',
  },
  footer: {
    marginTop:    '28px',
    textAlign:    'center',
    fontSize:     '0.72rem',
    color:        '#404040',
    fontFamily:   "'Barlow Condensed', sans-serif",
    letterSpacing: '1px',
  },
}
