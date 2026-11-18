import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { chapters, type Item } from './content'
import { Candle, Pic } from './Extra3'

const css = (o: Record<string, string | number>) => o as CSSProperties

function Graffiti() {
  return <svg className="gsvg" viewBox="0 0 200 120" aria-hidden="true">
    <path className="dd" pathLength="1" d="M100 8 l9 28 l29 -6 l-17 24 l22 18 l-29 2 l-4 28 l-14 -24 l-26 12 l8 -27 l-26 -10 l28 -9 l-4 -28 z" />
    <path className="dd d2" pathLength="1" d="M20 108 q20 -14 40 0 t40 0 t40 0 t40 0" />
    <path className="dd d3" pathLength="1" d="M168 20 c-12 -18 -34 0 -16 16 l16 14 l16 -14 c18 -16 -4 -34 -16 -16z" />
  </svg>
}

export function Box({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [lid, setLid] = useState<0 | 1 | 2>(0)
  const [seen, setSeen] = useState<number[]>([])
  const it = open === null ? null : items[open]
  if (lid < 2) return <div className="gift">
    <button className={'gbox' + (lid ? ' o' : '')} disabled={lid > 0} aria-label="Open the gift box" onClick={() => { setLid(1); window.setTimeout(() => setLid(2), 1100) }}>
      <i className="gb" /><i className="rib" /><i className="gl" /><i className="bw2" />
      {lid === 1 && ['✦', '♥', '✧', '♡', '✶'].map((g, k) => <em key={k} style={css({ left: 18 + k * 16 + '%', animationDelay: k * 0.12 + 's' })}>{g}</em>)}
    </button>
    <p className="it">{lid ? 'Here we go…' : 'Tap the lid to open your box'}</p></div>
  const row = (txt: string, top: number, d0: number) => {
    const n = txt.length
    const pts = Array.from({ length: 21 }, (_, k) => { const t = k / 20; return `${8 + 84 * t},${top + 14 * Math.sin(Math.PI * t)}` }).join(' ')
    return <>
      <svg className="strg" viewBox={`0 0 100 ${top + 40}`} preserveAspectRatio="none" aria-hidden="true"><polyline points={pts} vectorEffect="non-scaling-stroke" /></svg>
      {txt.split('').map((ch, i) => { const t = (i + 0.5) / n
        return <span key={ch + i + top} className="fpos" style={css({ left: 8 + 84 * t + '%', top: top + 14 * Math.sin(Math.PI * t) + 'px', transform: `translateX(-50%) rotate(${Math.cos(Math.PI * t) * 14}deg)` })}>
          <i className="flg" style={css({ animationDelay: d0 + i * 110 + 'ms' })}>{ch}</i></span> })}
    </>
  }
  return <div className="cardbox">
    <div className="wall">
      <span className="mk m1">My darling…</span><span className="mk m2">you are my favourite person</span>
      <span className="mk m3">Happy birthday, Anjani ♡</span><span className="st s1">★</span><span className="st s2">♡</span><span className="st s3">✦</span>
      <div className="tp t1"><Pic src="photos/box-1.jpg" label="photo 1" /></div><div className="tp t2"><Pic src="photos/box-2.jpg" label="photo 2" /></div>
      <div className="bunt">{row('HAPPY', 20, 200)}{row('BIRTHDAY', 78, 900)}</div>
      <div className="board nb">{items.map((x, i) => (
        <button key={x.t} className={'stick s' + (i % 3) + (seen.includes(i) ? ' done' : '')} style={css({ '--r': ((i * 37) % 11 - 5) + 'deg' })}
          onClick={() => { setOpen(i); setSeen(s => s.includes(i) ? s : [...s, i]) }}><small>{String(i + 1).padStart(2, '0')}</small><em>{x.t}</em></button>))}</div>
    </div>
    <div className="tray" aria-hidden="true">{Array.from({ length: 26 }, (_, k) => <i key={k} style={css({ left: (k * 41) % 94 + '%', top: (k * 29) % 62 + '%', background: ['#6c151e', '#c98a92', '#c6a75e', '#e8dcc8', '#1F2A44'][k % 5], transform: `rotate(${k * 37}deg)` })} />)}<b>for you ♡</b></div>
    <p className="cnt">{seen.length} of {items.length} opened</p>
    {it && <div className="modal" onClick={() => setOpen(null)}><div className="card" onClick={e => e.stopPropagation()}>
      <Graffiti /><h3>{it.t}</h3><p>{it.d}</p><button className="cta" onClick={() => setOpen(null)}>Close</button></div></div>}
  </div>
}

const SPOTS: [number, number][] = [[12, 8], [68, 6], [38, 26], [78, 34], [14, 42], [52, 50]]

export function Bow({ items }: { items: Item[] }) {
  const arena = useRef<HTMLDivElement>(null)
  const flying = useRef(false)
  const [popped, setPopped] = useState<number[]>([])
  const [msg, setMsg] = useState<number | null>(null)
  const [aim, setAim] = useState(-Math.PI / 2)
  const [arrow, setArrow] = useState<{ x: number; y: number } | null>(null)
  const base = () => { const r = arena.current!.getBoundingClientRect(); return { x: r.width / 2, y: r.height - 46, r } }
  const point = (e: PointerEvent) => {
    const b = base()
    const a = Math.atan2(e.clientY - b.r.top - b.y, e.clientX - b.r.left - b.x)
    setAim(Math.min(-0.2, Math.max(-Math.PI + 0.2, a)))
  }
  const pop = (h: number) => { setPopped(p => p.includes(h) ? p : [...p, h]); setMsg(h) }
  const fire = () => {
    if (flying.current || msg !== null || !arena.current) return
    flying.current = true
    const b = base(); let x = b.x, y = b.y
    const vx = Math.cos(aim) * 15, vy = Math.sin(aim) * 15
    const step = () => {
      const el = arena.current
      if (!el) { flying.current = false; return }
      x += vx; y += vy; setArrow({ x, y })
      const ar = el.getBoundingClientRect(); let hit = -1
      el.querySelectorAll<HTMLElement>('[data-h]').forEach(n => {
        const q = n.getBoundingClientRect()
        if (Math.hypot(q.left + q.width / 2 - ar.left - x, q.top + q.height / 2 - ar.top - y) < q.width * 0.6) hit = Number(n.dataset.h)
      })
      if (hit >= 0) { flying.current = false; setArrow(null); pop(hit); return }
      if (x < 0 || x > ar.width || y < 0) { flying.current = false; setArrow(null); return }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  const deg = aim * 180 / Math.PI + 90
  const it = msg === null ? null : items[msg]
  return <div className="bowwrap">
    <p className="cnt">Drag to aim, let go to shoot. Or just tap a heart. · {popped.length}/{items.length} popped</p>
    <div className="arena" ref={arena} onPointerDown={point} onPointerMove={point} onPointerUp={fire}>
      {items.map((_, i) => !popped.includes(i) && <button key={i} data-h={i} className="hrt" aria-label="Pop heart"
        style={css({ left: SPOTS[i % 6][0] + '%', top: SPOTS[i % 6][1] + '%', animationDelay: i * -1.3 + 's' })}
        onPointerUp={e => e.stopPropagation()} onClick={() => pop(i)}>♥</button>)}
      {arrow && <svg className="arrow" style={css({ left: arrow.x, top: arrow.y, transform: `translate(-50%,-50%) rotate(${deg}deg)` })} viewBox="-6 -30 12 60" width="14" height="60" aria-hidden="true"><path d="M0 -28 V26 M-5 -20 L0 -28 L5 -20 M-4 26 L0 18 L4 26" /></svg>}
      <svg className="bowsvg" viewBox="-50 -50 100 100" aria-hidden="true"><g transform={`rotate(${deg})`}><path className="bw" d="M-36 6 Q0 -38 36 6" /><path className="bs" d="M-36 6 L36 6" />{!arrow && <path className="ar" d="M0 6 V-42 M-5 -34 L0 -42 L5 -34" />}</g></svg>
    </div>
    {popped.length === items.length && <p className="it big">All of them. You never miss. ♡</p>}
    {it && <div className="modal" onClick={() => setMsg(null)}><div className="card" onClick={e => e.stopPropagation()}>
      <Graffiti /><h3>{it.t}</h3><p>{it.d}</p><button className="cta" onClick={() => setMsg(null)}>Keep aiming</button></div></div>}
  </div>
}

export function Rise({ words, items }: { words: string[]; items: Item[] }) {
  const [n, setN] = useState(0)
  return <div className="rise">
    <small>make a wish…</small>
    {words.map((w, r) => <div className="word" key={w} aria-label={w}>{w.split('').map((ch, i) =>
      <i key={i} style={css({ animationDelay: (r * 6 + i) * 110 + 'ms' })}>{ch}</i>)}</div>)}
    <Candle onBlown={() => setN(v => v < items.length ? v + 1 : 0)} />
    <div className="wishes">{items.slice(0, n).map(x => <p key={x.t} className="wish"><b>{x.t}</b> {x.d}</p>)}</div>
  </div>
}

function rng(seed: number) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const HC = ['#e58aa0', '#f2b3c0', '#c9506b', '#e9c46a', '#a62b43', '#f6c9d3']

export function Tree({ text, go, seen }: { text: string; go: (i: number) => void; seen: Set<number> }) {
  const [gust, setGust] = useState(0)
  const [ded, setDed] = useState(false)
  const hearts = useMemo(() => {
    const r = rng(22); const out: { x: number; y: number; s: number; c: string; d: number }[] = []
    for (let k = 0; k < 460; k++) {
      const t = k < 120 ? k / 120 * Math.PI * 2 : r() * Math.PI * 2, q = k < 120 ? 1 : Math.sqrt(r())
      const hx = 16 * Math.sin(t) ** 3, hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      out.push({ x: 200 + hx * q * 11, y: 190 - hy * q * 11, s: 0.85 + r() * 0.75, c: HC[Math.floor(r() * HC.length)], d: 300 + k * 4 + r() * 200 })
    }
    return out
  }, [])
  const fall = useMemo(() => Array.from({ length: 18 }, (_, k) => ({ l: (k * 37) % 100, d: 6 + (k % 6) * 1.4, w: -(k * 1.7), c: HC[k % HC.length] })), [])
  return <div className="treewrap">
    <div className="tree" key={gust} onClick={() => setGust(g => g + 1)} role="button" tabIndex={0} aria-label="Tap the tree to make it bloom again"
      onKeyDown={e => { if (e.key === 'Enter') setGust(g => g + 1) }}>
      {fall.map((f, k) => <span key={k} className="fall" aria-hidden="true" style={css({ left: f.l + '%', animationDuration: f.d + 's', animationDelay: f.w + 's', color: f.c })}>♥</span>)}
      <svg viewBox="0 0 400 520" aria-hidden="true">
        <defs><path id="hh" d="M0 6 C-12 -3 -6 -11 0 -5 C6 -11 12 -3 0 6Z" /></defs>
        <path className="trunk" d="M188 515 C196 440 194 380 192 330 L208 330 C206 380 204 440 214 515Z M200 400 C170 370 150 350 130 330 M200 380 C230 350 255 330 275 305" />
        {hearts.map((h, k) => <g key={k} transform={`translate(${h.x.toFixed(1)} ${h.y.toFixed(1)})`}><use className="pop" href="#hh" fill={h.c} style={css({ '--s': h.s, animationDelay: h.d + 'ms' })} /></g>)}
      </svg>
    </div>
    <p className="script">Happy Birthday, Anjani</p>
    <p className="sub">{text} · tap the tree and it blooms again</p>
    <ol className="arch">{chapters.map((x, i) => <li key={x.id}><button onClick={() => go(i)}><b>{x.id}</b>{x.title}{seen.has(i) && ' ✓'}</button></li>)}</ol>
    <button className="cta" onClick={() => go(1)}>Return to the cover</button>
    <button className="cta ghost" onClick={() => setDed(d => !d)}>{ded ? 'Hide dedication' : 'Dedication'}</button>
    {ded && <p className="it big">For Anjani. Made by hand, only for you. ✦</p>}
  </div>
}

const SYM = ['🚌', '📔', '🎬', '💋', '🌹', '⭐']
const CH = 84
export function Slot({ items }: { items: Item[] }) {
  const [pos, setPos] = useState([0, 0, 0])
  const [anim, setAnim] = useState(false)
  const [pulled, setPulled] = useState(false)
  const [found, setFound] = useState<number[]>([])
  const [res, setRes] = useState<number | null>(null)
  const busy = useRef(false)
  const sy = useRef<number | null>(null)
  const pull = () => {
    if (busy.current) return
    busy.current = true; navigator.vibrate?.(30)
    const all = items.map((_, i) => i), pool = all.filter(i => !found.includes(i)), src = pool.length ? pool : all
    const m = src[Math.floor(Math.random() * src.length)]
    setPulled(true); setAnim(true); setPos([24 + m, 24 + m, 24 + m])
    window.setTimeout(() => {
      setAnim(false); setPos([m, m, m]); setPulled(false); setFound(f => f.includes(m) ? f : [...f, m]); setRes(m)
      busy.current = false; navigator.vibrate?.([20, 40, 20])
    }, 3200)
  }
  const it = res === null ? null : items[res]
  return <div className="slot">
    <div className="sm">
      <div className="marq">★ JACKPOT OF US ★</div>
      <div className="reels">{[0, 1, 2].map(r => <div key={r} className="rw"><div className="strip" style={css({ transform: `translateY(${-pos[r] * CH}px)`, transition: anim ? `transform ${2.2 + r * 0.5}s cubic-bezier(.15,.8,.2,1)` : 'none' })}>
        {Array.from({ length: 36 }, (_, i) => <span key={i}>{SYM[i % 6]}</span>)}</div></div>)}</div>
      <button className={'lever' + (pulled ? ' down' : '')} aria-label="Pull the lever" onClick={pull}
        onPointerDown={e => { sy.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerMove={e => { if (sy.current !== null && e.clientY - sy.current > 24) { sy.current = null; pull() } }}><i /></button>
    </div>
    <p className="cnt">Pull the lever · {found.length} of {items.length} reasons found</p>
    {found.length === items.length && <p className="it big">You found every single one ♡</p>}
    {it && <div className="modal" onClick={() => setRes(null)}><div className="card" onClick={e => e.stopPropagation()}>
      <div className="big3">{SYM[res ?? 0]}{SYM[res ?? 0]}{SYM[res ?? 0]}</div><Graffiti /><h3>{it.t}</h3><p>{it.d}</p><button className="cta" onClick={() => setRes(null)}>Pull again</button></div></div>}
  </div>
}
