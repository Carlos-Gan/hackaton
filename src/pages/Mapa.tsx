import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import { rutas } from '../data/rutas'


import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
})

declare module 'leaflet' {
  namespace Routing {
    function control(options: object): L.Control & { getPlan(): object }
  }
}

import 'leaflet-routing-machine'
import { colors } from '../utils/theme'

const center: [number, number] = [24.0277, -104.6532]

type RutaProps = {
  waypoints: [number, number][]
  color: string
}

function RutaCamion({ waypoints, color }: RutaProps) {
  const map = useMap()
  const controlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    const latLngs = waypoints.map(([lat, lng]) =>
      L.latLng(lat, lng)
    )

    const routingControl = L.Routing.control({
      waypoints: latLngs,
      createMarker: () => null,
      draggableWaypoints: false,
      addWaypoints: false,
      routeWhileDragging: false,
      show: false,

      lineOptions: {
        styles: [
          {
            color,
            weight: 7,
            opacity: 0.9,
          },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
    }).addTo(map)

    controlRef.current = routingControl

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current)
      }
    }
  }, [map, waypoints, color])

  return null
}

/* UBICACIÓN */

const iconoUbicacion = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #4cc98f;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(76,201,143,0.25);
      animation: pulso 1.5s infinite;
    "></div>

    <style>
      @keyframes pulso {
        0% {
          box-shadow: 0 0 0 0px rgba(76,201,143,0.5);
        }

        100% {
          box-shadow: 0 0 0 12px rgba(76,201,143,0);
        }
      }
    </style>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function UbicacionActual() {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords

        const latlng = L.latLng(latitude, longitude)

        if (markerRef.current) {
          markerRef.current.setLatLng(latlng)
        } else {
          markerRef.current = L.marker(latlng, {
            icon: iconoUbicacion,
          })
            .addTo(map)
            .bindPopup('📍 Estás aquí')

          map.setView(latlng, 14)
        }
      },
      (err) => {
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)

      if (markerRef.current) {
        markerRef.current.remove()
      }
    }
  }, [map])

  if (error) {
    return (
      <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200 backdrop-blur-xl">
        ⚠️ {error}
      </div>
    )
  }

  return null
}

function Mapa() {
  // null = todas las rutas visibles, string = solo esa ruta
  const [rutaActiva, setRutaActiva] = useState<string | null>(null)

  const handleClickRuta = (nombre: string) => {
    // Si ya está activa, deselecciona (muestra todas)
    setRutaActiva(prev => prev === nombre ? null : nombre)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-[#F0E8D0]"
      style={{ background: colors.background, fontFamily: "'DM Sans', sans-serif" }}
    >

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
      </style>
      {/* FONDO — sin cambios */}
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

        {/* HEADER — sin cambios */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex flex-col items-center text-center"
        >
          <div
            className="mb-1 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em]"
            style={{
              borderColor: colors.brand.goldCardBorder,
              color: colors.brand.orangeGlow,
              background: colors.brand.goldSoft,
              fontFamily: "'Ubuntu', sans-serif",
            }}
          >
            ⬡ Sistema de Transporte · Durango
          </div>
          <h1 className="text-4xl font-black sm:text-6xl" 
          style={{ fontFamily: "'Playfair Display', serif" }}>
            Rutas urbanas{' '}
            <span style={{ color: colors.brand.orange }}>en tiempo real.</span>
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.3 }}
            className="my-5 h-0.5"
            style={{ background: 'linear-gradient(90deg, ' + colors.brand.orange + ', transparent)' }}
          />
          <p className="max-w-2xl text-sm leading-relaxed text-[#ada79c]">
            Consulta las rutas disponibles, encuentra el camión más cercano
            y sigue su recorrido directamente desde el mapa.
          </p>
        </motion.div>

        {/* LEYENDA — son botones filtrables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 flex flex-wrap gap-3"
        >
          {/* Botón "Todas" */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRutaActiva(null)}
            className="flex items-center gap-3 rounded-2xl border px-4 py-2 backdrop-blur-xl transition-all"
            style={{
              background: rutaActiva === null
                ? colors.brand.goldShadow
                : colors.card.dark,
              borderColor: rutaActiva === null
                ? colors.brand.goldCardBorder
                : colors.brand.goldBorder,
              cursor: 'pointer',
            }}
          >
            <div className="h-2 w-3 rounded-full bg-[#F0E8D0]"
              style={{ boxShadow: rutaActiva === null ? '0 0 10px #F0E8D0' : 'none' }}
            />
            <span className="text-sm font-semibold text-[#F0E8D0]">Todas</span>
          </motion.button>

          {/* Botón por ruta */}
          {rutas.map((ruta) => {
            const activa = rutaActiva === ruta.nombre
            return (
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                key={ruta.nombre}
                onClick={() => handleClickRuta(ruta.nombre)}
                className="flex items-center gap-3 rounded-2xl border px-4 py-2 backdrop-blur-xl transition-all"
                style={{
                  background: activa
                    ? `${ruta.color}22`           // fondo tintado con el color de la ruta
                    : colors.green.shadow,
                  borderColor: activa
                    ? ruta.color
                    : colors.brand.goldBorder,
                  cursor: 'pointer',
                  // ✅ borde más grueso cuando está activa
                  outline: activa ? `1px solid ${ruta.color}` : 'none',
                }}
              >
                <div
                  className="h-3 w-3 rounded-full transition-all"
                  style={{
                    background: ruta.color,
                    boxShadow: activa
                      ? `0 0 18px ${ruta.color}`   // brilla más cuando activa
                      : `0 0 6px ${ruta.color}55`,
                    // ✅ escala el punto cuando está seleccionado
                    transform: activa ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-sm transition-colors"
                  style={{ color: activa ? '#F0E8D0' : '#ada79c', fontWeight: activa ? 600 : 400 }}
                >
                  {ruta.nombre}
                </span>
                {/* ✅ badge de "activa" */}
                {activa && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: ruta.color, color: '#0E0E0A' }}
                  >
                    activa
                  </span>
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* MAPA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-[2rem] border"
          style={{
            borderColor: colors.brand.goldShadow,
            background: 'rgba(10,10,8,0.55)',
            boxShadow: '0 30px 80px -30px rgba(0,0,0,0.65)',
          }}
        >
          <div className="relative">
            <MapContainer center={center} zoom={13} scrollWheelZoom className="h-[78vh] w-full">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* ✅ Filtra: si hay rutaActiva solo renderiza esa, si no todas */}
              {rutas
                .filter(ruta => rutaActiva === null || ruta.nombre === rutaActiva)
                .map(ruta => (
                  <RutaCamion
                    key={ruta.nombre}
                    waypoints={ruta.waypoints}
                    color={ruta.color}
                  />
                ))}

              <UbicacionActual />
            </MapContainer>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#4a4e59] to-transparent" />
          </div>
        </motion.div>

      </main>
    </motion.div>
  )
}

export default Mapa