import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  amount: number
  onSuccess: () => void
}

function PagoStripe({ amount, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [estado, setEstado] = useState<
    'idle' | 'procesando' | 'aprobado'
  >('idle')

  const handlePago = async () => {
    setLoading(true)
    setEstado('procesando')

    // Simula validación bancaria
    await new Promise((r) => setTimeout(r, 1800))

    // Simula aprobación
    setEstado('aprobado')

    // Espera para mostrar check
    await new Promise((r) => setTimeout(r, 1400))

    onSuccess()
  }

  return (
    <div className="space-y-4">

      {/* Tarjeta fake */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[1.8rem] border p-5"
        style={{
          background:
            'linear-gradient(145deg, rgba(25,25,20,0.9), rgba(10,10,8,0.9))',
          borderColor: 'rgba(201,168,76,0.12)',
        }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#c86a4c]/30 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#8A8272]">
                Tarjeta digital
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#F0E8D0]">
                Demo Transit Pay
              </h3>
            </div>

            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="text-4xl"
            >
              💳
            </motion.div>
          </div>

          <div className="mb-6 font-mono text-lg tracking-[0.3em] text-[#F0E8D0]">
            4242 •••• •••• 4242
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A8272]">
                Total
              </p>

              <p className="text-3xl font-black text-[#4cc98f]">
                ${amount}.00 MXN
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A8272]">
                Estado
              </p>

              <p className="text-sm text-[#c86a4c]">
                Demo
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botón */}
      <AnimatePresence mode="wait">

        {estado === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 0 30px rgba(200,106,76,0.25)',
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handlePago}
            disabled={loading}
            className="w-full rounded-full px-6 py-3 text-sm font-semibold"
            style={{
              background: '#c86a4c',
              color: '#0E0E0A',
            }}
          >
            Confirmar pago
          </motion.button>
        )}

        {estado === 'procesando' && (
          <motion.div
            key="procesando"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border p-6"
            style={{
              background: 'rgba(201,168,76,0.05)',
              borderColor: 'rgba(201,168,76,0.1)',
            }}
          >
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: 'linear',
              }}
              className="mb-4 h-10 w-10 rounded-full border-4 border-[#c86a4c]/20 border-t-[#c86a4c]"
            />

            <p className="text-sm font-semibold text-[#F0E8D0]">
              Procesando pago...
            </p>

            <p className="mt-1 text-xs text-[#8A8272]">
              Conectando con el banco
            </p>
          </motion.div>
        )}

        {estado === 'aprobado' && (
          <motion.div
            key="aprobado"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border p-6 text-center"
            style={{
              background: 'rgba(76,201,143,0.08)',
              borderColor: 'rgba(76,201,143,0.2)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
              }}
              className="mb-3 text-5xl"
            >
              ✅
            </motion.div>

            <h3 className="text-lg font-bold text-[#4cc98f]">
              Compra aprobada
            </h3>

            <p className="mt-1 text-sm text-[#ada79c]">
              Tu boleto ha sido emitido correctamente
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PagoStripe