import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointer, type ReactNode } from 'react'
import { asset } from './media'

const css = (o: Record<string, string | number>) => o as CSSProperties

export function Pic({ src, label, cls = '', style }: { src: string; label: string; cls?: string; style?: CSSProperties }) {
  const [bad, setBad] = useState(false)
  return bad ? <div className={'ph ' + cls}><span>{label}</span></div>
    : <img className={cls} style={style} src={asset(src)} alt={label} onError={() => setBad(true)} />
}

export function Opening({ text, onOpen }: { text: string; onOpen: () => void }) {
  const [st, setSt] = useState(0)
  const t = useRef(0)
  useEffect(() => () => window.clearTimeout(t.current), [])
  const crack = () => { setSt(1); t.current = window.setTimeout(onOpen, 1300) }
  return <div className="center">
    <small>A letter for Anjani</small>
    <div className={'envelope s' + st}><div className="flap" />
      <button className="wax" onClick={crack} disabled={st > 0} aria-label="Break the wax seal to open"><span>♥</span></button></div>
    <p className="it">{st ? 'Opening…' : text}</p>
    <small>{st ? '' : 'Tap the wax seal'}</small>
  </div>
}

export function Cover({ title, kicker, items, go }: { title: string; kicker: string; items: { t: string; d: string }[]; go: (i: number) => void }) {
  const h1 = useRef<HTMLHeadingElement>(null)
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [need, setNeed] = useState(false)
  const orient = useCallback((e: DeviceOrientationEvent) => {
    setTilt({ x: Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30)), y: Math.max(-1, Math.min(1, ((e.beta ?? 45) - 45) / 30)) })
  }, [])
  useEffect(() => {
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined
    if (D && typeof D.requestPermission === 'function') setNeed(true)
    else window.addEventListener('deviceorientation', orient)
    return () => window.removeEventListener('deviceorientation', orient)
  }, [orient])
  const enable = async () => {
    const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    try { if (D.requestPermission && (await D.requestPermission()) === 'granted') { window.addEventListener('deviceorientation', orient); setNeed(false) } } catch { setNeed(false) }
  }
  const move = (e: RPointer) => {
    const r = h1.current?.getBoundingClientRect(); if (!r) return
    setPt({ x: e.clientX - r.left, y: e.clientY - r.top })
    setTilt({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 })
  }
  const W = h1.current?.offsetWidth ?? 300, H = h1.current?.offsetHeight ?? 100
  const fx = pt ? pt.x : (tilt.x + 1) / 2 * W, fy = pt ? pt.y : H / 2
  const n = title.length
  return <div className="cover" onPointerMove={move} onPointerLeave={() => setPt(null)}>
    <Pic src="photos/cover.jpg" label="Cover photograph" cls="fill" style={{ transform: `translate(${-tilt.x * 14}px,${-tilt.y * 14}px) scale(1.14)`, transition: 'transform .25s ease-out' }} />
    <div className="over"><small>{kicker}</small>
      <h1 ref={h1} aria-label={title}>{title.split('').map((c, i) => {
        const d = Math.hypot(fx - (i + 0.5) / n * W, (fy - H / 2) * 0.5), s = 1 + Math.max(0, 1 - d / 110) * 0.5
        return <span key={i} aria-hidden="true" style={css({ display: 'inline-block', transform: `translateY(${-(s - 1) * 26}px) scale(${s})`, color: s > 1.25 ? '#e9c46a' : 'inherit', transition: 'transform .15s, color .2s' })}>{c}</span>
      })}</h1>
      <ul>{items.map(i => <li key={i.t}><b>{i.d}</b> {i.t}</li>)}</ul>
      <button className="cta" onClick={() => go(2)}>Open the edition →</button>
      {need && <button className="cta ghost" onClick={enable}>Tilt the photo with my phone</button>}
    </div>
  </div>
}

export function Candle({ onBlown }: { onBlown: () => void }) {
  const [lit, setLit] = useState(true)
  const [listen, setListen] = useState(false)
  const [note, setNote] = useState('')
  const stop = useRef<(() => void) | null>(null)
  const relight = useRef(0)
  const out = () => {
    stop.current?.(); stop.current = null; setListen(false); setLit(false); setNote(''); onBlown()
    relight.current = window.setTimeout(() => setLit(true), 2800)
  }
  useEffect(() => () => { stop.current?.(); window.clearTimeout(relight.current) }, [])
  const start = async () => {
    if (!lit || listen) return
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext(); const an = ctx.createAnalyser(); an.fftSize = 512
      ctx.createMediaStreamSource(s).connect(an)
      const buf = new Uint8Array(an.fftSize); let hot = 0, raf = 0
      const tick = () => {
        an.getByteTimeDomainData(buf); let sum = 0
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v }
        hot = Math.sqrt(sum / buf.length) > 0.12 ? hot + 1 : 0
        if (hot > 6) { out(); return }
        raf = requestAnimationFrame(tick)
      }
      stop.current = () => { cancelAnimationFrame(raf); s.getTracks().forEach(t => t.stop()); void ctx.close() }
      setListen(true); setNote('Now blow gently towards the phone…'); tick()
    } catch { setNote('No microphone access, so just tap the flame ♡') }
  }
  return <div className="candle">
    <button className={'flame' + (lit ? '' : ' off')} onClick={() => lit && out()} aria-label="Blow out the candle (tap)"><i /></button>
    <div className="wax2" />
    <button className="cta" onClick={start} disabled={!lit || listen}>{listen ? 'Listening…' : 'Blow out the candle'}</button>
    <small>{note || 'Uses your microphone only to hear your breath. Nothing is recorded. Or tap the flame.'}</small>
  </div>
}

export function Cinema({ children }: { children: ReactNode }) {
  const [ph, setPh] = useState(0)
  const t = useRef(0)
  useEffect(() => () => window.clearTimeout(t.current), [])
  const tear = () => { setPh(1); t.current = window.setTimeout(() => setPh(2), 1100) }
  if (ph < 2) return <div className="tk">
    <div className={'ticket' + (ph ? ' torn' : '')}>
      <div className="tmain"><small>Admit one · Screen 1</small><h3>A Little Film</h3><p>Starring Anjani · Seat ♡ · Tonight only</p></div>
      <div className="tstub"><span>No.</span><b>0001</b></div>
    </div>
    <button className="cta" onClick={tear} disabled={ph > 0}>Tear the ticket</button>
  </div>
  return <div className="theatre"><i className="curt l" /><i className="curt r" />{children}</div>
}
