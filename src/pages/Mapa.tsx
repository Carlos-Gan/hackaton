import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapContainer,
  TileLayer,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import { useRutas } from '../hooks/useRutas'

import { colors } from '../utils/theme'

import RutaCamion from '../componentes/mapa/RutaCamion'
import ParadasRuta from '../componentes/mapa/ParadasRuta'
import UbicacionActual from '../componentes/mapa/UbicacionActual.js'

const center: [number, number] = [24.0277, -104.6532]

function Mapa() {
  const { rutas } = useRutas()
  const [rutaActiva, setRutaActiva] = useState<string | null>(null)

  const rutasFiltradas = rutas.filter(
    ruta =>
      rutaActiva === null ||
      ruta.nombre === rutaActiva
  )

  const handleClickRuta = (nombre: string) => {
    setRutaActiva(prev => prev === nombre ? null : nombre)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-[#F0E8D0]"
      style={{
        background: colors.background,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Fondo */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 90% 80%, rgba(30,58,47,0.25) 0%, transparent 60%)
    `,
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-2 flex flex-col items-center text-center">
          <div
            className="mb-1 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em]"
            style={{
              borderColor:
                colors.brand.goldCardBorder,
              color:
                colors.brand.orangeGlow,
              background:
                colors.brand.goldSoft,
            }}
          >
            ⬡ Sistema de Transporte · Durango
          </div>

          <h1
            className="text-4xl font-black sm:text-6xl"
          >
            Rutas urbanas{' '}
            <span
              style={{
                color: colors.brand.orange,
              }}
            >
              en tiempo real.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-[#ada79c]">
            Consulta rutas disponibles y sigue
            recorridos en tiempo real.
          </p>
        </div>

        {/* FILTROS */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => setRutaActiva(null)}
            className="rounded-2xl border px-4 py-2"
          >
            Todas
          </button>

          {rutas.map(ruta => {
            const activa =
              rutaActiva === ruta.nombre

            return (
              <button
                key={ruta.nombre}
                onClick={() =>
                  handleClickRuta(ruta.nombre)
                }
                className="rounded-2xl border px-4 py-2"
                style={{
                  borderColor: activa
                    ? ruta.color
                    : '#444',
                }}
              >
                {ruta.nombre}
              </button>
            )
          })}
        </div>

        {/* MAPA */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="overflow-hidden rounded-[2rem] border"
          style={{
            borderColor:
              colors.brand.goldShadow,
          }}
        >
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom
            className="h-[78vh] w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {rutasFiltradas.map(ruta => (
              <RutaCamion
                key={ruta.nombre}
                waypoints={ruta.waypoints}
                color={ruta.color}
              />
            ))}

            {rutasFiltradas.map(ruta => (
              <ParadasRuta
                key={`paradas-${ruta.nombre}`}
                waypoints={ruta.waypoints}
                color={ruta.color}
                nombre={ruta.nombre}
                numCamiones={ruta.camiones}
                estado={ruta.estado}
              />
            ))}

            <UbicacionActual />
          </MapContainer>
        </motion.div>
      </main>
    </motion.div>
  )
}

export default Mapa