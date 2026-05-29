import { useProductos } from '../hooks/useProductos'
import ProductCard from '../components/store/ProductCard'

const CATEGORIAS = [
  { key: 'todos',        label: 'TODOS' },
  { key: 'proteina',     label: 'PROTEÍNA' },
  { key: 'fuerza',       label: 'FUERZA' },
  { key: 'energia',      label: 'ENERGÍA' },
  { key: 'salud',        label: 'SALUD' },
  { key: 'recuperacion', label: 'RECUPERACIÓN' },
]

function SkeletonCard() {
  return (
    <div className="pcard pcard-skeleton">
      <div className="sk-img"  />
      <div className="sk-body">
        <div className="sk-line sk-short" />
        <div className="sk-line sk-long"  />
        <div className="sk-line sk-med"   />
        <div className="sk-line sk-price" />
        <div className="sk-line sk-btn"   />
      </div>
    </div>
  )
}

function ErrorBanner({ mensaje, onRetry }) {
  return (
    <div className="tienda-error">
      <span className="tienda-error-icon">⚠</span>
      <p>{mensaje}</p>
      <button className="btn btn-outline" onClick={onRetry}>REINTENTAR</button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="tienda-empty">
      <span>🔍</span>
      <p>Sin productos en esta categoría</p>
    </div>
  )
}

export default function TiendaPage() {
  const { productos, loading, error, categoria, filtrar, recargar } = useProductos()

  return (
    <main>
      <div className="page-hero">
        <h1>Tienda</h1>
        <p>Suplementos · Equipamiento · Rendimiento</p>
      </div>

      <div className="page">
        <div className="tienda-filtros">
          {CATEGORIAS.map(({ key, label }) => (
            <button
              key={key}
              className={`filtro-btn ${categoria === key ? 'activo' : ''}`}
              onClick={() => filtrar(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="tienda-count">
            {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
          </p>
        )}

        {error && <ErrorBanner mensaje={error} onRetry={recargar} />}

        {!error && (
          <div className="productos-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : productos.length === 0
                ? <EmptyState />
                : productos.map(p => <ProductCard key={p._id} producto={p} />)
            }
          </div>
        )}
      </div>
    </main>
  )
}
