import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Item } from './content'
import { asset } from './media'

const css = (o: Record<string, string | number>) => o as CSSProperties

function Pic({ src, label }: { src?: string; label: string }) {
  const [bad, setBad] = useState(!src)
  return bad ? <div className="ph"><span>{label}</span></div> : <img src={asset(src!)} alt={label} loading="lazy" onError={() => setBad(true)} />
}

function Scratch({ item }: { item: Item }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const down = useRef(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const c = cv.current; if (!c) return
    const w = c.offsetWidth, h = c.offsetHeight; c.width = w; c.height = h
    const x = c.getContext('2d'); if (!x) return
    const g = x.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#c6a75e'); g.addColorStop(0.5, '#f3e6c0'); g.addColorStop(1, '#c98a92')
    x.fillStyle = g; x.fillRect(0, 0, w, h)
    x.fillStyle = 'rgba(108,21,30,.6)'; x.font = 'italic 22px Georgia'; x.textAlign = 'center'; x.fillText('scratch me ♡', w / 2, h / 2)
  }, [])
  const draw = (e: PointerEvent<HTMLCanvasElement>) => {
    const c = cv.current; if (!c || !down.current || done) return
    const x = c.getContext('2d'); if (!x) return
    const r = c.getBoundingClientRect()
    x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 7); x.fill()
  }
  const check = () => {
    const c = cv.current; const x = c?.getContext('2d'); if (!c || !x) return
    const d = x.getImageData(0, 0, c.width, c.height).data; let t = 0, n = 0
    for (let i = 3; i < d.length; i += 64) { n++; if (d[i] === 0) t++ }
    if (t / n > 0.5) setDone(true)
  }
  return <figure className="scr">
    <div className="scrbox"><Pic src={item.img} label={item.t} />
      <canvas ref={cv} className={done ? 'gone' : ''} onPointerDown={e => { down.current = true; draw(e) }} onPointerMove={draw}
        onPointerUp={() => { down.current = false; check() }} onPointerLeave={() => { down.current = false }} aria-label={'Scratch to reveal ' + item.t} /></div>
    <figcaption><b>{item.t}</b>{done ? ' ' + item.d : ''}</figcaption>
  </figure>
}
export function Scratches({ items }: { items: Item[] }) {
  return <div><p className="cnt">Scratch each card with your finger.</p><div className="scrgrid">{items.map(i => <Scratch key={i.t} item={i} />)}</div></div>
}

interface P { x: number; y: number; r: number; z: number; f: boolean }
export function Museum({ items }: { items: Item[] }) {
  const box = useRef<HTMLDivElement>(null)
  const top = useRef(items.length)
  const drag = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const [p, setP] = useState<P[]>(() => items.map((_, i) => ({ x: 4 + (i % 2) * 46, y: 2 + Math.floor(i / 2) * 29, r: (i * 47) % 15 - 7, z: i, f: false })))
  const down = (e: PointerEvent<HTMLDivElement>, i: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: p[i].x, oy: p[i].y, moved: false }
    top.current++; setP(a => a.map((q, k) => k === i ? { ...q, z: top.current } : q))
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current; const b = box.current; if (!d || !b) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (Math.hypot(dx, dy) > 6) d.moved = true
    if (!d.moved) return
    setP(a => a.map((q, k) => k === d.i ? { ...q, x: Math.max(-4, Math.min(48, d.ox + dx / b.offsetWidth * 100)), y: Math.max(-2, Math.min(80, d.oy + dy / b.offsetHeight * 100)) } : q))
  }
  const up = () => { const d = drag.current; drag.current = null; if (d && !d.moved) setP(a => a.map((q, k) => k === d.i ? { ...q, f: !q.f } : q)) }
  return <div><p className="cnt">Drag the photos around. Tap one to flip it.</p>
    <div className="table" ref={box}>{items.map((it, i) => (
      <div key={it.t} className={'pol' + (p[i].f ? ' flip' : '')} style={css({ left: p[i].x + '%', top: p[i].y + '%', zIndex: p[i].z, '--r': p[i].r + 'deg' })}
        onPointerDown={e => down(e, i)} onPointerMove={move} onPointerUp={up} role="button" aria-label={'Photo ' + it.t}>
        <div className="face front"><Pic src={it.img} label={it.t} /><small>{it.t}</small></div>
        <div className="face back"><p>{it.d}</p></div>
      </div>))}</div></div>
}

export function Vinyl({ src }: { src: string }) {
  const el = useRef<HTMLAudioElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState(6)
  const [on, setOn] = useState(false)
  const [drag, setDrag] = useState(false)
  const [bad, setBad] = useState(false)
  const [pct, setPct] = useState(0)
  const r0 = useRef(6)
  const play = (v: boolean) => {
    const a = el.current
    setOn(v); setRot(v ? 36 : 6)
    if (!a || bad) return
    if (v) a.play().catch(() => undefined); else a.pause()
  }
  const mv = (e: PointerEvent<HTMLDivElement>) => {
    const r = deck.current?.getBoundingClientRect(); if (!r || !drag) return
    const deg = Math.atan2(e.clientY - (r.top + r.height * 0.1), e.clientX - (r.left + r.width * 0.86)) * 180 / Math.PI - 90
    setRot(Math.max(4, Math.min(46, deg)))
  }
  return <div className="vinyl">
    <p className="cnt">{bad ? 'Needle is on the record. Add the song at public/media/' + src : 'Drag the needle onto the record, or tap it'}</p>
    <div className="deck" ref={deck}>
      <div className={'rec' + (on && !drag ? ' spin' : '')}><span>Anjani<br />Side A</span></div>
      <div className="arm" style={css({ transform: `rotate(${rot}deg)`, transition: drag ? 'none' : 'transform .6s' })} role="slider" aria-label="Tonearm" aria-valuenow={Math.round(rot)}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); r0.current = rot; setDrag(true) }} onPointerMove={mv} onPointerUp={() => { setDrag(false); play(Math.abs(rot - r0.current) > 3 ? rot >= 26 : !on) }}><i /></div>
    </div>
    <audio ref={el} src={asset(src)} preload="metadata" onError={() => setBad(true)} onEnded={() => play(false)}
      onTimeUpdate={() => { const a = el.current; if (a && a.duration) setPct(a.currentTime / a.duration * 100) }} />
    <div className="ctl">
      <button onClick={() => play(!on)} aria-label={on ? 'Pause' : 'Play'}>{on ? '❚❚' : '▶'}</button>
      <input type="range" min={0} max={100} value={pct} disabled={bad} aria-label="Progress" onChange={e => { const a = el.current; if (a && a.duration) a.currentTime = Number(e.target.value) / 100 * a.duration }} />
      <input type="range" className="vol" min={0} max={1} step={0.05} defaultValue={1} disabled={bad} aria-label="Volume" onChange={e => { if (el.current) el.current.volume = Number(e.target.value) }} />
    </div>
  </div>
}

export const CAPSULE_NEEDS = 13 // chapters 01–13 must be visited. Lower it to test.
export function Capsule({ body, seen }: { body: string[]; seen: Set<number> }) {
  const n = Array.from({ length: CAPSULE_NEEDS }, (_, i) => i).filter(i => seen.has(i)).length
  const ready = n >= CAPSULE_NEEDS
  const [open, setOpen] = useState(false)
  return <div className="cap">
    <div className={'capsule' + (ready ? ' ready' : '') + (open ? ' open' : '')} style={css({ '--p': Math.round(n / CAPSULE_NEEDS * 360) + 'deg' })}>
      <i className="lid" /><i className="low" /><b>{ready ? '♡' : '🔒'}</b>
      {open && [0, 1, 2, 3, 4, 5].map(k => <em key={k} className="float" style={css({ left: 18 + k * 13 + '%', animationDelay: k * 0.2 + 's' })}>♥</em>)}
    </div>
    {!ready && <p className="it">Sealed until you have turned every page. <b>{n}/{CAPSULE_NEEDS}</b> opened.</p>}
    {ready && !open && <><p className="it">Everything is opened. It is time.</p><button className="cta" onClick={() => setOpen(true)}>Open the time capsule</button></>}
    {open && <article className="notecard">{body.map((t, i) => <p key={i} style={css({ animationDelay: i * 0.7 + 's' })}>{t}</p>)}</article>}
  </div>
}
