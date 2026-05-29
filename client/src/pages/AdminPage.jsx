import { useState, useEffect, useCallback } from 'react'
import ProductForm from '../components/admin/ProductForm'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const CAT_COLOR = {
  proteina: '#d63031', fuerza: '#e17055', energia: '#fdcb6e',
  salud: '#00b894', recuperacion: '#6c5ce7',
}

/* ── Toast ──────────────────────────────────────────── */
function Toast({ msg, tipo }) {
  return (
    <div className={`adm-toast adm-toast--${tipo}`}>
      {tipo === 'ok' ? '✓' : '⚠'} {msg}
    </div>
  )
}

/* ── Confirm dialog ─────────────────────────────────── */
function Confirm({ nombre, onConfirmar, onCancelar }) {
  return (
    <div className="pform-overlay" onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className="adm-confirm">
        <p className="adm-confirm-title">¿ELIMINAR PRODUCTO?</p>
        <p className="adm-confirm-sub">{nombre}</p>
        <div className="adm-confirm-actions">
          <button className="btn btn-outline" onClick={onCancelar}>CANCELAR</button>
          <button className="btn adm-btn-danger" onClick={onConfirmar}>ELIMINAR</button>
        </div>
      </div>
    </div>
  )
}

/* ── Stat card ──────────────────────────────────────── */
function StatCard({ label, value, accent }) {
  return (
    <div className="adm-stat" style={{ '--accent-stat': accent }}>
      <span className="adm-stat-val">{value}</span>
      <span className="adm-stat-label">{label}</span>
    </div>
  )
}

/* ── AdminPage ──────────────────────────────────────── */
export default function AdminPage() {
  const [productos,   setProductos]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [busqueda,    setBusqueda]    = useState('')
  const [catFiltro,   setCatFiltro]   = useState('todos')
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando,    setEditando]    = useState(null)   // producto | null
  const [confirmando, setConfirmando] = useState(null)   // producto | null
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, tipo = 'ok') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/productos')
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setProductos(data.productos)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  /* Eliminar */
  const eliminar = async (producto) => {
    try {
      const res  = await fetch(`/api/productos/${producto._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setProductos(ps => ps.filter(p => p._id !== producto._id))
      showToast(`${producto.nombre} eliminado`)
    } catch (err) {
      showToast(err.message, 'err')
    } finally {
      setConfirmando(null)
    }
  }

  /* Toggle disponible rápido */
  const toggleDisponible = async (p) => {
    try {
      const res  = await fetch(`/api/productos/${p._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible: !p.disponible }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setProductos(ps => ps.map(x => x._id === p._id ? data.producto : x))
    } catch (err) {
      showToast(err.message, 'err')
    }
  }

  /* Callback del form */
  const onGuardado = (productoActualizado) => {
    setProductos(ps => {
      const idx = ps.findIndex(p => p._id === productoActualizado._id)
      if (idx === -1) return [productoActualizado, ...ps]
      return ps.map(p => p._id === productoActualizado._id ? productoActualizado : p)
    })
    showToast(editando ? 'Producto actualizado' : 'Producto creado')
    setFormAbierto(false)
    setEditando(null)
  }

  /* Filtrado local */
  const visibles = productos.filter(p => {
    const coincideCat = catFiltro === 'todos' || p.categoria === catFiltro
    const texto = busqueda.toLowerCase()
    const coincideTexto = !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.marca.toLowerCase().includes(texto)
    return coincideCat && coincideTexto
  })

  /* Stats */
  const total      = productos.length
  const disponibles = productos.filter(p => p.disponible).length
  const destacados  = productos.filter(p => p.destacado).length
  const sinStock    = productos.filter(p => p.stock === 0).length

  const CATS = ['todos','proteina','fuerza','energia','salud','recuperacion']

  return (
    <main>
      <div className="adm-hero">
        <div className="adm-hero-inner">
          <div>
            <h1 className="adm-title">DASHBOARD</h1>
            <p className="adm-sub">Panel de administración · Productos</p>
          </div>
          <button className="btn btn-primary adm-btn-nuevo"
            onClick={() => { setEditando(null); setFormAbierto(true) }}>
            ＋ NUEVO PRODUCTO
          </button>
        </div>
      </div>

      <div className="adm-page">

        {/* Stats */}
        <div className="adm-stats">
          <StatCard label="Total"      value={total}       accent="var(--red)" />
          <StatCard label="Disponibles" value={disponibles} accent="#00b894" />
          <StatCard label="Destacados"  value={destacados}  accent="#fdcb6e" />
          <StatCard label="Sin stock"   value={sinStock}    accent="#636e72" />
        </div>

        {/* Toolbar */}
        <div className="adm-toolbar">
          <input
            className="adm-search"
            placeholder="🔍  Buscar por nombre o marca…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <div className="adm-cats">
            {CATS.map(c => (
              <button key={c}
                className={`filtro-btn ${catFiltro === c ? 'activo' : ''}`}
                onClick={() => setCatFiltro(c)}>
                {c === 'todos' ? 'TODOS' : c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {error && (
          <div className="tienda-error">
            <span className="tienda-error-icon">⚠</span>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={cargar}>REINTENTAR</button>
          </div>
        )}

        {!error && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="adm-row-sk">
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j}><div className="adm-sk-cell" /></td>
                        ))}
                      </tr>
                    ))
                  : visibles.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="adm-empty">Sin resultados</td>
                      </tr>
                    )
                    : visibles.map(p => (
                      <tr key={p._id} className={`adm-row ${!p.disponible ? 'adm-row--off' : ''}`}>

                        {/* Producto */}
                        <td>
                          <div className="adm-prod-cell">
                            <span className="adm-prod-emoji">{p.emoji}</span>
                            <div>
                              <p className="adm-prod-nombre">{p.nombre}</p>
                              <p className="adm-prod-marca">{p.marca}</p>
                            </div>
                            {p.destacado && <span className="adm-star">★</span>}
                          </div>
                        </td>

                        {/* Categoría */}
                        <td>
                          <span className="adm-cat-pill"
                            style={{ background: CAT_COLOR[p.categoria] }}>
                            {p.categoria}
                          </span>
                        </td>

                        {/* Precio */}
                        <td>
                          <span className="adm-precio">{fmt(p.precio)}</span>
                          {p.precioAntes && (
                            <span className="adm-precio-antes">{fmt(p.precioAntes)}</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td>
                          <span className={`adm-stock ${p.stock === 0 ? 'adm-stock--cero' : ''}`}>
                            {p.stock}
                          </span>
                        </td>

                        {/* Disponible */}
                        <td>
                          <button
                            className={`adm-pill-toggle ${p.disponible ? 'on' : 'off'}`}
                            onClick={() => toggleDisponible(p)}
                            title="Cambiar disponibilidad">
                            {p.disponible ? 'ACTIVO' : 'INACTIVO'}
                          </button>
                        </td>

                        {/* Acciones */}
                        <td>
                          <div className="adm-actions">
                            <button className="adm-btn-edit"
                              onClick={() => { setEditando(p); setFormAbierto(true) }}
                              title="Editar">✏️</button>
                            <button className="adm-btn-del"
                              onClick={() => setConfirmando(p)}
                              title="Eliminar">🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <p className="tienda-count" style={{ marginTop: 12 }}>
            {visibles.length} de {total} productos
          </p>
        )}
      </div>

      {/* Modal form */}
      {formAbierto && (
        <ProductForm
          producto={editando}
          onGuardado={onGuardado}
          onCancelar={() => { setFormAbierto(false); setEditando(null) }}
        />
      )}

      {/* Confirm delete */}
      {confirmando && (
        <Confirm
          nombre={confirmando.nombre}
          onConfirmar={() => eliminar(confirmando)}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} tipo={toast.tipo} />}
    </main>
  )
}
