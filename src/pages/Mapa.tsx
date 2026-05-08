import { useEffect, useRef, useState } from 'react'
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
  waypoints: [number, number][]
}

const rutas: RutaData[] = [
  {
    color: '#cc6900',
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
    color: '#3b82f6',
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
    color: '#ffd900',
    waypoints: [
      [24.988992, -104.616596],
      [24.999536, -104.646954],
      [24.007550, -104.658967],
      [24.020916, -104.669468],
      [24.022705, -104.673886],
    ],
  },
]

type RutaProps = {
  waypoints: [number, number][]
  color: string
}

function RutaCamion({ waypoints, color }: RutaProps) {
  const map = useMap()
  const controlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    const latLngs = waypoints.map(([lat, lng]) => L.latLng(lat, lng))

    const routingControl = L.Routing.control({
      waypoints: latLngs,
      createMarker: () => null,
      draggableWaypoints: false,
      addWaypoints: false,
      routeWhileDragging: false,
      show: false,
      lineOptions: {
        styles: [{ color, weight: 7, opacity: 0.9 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
    }).addTo(map)

    controlRef.current = routingControl

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current)
        controlRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, color])

  return null
}

// ✅ NUEVO: ícono personalizado para tu ubicación (punto azul pulsante)
const iconoUbicacion = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 18px; height: 18px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.35);
      animation: pulso 1.5s infinite;
    "></div>
    <style>
      @keyframes pulso {
        0%   { box-shadow: 0 0 0 0px rgba(59,130,246,0.5); }
        100% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
      }
    </style>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// ✅ NUEVO: componente que obtiene y muestra tu ubicación en el mapa
function UbicacionActual() {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      return
    }

    // Muestra la posición inicial
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const latlng = L.latLng(latitude, longitude)

        if (markerRef.current) {
          // Si ya existe el marcador, solo actualiza su posición
          markerRef.current.setLatLng(latlng)
        } else {
          // Crea el marcador la primera vez y centra el mapa
          markerRef.current = L.marker(latlng, { icon: iconoUbicacion })
            .addTo(map)
            .bindPopup('📍 Estás aquí')
          map.setView(latlng, 15)
        }
      },
      (err) => {
        setError('No se pudo obtener tu ubicación: ' + err.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    )

    return () => {
      // Limpia el watcher y el marcador al desmontar
      navigator.geolocation.clearWatch(watchId)
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [map])

  // Muestra el error flotante sobre el mapa si ocurre
  if (error) {
    return (
      <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2
                      rounded-xl bg-red-600 px-4 py-2 text-sm text-white shadow-lg">
        ⚠️ {error}
      </div>
    )
  }

  return null
}

function Mapa() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 p-6">
        <h1 className="mb-4 text-3xl font-bold text-white">
          Rutas de Camión
        </h1>
        <div className="relative"> {/* ✅ necesario para el z-index del error */}
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom
            id="map"
            className="h-[75vh] w-full rounded-3xl"
          >
            <TileLayer
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {rutas.map((ruta) => (
              <RutaCamion
                key={ruta.color}
                waypoints={ruta.waypoints}
                color={ruta.color}
              />
            ))}

            {/* ✅ NUEVO: agrega tu ubicación al mapa */}
            <UbicacionActual />

          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default Mapa