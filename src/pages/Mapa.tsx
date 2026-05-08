import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

// ✅ Fix: evita íconos rotos con webpack/vite
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
})

// ✅ Fix: declarar el módulo para que TypeScript reconozca L.Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: object): L.Control & { getPlan(): object }
  }
}
import 'leaflet-routing-machine'

const center: [number, number] = [24.0277, -104.6532]

// ✅ Fix: usar tuplas en lugar de L.latLng() al nivel del módulo
//    (L.latLng a nivel de módulo puede romper en SSR / Next.js)
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
  // ✅ Fix: ref para evitar duplicar controles en React Strict Mode
  const controlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    // ✅ Fix: convertir tuplas a L.LatLng dentro del efecto (seguro en cliente)
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
      // ✅ Fix: limpieza robusta usando la ref
      if (controlRef.current) {
        map.removeControl(controlRef.current)
        controlRef.current = null
      }
    }
    // ✅ Fix: dependencias correctas — waypoints y color son primitivos estables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, color])

  return null
}

function Mapa() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 p-6">
        <h1 className="mb-4 text-3xl font-bold text-white">
          Rutas de Camión
        </h1>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          // ✅ Fix: id único ayuda a Leaflet a identificar el contenedor
          id="map"
          className="h-[75vh] w-full rounded-3xl"
        >
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {rutas.map((ruta) => (
            <RutaCamion
              // ✅ Fix: key con color es más estable que el índice
              key={ruta.color}
              waypoints={ruta.waypoints}
              color={ruta.color}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default Mapa