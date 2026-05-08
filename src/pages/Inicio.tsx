import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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
        background: '#424e51',
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

      <main className="relative z-10 mx-auto max-w px-6 py-10">

        {/* NAV */}
        <motion.nav
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5 flex items-center justify-between border-b pb-5"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.1,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
              style={{
                background: 'linear-gradient(135deg, #4cc98f, #305e7a)',
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
                color: '#ce7230',
              }}
            >
              Q-Ruta
            </span>
          </div>

          <span className="hidden text-xs uppercase tracking-[0.25em] text-white sm:block">
            Sistema de Transporte Urbano
          </span>
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
              borderColor: '#915022',
              color: '#ce7230',
              background: 'rgba(201,168,76,0.07)',
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
              style={{ color: '#ce7230' }}
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
                'linear-gradient(90deg, #c86a4c, transparent)',
            }}
          />

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-xl px-4 text-base leading-relaxed font-light text-white"
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
              bg: 'linear-gradient(145deg, #1E3A2F 0%, #0E2219 100%)',
              border: 'rgba(42,92,69,0.6)',
              shadow: 'rgba(30,58,47,0.5)',
              color: '#6FCF97',
            },
            {
              emoji: '💳',
              tag: 'Pago sin efectivo',
              title: 'Pagar con código QR',
              desc: 'Genera tu código de pago al instante y aborda sin necesidad de llevar monedas.',
              button: '💳 Pagar ahora',
              route: '/pagar',
              bg: 'linear-gradient(145deg, #2A1F00 0%, #1A1200 100%)',
              border: 'rgba(201,168,76,0.3)',
              shadow: 'rgba(201,168,76,0.15)',
              color: '#C9A84C',
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
                      ? '#2e5c317d'
                      : '#c86b4ca0',
                  color:
                    card.route === '/mapa'
                      ? '#6FCF97'
                      : '#0E0E0A',
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