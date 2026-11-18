import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PASSCODE, type Item } from './content'
import { asset } from './media'

const css = (o: Record<string, string | number>) => o as CSSProperties
const scallop = (n: number, a: number) => 'polygon(' + Array.from({ length: 180 }, (_, i) => {
  const t = i / 180 * 2 * Math.PI, r = 50 - a + a * Math.cos(n * t)
  return `${(50 + r * Math.cos(t)).toFixed(2)}% ${(50 + r * Math.sin(t)).toFixed(2)}%`
}).join(',') + ')'
const SC = scallop(12, 3.2)

function usePhoto(src: string) {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => { const i = new Image(); i.onload = () => setOk(true); i.onerror = () => setOk(false); i.src = asset(src) }, [src])
  return ok
}

export function Lock({ onOpen }: { onOpen: () => void }) {
  const [code, setCode] = useState('')
  const [bad, setBad] = useState('')
  const [done, setDone] = useState(false)
  const ph = usePhoto('photos/couple.jpg')
  const push = (d: string) => {
    if (code.length >= 4 || done) return
    const next = code + d
    setCode(next); setBad('')
    if (next.length === 4) {
      if (next === PASSCODE) { setDone(true); window.setTimeout(onOpen, 900) }
      else { setBad('Hmm, not quite. Think of a very special date ♡'); window.setTimeout(() => setCode(''), 650) }
    }
  }
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '↵']
  return <main className={'lock' + (done ? ' gone' : '')}>
    <svg width="0" height="0" aria-hidden="true"><filter id="wob"><feTurbulence baseFrequency=".03" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="9" /></filter></svg>
    <h1 className="lk-t">unlock<span>for surprise</span></h1>
    <div className="lk-photo" style={css({ clipPath: SC })}><div>{ph ? <img src={asset('photos/couple.jpg')} alt="Us" /> : <span>our photo<br />photos/couple.jpg</span>}</div></div>
    <svg className="hat" viewBox="0 0 60 70" aria-hidden="true"><path d="M30 2 L56 66 H4Z" fill="#3b4cc0" stroke="#fff" strokeWidth="2" /><path d="M30 20 l3 7 7 1 -5 5 2 8 -7 -4 -7 4 2 -8 -5 -5 7 -1z" fill="#f5c542" /></svg>
    <section className={'pad' + (bad ? ' shake' : '')}>
      <i className="wavy" />
      <p>Enter passcode</p>
      <div className="dots" aria-label={code.length + ' of 4 digits'}>{[0, 1, 2, 3].map(i => <b key={i} className={i < code.length ? 'on' : ''}>{i < code.length ? '✱' : ''}</b>)}</div>
      <div className="keys">{keys.map(k => <button key={k} aria-label={k === '⌫' ? 'Delete' : k === '↵' ? 'Enter' : k}
        onClick={() => k === '⌫' ? setCode(c => c.slice(0, -1)) : k === '↵' ? setBad(code.length < 4 ? 'Four digits please ♡' : '') : push(k)}>{k}</button>)}</div>
      <small className="msg">{bad || 'Hint: her birthday, day then month'}</small>
    </section>
  </main>
}

const RN = ['r0', 'r1', 'r2', 'r3', 'r4']
const TRIES = ['Are you sure? 🥺', 'How dare you click NO!', 'Try again 😤', 'The NO button is broken now.', 'Just press YES, Anjani ♡']

export function YesNo({ body }: { body: string[] }) {
  const [yes, setYes] = useState(false)
  const [n, setN] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const dodge = () => { setN(v => v + 1); setPos({ x: Math.round((Math.random() - 0.5) * 220), y: Math.round((Math.random() - 0.5) * 140) }) }
  return <div className="yn">
    <div className="ransom" aria-label="Happy Birthday">{'HAPPY BIRTHDAY'.split('').map((c, i) => c === ' ' ? <br key={i} /> : <i key={i} className={RN[i % 5]} style={css({ animationDelay: i * 70 + 'ms', '--t': (i * 53 % 13 - 6) + 'deg' })}>{c}</i>)}</div>
    {!yes ? <>
      <p className="it">Before you read your note… are you ready for a surprise?</p>
      <div className="ynbtns">
        <button className="cta yes" style={css({ transform: `scale(${1 + Math.min(n, 5) * 0.12})` })} onClick={() => setYes(true)}>YES</button>
        <button className="cta no" style={css({ transform: `translate(${pos.x}px,${pos.y}px)` })} onPointerEnter={dodge} onPointerDown={dodge} onClick={e => e.preventDefault()}>NO</button>
      </div>
      <p className="hand">{n ? TRIES[Math.min(n - 1, TRIES.length - 1)] : 'be honest…'}</p>
    </> : <article className="notecard">{body.map((p, i) => <p key={i} style={css({ animationDelay: i * 0.6 + 's' })}>{p}</p>)}</article>}
  </div>
}

export function Puzzle({ items }: { items: Item[] }) {
  const ph = usePhoto('photos/puzzle.jpg')
  const mk = () => { const a = [1, 2, 3, 4, 5, 6, 7, 8, 0]; for (let k = 0; k < 40; k++) { const i = Math.floor(Math.random() * 9), j = Math.floor(Math.random() * 9);[a[i], a[j]] = [a[j], a[i]] } return a.every((v, i) => v === i) ? [1, 0, 2, 3, 4, 5, 6, 7, 8] : a }
  const [t, setT] = useState<number[]>(mk)
  const [sel, setSel] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [peek, setPeek] = useState(false)
  const [open, setOpen] = useState(0)
  const solved = t.every((v, i) => v === i)
  const tap = (i: number) => {
    if (solved) return
    if (sel === null) { setSel(i); return }
    if (sel !== i) { setT(p => { const a = [...p];[a[sel], a[i]] = [a[i], a[sel]]; return a }); setMoves(m => m + 1) }
    setSel(null)
  }
  const bg = (v: number): CSSProperties => ph ? { backgroundImage: `url(${asset('photos/puzzle.jpg')})`, backgroundSize: '300% 300%', backgroundPosition: `${(v % 3) * 50}% ${Math.floor(v / 3) * 50}%` } : {}
  return <div className="pz">
    <p className="cnt">{solved ? 'Fixed it. Our story just unlocked ♡' : 'Tap two pieces to swap them. Fix the photo to open our story.'} · {moves} moves</p>
    <div className={'pzgrid' + (solved ? ' ok' : '')}>{t.map((v, i) => <button key={i} className={'pc' + (sel === i ? ' sel' : '')} style={bg(peek ? i : v)} onClick={() => tap(i)} aria-label={'Piece ' + (i + 1)}>{ph ? '' : (peek ? i : v) + 1}</button>)}</div>
    {!solved && <div><button className="cta" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)}>Hold to peek</button>
      <button className="cta ghost" onClick={() => { setT(mk()); setMoves(0); setSel(null) }}>Shuffle</button></div>}
    {solved && <ol className="tl">{items.map((it, i) => <li key={it.t}><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><b>{String(i + 1).padStart(2, '0')}</b>{it.t}</button>{open === i && <p>{it.d}</p>}</li>)}</ol>}
  </div>
}

const BLOB = (() => { const p = Array.from({ length: 120 }, (_, i) => { const t = i / 120 * 2 * Math.PI, r = 50 + 3.2 * Math.sin(7 * t) + 2 * Math.sin(11 * t + 1); return `${(60 + r * Math.cos(t)).toFixed(1)},${(60 + r * Math.sin(t)).toFixed(1)}` }); return 'M' + p.join('L') + 'Z' })()
function Seal() {
  return <svg viewBox="0 0 120 120" aria-hidden="true"><defs>
    <radialGradient id="wg" cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#f6d594" /><stop offset=".6" stopColor="#dca24d" /><stop offset="1" stopColor="#b9782b" /></radialGradient>
    <radialGradient id="hg" cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#e8566a" /><stop offset=".7" stopColor="#a31a30" /><stop offset="1" stopColor="#7a1224" /></radialGradient></defs>
    <path d={BLOB} fill="url(#wg)" stroke="#fff3d6" strokeOpacity=".6" strokeWidth="2" />
    <circle cx="60" cy="60" r="37" fill="#d79a46" stroke="#fbe3b0" strokeOpacity=".8" strokeWidth="2" /><circle cx="60" cy="60" r="33" fill="none" stroke="#a8691f" strokeOpacity=".4" />
    <g transform="translate(60 62)"><path d="M0 22 C-26 2 -22 -22 0 -10 C22 -22 26 2 0 22Z" fill="url(#hg)" stroke="#6b0f20" strokeOpacity=".5" />
      <path d="M-12 -10 C-8 -14 -3 -13 -1 -9" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2.5" strokeLinecap="round" /></g></svg>
}

export function Envelope({ body }: { body: string[] }) {
  const [st, setSt] = useState<0 | 1 | 2>(0)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const crack = () => { setSt(1); navigator.vibrate?.(25); timer.current = window.setTimeout(() => setSt(2), 1000) }
  return <div className="env">
    <div className={'env2 s' + st}>
      <svg className="ebg" viewBox="0 0 340 255" aria-hidden="true"><defs><linearGradient id="ec" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8f2e5" /><stop offset="1" stopColor="#e6dcc6" /></linearGradient></defs>
        <rect width="340" height="255" rx="8" fill="url(#ec)" /><polygon points="0,0 340,0 170,125" fill="#d6c7a4" />
        <polygon points="0,0 170,125 0,255" fill="#efe7d4" /><polygon points="340,0 170,125 340,255" fill="#ebe2cd" /><polygon points="0,255 170,125 340,255" fill="#f6f0e2" />
        <path d="M0 0 L170 125 M340 0 L170 125 M0 255 L170 125 M340 255 L170 125" stroke="#b79e72" strokeOpacity=".6" strokeWidth="1.8" fill="none" /></svg>
      <div className="flap2" />
      <button className="wax3" onClick={crack} disabled={st > 0} aria-label="Break the wax seal"><Seal /></button>
      <small>{st === 0 ? 'Tap the seal' : ''}</small>
    </div>
    {st === 2 && <article className="paper">{body.map((p, i) => <p key={i} style={css({ animationDelay: i * 0.7 + 's' })}>{p}</p>)}
      <button className="cta" onClick={() => setSt(0)}>Seal it again</button></article>}
  </div>
}
