import { useState, useEffect } from 'react'

const CATEGORIAS = [
  { value: 'proteina',     label: 'Proteína' },
  { value: 'fuerza',       label: 'Fuerza' },
  { value: 'energia',      label: 'Energía' },
  { value: 'salud',        label: 'Salud' },
  { value: 'recuperacion', label: 'Recuperación' },
]

const EMOJIS = ['🥛','⚡','🔥','🐟','🌱','💪','☀️','☕','🔬','💊','🏋️','🧬']

const VACIO = {
  nombre: '', marca: '', descripcion: '', precio: '',
  precioAntes: '', categoria: 'proteina', sabores: 'Sin sabor',
  imagen: '', emoji: '💊', stock: '', disponible: true, destacado: false,
}

export default function ProductForm({ producto, onGuardado, onCancelar }) {
  const editando = Boolean(producto)
  const [form,    setForm]    = useState(VACIO)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  /* Rellena el form cuando se edita */
  useEffect(() => {
    if (producto) {
      setForm({
        ...producto,
        precio:      producto.precio      ?? '',
        precioAntes: producto.precioAntes ?? '',
        stock:       producto.stock       ?? '',
        sabores:     (producto.sabores ?? []).join(', '),
      })
    } else {
      setForm(VACIO)
    }
    setError(null)
  }, [producto])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const body = {
        ...form,
        precio:      Number(form.precio)      || 0,
        precioAntes: form.precioAntes ? Number(form.precioAntes) : null,
        stock:       Number(form.stock)       || 0,
        sabores:     form.sabores.split(',').map(s => s.trim()).filter(Boolean),
      }

      const url    = editando ? `/api/productos/${producto._id}` : '/api/productos'
      const method = editando ? 'PUT' : 'POST'

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Error al guardar')
      onGuardado(data.producto)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pform-overlay" onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className="pform-modal">

        {/* Header */}
        <div className="pform-header">
          <h2 className="pform-title">
            {editando ? '✏️ EDITAR PRODUCTO' : '＋ NUEVO PRODUCTO'}
          </h2>
          <button className="pform-close" onClick={onCancelar}>✕</button>
        </div>

        {error && <div className="pform-error">⚠ {error}</div>}

        <div className="pform-body">

          {/* Fila 1 */}
          <div className="pform-row">
            <div className="pform-field pform-field--grow">
              <label>Nombre *</label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                placeholder="WHEY PROTEIN" />
            </div>
            <div className="pform-field">
              <label>Marca *</label>
              <input value={form.marca} onChange={e => set('marca', e.target.value)}
                placeholder="Optimum Nutrition" />
            </div>
          </div>

          {/* Descripción */}
          <div className="pform-field">
            <label>Descripción</label>
            <textarea rows={3} value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder="Descripción del producto..." />
          </div>

          {/* Fila 2 — precios */}
          <div className="pform-row">
            <div className="pform-field">
              <label>Precio COP *</label>
              <input type="number" min="0" value={form.precio}
                onChange={e => set('precio', e.target.value)}
                placeholder="189000" />
            </div>
            <div className="pform-field">
              <label>Precio anterior</label>
              <input type="number" min="0" value={form.precioAntes}
                onChange={e => set('precioAntes', e.target.value)}
                placeholder="220000 (opcional)" />
            </div>
            <div className="pform-field">
              <label>Stock</label>
              <input type="number" min="0" value={form.stock}
                onChange={e => set('stock', e.target.value)}
                placeholder="0" />
            </div>
          </div>

          {/* Fila 3 — categoría + emoji */}
          <div className="pform-row">
            <div className="pform-field">
              <label>Categoría *</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                {CATEGORIAS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="pform-field">
              <label>Emoji</label>
              <select value={form.emoji} onChange={e => set('emoji', e.target.value)}>
                {EMOJIS.map(em => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sabores */}
          <div className="pform-field">
            <label>Sabores <span className="pform-hint">(separados por coma)</span></label>
            <input value={form.sabores}
              onChange={e => set('sabores', e.target.value)}
              placeholder="Chocolate, Vainilla, Fresa" />
          </div>

          {/* Imagen */}
          <div className="pform-field">
            <label>URL imagen <span className="pform-hint">(opcional)</span></label>
            <input value={form.imagen}
              onChange={e => set('imagen', e.target.value)}
              placeholder="https://..." />
          </div>

          {/* Toggles */}
          <div className="pform-row pform-row--toggles">
            <label className="pform-toggle">
              <input type="checkbox" checked={form.disponible}
                onChange={e => set('disponible', e.target.checked)} />
              <span className="pform-toggle-track" />
              <span>Disponible</span>
            </label>
            <label className="pform-toggle">
              <input type="checkbox" checked={form.destacado}
                onChange={e => set('destacado', e.target.checked)} />
              <span className="pform-toggle-track" />
              <span>Destacado ★</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pform-footer">
          <button className="btn btn-outline" onClick={onCancelar} disabled={loading}>
            CANCELAR
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'GUARDANDO…' : editando ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
          </button>
        </div>
      </div>
    </div>
  )
}
