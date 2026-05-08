import { colors } from '../utils/theme'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

import { rutas } from '../data/rutas'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

// ─── Datos ───────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nivelColor(n: number) {
  if (n >= 85) return colors.brand.gold
  if (n >= 60) return colors.brand.orange
  return colors.green.primary
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent = false,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: colors.brown.darker, border: `0.5px solid ${colors.brand.goldBorder}` }}
    >
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.text.muted }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold leading-none"
        style={{ color: accent ? colors.brand.gold : colors.text.primary }}
      >
        {value}
      </p>
      <p className="text-xs mt-2" style={{ color: colors.text.muted }}>{sub}</p>
    </div>
  )
}

function Congestion() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: colors.brown.darker, border: `0.5px solid ${colors.brand.goldBorder}` }}
    >
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-sm font-medium" style={{ color: colors.text.primary }}>
          Congestión por hora
        </h3>
        <span className="text-xs" style={{ color: colors.text.muted }}>Tiempo real</span>
      </div>

      <div className="space-y-3">
        {congestionHoras.map((item) => {
          const c = nivelColor(item.nivel)
          return (
            <div key={item.hora}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: colors.text.primary }}>{item.hora}</span>
                <span style={{ color: c, fontWeight: 600 }}>{item.nivel}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#2B2118' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.nivel}%`, background: c }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UsoSemanal() {
  const data = {
    labels: dias,
    datasets: [{
      data: usoDiario,
      // Resalta el máximo (sábado)
      backgroundColor: usoDiario.map((v, i) =>
        v === Math.max(...usoDiario) ? colors.brand.gold : 'rgba(201,168,76,0.25)'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: colors.brown.darker, border: `0.5px solid ${colors.brand.goldBorder}` }}
    >
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="text-sm font-medium" style={{ color: colors.text.primary }}>
          Uso semanal
        </h3>
        <span className="text-xs" style={{ color: colors.text.muted }}>Últimos 7 días</span>
      </div>

      <div style={{ height: 160 }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}%` } },
            },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: colors.text.muted, font: { size: 11 } },
              },
              y: {
                min: 0, max: 100,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: colors.text.muted, font: { size: 11 }, callback: v => v + '%' },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

function TablaRutas() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: colors.brown.darker, border: `0.5px solid ${colors.brand.goldBorder}` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-medium" style={{ color: colors.text.primary }}>
            Gestión de rutas
          </h3>
          <p className="text-xs mt-0.5" style={{ color: colors.text.muted }}>
            {rutas.filter(r => r.estado === 'Activa').length} activas ·{' '}
            {rutas.filter(r => r.estado === 'Mantenimiento').length} en mantenimiento
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:brightness-110"
          style={{ background: colors.brand.gold, color: '#1A1200' }}
        >
          + Nueva ruta
        </button>
      </div>

      <div className="space-y-2">
        {rutas.map((ruta) => {  // ← ahora usa los datos reales con waypoints incluidos
          const activa = ruta.estado === 'Activa'
          return (
            <div
              key={ruta.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-4"
              style={{
                background: '#24180f',
                border: `0.5px solid ${colors.brand.goldBorder}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ background: ruta.color, boxShadow: `0 0 8px ${ruta.color}88` }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                    {ruta.nombre}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.text.muted }}>
                    {ruta.pasajeros.toLocaleString()} pasajeros hoy
                    {' · '}
                    {ruta.waypoints.length} paradas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
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
                  className="rounded-lg border px-3 py-1.5 text-xs transition hover:bg-white/5"
                  style={{ borderColor: colors.brand.goldBorder, color: colors.text.primary }}
                >
                  Editar
                </button>
                <button
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition hover:brightness-110"
                  style={{ background: colors.brand.orange, color: colors.text.primary }}
                >
                  Ver ruta →
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

function Empleado() {
  const totalPasajeros = rutas.reduce((sum, r) => sum + r.pasajeros, 0)
  const rutasActivas = rutas.filter(r => r.estado === 'Activa').length

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{ background: colors.background, fontFamily: "'DM Sans', sans-serif", color: colors.text.primary }}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div
              className="mb-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-widest"
              style={{ borderColor: colors.brand.goldBorder, color: colors.text.muted }}
            >
              ⬡ Durango Transit
            </div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>
              Panel Administrativo
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
              Monitorea el uso del transporte y administra rutas en tiempo real.
            </p>
          </div>
          <span className="text-xs" style={{ color: colors.text.muted }}>🟢 Actualizado hace 2 min</span>
        </div>

        {/* Stats calculadas desde rutas reales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Pasajeros hoy"
            value={totalPasajeros.toLocaleString()}  // ← suma real: 795
            sub={`en ${rutas.length} rutas`}
          />
          <StatCard
            label="Rutas activas"
            value={String(rutasActivas)}              // ← conteo real: 3
            sub={`${rutas.length - rutasActivas} en mantenimiento`}
          />
          <StatCard label="Congestión actual" value="Alta" sub="Hora pico: 6 PM" accent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Congestion />
          <UsoSemanal />
        </div>

        <TablaRutas />
      </div>
    </main>
  )
}

export default Empleado