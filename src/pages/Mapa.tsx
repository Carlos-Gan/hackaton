import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

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

const center: [number, number] = [24.0277, -104.6532]

type RutaData = {
  color: string
  nombre: string
  waypoints: [number, number][]
}

const rutas: RutaData[] = [
  {
    nombre: 'Ruta Naranja',
    color: '#ef7300',
    waypoints: [
      [24.063854, -104.585587],
      [24.061471, -104.585156],
      [24.059199, -104.584642],
      [24.057516, -104.584323],
      [24.057239, -104.585904],
      [24.057095, -104.586745],
      [24.056365, -104.589337],
      [24.057819, -104.590889],
      [24.058658, -104.591769],
      // Solidaridad 
      [24.058995, -104.592140],
      [24.059991, -104.593242],
      [24.061729, -104.595093],
      [24.062815, -104.596261],
      [24.064233, -104.597742],
      [24.065444, -104.599032],
      [24.066428, -104.600092],
      // Volkswagen 
      [24.067207, -104.600904],
      [24.064215, -104.604782],
      [24.060394, -104.609075],
      [24.057455, -104.612300],
      [24.050703, -104.619853],
      [24.046106, -104.624950],
      [24.042040, -104.629431],
      [24.040245, -104.631428],
      [24.037658, -104.634369],
      [24.033504, -104.641839],
      [24.034291, -104.647950],
      [24.025622, -104.670489],
    ],
  },

  {
    nombre: 'Ruta Azul',
    color: '#00328f',
    waypoints: [
      [24.004815, -104.652848],
      [24.008073, -104.651632],
      [24.008782, -104.654654],
      [24.014487, -104.656023],
      [24.018410, -104.656082],
      [24.017542, -104.652910],
      [24.017874, -104.651748],
      [24.021173, -104.651962],
      [24.027476, -104.652923],
      [24.030975, -104.653486],
      [24.034707, -104.652646],
      [24.034256, -104.648991],
      [24.030813, -104.646863],
      [24.031902, -104.641289],
      [24.028438, -104.644391],
      [24.026124, -104.645888],
      [24.020397, -104.645468],
      [24.019579, -104.655091],
      [24.017019, -104.649958],
      [24.017432, -104.651596],
      //El pechugon 
      [24.017312, -104.655388],
      [24.008250, -104.654562],
      [24.004886, -104.653077],
      [24.005353, -104.655941],
      [24.006198, -104.662556],
    ],
  },

  {
    nombre: 'Ruta Morada',
    color: '#ff01d0',
    waypoints: [
      [23.988509, -104.615164],
      [23.993247, -104.628946],
      [23.995993, -104.636949],
      [23.999544, -104.646949],
      [24.001347, -104.648802],
      [24.002646, -104.652959],
      [24.00755, -104.658967],
      [24.020916, -104.669468],
      [24.022705, -104.673886],
    ],
  },

  {
    nombre: 'Ruta Verde',
    color: '#065b00',
    waypoints: [
      [24.047139 , -104.684319],
      [24.045002 , -104.682263],
      [24.043756 , -104.681070],
      [24.042323 , -104.682275],
      [24.038566 , -104.681485],
      [24.034133 , -104.680295],
      [24.028907 , -104.680253],
      [24.020996 , -104.676069],
      [24.018618 , -104.675487],
      [24.015081 , -104.675949],
      [24.013107 , -104.671277],
      [24.005279 , -104.677027],
    ]
  }
]

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
      style={{ background: '#4a4e59', fontFamily: "'DM Sans', sans-serif" }}
    >
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
          className="mb-8 flex flex-col items-center text-center"
        >
          <div
            className="mb-4 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em]"
            style={{ borderColor: 'rgba(201,168,76,0.3)', color: '#c86a4c', background: 'rgba(201,168,76,0.07)' }}
          >
            ⬡ Sistema de Transporte · Durango
          </div>
          <h1 className="text-4xl font-black sm:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Rutas urbanas{' '}
            <span style={{ color: '#c86a4c' }}>en tiempo real.</span>
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.3 }}
            className="my-5 h-0.5"
            style={{ background: 'linear-gradient(90deg, #c86a4c, transparent)' }}
          />
          <p className="max-w-2xl text-sm leading-relaxed text-[#ada79c]">
            Consulta las rutas disponibles, encuentra el camión más cercano
            y sigue su recorrido directamente desde el mapa.
          </p>
        </motion.div>

        {/* ✅ LEYENDA — ahora son botones filtrables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5 flex flex-wrap gap-3"
        >
          {/* Botón "Todas" */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setRutaActiva(null)}
            className="flex items-center gap-3 rounded-2xl border px-4 py-2 backdrop-blur-xl transition-all"
            style={{
              background: rutaActiva === null
                ? 'rgba(201,168,76,0.18)'
                : 'rgba(20,20,16,0.55)',
              borderColor: rutaActiva === null
                ? 'rgba(201,168,76,0.5)'
                : 'rgba(201,168,76,0.1)',
              cursor: 'pointer',
            }}
          >
            <div className="h-3 w-3 rounded-full bg-[#F0E8D0]"
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
                    : 'rgba(20,20,16,0.55)',
                  borderColor: activa
                    ? ruta.color
                    : 'rgba(201,168,76,0.1)',
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
            borderColor: 'rgba(201,168,76,0.12)',
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