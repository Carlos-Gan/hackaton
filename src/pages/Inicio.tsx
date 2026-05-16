import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { colors } from '../utils/theme'

/* ─── Types ─────────────────────────────────────────────── */
interface Blob {
  w: number
  h: number
  color: string
  dur: number
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}

interface Cloud {
  w: number
  h: number
  top: number
  dur: number
  left?: number | string
  right?: number | string
}

interface Pin {
  e: string
  top: number
  left: string
  delay: number
}

/* ─── Animated counter hook ─────────────────────────────── */
function useCountUp(target: number, delay = 0) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const step = target / (1100 / 16)
      let cur = 0
      const id = setInterval(() => {
        cur = Math.min(cur + step, target)
        setN(Math.round(cur))
        if (cur >= target) clearInterval(id)
      }, 16)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return n
}

/* ─── Motion variants ───────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

/* ─── Static data ───────────────────────────────────────── */
const DESTINOS = [
  'Catedral Basílica', 'Parque Guadiana', 'Teleférico',
  'Museo Túnel Minería', 'El Saltito', 'Mapimí',
  'Sierra Madre', 'Teatro Ricardo Castro', 'Cañón de Fernández',
]

const BLOBS: Blob[] = [
  { w: 440, h: 320, top: -100,  right: -80,  color: 'rgba(192,78,46,0.10)', dur: 10 },
  { w: 360, h: 360, bottom: -80, left: -90,  color: 'rgba(201,124,18,0.09)', dur: 13 },
  { w: 280, h: 220, top: '48%', left: '42%', color: 'rgba(61,115,85,0.07)',  dur: 8  },
]

const CLOUDS: Cloud[] = [
  { w: 68, h: 20, top: 28, left: 18,  dur: 11 },
  { w: 46, h: 14, top: 38, left: 74,  dur: 8  },
  { w: 54, h: 17, top: 22, right: 70, dur: 15 },
]

const PINS: Pin[] = [
  { e: '📍', top: 65, left: '22%', delay: 0   },
  { e: '⛪', top: 44, left: '54%', delay: 0.8 },
  { e: '🌿', top: 70, left: '74%', delay: 1.5 },
]

const FEATURES = [
  { icon: '🗺️', title: 'Rutas de camión',  desc: 'Localiza tu ruta y sigue el recorrido en el mapa en tiempo real.',    route: '/mapa',  accent: colors.pine.DEFAULT,  border: colors.pine.border          },
  { icon: '💳', title: 'Pago con QR',       desc: 'Genera tu código al instante. Aborda sin efectivo ni complicaciones.', route: '/pagar', accent: colors.gold.DEFAULT,  border: colors.gold.border          },
  { icon: '📍', title: 'Puntos turísticos', desc: 'Descubre la Catedral, Guadiana, el Cañón de Fernández y mucho más.',   route: '/mapa',  accent: colors.terra.DEFAULT, border: 'rgba(192,78,46,0.25)'       },
  { icon: '⏱️', title: 'Horarios en vivo', desc: 'Consulta tiempos de llegada y frecuencias de cada línea urbana.',       route: '/mapa',  accent: colors.sky.DEFAULT,   border: colors.sky.border           },
]

const STATS = [
  { label: 'Rutas',      color: colors.terra.DEFAULT, delay: 0.8 },
  { label: 'Turísticos', color: colors.gold.DEFAULT,  delay: 1.0 },
  { label: 'Municipios', color: colors.pine.DEFAULT,  delay: 1.2 },
]

/* ─── Component ─────────────────────────────────────────── */
function Inicio() {
  const navigate    = useNavigate()
  const rutas       = useCountUp(24,  700)
  const turisticos  = useCountUp(18,  850)
  const municipios  = useCountUp(39, 1000)
  const statValues  = [rutas, turisticos, municipios]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ background: colors.background, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}
    >
      {/* ── Ambient blobs ── */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          style={{
            position:      'fixed',
            borderRadius:  '50%',
            filter:        'blur(60px)',
            pointerEvents: 'none',
            zIndex:        0,
            width:         b.w,
            height:        b.h,
            background:    b.color,
            top:           b.top,
            right:         b.right,
            bottom:        b.bottom,
            left:          b.left,
          }}
        />
      ))}

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto', padding: '24px 28px 40px' }}>

        {/* ── NAV ── */}
        <motion.nav
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.border}`, paddingBottom: 16, marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              style={{
                width: 40, height: 40, borderRadius: 14,
                background: colors.gradients.logo,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: `0 4px 18px ${colors.terra.glow}`,
              }}
            >
              🦂
            </motion.div>
            <span style={{ fontFamily: "'Ubuntu', sans-serif", fontSize: 28, fontWeight: 700, color: colors.terra.DEFAULT }}>
              Q-Ruta
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 28 }}>
            {['Rutas', 'Turismo', 'Mapa', 'Horarios'].map(link => (
              <span
                key={link}
                style={{ fontSize: 14, fontWeight: 500, color: colors.text.secondary, cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = colors.terra.DEFAULT }}
                onMouseLeave={e => { e.currentTarget.style.color = colors.text.secondary }}
              >
                {link}
              </span>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 8px 24px ${colors.terra.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            style={{
              background: colors.terra.DEFAULT, color: '#fff',
              border: 'none', borderRadius: 999,
              padding: '9px 22px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 18px ${colors.terra.glow}`,
            }}
          >
            Iniciar sesión →
          </motion.button>
        </motion.nav>

        {/* ── HERO ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, alignItems: 'center', marginBottom: 28 }}
        >
          {/* Left — copy */}
          <div>
            <motion.div
              variants={fadeUp}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: colors.terra.soft, border: `1px solid ${colors.terra.light}`,
                borderRadius: 999, padding: '5px 16px',
                fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                color: colors.terra.DEFAULT, marginBottom: 20,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: colors.terra.DEFAULT, display: 'inline-block' }}
              />
              Estado de Durango · México
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 700,
                lineHeight: 1.1, color: colors.text.primary, marginBottom: 18,
              }}
            >
              Tu camión,{' '}
              <motion.em
                animate={{ textShadow: ['0 0 0px rgba(192,78,46,0)', '0 0 20px rgba(192,78,46,0.5)', '0 0 0px rgba(192,78,46,0)'] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ color: colors.terra.DEFAULT, fontStyle: 'italic' }}
              >
                en un toque.
              </motion.em>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
              style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${colors.terra.DEFAULT}, transparent)`, marginBottom: 18 }}
            />

            <motion.p
              variants={fadeUp}
              style={{ fontSize: 15, lineHeight: 1.8, color: colors.text.secondary, fontWeight: 300, maxWidth: 440, marginBottom: 28 }}
            >
              Consulta rutas en tiempo real y paga tu pasaje sin efectivo.
              Moverse por Durango nunca fue tan sencillo.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ y: -2, boxShadow: `0 10px 28px ${colors.terra.glow}` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/mapa')}
                style={{
                  background: colors.terra.DEFAULT, color: '#fff', border: 'none',
                  borderRadius: 999, padding: '12px 26px', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 7,
                  boxShadow: `0 4px 20px ${colors.terra.glow}`,
                }}
              >
                🗺️ Ver rutas
              </motion.button>
              <motion.button
                whileHover={{ y: -2, borderColor: colors.terra.DEFAULT, color: colors.terra.DEFAULT }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', border: `1.5px solid ${colors.border}`,
                  borderRadius: 999, padding: '12px 26px', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', color: colors.text.secondary, fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 7, transition: 'all .15s',
                }}
              >
                📍 Turismo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex', background: colors.surface,
                border: `1px solid ${colors.border}`, borderRadius: 18,
                overflow: 'hidden', maxWidth: 380,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1, textAlign: 'center', padding: '14px 8px', position: 'relative',
                    borderRight: i < STATS.length - 1 ? `1px solid ${colors.border}` : 'none',
                  }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: s.delay, duration: 0.7, ease: 'easeOut' }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, transformOrigin: 'left' }}
                  />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: colors.text.primary }}>
                    {statValues[i]}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: colors.text.muted, letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — illustration panel */}
          <motion.div
            variants={fadeUp}
            style={{
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: 28, overflow: 'hidden',
              minHeight: 380, display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Sky */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #C8E6F5 0%, #EAF4FB 45%, #F8ECD8 100%)', minHeight: 280 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: 24, right: 32, width: 56, height: 56, borderRadius: '50%', background: '#F5C842', boxShadow: '0 0 0 14px rgba(245,200,66,0.18), 0 0 0 28px rgba(245,200,66,0.07)' }}
              />
              {CLOUDS.map((c, i) => (
                <motion.div
                  key={i}
                  animate={{ x: [0, 14, 0] }}
                  transition={{ duration: c.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  style={{ position: 'absolute', background: '#fff', borderRadius: 999, opacity: 0.85, width: c.w, height: c.h, top: c.top, left: c.left, right: c.right }}
                />
              ))}
              {PINS.map((p, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: p.top, left: p.left, fontSize: 20, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}
                >
                  {p.e}
                </motion.span>
              ))}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <svg viewBox="0 0 360 100" style={{ display: 'block', width: '100%' }}>
                  <polygon points="0,100 60,30 110,65 160,15 210,55 260,25 310,60 360,35 360,100" fill="#6B9E7A" opacity=".65" />
                  <polygon points="0,100 40,55 80,75 130,40 180,70 230,45 280,72 330,50 360,65 360,100" fill="#4A7A5C" opacity=".9" />
                  <polygon points="0,100 30,80 70,90 120,75 180,88 240,72 300,85 360,78 360,100" fill="#D4A96A" />
                </svg>
              </div>
            </div>

            {/* Ground + road + bus */}
            <div style={{ height: 70, background: 'linear-gradient(180deg, #D4A96A, #C49055)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, background: '#8A8A8A', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, #FFD700 0, #FFD700 20px, transparent 20px, transparent 38px)" }} />
                <motion.div
                  animate={{ left: ['-90px', '110%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                  style={{ position: 'absolute', bottom: 28 }}
                >
                  <div style={{ width: 72, height: 36, background: colors.terra.DEFAULT, borderRadius: '8px 8px 4px 4px', position: 'relative' }}>
                    {[8, 28, 48].map(l => (
                      <div key={l} style={{ position: 'absolute', width: 15, height: 11, background: '#BEE3F8', borderRadius: 3, top: 7, left: l }} />
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', position: 'absolute', bottom: -7, left: 0, right: 0 }}>
                      {[0, 1].map(i => (
                        <motion.div
                          key={i}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                          style={{ width: 13, height: 13, borderRadius: '50%', background: '#2C2C2C', border: '2px solid #555' }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Marquee */}
            <div style={{ overflow: 'hidden', borderTop: `1px solid ${colors.border}`, padding: '9px 0', background: colors.surface }}>
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: 24, whiteSpace: 'nowrap' }}
              >
                {[...DESTINOS, ...DESTINOS].map((d, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: colors.text.muted, flexShrink: 0 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: colors.terra.DEFAULT, opacity: 0.5, flexShrink: 0 }} />
                    {d}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── FEATURE CARDS ── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ marginBottom: 24 }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: colors.text.muted, marginBottom: 16 }}>
            ¿Qué puedes hacer?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {FEATURES.map(f => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(44,26,14,0.10)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(f.route)}
                style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 20, padding: '20px 18px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: f.accent, transformOrigin: 'left' }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, marginBottom: 7 }}>{f.title}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.65, color: colors.text.muted, fontWeight: 300 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
          style={{
            borderRadius: 26, overflow: 'hidden', position: 'relative',
            background: colors.gradients.ctaBanner,
            padding: '28px 32px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', gap: 20,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(245,200,66,0.15)', top: -80, right: 60, filter: 'blur(40px)', pointerEvents: 'none' }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
              Elige tu siguiente parada
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, fontStyle: 'italic', color: '#fff', lineHeight: 1.3 }}>
              ¿Ruta de camión o turismo<br />por Durango?
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(0,0,0,.22)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/mapa')}
              style={{ background: '#fff', color: colors.terra.DEFAULT, border: 'none', borderRadius: 999, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 18px rgba(0,0,0,.15)' }}
            >
              🗺️ Encontrar ruta
            </motion.button>
            <motion.button
              whileHover={{ y: -2, borderColor: 'rgba(255,255,255,.75)' }}
              whileTap={{ scale: 0.97 }}
              style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,.35)', borderRadius: 999, padding: '11px 22px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#fff', fontFamily: "'DM Sans', sans-serif", transition: 'all .15s' }}
            >
              📍 Ver turismo
            </motion.button>
          </div>
        </motion.div>

      </main>
    </motion.div>
  )
}

export default Inicio