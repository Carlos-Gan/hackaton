import { useState } from 'react'
import { motion } from 'framer-motion'

import type { QrData, PaymentStep } from '../types'

import EscanerQR from '../componentes/EscanerQr'
import PagoStripe from '../componentes/PagoStripe'
import { colors } from '../utils/theme'

function PagoCamion() {
  const [step, setStep] = useState<PaymentStep>('escaneando')
  const [qrData, setQrData] = useState<QrData | null>(null)

  const handleQrDetected = (data: QrData) => {
    setQrData(data)
    setStep('pagando')
  }

  const handlePagoExitoso = () => {
    setStep('exito')

    if (qrData) {
      localStorage.setItem(
        'ultimoBoleto',
        JSON.stringify({
          qr: qrData,
          timestamp: new Date().toISOString(),
          validoHasta: new Date(
            Date.now() + 3600000
          ).toISOString(),
        })
      )
    }
  }

  const handleVolverInicio = () => {
    window.location.href = '/'
  }

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    show: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
      },
    },
  }

  /* ESCÁNER */

  if (step === 'escaneando') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
        style={{
          background: colors.background,
        }}
      >
        {/* Fondo ambiental */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 10,
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

        <EscanerQR
          onQrDetected={handleQrDetected}
          onCancel={handleVolverInicio}
        />
      </motion.div>
    )
  }

  /* PAGO */

  if (step === 'pagando') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-[#F0E8D0]"
        style={{
          background: colors.background,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Fondo */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="pointer-events-none fixed inset-0"
          style={{
            background: `
              colors.gradients.backgroundLight,
              colors.gradients.backgroundDark
            `,
          }}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border p-7 backdrop-blur-xl"
          style={{
            background: 'rgba(18,18,14,0.72)',
            borderColor: colors.brand.goldShadow,
            boxShadow:
              '0 30px 80px -30px rgba(0,0,0,0.65)',
          }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#c86a4c]/10 blur-3xl" />

          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="relative mb-6 flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.08,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{
                background:
                  colors.gradients.header,
              }}
            >
              🚍
            </motion.div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#c86a4c]">
                Pago urbano
              </p>

              <h2
                className="text-2xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Completa tu pago
              </h2>
            </div>
          </motion.div>

          {/* Ruta */}
          <motion.div
            variants={fadeUp}
            className="mb-5 rounded-2xl border p-4"
            style={{
              background: colors.brand.goldCardBorder,
              borderColor: colors.brand.goldBorder,
            }}
          >
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8A8272]">
              Ruta detectada
            </p>

            <p className="break-all font-mono text-sm text-[#4cc98f]">
              {qrData?.route || qrData?.raw}
            </p>
          </motion.div>

          {/* Stripe */}
          <motion.div variants={fadeUp}>
            <PagoStripe
              amount={12}
              onSuccess={handlePagoExitoso}
            />
          </motion.div>

          {/* Volver */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => setStep('escaneando')}
            className="mt-5 w-full text-center text-sm transition"
            style={{
              color: colors.text.secondary,
            }}
          >
            ← Volver a escanear
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  /* ÉXITO */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-[#F0E8D0]"
      style={{
        background: colors.background,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Fondo */}
      <motion.div
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 10,
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

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border p-8 text-center backdrop-blur-xl"
        style={{
          background: 'rgba(18,18,14,0.72)',
          borderColor: colors.brand.goldShadow,
          boxShadow:
            '0 30px 80px -30px rgba(0,0,0,0.65)',
        }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#4cc98f]/10 blur-3xl" />

        {/* Check */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(76,201,143,0.2), rgba(48,94,122,0.2))',
            border: '1px solid rgba(76,201,143,0.2)',
          }}
        >
          <span className="text-5xl">✅</span>
        </motion.div>

        {/* Título */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-black"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          ¡Pago exitoso!
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm leading-relaxed text-[#ada79c]"
        >
          Tu boleto digital ya está activo y será válido
          durante 1 hora.
        </motion.p>

        {/* Código */}
        <motion.div
          variants={fadeUp}
          className="mt-6 rounded-2xl border p-4"
          style={{
            background: 'rgba(201,168,76,0.05)',
            borderColor: 'rgba(201,168,76,0.1)',
          }}
        >
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#8A8272]">
            Código de viaje
          </p>

          <p className="break-all font-mono text-sm text-[#4cc98f]">
            {qrData?.raw.substring(0, 40)}...
          </p>
        </motion.div>

        {/* Botón */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow:
              '0 0 30px rgba(200,106,76,0.25)',
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={handleVolverInicio}
          className="mt-7 rounded-full px-7 py-3 text-sm font-semibold"
          style={{
            background: '#c86a4c',
            color: '#0E0E0A',
          }}
        >
          Volver al inicio
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default PagoCamion