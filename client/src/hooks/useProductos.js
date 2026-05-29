import { useState, useEffect, useCallback } from 'react'

const BASE = '/api/productos'

export function useProductos(categoriaInicial = 'todos') {
  const [productos,  setProductos]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [categoria,  setCategoria]  = useState(categoriaInicial)

  const fetchProductos = useCallback(async (cat) => {
    setLoading(true)
    setError(null)
    try {
      const url = cat && cat !== 'todos'
        ? `${BASE}?categoria=${cat}`
        : BASE
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Error al cargar productos')
      setProductos(data.productos)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProductos(categoria)
  }, [categoria, fetchProductos])

  const filtrar = (cat) => setCategoria(cat)
  const recargar = () => fetchProductos(categoria)

  return { productos, loading, error, categoria, filtrar, recargar }
}
