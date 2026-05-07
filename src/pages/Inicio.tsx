import { useNavigate } from 'react-router-dom';

// Componente del contenido principal
function Inicio() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col px-6 py-10 sm:px-10">
        
        {/* Header con botones superiores */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/mapa')}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              🗺️ Ver Mapa
            </button>
            <button
              onClick={() => navigate('/pagar')}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-500"
            >
              💳 Pagar camión
            </button>
          </div>
          <div className="text-right text-sm text-slate-400">
            Transporte oficial de turistas
          </div>
        </div>

        <header className="mb-12 flex flex-col items-center text-center gap-6">
          <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Durango
          </span>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Turismo en Durango y transporte en camión para tu próxima aventura
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Descubre los principales puntos turísticos del estado y encuentra la mejor ruta en autobús para llegar fácil y seguro a cada destino.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.7)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Viaja en autobús por Durango</p>
                  <h2 className="text-2xl font-semibold text-white">Rutas seguras para turistas en camión</h2>
                </div>
                <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300">
                  Opciones para viajeros
                </span>
              </div>
              <p className="mt-4 text-slate-300">
                Conoce terminales, horarios y conexiones entre Durango capital y los principales atractivos turísticos. Ideal para planificar tu viaje en camión sin complicaciones.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 text-left shadow-lg shadow-black/20">
                <h3 className="text-xl font-semibold text-white">Buscar ruta de camión</h3>
                <p className="mt-3 text-slate-400">Encuentra rutas directas y conectadas entre la CD Durango, Gómez Palacio, el Valle del Guadiana y los principales pueblos mágicos.</p>
                <button 
                  onClick={() => navigate('/mapa')}
                  className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Ver mapa →
                </button>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 text-left shadow-lg shadow-black/20">
                <h3 className="text-xl font-semibold text-white">Puntos turísticos</h3>
                <p className="mt-3 text-slate-400">Explora iconos como la Catedral, el Museo de Arqueología, el Parque Guadiana y los paisajes del Cañón del Sombrerete.</p>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 text-left shadow-lg shadow-black/20">
                <h3 className="text-xl font-semibold text-white">Conexiones fáciles</h3>
                <p className="mt-3 text-slate-400">Descubre cómo combinar transporte en camión con recorridos guiados para aprovechar cada parada del viaje.</p>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 text-left shadow-lg shadow-black/20">
                <h3 className="text-xl font-semibold text-white">Consejos para viajeros</h3>
                <p className="mt-3 text-slate-400">Asegura tu traslado con anticipación, revisa horarios de salidas y lleva efectivo para terminales locales y paradas rurales.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-slate-200 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.8)] sm:flex-row sm:items-center sm:justify-between backdrop-blur-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Elige tu siguiente parada</p>
            <p className="mt-3 text-lg font-medium text-white">Selecciona si quieres buscar una ruta de autobús o explorar los lugares turísticos más destacados.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/mapa')}
              className="inline-flex justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Encontrar ruta de camión
            </button>
            <button
              onClick={() => navigate('/pagar')}
              className="inline-flex justify-center rounded-full border border-emerald-500/50 bg-transparent px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Pagar camión con QR
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Inicio;