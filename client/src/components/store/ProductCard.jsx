import { useState } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

const BADGE_COLORS = {
  proteina:     '#d63031',
  fuerza:       '#e17055',
  energia:      '#fdcb6e',
  salud:        '#00b894',
  recuperacion: '#6c5ce7',
}

export default function ProductCard({ producto }) {
  const {
    nombre, marca, descripcion, precio, precioAntes,
    categoria, sabores = [], emoji, stock, disponible, destacado,
  } = producto

  const [saborActivo, setSaborActivo] = useState(sabores[0] || '')
  const [agregado,    setAgregado]    = useState(false)

  const descuento = precioAntes
    ? Math.round((1 - precio / precioAntes) * 100)
    : null

  const agotado = !disponible || stock === 0

  const handleAgregar = () => {
    if (agotado) return
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1800)
  }

  return (
    <article className="pcard" data-agotado={agotado || undefined}>

      {/* Top badges */}
      <div className="pcard-badges">
        <span className="pcard-cat" style={{ background: BADGE_COLORS[categoria] }}>
          {categoria.toUpperCase()}
        </span>
        {destacado && <span className="pcard-badge-hot">★ TOP</span>}
        {descuento  && <span className="pcard-badge-off">-{descuento}%</span>}
        {agotado    && <span className="pcard-badge-sold">AGOTADO</span>}
      </div>

      {/* Emoji / imagen */}
      <div className="pcard-img">
        {producto.imagen
          ? <img src={producto.imagen} alt={nombre} />
          : <span className="pcard-emoji">{emoji}</span>
        }
      </div>

      {/* Info */}
      <div className="pcard-body">
        <p className="pcard-marca">{marca}</p>
        <h3 className="pcard-nombre">{nombre}</h3>
        <p className="pcard-desc">{descripcion}</p>

        {/* Sabores */}
        {sabores.length > 1 && (
          <div className="pcard-sabores">
            {sabores.map(s => (
              <button
                key={s}
                className={`pcard-sabor ${saborActivo === s ? 'activo' : ''}`}
                onClick={() => setSaborActivo(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Precio */}
        <div className="pcard-precio-wrap">
          {precioAntes && (
            <span className="pcard-antes">{fmt(precioAntes)}</span>
          )}
          <span className="pcard-precio">{fmt(precio)}</span>
        </div>

        {/* CTA */}
        <button
          className={`pcard-cta ${agregado ? 'agregado' : ''}`}
          onClick={handleAgregar}
          disabled={agotado}
        >
          {agotado ? 'AGOTADO' : agregado ? '✓ AGREGADO' : 'AGREGAR AL CARRITO'}
        </button>
      </div>
    </article>
  )
}
