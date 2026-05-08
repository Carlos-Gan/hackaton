import { motion } from 'framer-motion'

export default function FondoMapa() {
    return (
        <>
            {/* Glow superior */}
            <motion.div
                animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                }}
                className="pointer-events-none fixed inset-0"
                style={{
                    background: `
            radial-gradient(
              ellipse 80% 60% at 50% -10%,
              rgba(201,168,76,0.12) 0%,
              transparent 70%
            ),

            radial-gradient(
              ellipse 50% 40% at 90% 80%,
              rgba(30,58,47,0.25) 0%,
              transparent 60%
            )
          `,
                }}
            />

            {/* Glow lateral */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                }}
                className="pointer-events-none fixed left-0 top-0 h-full w-full"
                style={{
                    background: `
            radial-gradient(
              circle at 0% 50%,
              rgba(255,140,66,0.08),
              transparent 35%
            )
          `,
                }}
            />

            {/* Noise overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'url("https://grainy-gradients.vercel.app/noise.svg")',
                }}
            />
        </>
    )
}