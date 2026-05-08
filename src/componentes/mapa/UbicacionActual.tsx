import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

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

export default function UbicacionActual() {
    const map = useMap()

    const markerRef = useRef < L.Marker | null > (null)

    const [error, setError] = useState < string | null > (null)

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Tu navegador no soporta geolocalización')
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const latlng = L.latLng(
                    pos.coords.latitude,
                    pos.coords.longitude
                )

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

            markerRef.current?.remove()
        }
    }, [map])

    if (!error) return null

    return (
        <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200 backdrop-blur-xl">
            ⚠️ {error}
        </div>
    )
}