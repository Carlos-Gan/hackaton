import { colors } from '../utils/theme'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

import { type RutaData } from '../data/rutas'
import { useRutas } from '../hooks/useRutas'
import { MapContainer, useMap, TileLayer } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

// Datos demo
const congestionHoras = [
  { hora: '6 AM', nivel: 40 },
  { hora: '8 AM', nivel: 95 },
  { hora: '10 AM', nivel: 55 },
  { hora: '1 PM', nivel: 70 },
  { hora: '6 PM', nivel: 100 },
  { hora: '9 PM', nivel: 35 },
]

const usoDiario = [45, 60, 75, 90, 70, 95, 80]
const dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// Helpers
function nivelColor(n: number) {
  if (n >= 85) return colors.brand.gold
  if (n >= 60) return colors.brand.orange
  return colors.green.primary
}

// Card reutilizable
function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: colors.brown.darker,
        border: `0.5px solid ${colors.brand.goldBorder}`,
      }}
    >
      <p
        className="mb-2 text-xs uppercase tracking-widest"
        style={{ color: colors.text.muted }}
      >
        {label}
      </p>

      <p
        className="text-3xl font-bold leading-none"
        style={{
          color: accent
            ? colors.brand.gold
            : colors.text.primary,
        }}
      >
        {value}
      </p>

      <p
        className="mt-2 text-xs"
        style={{ color: colors.text.muted }}
      >
        {sub}
      </p>
    </div>
  )
}

function LineaRuta({
  waypoints,
  color,
}: {
  waypoints: [number, number][]
  color: string
}) {
  const map = useMap()
  const lineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    lineRef.current?.remove()
    const linea = L.polyline(waypoints, {
      color,
      weight: 5,
      opacity: 0.9,
    }).addTo(map)

    // Ajusta el zoom para que entre toda la ruta
    map.fitBounds(linea.getBounds(), { padding: [20, 20] })
    lineRef.current = linea

    return () => { linea.remove() }
  }, [map, waypoints, color])

  return null
}

function ModalEditar({
  ruta,
  onClose,
  onGuardar,
}: {
  ruta: RutaData
  onClose: () => void
  onGuardar: (id: number, nuevoEstado: 'Activa' | 'Mantenimiento') => void
}) {
  const [estado, setEstado] = useState<'Activa' | 'Mantenimiento'>(ruta.estado)
  const cambio = estado !== ruta.estado

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Panel — detiene propagación para no cerrar al hacer clic adentro */}
      <div
        className="relative w-full max-w-lg rounded-3xl p-6 shadow-2xl"
        style={{
          background: colors.brown.darker,
          border: `1px solid ${colors.brand.goldBorder}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-lg leading-none transition hover:opacity-60"
          style={{ color: colors.text.muted }}
        >
          ✕
        </button>

        {/* Título */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ background: ruta.color, boxShadow: `0 0 8px ${ruta.color}` }}
          />
          <h2 className="text-lg font-bold" style={{ color: colors.text.primary }}>
            Editar · {ruta.nombre}
          </h2>
        </div>

        {/* Toggle de estado */}
        <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: colors.text.muted }}>
          Estado de la ruta
        </p>
        <div className="mb-5 flex gap-3">
          {(['Activa', 'Mantenimiento'] as const).map(op => {
            const seleccionado = estado === op
            const esActiva = op === 'Activa'
            return (
              <button
                key={op}
                onClick={() => setEstado(op)}
                className="flex-1 rounded-2xl py-3 text-sm font-semibold transition"
                style={{
                  background: seleccionado
                    ? esActiva ? 'rgba(111,207,151,0.2)' : 'rgba(201,168,76,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: seleccionado
                    ? `1.5px solid ${esActiva ? colors.green.primary : colors.brand.gold}`
                    : `1px solid ${colors.brand.goldBorder}`,
                  color: seleccionado
                    ? esActiva ? colors.green.primary : colors.brand.gold
                    : colors.text.muted,
                }}
              >
                {esActiva ? '🟢 Activa' : '🔧 Mantenimiento'}
              </button>
            )
          })}
        </div>

        {/* Aviso visual si hay cambio pendiente */}
        {cambio && (
          <div
            className="mb-4 rounded-xl px-4 py-2 text-xs"
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: `1px solid ${colors.brand.goldBorder}`,
              color: colors.brand.gold,
            }}
          >
            ⚠️ Cambiarás el estado de <strong>{ruta.nombre}</strong> a{' '}
            <strong>{estado}</strong>. Esto afectará el mapa y las paradas.
          </div>
        )}

        {/*  Mini mapa  */}
        <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: colors.text.muted }}>
          Recorrido de la ruta
        </p>
        <div
          className="mb-5 overflow-hidden rounded-2xl"
          style={{ height: 220, border: `1px solid ${colors.brand.goldBorder}` }}
        >
          <MapContainer
            center={ruta.waypoints[0]}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LineaRuta waypoints={ruta.waypoints} color={ruta.color} />
          </MapContainer>
        </div>

        {/* Info rápida */}
        <div className="mb-5 flex gap-3">
          {[
            { label: 'Paradas', value: ruta.waypoints.length },
            { label: 'Camiones', value: ruta.camiones },
            { label: 'Capacidad', value: ruta.capacidad },
          ].map(item => (
            <div
              key={item.label}
              className="flex-1 rounded-xl py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${colors.brand.goldBorder}` }}
            >
              <p className="text-xs" style={{ color: colors.text.muted }}>{item.label}</p>
              <p className="text-lg font-bold" style={{ color: colors.text.primary }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl py-2.5 text-sm transition hover:bg-white/5"
            style={{ border: `1px solid ${colors.brand.goldBorder}`, color: colors.text.muted }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onGuardar(ruta.id, estado)
              onClose()
            }}
            className="flex-1 rounded-2xl py-2.5 text-sm font-semibold transition hover:brightness-110"
            style={{ background: colors.brand.gold, color: '#1A1200' }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

// Congestión
function Congestion() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: colors.brown.darker,
        border: `0.5px solid ${colors.brand.goldBorder}`,
      }}
    >
      <div className="mb-5 flex items-baseline justify-between">
        <h3
          className="text-sm font-medium"
          style={{ color: colors.text.primary }}
        >
          Congestión por hora
        </h3>

        <span
          className="text-xs"
          style={{ color: colors.text.muted }}
        >
          Tiempo real
        </span>
      </div>

      <div className="space-y-3">
        {congestionHoras.map((item) => {
          const c = nivelColor(item.nivel)

          return (
            <div key={item.hora}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span style={{ color: colors.text.primary }}>
                  {item.hora}
                </span>

                <span
                  style={{
                    color: c,
                    fontWeight: 600,
                  }}
                >
                  {item.nivel}%
                </span>
              </div>

              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: '#2B2118' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.nivel}%`,
                    background: c,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Uso semanal
function UsoSemanal() {
  const data = {
    labels: dias,

    datasets: [
      {
        data: usoDiario,

        backgroundColor: usoDiario.map((v) =>
          v === Math.max(...usoDiario)
            ? colors.brand.gold
            : 'rgba(201,168,76,0.25)'
        ),

        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: colors.brown.darker,
        border: `0.5px solid ${colors.brand.goldBorder}`,
      }}
    >
      <div className="mb-5 flex items-baseline justify-between">
        <h3
          className="text-sm font-medium"
          style={{ color: colors.text.primary }}
        >
          Uso semanal
        </h3>

        <span
          className="text-xs"
          style={{ color: colors.text.muted }}
        >
          Últimos 7 días
        </span>
      </div>

      <div style={{ height: 160 }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: { display: false },

              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.parsed.y}%`,
                },
              },
            },

            scales: {
              x: {
                grid: {
                  color: 'rgba(255,255,255,0.05)',
                },

                ticks: {
                  color: colors.text.muted,
                  font: { size: 11 },
                },
              },

              y: {
                min: 0,
                max: 100,

                grid: {
                  color: 'rgba(255,255,255,0.05)',
                },

                ticks: {
                  color: colors.text.muted,
                  font: { size: 11 },
                  callback: (v) => v + '%',
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}
// Modal Nueva Ruta

function ModalNuevaRuta({
  onClose,
  onGuardar,
}: {
  onClose: () => void
  onGuardar: (ruta: RutaData) => void
}) {
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState('#ef7300')
  const [camiones, setCamiones] = useState(2)
  const [capacidad, setCapacidad] = useState(40)
  const [estado, setEstado] = useState<'Activa' | 'Mantenimiento'>('Activa')

  // Waypoints: el usuario los escribe como "lat,lng" por línea
  const [waypointsRaw, setWaypointsRaw] = useState(
    '24.0277, -104.6532\n24.0300, -104.6600'
  )
  const [error, setError] = useState<string | null>(null)

  // Colores predefinidos para elegir rápido
  const coloresPredefinidos = [
    { label: 'Naranja', value: '#ef7300' },
    { label: 'Azul', value: '#00328f' },
    { label: 'Morado', value: '#ff01d0' },
    { label: 'Verde', value: '#065b00' },
    { label: 'Rojo', value: '#cc0000' },
    { label: 'Dorado', value: '#C9A84C' },
  ]

  function parsearWaypoints(): [number, number][] | null {
    try {
      const lineas = waypointsRaw
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)

      const puntos = lineas.map(linea => {
        const partes = linea.split(',').map(p => parseFloat(p.trim()))
        if (partes.length !== 2 || partes.some(isNaN)) throw new Error()
        return partes as [number, number]
      })

      if (puntos.length < 2) throw new Error('mínimo 2')
      return puntos
    } catch {
      return null
    }
  }

  function handleGuardar() {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    const waypoints = parsearWaypoints()
    if (!waypoints) {
      setError('Los puntos no tienen el formato correcto.\nUsa: latitud, longitud — uno por línea.')
      return
    }

    const nueva: RutaData = {
      id: Date.now(),   // ID temporal único
      nombre: nombre.trim(),
      color,
      estado,
      pasajeros: 0,
      camiones,
      capacidad,
      waypoints,
    }

    onGuardar(nueva)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl"
        style={{
          background: colors.brown.darker,
          border: `1px solid ${colors.brand.goldBorder}`,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-lg transition hover:opacity-60"
          style={{ color: colors.text.muted }}
        >✕</button>

        {/* Título */}
        <h2 className="mb-5 text-lg font-bold" style={{ color: colors.text.primary }}>
          + Nueva ruta
        </h2>

        {/*  Nombre  */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
            style={{ color: colors.text.muted }}>
            Nombre de la ruta
          </label>
          <input
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(null) }}
            placeholder="Ej. Ruta Centro"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: '#111109',
              border: `0.5px solid ${colors.brand.goldBorder}`,
              color: colors.text.primary,
            }}
          />
        </div>

        {/*  Color  */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
            style={{ color: colors.text.muted }}>
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {coloresPredefinidos.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className="rounded-lg px-3 py-1.5 text-[10px] font-semibold transition"
                style={{
                  background: `${c.value}22`,
                  border: `1.5px solid ${color === c.value ? c.value : 'transparent'}`,
                  color: c.value,
                }}
              >
                {c.label}
              </button>
            ))}
            {/* Input de color libre */}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              title="Color personalizado"
              className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
            />
          </div>
          {/* Preview */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="text-xs" style={{ color: colors.text.muted }}>{color}</span>
          </div>
        </div>

        {/*  Estado  */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
            style={{ color: colors.text.muted }}>
            Estado inicial
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['Activa', 'Mantenimiento'] as const).map(op => (
              <button
                key={op}
                onClick={() => setEstado(op)}
                className="rounded-xl py-2.5 text-sm transition"
                style={{
                  background: estado === op
                    ? op === 'Activa' ? 'rgba(111,207,151,0.15)' : 'rgba(201,168,76,0.12)'
                    : 'rgba(255,255,255,0.03)',
                  border: `0.5px solid ${estado === op
                    ? op === 'Activa' ? colors.green.primary : colors.brand.gold
                    : colors.brand.goldBorder}`,
                  color: estado === op
                    ? op === 'Activa' ? colors.green.primary : colors.brand.gold
                    : colors.text.muted,
                }}
              >
                {op === 'Activa' ? '🟢 Activa' : '🔧 Mantenimiento'}
              </button>
            ))}
          </div>
        </div>

        {/*  Camiones y Capacidad  */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
              style={{ color: colors.text.muted }}>
              Camiones
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCamiones(v => Math.max(1, v - 1))}
                className="rounded-lg px-2.5 py-1 text-sm font-bold transition hover:brightness-110"
                style={{ background: colors.brand.orange, color: '#111' }}
              >−</button>
              <span className="min-w-[24px] text-center text-sm font-semibold"
                style={{ color: colors.text.primary }}>
                {camiones}
              </span>
              <button
                onClick={() => setCamiones(v => v + 1)}
                className="rounded-lg px-2.5 py-1 text-sm font-bold transition hover:brightness-110"
                style={{ background: colors.green.primary, color: '#111' }}
              >+</button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
              style={{ color: colors.text.muted }}>
              Capacidad / camión
            </label>
            <input
              type="number"
              min={1}
              value={capacidad}
              onChange={e => setCapacidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                background: '#111109',
                border: `0.5px solid ${colors.brand.goldBorder}`,
                color: colors.text.primary,
              }}
            />
          </div>
        </div>

        {/*  Waypoints */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] uppercase tracking-widest"
            style={{ color: colors.text.muted }}>
            Puntos de ruta (lat, lng — uno por línea)
          </label>
          <textarea
            value={waypointsRaw}
            onChange={e => { setWaypointsRaw(e.target.value); setError(null) }}
            rows={5}
            placeholder={"24.0277, -104.6532\n24.0300, -104.6600\n24.0350, -104.6700"}
            className="w-full rounded-xl px-4 py-2.5 font-mono text-xs outline-none"
            style={{
              background: '#111109',
              border: `0.5px solid ${colors.brand.goldBorder}`,
              color: colors.text.primary,
              resize: 'vertical',
            }}
          />
          <p className="mt-1 text-[10px]" style={{ color: colors.text.muted }}>
            Mínimo 2 puntos. Puedes copiar coordenadas de Google Maps (clic derecho → copiar).
          </p>
        </div>

        {/* Preview capacidad total */}
        <div
          className="mb-5 rounded-xl px-4 py-2.5 text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${colors.brand.goldBorder}` }}
        >
          <span style={{ color: colors.text.muted }}>Capacidad total estimada: </span>
          <span style={{ color: colors.brand.gold, fontWeight: 600 }}>
            {camiones * capacidad} pasajeros
          </span>
          <span style={{ color: colors.text.muted }}> · {parsearWaypoints()?.length ?? 0} puntos cargados</span>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 whitespace-pre-line rounded-xl px-4 py-2.5 text-xs"
            style={{
              background: 'rgba(226,75,74,0.1)',
              border: '0.5px solid rgba(226,75,74,0.3)',
              color: '#f09595',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl py-2.5 text-sm transition hover:bg-white/5"
            style={{ border: `1px solid ${colors.brand.goldBorder}`, color: colors.text.muted }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex-1 rounded-2xl py-2.5 text-sm font-semibold transition hover:brightness-110"
            style={{ background: colors.brand.gold, color: '#1A1200' }}
          >
            Crear ruta
          </button>
        </div>
      </div>
    </div>
  )
}
// Tabla rutas

function TablaRutas({
  rutas,
  setRutas,
}: {
  rutas: RutaData[]
  setRutas: React.Dispatch<React.SetStateAction<RutaData[]>>
}) {
  const [rutaEditando, setRutaEditando] = useState<RutaData | null>(null)
  const [modalNueva, setModalNueva] = useState(false)

  function cambiarCamiones(id: number, cantidad: number) {
    setRutas(prev => prev.map(r =>
      r.id !== id ? r : { ...r, camiones: Math.max(0, r.camiones + cantidad) }
    ))
  }

  function guardarEstado(id: number, nuevoEstado: 'Activa' | 'Mantenimiento') {
    setRutas(prev => prev.map(r =>
      r.id !== id ? r : { ...r, estado: nuevoEstado }
    ))
  }

  // ✅ Definida aquí, la usaba ModalNuevaRuta pero no existía
  function agregarRuta(nueva: RutaData) {
    setRutas(prev => [...prev, nueva])
  }

  return (
    // ✅ Un solo Fragment, sin divs duplicados ni modales repetidos
    <>
      {rutaEditando && (
        <ModalEditar
          ruta={rutaEditando}
          onClose={() => setRutaEditando(null)}
          onGuardar={guardarEstado}
        />
      )}

      {modalNueva && (
        <ModalNuevaRuta
          onClose={() => setModalNueva(false)}
          onGuardar={agregarRuta}
        />
      )}

      <div
        className="rounded-2xl p-5"
        style={{
          background: colors.brown.darker,
          border: `0.5px solid ${colors.brand.goldBorder}`,
        }}
      >
        {/* Cabecera */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium" style={{ color: colors.text.primary }}>
              Gestión de rutas
            </h3>
            <p className="mt-0.5 text-xs" style={{ color: colors.text.muted }}>
              {rutas.filter(r => r.estado === 'Activa').length} activas ·{' '}
              {rutas.filter(r => r.estado === 'Mantenimiento').length} en mantenimiento
            </p>
          </div>

          <button
            onClick={() => setModalNueva(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:brightness-110"
            style={{ background: colors.brand.gold, color: '#1A1200' }}
          >
            + Nueva ruta
          </button>
        </div>

        {/* Lista de rutas */}
        <div className="space-y-2">
          {rutas.map(ruta => {
            const activa = ruta.estado === 'Activa'
            return (
              <div
                key={ruta.id}
                className="flex flex-col justify-between gap-4 rounded-xl p-4 sm:flex-row sm:items-center"
                style={{
                  background: '#24180f',
                  border: `0.5px solid ${activa ? colors.brand.goldBorder : 'rgba(201,168,76,0.3)'}`,
                  opacity: activa ? 1 : 0.8,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{
                      background: activa ? ruta.color : '#888',
                      boxShadow: activa ? `0 0 8px ${ruta.color}88` : 'none',
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                      {ruta.nombre}
                      {!activa && (
                        <span
                          className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold"
                          style={{ background: 'rgba(201,168,76,0.15)', color: colors.brand.gold }}
                        >
                          🔧 Mantenimiento
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: colors.text.muted }}>
                      {ruta.pasajeros.toLocaleString()} · {ruta.camiones} camiones · {ruta.waypoints.length} paradas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className="rounded-md px-2 py-1 text-[10px]"
                        style={{ background: `${ruta.color}22`, color: ruta.color }}
                      >
                        Capacidad: {ruta.capacidad}
                      </span>
                      <span
                        className="rounded-md px-2 py-1 text-[10px]"
                        style={{ background: 'rgba(255,255,255,0.06)', color: colors.text.muted }}
                      >
                        {ruta.camiones * ruta.capacidad} pasajeros máx
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {/* Control camiones */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => cambiarCamiones(ruta.id, 1)}
                      className="rounded-md px-2 py-1 text-xs font-bold transition hover:brightness-110"
                      style={{ background: colors.green.primary, color: '#111' }}
                    >+</button>
                    <span className="min-w-[20px] text-center text-xs" style={{ color: colors.text.primary }}>
                      {ruta.camiones}
                    </span>
                    <button
                      onClick={() => cambiarCamiones(ruta.id, -1)}
                      className="rounded-md px-2 py-1 text-xs font-bold transition hover:brightness-110"
                      style={{ background: colors.brand.orange, color: '#111' }}
                    >-</button>
                  </div>

                  <span
                    className="rounded-lg px-3 py-1 text-xs font-medium"
                    style={{
                      background: activa ? 'rgba(111,207,151,0.15)' : 'rgba(201,168,76,0.12)',
                      color: activa ? colors.green.primary : colors.brand.gold,
                    }}
                  >
                    {ruta.estado}
                  </span>

                  <button
                    onClick={() => setRutaEditando(ruta)}
                    className="rounded-lg border px-3 py-1.5 text-xs transition hover:bg-white/5"
                    style={{ borderColor: colors.brand.goldBorder, color: colors.text.primary }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
// Principal

function Empleado() {
  const { rutas, setRutas } = useRutas()
  const { user } = useAuth()          // ← usuario actual
  const navigate = useNavigate()

  // Cerrar sesión 
  async function handleSignOut() {
    await signOut(auth)
    navigate('/login')
  }

  const totalPasajeros = rutas.reduce((sum, r) => sum + r.pasajeros, 0)
  const rutasActivas = rutas.filter((r) => r.estado === 'Activa').length
  const totalCamiones = rutas.reduce((sum, r) => sum + r.camiones, 0)
  const capacidadTotal = rutas.reduce((sum, r) => sum + r.camiones * r.capacidad, 0)

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{ background: colors.background, fontFamily: "'DM Sans', sans-serif", color: colors.text.primary }}
    >
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div
              className="mb-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-widest"
              style={{ borderColor: colors.brand.goldBorder, color: colors.text.muted }}
            >
              ⬡ Q-Ruta
            </div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>
              Panel Administrativo
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.text.muted }}>
              Monitorea el uso del transporte y administra rutas en tiempo real.
            </p>
          </div>

          {/* ── Lado derecho ── */}
          <div className="flex flex-col items-end gap-2">
            {/* Email del usuario */}
            {user && (
              <span className="text-xs" style={{ color: colors.text.muted }}>
                {user.email}
              </span>
            )}

            <span className="text-xs" style={{ color: colors.text.muted }}>
              🟢 Actualizado hace 2 min
            </span>

            {/* Botón cerrar sesión */}
            <button
              onClick={handleSignOut}
              className="rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition hover:bg-white/5"
              style={{
                borderColor: colors.brand.goldBorder,
                color: colors.text.muted,
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Stats — sin cambios */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Pasajeros hoy" value={totalPasajeros.toLocaleString()} sub={`en ${rutas.length} rutas`} />
          <StatCard label="Rutas activas" value={String(rutasActivas)} sub={`${rutas.length - rutasActivas} en mantenimiento`} />
          <StatCard label="Camiones activos" value={String(totalCamiones)} sub="en circulación" />
          <StatCard label="Capacidad total" value={String(capacidadTotal)} sub="pasajeros simultáneos" />
          <StatCard label="Congestión" value="Alta" sub="Hora pico: 2 PM" accent />
        </div>

        {/* Gráficas — sin cambios */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Congestion />
          <UsoSemanal />
        </div>

        {/* Tabla — sin cambios */}
        <TablaRutas rutas={rutas} setRutas={setRutas} />
      </div>
    </main>
  )
}

export default Empleado