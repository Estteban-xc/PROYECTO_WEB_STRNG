import { useState, useEffect, useRef } from 'react'

/* ══════════════════════════════════════════════════
   Config
   ══════════════════════════════════════════════════ */
const ESTADOS = ['Procesando', 'Empacado', 'En tránsito', 'En ruta', 'Entregado']

const ESTADO_META = {
  'Procesando':  { icon: '📋', color: '#a29bfe', label: 'PROCESANDO',  desc: 'Pedido recibido y en preparación' },
  'Empacado':    { icon: '📦', color: '#e17055', label: 'EMPACADO',    desc: 'Paquete listo para despacho' },
  'En tránsito': { icon: '🚚', color: '#fdcb6e', label: 'EN TRÁNSITO', desc: 'En camino al destino' },
  'En ruta':     { icon: '🛵', color: '#d63031', label: 'EN RUTA',     desc: 'Repartidor en tu dirección' },
  'Entregado':   { icon: '✅', color: '#00b894', label: 'ENTREGADO',   desc: 'Entregado exitosamente' },
}

/* Repartidor mock cuando no hay uno asignado en DB */
const REPARTIDOR_MOCK = {
  nombre:   'Carlos Mendoza',
  telefono: '+57 310 456 7890',
  vehiculo: { tipo: 'moto', placa: 'BKR-24D' },
  estado:   'En ruta',
  ubicacion:{ direccion: 'Av. El Dorado #68-11, Bogotá' },
}

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(n)

const fmtFecha = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('es-CO', {
    day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
  })
}

/* ══════════════════════════════════════════════════
   ProgressBar
   ══════════════════════════════════════════════════ */
function ProgressBar({ estado }) {
  const idx    = ESTADOS.indexOf(estado)
  const pct    = idx < 0 ? 0 : Math.round(((idx + 1) / ESTADOS.length) * 100)
  const color  = ESTADO_META[estado]?.color || '#d63031'
  const [fill, setFill] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setFill(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div style={ps.wrap}>
      {/* Nodos */}
      <div style={ps.nodesRow}>
        {ESTADOS.map((e, i) => {
          const done    = i <= idx
          const current = i === idx
          const m       = ESTADO_META[e]
          return (
            <div key={e} style={ps.node}>
              <div style={{
                ...ps.dot,
                background:  done ? (current ? color : '#00b894') : '#1e1e1e',
                borderColor: done ? (current ? color : '#00b894') : 'rgba(255,255,255,0.12)',
                boxShadow:   current ? `0 0 20px ${color}70` : 'none',
                transform:   current ? 'scale(1.3)' : 'scale(1)',
              }}>
                <span style={{ fontSize: current ? '1.05rem' : '0.78rem', transition: 'font-size 0.3s' }}>
                  {m.icon}
                </span>
              </div>
              {/* conector */}
              {i < ESTADOS.length - 1 && (
                <div style={{
                  ...ps.connector,
                  background: i < idx
                    ? 'linear-gradient(90deg,#00b894,#00b894)'
                    : 'rgba(255,255,255,0.08)',
                }} />
              )}
              <span style={{
                ...ps.nodeLabel,
                color:      done ? (current ? color : '#00b894') : 'rgba(255,255,255,0.25)',
                fontWeight: current ? 700 : 400,
              }}>
                {m.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Barra */}
      <div style={ps.track}>
        <div style={{ ...ps.bar, width: `${fill}%`, background: `linear-gradient(90deg,${color}99,${color})` }} />
      </div>
      <div style={ps.barFooter}>
        <span style={{ color, fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.1rem', letterSpacing:3 }}>
          {pct}% COMPLETADO
        </span>
        <span style={{ color:'#606060', fontSize:'0.8rem' }}>{ESTADO_META[estado]?.desc}</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Timeline
   ══════════════════════════════════════════════════ */
function Timeline({ historial }) {
  const items = [...historial].reverse()
  return (
    <section style={tl.section}>
      <h3 style={tl.heading}>
        <span style={tl.headingLine} />
        HISTORIAL DE ESTADOS
        <span style={tl.headingLine} />
      </h3>
      <div style={tl.list}>
        {items.map((ev, i) => {
          const m       = ESTADO_META[ev.estado] || { icon:'📍', color:'#707070' }
          const isFirst = i === 0
          return (
            <div key={ev._id || i} style={tl.row}>
              <div style={tl.rail}>
                <div style={{
                  ...tl.circle,
                  borderColor: m.color,
                  background:  isFirst ? m.color : 'transparent',
                  boxShadow:   isFirst ? `0 0 14px ${m.color}55` : 'none',
                }}>
                  <span style={{ fontSize:'0.7rem' }}>{m.icon}</span>
                </div>
                {i < items.length - 1 && <div style={tl.pipe} />}
              </div>
              <div style={{ ...tl.body, opacity: isFirst ? 1 : 0.55 }}>
                <div style={tl.evTop}>
                  <span style={{ ...tl.evEstado, color: m.color }}>{ev.estado}</span>
                  <span style={tl.evTime}>{fmtFecha(ev.hora)}</span>
                </div>
                {ev.descripcion && <p style={tl.evDesc}>{ev.descripcion}</p>}
                {ev.ubicacion   && <p style={tl.evLoc}>📍 {ev.ubicacion}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════
   RepartidorCard (usa mock si no hay DB)
   ══════════════════════════════════════════════════ */
function RepartidorCard({ rep, estado }) {
  const show = estado === 'En ruta' || estado === 'En tránsito' || estado === 'Entregado'
  if (!show) return null
  const r    = rep || REPARTIDOR_MOCK
  const vIco = { moto:'🛵', bicicleta:'🚲', carro:'🚗' }[r.vehiculo?.tipo] || '🛵'
  const enRuta = r.estado === 'En ruta'
  return (
    <div style={rc.card}>
      <div style={rc.top}>
        <div style={rc.avatar}>{r.nombre.charAt(0)}</div>
        <div style={{ flex:1 }}>
          <p style={rc.tag}>REPARTIDOR ASIGNADO</p>
          <p style={rc.nombre}>{r.nombre}</p>
        </div>
        <span style={{
          ...rc.badge,
          background:  enRuta ? 'rgba(214,48,49,0.12)' : 'rgba(0,184,148,0.10)',
          color:       enRuta ? '#ff4757' : '#00b894',
          borderColor: enRuta ? 'rgba(214,48,49,0.3)' : 'rgba(0,184,148,0.25)',
        }}>
          {r.estado}
        </span>
      </div>
      <div style={rc.grid}>
        <div style={rc.cell}>
          <span style={rc.cellLabel}>TELÉFONO</span>
          <a href={`tel:${r.telefono}`} style={rc.cellVal}>{r.telefono}</a>
        </div>
        <div style={rc.cell}>
          <span style={rc.cellLabel}>VEHÍCULO</span>
          <span style={rc.cellVal}>{vIco} {r.vehiculo?.tipo}{r.vehiculo?.placa ? ` · ${r.vehiculo.placa}` : ''}</span>
        </div>
        {r.ubicacion?.direccion && (
          <div style={{ ...rc.cell, gridColumn:'1/-1' }}>
            <span style={rc.cellLabel}>ÚLTIMA UBICACIÓN</span>
            <span style={rc.cellVal}>📍 {r.ubicacion.direccion}</span>
          </div>
        )}
      </div>
      {!rep && (
        <p style={rc.mockNote}>* Datos de repartidor de ejemplo</p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   DetallePaquete
   ══════════════════════════════════════════════════ */
function DetallePaquete({ p }) {
  const [copied, setCopied] = useState(false)
  const copyGuia = () => {
    navigator.clipboard?.writeText(p.guia)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div style={dp.grid}>
      {/* Guía */}
      <div style={{ ...dp.card, gridColumn:'1/-1' }}>
        <div style={dp.guiaRow}>
          <div>
            <p style={dp.label}>NÚMERO DE GUÍA</p>
            <p style={dp.guia}>{p.guia}</p>
          </div>
          <button style={{ ...dp.copyBtn, borderColor: copied ? '#00b894' : 'rgba(255,255,255,0.1)', color: copied ? '#00b894' : '#707070' }} onClick={copyGuia}>
            {copied ? '✓ COPIADO' : '📋 COPIAR'}
          </button>
        </div>
      </div>

      {/* Destinatario */}
      <div style={dp.card}>
        <p style={dp.label}>DESTINATARIO</p>
        <p style={dp.main}>{p.destinatario?.nombre}</p>
        <p style={dp.sub}>📞 {p.destinatario?.telefono}</p>
        <p style={dp.sub}>📍 {p.destinatario?.direccion}</p>
        <p style={dp.sub}>🏙 {p.destinatario?.ciudad || 'Bogotá'}</p>
      </div>

      {/* Remitente */}
      <div style={dp.card}>
        <p style={dp.label}>REMITENTE</p>
        <p style={dp.main}>{p.remitente?.nombre}</p>
        {p.remitente?.telefono  && <p style={dp.sub}>📞 {p.remitente.telefono}</p>}
        {p.remitente?.direccion && <p style={dp.sub}>📍 {p.remitente.direccion}</p>}
      </div>

      {/* Fechas */}
      <div style={dp.card}>
        <p style={dp.label}>FECHAS</p>
        <p style={dp.sub}>Creado: <strong style={{ color:'var(--text,#f0f0f0)' }}>{fmtFecha(p.fechaCreacion)}</strong></p>
        {p.fechaEntrega && <p style={dp.sub}>Entregado: <strong style={{ color:'#00b894' }}>{fmtFecha(p.fechaEntrega)}</strong></p>}
      </div>

      {/* Dimensiones */}
      {p.dimensiones && (p.dimensiones.peso > 0 || p.dimensiones.largo > 0) && (
        <div style={dp.card}>
          <p style={dp.label}>PAQUETE</p>
          {p.dimensiones.peso  > 0 && <p style={dp.sub}>⚖️ {p.dimensiones.peso} kg</p>}
          {p.dimensiones.largo > 0 && <p style={dp.sub}>📐 {p.dimensiones.largo}×{p.dimensiones.ancho}×{p.dimensiones.alto} cm</p>}
          {p.descripcion        && <p style={dp.sub}>📝 {p.descripcion}</p>}
        </div>
      )}

      {/* Productos */}
      {p.productos?.length > 0 && (
        <div style={{ ...dp.card, gridColumn:'1/-1' }}>
          <p style={dp.label}>PRODUCTOS ({p.productos.length})</p>
          <div style={dp.prodList}>
            {p.productos.map((prod, i) => (
              <div key={i} style={dp.prodRow}>
                {prod.imagen && <img src={prod.imagen} alt={prod.nombre} style={dp.prodImg} onError={e=>e.target.style.display='none'} />}
                <div style={{ flex:1 }}>
                  <p style={dp.prodName}>{prod.nombre}{prod.sabor ? ` · ${prod.sabor}` : ''}</p>
                  <p style={dp.prodMeta}>x{prod.qty}{prod.precio ? ` · ${fmt(prod.precio)}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
          {p.total > 0 && <p style={dp.total}>TOTAL: <span style={{ color:'#ff4757' }}>{fmt(p.total)}</span></p>}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Skeleton loader
   ══════════════════════════════════════════════════ */
function Skeleton() {
  const bars = [240, 180, 320, 140, 280, 200]
  return (
    <div style={{ padding:'32px 0' }}>
      {bars.map((w, i) => (
        <div key={i} style={{
          height:16, width:w, maxWidth:'100%',
          background:'rgba(255,255,255,0.05)',
          borderRadius:4, marginBottom:18,
          animation:'pulse 1.4s ease-in-out infinite',
          animationDelay:`${i * 0.1}s`,
        }} />
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   RastreoPage
   ══════════════════════════════════════════════════ */
export default function RastreoPage() {
  const [guia,     setGuia]     = useState('')
  const [paquete,  setPaquete]  = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error,    setError]    = useState('')
  const inputRef               = useRef(null)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('guia')
    if (q) { setGuia(q.toUpperCase()); buscar(q.toUpperCase()) }
  }, [])

  const buscar = async (override) => {
    const g = (override ?? guia).trim().toUpperCase()
    if (!g) { setError('Ingresa un número de guía.'); return }
    setError(''); setCargando(true); setPaquete(null)
    try {
      const res  = await fetch(`/api/paquetes/${encodeURIComponent(g)}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Paquete no encontrado.'); return }
      setPaquete(data.paquete)
    } catch {
      setError('Sin conexión con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const limpiar = () => { setPaquete(null); setGuia(''); setError(''); inputRef.current?.focus() }

  return (
    <main className="page" style={{ maxWidth:900 }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="page-hero">
        <h1>RASTREAR PEDIDO</h1>
        <p>Seguimiento en tiempo real · STRNG Logistics</p>
      </div>

      {/* ── Buscador ─────────────────────────────────── */}
      <div style={sb.outer}>
        <div style={sb.box}>
          <span style={sb.pkgIcon}>📦</span>
          <input
            ref={inputRef}
            value={guia}
            onChange={e => setGuia(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="STRNG-XXXXXXXX"
            maxLength={20}
            disabled={cargando}
            style={sb.input}
          />
          {guia && (
            <button style={sb.clearBtn} onClick={limpiar}>✕</button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => buscar()}
            disabled={cargando || !guia.trim()}
            style={sb.searchBtn}
          >
            {cargando
              ? <><SpinIcon />BUSCANDO</>
              : <>🔍 RASTREAR</>}
          </button>
        </div>
        <p style={sb.hint}>Ej: STRNG-AB12CD34 · Número enviado con tu confirmación de compra</p>
      </div>

      {/* ── Error ────────────────────────────────────── */}
      {error && (
        <div style={er.box}>
          <span style={{ fontSize:'1.8rem' }}>⚠️</span>
          <div>
            <p style={er.title}>NO ENCONTRADO</p>
            <p style={er.sub}>{error}</p>
          </div>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────── */}
      {cargando && <Skeleton />}

      {/* ── Resultado ────────────────────────────────── */}
      {paquete && !cargando && (
        <div style={{ animation:'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>

          {/* Estado badge */}
          <div style={re.estadoBanner}>
            <div style={re.estadoLeft}>
              <span style={{ fontSize:'2.8rem', lineHeight:1 }}>
                {ESTADO_META[paquete.estado]?.icon}
              </span>
              <div>
                <p style={re.estadoTag}>ESTADO ACTUAL</p>
                <p style={{ ...re.estadoVal, color: ESTADO_META[paquete.estado]?.color }}>
                  {paquete.estado}
                </p>
              </div>
            </div>
            <button className="btn btn-outline" onClick={limpiar} style={{ fontSize:'0.72rem' }}>
              ← NUEVA BÚSQUEDA
            </button>
          </div>

          {/* Barra progreso */}
          <ProgressBar estado={paquete.estado} />

          {/* Repartidor */}
          <RepartidorCard rep={paquete.repartidor} estado={paquete.estado} />

          {/* Detalle */}
          <DetallePaquete p={paquete} />

          {/* Timeline */}
          {paquete.historialEstados?.length > 0 && (
            <Timeline historial={paquete.historialEstados} />
          )}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────── */}
      {!paquete && !cargando && !error && (
        <div style={em.wrap}>
          <div style={em.iconWrap}>📦</div>
          <p style={em.title}>INGRESA TU GUÍA</p>
          <p style={em.sub}>El número de guía llegó a tu correo o WhatsApp al confirmar el pedido</p>
          <div style={em.chips}>
            {['Procesando','Empacado','En tránsito','En ruta','Entregado'].map(e => (
              <span key={e} style={{ ...em.chip, borderColor: ESTADO_META[e].color + '55', color: ESTADO_META[e].color }}>
                {ESTADO_META[e].icon} {e}
              </span>
            ))}
          </div>
        </div>
      )}

    </main>
  )
}

function SpinIcon() {
  return <span style={{
    display:'inline-block', width:12, height:12,
    border:'2px solid rgba(255,255,255,0.25)', borderTop:'2px solid #fff',
    borderRadius:'50%', animation:'spin 0.7s linear infinite', marginRight:7,
  }} />
}

/* ══════════════════════════════════════════════════
   Estilos
   ══════════════════════════════════════════════════ */

const sb = {
  outer:     { marginBottom:36 },
  box:       { display:'flex', alignItems:'stretch', border:'1px solid rgba(214,48,49,0.3)', borderRadius:4, overflow:'hidden', boxShadow:'0 0 40px rgba(214,48,49,0.07)' },
  pkgIcon:   { display:'flex', alignItems:'center', padding:'0 16px', background:'#0e0e0e', fontSize:'1.3rem', borderRight:'1px solid rgba(255,255,255,0.05)', flexShrink:0 },
  input:     { flex:1, background:'#0e0e0e', border:'none', outline:'none', color:'#f0f0f0', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.3rem', letterSpacing:5, padding:'0 10px', height:54, minWidth:0 },
  clearBtn:  { background:'none', border:'none', color:'#555', fontSize:'1rem', cursor:'pointer', padding:'0 12px', transition:'color 0.2s', flexShrink:0 },
  searchBtn: { borderRadius:'0 4px 4px 0', padding:'0 30px', height:54, fontSize:'0.82rem', letterSpacing:'2.5px', flexShrink:0 },
  hint:      { marginTop:10, fontSize:'0.75rem', color:'#484848', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5 },
}

const er = {
  box:   { display:'flex', gap:18, alignItems:'flex-start', background:'rgba(214,48,49,0.07)', border:'1px solid rgba(214,48,49,0.22)', borderRadius:4, padding:'22px 26px', marginBottom:32 },
  title: { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.9rem', letterSpacing:3, color:'#ff4757', marginBottom:5 },
  sub:   { fontSize:'0.87rem', color:'#b0b0b0' },
}

const re = {
  estadoBanner: { display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, background:'#151515', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, padding:'22px 26px', marginBottom:22 },
  estadoLeft:   { display:'flex', alignItems:'center', gap:18 },
  estadoTag:    { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.65rem', letterSpacing:3, color:'#555', marginBottom:5 },
  estadoVal:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:4, lineHeight:1 },
}

const ps = {
  wrap:      { background:'#121212', border:'1px solid rgba(255,255,255,0.06)', borderRadius:4, padding:'30px 26px', marginBottom:22 },
  nodesRow:  { display:'flex', alignItems:'flex-start', marginBottom:22 },
  node:      { display:'flex', flexDirection:'column', alignItems:'center', flex:1, position:'relative' },
  dot:       { width:44, height:44, borderRadius:'50%', border:'2px solid', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)', zIndex:1, background:'#1e1e1e' },
  connector: { position:'absolute', top:21, left:'calc(50% + 22px)', right:'calc(-50% + 22px)', height:2, transition:'background 0.4s' },
  nodeLabel: { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.6rem', letterSpacing:1, textAlign:'center', marginTop:9, transition:'color 0.3s', lineHeight:1.2, maxWidth:64 },
  track:     { height:5, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden', marginBottom:12 },
  bar:       { height:'100%', borderRadius:3, transition:'width 1s cubic-bezier(0.16,1,0.3,1)' },
  barFooter: { display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 },
}

const tl = {
  section: { marginTop:36, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.06)' },
  heading: { display:'flex', alignItems:'center', gap:14, fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.7rem', letterSpacing:4, color:'#505050', marginBottom:28 },
  headingLine: { flex:1, height:1, background:'rgba(255,255,255,0.06)' },
  list:    { display:'flex', flexDirection:'column' },
  row:     { display:'flex', gap:16 },
  rail:    { display:'flex', flexDirection:'column', alignItems:'center', minWidth:38 },
  circle:  { width:38, height:38, borderRadius:'50%', border:'2px solid', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s' },
  pipe:    { width:2, flex:1, minHeight:20, background:'rgba(255,255,255,0.07)', margin:'4px 0' },
  body:    { paddingBottom:28, flex:1 },
  evTop:   { display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 },
  evEstado:{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.88rem', letterSpacing:2 },
  evTime:  { fontSize:'0.74rem', color:'#484848' },
  evDesc:  { fontSize:'0.84rem', color:'#a0a0a0', marginBottom:4 },
  evLoc:   { fontSize:'0.76rem', color:'#585858' },
}

const rc = {
  card:     { background:'#131313', border:'1px solid rgba(214,48,49,0.18)', borderRadius:4, padding:'22px 26px', marginBottom:22 },
  top:      { display:'flex', alignItems:'center', gap:14, marginBottom:18, flexWrap:'wrap' },
  avatar:   { width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,#d63031,#c0392b)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.4rem', color:'#fff', flexShrink:0 },
  tag:      { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.62rem', letterSpacing:3, color:'#555', marginBottom:3 },
  nombre:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.25rem', letterSpacing:2, color:'#f0f0f0' },
  badge:    { marginLeft:'auto', padding:'5px 14px', borderRadius:20, border:'1px solid', fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.7rem', letterSpacing:2, flexShrink:0 },
  grid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 },
  cell:     { display:'flex', flexDirection:'column', gap:4 },
  cellLabel:{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.62rem', letterSpacing:2, color:'#525252' },
  cellVal:  { fontSize:'0.86rem', color:'#c0c0c0', textDecoration:'none' },
  mockNote: { marginTop:14, fontSize:'0.72rem', color:'#404040', fontStyle:'italic' },
}

const dp = {
  grid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:14, marginBottom:30 },
  card:    { background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:4, padding:'16px 18px' },
  label:   { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.62rem', letterSpacing:3, color:'#505050', marginBottom:10 },
  main:    { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'1rem', fontWeight:700, color:'#e8e8e8', marginBottom:6 },
  sub:     { fontSize:'0.82rem', color:'#828282', marginBottom:4 },
  guiaRow: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' },
  guia:    { fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:6, color:'#d63031', lineHeight:1 },
  copyBtn: { background:'rgba(255,255,255,0.03)', border:'1px solid', borderRadius:4, color:'#707070', fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.68rem', letterSpacing:2, padding:'8px 14px', cursor:'pointer', transition:'all 0.25s', flexShrink:0 },
  prodList:{ display:'flex', flexDirection:'column', gap:10, marginTop:12 },
  prodRow: { display:'flex', alignItems:'center', gap:12, paddingBottom:10, borderBottom:'1px solid rgba(255,255,255,0.04)' },
  prodImg: { width:42, height:42, objectFit:'cover', borderRadius:4, background:'#1e1e1e', flexShrink:0 },
  prodName:{ fontSize:'0.86rem', color:'#d0d0d0', marginBottom:2 },
  prodMeta:{ fontSize:'0.76rem', color:'#686868' },
  total:   { marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", fontSize:'1rem', letterSpacing:2, textAlign:'right', color:'#a0a0a0' },
}

const em = {
  wrap:    { textAlign:'center', padding:'70px 20px 50px' },
  iconWrap:{ fontSize:'4.5rem', marginBottom:20, filter:'grayscale(0.6) opacity(0.35)' },
  title:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:6, color:'rgba(255,255,255,0.15)', marginBottom:12 },
  sub:     { fontSize:'0.88rem', color:'rgba(255,255,255,0.2)', maxWidth:340, margin:'0 auto 28px' },
  chips:   { display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' },
  chip:    { fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.72rem', letterSpacing:1.5, padding:'5px 14px', border:'1px solid', borderRadius:20, opacity:0.7 },
}
