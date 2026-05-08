import { useNavigate } from 'react-router-dom'
import { color, motion } from 'framer-motion'
import { colors } from '../utils/theme'

function Inicio() {
  const navigate = useNavigate()

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen text-[#F0E8D0]"
      style={{
        background: colors.background,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Fondo ambiental animado */}
      <motion.div
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(30,58,47,0.25) 0%, transparent 60%)
          `,
        }}
      />

      <main className="relative z-10 mx-auto max-w px-6 py-6">

        {/* NAV */}
        <motion.nav
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-1 flex items-center justify-between border-b pb-2"
          style={{ borderColor: colors.brand.goldBorder }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.1,
              }}
              className="flex h-6 w-9 items-center justify-center rounded-full text-lg"
              style={{
                background: colors.gradients.logo,
              }}
            >
              🦂
            </motion.div>

            <style>
              @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
            </style>

            <span
              className="text-lg tracking-wide"
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontSize: '2rem',
                color: colors.brand.orange,
              }}
            >
              Q-Ruta
            </span>
          </div>

          <span className="hidden text-xs uppercase tracking-[0.25em] text-white sm:block">
            Sistema de Transporte Urbano
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition"
            style={{
              background: colors.brand.gold,
              color: '#1A1200',
            }}
          >
            Iniciar sesión
          </motion.button>
        </motion.nav>

        {/* HERO */}
        <motion.header
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-3 flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 25px rgba(200,106,76,0.2)',
            }}
            className="mb-2 flex w-fit items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-xs text-white uppercase tracking-[0.25em]"
            style={{
              borderColor: colors.brown.button,
              color: colors.brand.orange,
              background: colors.brand.goldSoft,
            }}
          >
            ⬡ Estado de Durango · México
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-2 text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Tu camión,{' '}
            <motion.em
              animate={{
                textShadow: [
                  '0 0 0px rgba(200,106,76,0)',
                  '0 0 18px rgba(200,106,76,0.7)',
                  '0 0 0px rgba(200,106,76,0)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              style={{ color: colors.brand.orange }}
            >
              en un toque.
            </motion.em>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="my-5 h-0.5"
            style={{
              background:
                'linear-gradient(90deg, ' + colors.brand.orange + ', transparent)',
            }}
          />

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-xl px-4 text-base leading-relaxed font-light text-white"
            style={{
              fontFamily: "'Ubuntu', sans-serif",
            }}
          >

            Consulta rutas en tiempo real y paga tu pasaje sin efectivo.
            Moverse por Durango nunca fue tan sencillo.
          </motion.p>
        </motion.header>

        {/* CARDS */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-3 grid gap-4 sm:grid-cols-2"
        >
          {[
            {
              emoji: '🗺️',
              tag: 'Transporte urbano',
              title: 'Ver rutas de camión',
              desc: 'Localiza tu ruta, sigue el recorrido en el mapa y sabe exactamente dónde estás y a dónde vas.',
              button: '🗺️ Abrir mapa →',
              route: '/mapa',
              bg: colors.gradients.mapaCard,
              border: colors.green.border,
              shadow: colors.green.shadow,
              color: '#6FCF97',
            },
            {
              emoji: '💳',
              tag: 'Pago sin efectivo',
              title: 'Pagar con código QR',
              desc: 'Genera tu código de pago al instante y aborda sin necesidad de llevar monedas.',
              button: 'Pagar ahora',
              route: '/pagar',
              bg: colors.gradients.pagoCard,
              border: colors.brand.goldCardBorder,
              shadow: colors.brand.goldShadow,
              color: colors.brand.gold,
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border p-8"
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                background: card.bg,
                borderColor: card.border,
                boxShadow: `0 20px 60px -20px ${card.shadow}`,
              }}
              onClick={() => navigate(card.route)}
            >
              <motion.span
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="pointer-events-none absolute bottom-3 right-5 text-[5rem] opacity-10"
              >
                {card.emoji}
              </motion.span>

              <p
                className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em]"
                style={{ color: card.color }}
              >
                {card.tag}
              </p>

              <h2
                className="mb-2 text-3xl font-bold leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {card.title}
              </h2>

              <p className="mb-3 text-sm font-light leading-relaxed text-[#F0E8D0]/50">
                {card.desc}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{
                  background:
                    card.route === '/mapa'
                      ? colors.card.green
                      : colors.card.red,
                  color:
                    card.route === '/mapa'
                      ? colors.card.lightGreen
                      : colors.card.dark,
                }}
              >
                {card.button}
              </motion.button>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </motion.div>
  )
}

export default Inicio