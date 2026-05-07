import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
import iconUrl from 'leaflet/dist/images/marker-icon.png?url'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url'

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

const center: [number, number] = [24.0277, -104.6532]

const puntosTuristicos: { position: [number, number]; title: string; description: string }[] = [
  {
    position: [24.0277, -104.6532],
    title: 'Centro histórico de Durango',
    description: 'Durango, Durango, México',
  },
  {
    position: [24.0327, -104.6520],
    title: 'Catedral Basílica Menor',
    description: 'Catedral ubicada en el corazón de la ciudad',
  },
  {
    position: [24.0296, -104.6485],
    title: 'Museo de Arqueología',
    description: 'Colecciones arqueológicas de Durango',
  },
]

function Mapa() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="mb-4 text-3xl font-semibold">Mapa de Durango, México</h1>
        <p className="mb-6 text-slate-300">Este mapa muestra el centro de Durango capital, México, con algunos puntos turísticos.</p>
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-[70vh] w-full rounded-3xl">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {puntosTuristicos.map(({ position, title, description }) => (
            <Marker key={title} position={position}>
              <Popup>
                <strong>{title}</strong>
                <br />
                {description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default Mapa
