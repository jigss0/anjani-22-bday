import { useEffect, useRef, useState } from 'react'
import { chapters, type Chapter, type Item } from './content'
import { asset } from './media'
import { Box, Bow, Rise, Tree, Slot } from './Special'
import { Scratches, Museum, Vinyl, Capsule } from './Extra2'
import { Opening, Cover, Cinema } from './Extra3'
import { Lock, YesNo, Puzzle, Envelope } from './Extra'

function Photo({ src, label, cls = '' }: { src?: string; label: string; cls?: string }) {
  const [bad, setBad] = useState(!src)
  return bad
    ? <div className={'ph ' + cls}><span>{label}</span></div>
    : <img className={cls} src={asset(src!)} alt={label} loading="lazy" onError={() => setBad(true)} />
}

function Player({ m }: { m: NonNullable<Chapter['media']> }) {
  const el = useRef<HTMLMediaElement | null>(null)
  const [on, setOn] = useState(false)
  const [pct, setPct] = useState(0)
  const [bad, setBad] = useState(false)
  const common = {
    src: asset(m.src), preload: 'metadata' as const,
    onError: () => setBad(true), onEnded: () => setOn(false),
    onTimeUpdate: () => { const e = el.current; if (e && e.duration) setPct(e.currentTime / e.duration * 100) },
  }
  const toggle = () => { const e = el.current; if (!e || bad) return; if (e.paused) { void e.play(); setOn(true) } else { e.pause(); setOn(false) } }
  return (
    <div className="player">
      {m.type === 'video'
        ? <div className="stage">{bad ? <Photo label="Add public/media/videos/film.mp4" cls="fill" /> : <video {...common} ref={e => { el.current = e }} poster={m.poster ? asset(m.poster) : undefined} playsInline />}</div>
        : <div className={'record' + (on ? ' spin' : '')}><i /><audio {...common} ref={e => { el.current = e }} /></div>}
      {bad && m.type === 'audio' && <small>Add public/media/{m.src}</small>}
      <div className="ctl">
        <button onClick={toggle} disabled={bad} aria-label={on ? 'Pause' : 'Play'}>{on ? '❚❚' : '▶'}</button>
        <input type="range" min={0} max={100} value={pct} disabled={bad} aria-label="Progress"
          onChange={e => { const v = el.current; if (v && v.duration) v.currentTime = Number(e.target.value) / 100 * v.duration }} />
        <input type="range" className="vol" min={0} max={1} step={0.05} defaultValue={1} disabled={bad} aria-label="Volume"
          onChange={e => { if (el.current) el.current.volume = Number(e.target.value) }} />
        {m.type === 'video' && <button disabled={bad} aria-label="Fullscreen" onClick={() => void el.current?.requestFullscreen?.()}>⤢</button>}
      </div>
    </div>
  )
}

function Timeline({ items }: { items: Item[] }) {
  const [o, setO] = useState(0)
  return <ol className="tl">{items.map((it, i) => (
    <li key={it.t}>
      <button onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i}><b>{String(i + 1).padStart(2, '0')}</b>{it.t}</button>
      {o === i && <p>{it.d}</p>}
    </li>))}</ol>
}

function Notes({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number[]>([])
  const flip = (i: number) => setOpen(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  return <div className="notes">{items.map((it, i) => (
    <button key={it.t} className={'note' + (open.includes(i) ? ' open' : '')} onClick={() => flip(i)} aria-expanded={open.includes(i)}>
      <em>{it.t}</em>{open.includes(i) && <span>{it.d}</span>}
    </button>))}</div>
}

function Frames({ items }: { items: Item[] }) {
  const [lb, setLb] = useState<number | null>(null)
  const it = lb === null ? null : items[lb]
  return <>
    <div className="frames">{items.map((x, i) => (
      <button key={x.t} className={'fr f' + (i % 3)} onClick={() => setLb(i)} aria-label={'Open ' + x.t}>
        <Photo src={x.img} label={x.t} /><small>{x.d}</small></button>))}</div>
    {it && lb !== null && <div className="lb" role="dialog" aria-modal="true">
      <button className="x" onClick={() => setLb(null)} aria-label="Close">✕</button>
      <button onClick={() => setLb((lb + items.length - 1) % items.length)} aria-label="Previous">‹</button>
      <figure><Photo src={it.img} label={it.t} /><figcaption>{it.t} — {it.d}</figcaption></figure>
      <button onClick={() => setLb((lb + 1) % items.length)} aria-label="Next">›</button>
    </div>}
  </>
}

function Body({ c, go, seen }: { c: Chapter; go: (i: number) => void; seen: Set<number> }) {
  switch (c.kind) {
    case 'envelope': return <Opening text={c.body?.[0] ?? ''} onOpen={() => go(1)} />
    case 'cover': return <Cover title={c.title} kicker={c.kicker} items={c.items ?? []} go={go} />
    case 'text': return <article className="prose">{c.body?.map((p, i) => <p key={i} className={i === 0 ? 'drop' : ''}>{p}</p>)}</article>
    case 'frames': return <Frames items={c.items ?? []} />
    case 'timeline': return <Timeline items={c.items ?? []} />
    case 'notes': return <Notes items={c.items ?? []} />
    case 'media': return c.media ? (c.media.type === 'video' ? <Cinema><Player m={c.media} /></Cinema> : <Player m={c.media} />) : null
    case 'slot': return <Slot items={c.items ?? []} />
    case 'scratch': return <Scratches items={c.items ?? []} />
    case 'museum': return <Museum items={c.items ?? []} />
    case 'vinyl': return c.media ? <Vinyl src={c.media.src} /> : null
    case 'capsule': return <Capsule body={c.body ?? []} seen={seen} />
    case 'yesno': return <YesNo body={c.body ?? []} />
    case 'puzzle': return <Puzzle items={c.items ?? []} />
    case 'waxletter': return <Envelope body={c.body ?? []} />
    case 'box': return <Box items={c.items ?? []} />
    case 'bow': return <Bow items={c.items ?? []} />
    case 'rise': return <Rise words={c.body ?? []} items={c.items ?? []} />
    case 'tree': return <Tree text={c.body?.[0] ?? ''} go={go} seen={seen} />
  }
}

function Doodles() {
  return <svg className="doodles" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className="dd" pathLength="1" d="M20 120 q20 -26 40 0 t40 0 t40 0 t40 0"/>
    <path className="dd d2" pathLength="1" d="M330 170 l10 -26 l10 26 l-26 -16 h32 z"/>
    <path className="dd d3" pathLength="1" d="M300 600 c-22 -34 -66 0 -32 30 l32 28 l32 -28 c34 -30 -10 -64 -32 -30z"/>
    <path className="dd d4" pathLength="1" d="M30 720 q70 -70 150 -10 m-22 -16 l24 16 l-12 24"/>
    <path className="dd d5" pathLength="1" d="M320 380 c-32 -22 -76 22 -44 54 c32 32 86 -10 64 -48 c-12 -22 -54 -32 -80 0"/>
  </svg>
}

interface Spark { id: number; x: number; y: number }

function Magazine() {
  const [sparks, setSparks] = useState<Spark[]>([])
  const burst = (x: number, y: number) => {
    navigator.vibrate?.(8)
    const id = Date.now() + Math.random()
    setSparks(s => [...s, { id, x, y }])
    window.setTimeout(() => setSparks(s => s.filter(p => p.id !== id)), 900)
  }
  const [i, setI] = useState(0)
  const [idx, setIdx] = useState(false)
  const [seen, setSeen] = useState<Set<number>>(new Set([0]))
  const sx = useRef(0)
  const scroller = useRef<HTMLElement | null>(null)
  const go = (n: number) => {
    const k = Math.max(0, Math.min(chapters.length - 1, n))
    setI(k); setIdx(false); setSeen(s => new Set(s).add(k)); scroller.current?.scrollTo(0, 0)
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  })
  const c = chapters[i]
  return (
    <main className={'pg ' + c.theme} onPointerDown={e => burst(e.clientX, e.clientY)} onTouchStart={e => { sx.current = e.touches[0].clientX }}
      onTouchEnd={e => { const d = e.changedTouches[0].clientX - sx.current; if (Math.abs(d) > 70 && c.kind !== 'media' && c.kind !== 'bow' && c.kind !== 'museum' && c.kind !== 'vinyl' && c.kind !== 'scratch') go(i + (d < 0 ? 1 : -1)) }}>
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div><Doodles key={c.id} />
      {sparks.map(p => <span key={p.id} className="spark" style={{ left: p.x, top: p.y }} aria-hidden="true">{['✦','♥','✧','❀','✶','♡'].map((g, k) => <b key={k} style={{ ['--a' as string]: k * 60 + 'deg' }}>{g}</b>)}</span>)}
      <header><button onClick={() => go(1)} aria-label="Cover">Anjani</button><span>{c.id} / {chapters.length}</span>
        <button onClick={() => setIdx(true)}>Index</button></header>
      <div className="bar"><i style={{ width: (i + 1) / chapters.length * 100 + '%' }} /></div>
      <section className="scroll" ref={scroller} key={c.id}>
        {c.kind !== 'cover' && c.kind !== 'envelope' && <div className="head"><small>{c.id} — {c.kicker}</small><h2>{c.title}</h2></div>}
        <Body c={c} go={go} seen={seen} />
      </section>
      <footer><button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous">←</button>
        <button onClick={() => go(i + 1)} disabled={i === chapters.length - 1} aria-label="Next">→</button></footer>
      {idx && <nav className="idx"><button className="x" onClick={() => setIdx(false)} aria-label="Close">✕</button>
        {chapters.map((x, k) => <button key={x.id} onClick={() => go(k)}><b>{x.id}</b>{x.title}{seen.has(k) && ' ✓'}</button>)}</nav>}
    </main>
  )
}

export default function App() {
  const [ok, setOk] = useState(false)
  return ok ? <Magazine /> : <Lock onOpen={() => setOk(true)} />
}
