import { useState } from 'react'

export default function IMCPage() {
  const [peso, setPeso]   = useState('')
  const [talla, setTalla] = useState('')
  const [imc, setImc]     = useState(null)

  const calcular = () => {
    const p = parseFloat(peso)
    const t = parseFloat(talla) / 100
    if (p > 0 && t > 0) setImc((p / (t * t)).toFixed(1))
  }

  const categoria = (v) => {
    if (v < 18.5) return 'Bajo peso'
    if (v < 25)   return 'Normal'
    if (v < 30)   return 'Sobrepeso'
    return 'Obesidad'
  }

  return (
    <main className="page">
      <div className="page-hero">
        <h1>Calculadora IMC</h1>
        <p>Índice de Masa Corporal</p>
      </div>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="number" placeholder="Peso (kg)"
            value={peso} onChange={e => setPeso(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '10px 14px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)' }}
          />
          <input
            type="number" placeholder="Talla (cm)"
            value={talla} onChange={e => setTalla(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '10px 14px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)' }}
          />
          <button className="btn btn-primary" onClick={calcular}>CALCULAR</button>
        </div>
        {imc && (
          <div style={{ marginTop: 28, textAlign: 'center', padding: 24, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border2)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--red)' }}>{imc}</div>
            <div style={{ fontFamily: 'var(--font-cond)', letterSpacing: 3, color: 'var(--text2)', marginTop: 4 }}>{categoria(parseFloat(imc))}</div>
          </div>
        )}
      </div>
    </main>
  )
}
