import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { distanciaRuta } from '../../utils/geo'
import { estimarEspera } from '../../utils/estimaciones'
import { VELOCIDAD_KMH } from '../../constants/mapa'

type Props = {
  waypoints: [number, number][]
  color: string
  nombre: string
  numCamiones: number
  estado: 'Activa' | 'Mantenimiento'  // ← prop nueva
}

export default function ParadasRuta({
  waypoints,
  color,
  nombre,
  numCamiones,
  estado,  // ← desestructurar
}: Props) {
  const map = useMap()
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const totalKm = distanciaRuta(waypoints)
    const intervaloMin = Math.round(
      (totalKm / (numCamiones * VELOCIDAD_KMH)) * 60
    )

    // ── Config según estado ──────────────────────────────
    const enMantenimiento = estado === 'Mantenimiento'

    // Color del marcador: gris si está en mantenimiento
    const colorEfectivo = enMantenimiento ? '#888888' : color

    // Banner de advertencia para el popup
    const bannerEstado = enMantenimiento
      ? `<div style="
            margin-bottom: 8px;
            padding: 6px 10px;
            border-radius: 8px;
            background: rgba(201,168,76,0.15);
            border: 1px solid rgba(201,168,76,0.5);
            font-size: 11px;
            font-weight: 700;
            color: #C9A84C;
            text-align: center;
          ">
            🔧 Ruta en mantenimiento — servicio suspendido
          </div>`
      : ''

    // Bloque de tiempo: se oculta si está en mantenimiento
    const bloqueEspera = enMantenimiento
      ? `<div style="
            margin-top: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(136,136,136,0.12);
            border: 1px solid rgba(136,136,136,0.3);
            font-size: 12px;
            font-weight: 700;
            color: #888;
            text-align: center;
          ">
            ⚠️ Sin servicio disponible
          </div>`
      : (() => {
        const { minutos, label } = estimarEspera(0, waypoints, numCamiones)
        return `<div style="
            margin-top: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            background: ${color}18;
            border: 1px solid ${color}55;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
          ">
            ${label} · ~${minutos} min
          </div>`
      })()
    // ────────────────────────────────────────────────────

    waypoints.forEach(([lat, lng], i) => {
      // Estimar espera solo si está activa
      const { minutos, label } = estado === 'Activa'
        ? estimarEspera(i, waypoints, numCamiones)
        : { minutos: 0, label: '' }

      const esInicio = i === 0
      const esFin = i === waypoints.length - 1
      const size = esInicio || esFin ? 16 : 11

      const icono = L.divIcon({
        className: '',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${colorEfectivo};
            border: ${esInicio || esFin ? '3px' : '2px'} solid white;
            border-radius: ${esInicio ? '4px' : '50%'};
            box-shadow: 0 0 ${esInicio || esFin ? '10px' : '5px'} ${colorEfectivo};
            ${enMantenimiento ? 'opacity: 0.5;' : ''}
          "></div>
          ${enMantenimiento && (esInicio || esFin) ? `
            <div style="
              position: absolute;
              top: -6px;
              right: -6px;
              font-size: 10px;
              line-height: 1;
            ">🔧</div>
          ` : ''}
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const popup = `
        <div style="font-family: DM Sans, sans-serif; min-width: 180px;">
          ${bannerEstado}
          <div style="font-weight: 700; font-size: 13px; color: ${colorEfectivo}; margin-bottom: 6px;">
            ${esInicio ? '🚌 Inicio' : esFin ? '🏁 Final' : '📍 Parada'} · ${nombre}
          </div>
          <div style="font-size: 12px; color: #444; margin-bottom: 8px;">
            Parada ${i + 1} de ${waypoints.length}
          </div>
          ${estado === 'Activa' ? `
          <div style="font-size: 12px; color: #555;">
            ⏱ Frecuencia: <strong>cada ${intervaloMin} min</strong>
          </div>
          <div style="
            margin-top: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            background: ${color}18;
            border: 1px solid ${color}55;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
          ">
            ${label} · ~${minutos} min
          </div>
          ` : bloqueEspera}
        </div>
      `

      const marker = L.marker([lat, lng], { icon: icono })
        .addTo(map)
        .bindPopup(popup)

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach(m => m.remove())
    }
  }, [map, waypoints, color, nombre, numCamiones, estado])

  return null
}