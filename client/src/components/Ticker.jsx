const MSGS = [
  'NO PAIN NO GAIN', 'LEVANTA O CALLA', 'EL HIERRO NO MIENTE',
  'SUFFER NOW. SHINE LATER', 'TU MENTE SE RINDE PRIMERO', 'STRNG 2026',
]

export default function Ticker() {
  // Duplicated for seamless loop
  const items = [...MSGS, ...MSGS]
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {items.map((msg, i) => (
          <span key={i}>{i % MSGS.length === 0 && i !== 0 ? null : null}{msg}{i < items.length - 1 && <span className="dot"> •</span>}</span>
        ))}
      </div>
    </div>
  )
}
