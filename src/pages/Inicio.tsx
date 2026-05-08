import { useNavigate } from 'react-router-dom';

function Inicio() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-[#F0E8D0]"
      style={{
        background: '#4a4e59',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Fondo ambiental */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(30,58,47,0.25) 0%, transparent 60%)
          `,
        }}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">

        {/* NAV */}
        <nav className="mb-14 flex items-center justify-between border-b pb-5"
          style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
              style={{ background: 'linear-gradient(135deg, #4cc98f, #305e7a)' }}
            >
              🦂
            </div>
            <span
              className="text-lg tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif", color: '#c86a4c' }}
            >
              Durango Transit
            </span>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-[#8A8272] sm:block">
            Sistema de Transporte Urbano
          </span>
        </nav>

        {/* HERO */}
        <header className="mb-14 text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em]"
            style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#c86a4c', background: 'rgba(201,168,76,0.07)' }}
          >
            ⬡ Estado de Durango · México
          </div>
          <h1
            className="mb-3 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Tu camión,{ ' ' }
            <em style={{ color: '#c86a4c' }}>en un toque.</em>
          </h1>
          {/* Línea dorada decorativa */}
          <div className="mx-auto my-5 h-0.5 w-12"
            style={{ background: 'linear-gradient(90deg, #c86a4c, transparent)' }} />
          <p className="mx-auto max-w-md text-base leading-relaxed font-light text-[#ada79c]">
            Consulta rutas en tiempo real y paga tu pasaje sin efectivo.
            Moverse por Durango nunca fue tan sencillo.
          </p>
        </header>

        {/* CARDS PRINCIPALES */}
        <section className="mb-4 grid gap-4 sm:grid-cols-2">
          {/* Rutas */}
          <div
            className="group relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(145deg, #1E3A2F 0%, #0E2219 100%)',
              borderColor: 'rgba(42,92,69,0.6)',
              boxShadow: '0 20px 60px -20px rgba(30,58,47,0.5)',
            }}
            onClick={() => navigate('/mapa')}
          >
            <span className="pointer-events-none absolute bottom-3 right-5 text-[5rem] opacity-10">🗺️</span>
            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#6FCF97]">
              Transporte urbano
            </p>
            <h2
              className="mb-3 text-3xl font-bold leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ver rutas de camión
            </h2>
            <p className="mb-7 text-sm font-light leading-relaxed text-[#F0E8D0]/50">
              Localiza tu ruta, sigue el recorrido en el mapa y sabe exactamente
              dónde estás y a dónde vas.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition"
              style={{
                background: '#2e5c317d',
                borderColor: 'rgba(111,207,151,0.3)',
                color: '#6FCF97',
              }}
            >
              🗺️ Abrir mapa →
            </button>
          </div>

          {/* Pagar */}
          <div
            className="group relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(145deg, #2A1F00 0%, #1A1200 100%)',
              borderColor: 'rgba(201,168,76,0.3)',
              boxShadow: '0 20px 60px -20px rgba(201,168,76,0.15)',
            }}
            onClick={() => navigate('/pagar')}
          >
            <span className="pointer-events-none absolute bottom-3 right-5 text-[5rem] opacity-10">💳</span>
            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
              Pago sin efectivo
            </p>
            <h2
              className="mb-3 text-3xl font-bold leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pagar con código QR
            </h2>
            <p className="mb-7 text-sm font-light leading-relaxed text-[#F0E8D0]/50">
              Genera tu código de pago al instante y aborda sin necesidad de
              llevar monedas ni cambio exacto.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
              style={{ background: '#c86b4ca0', color: '#0E0E0A' }}
            >
              💳 Pagar ahora
            </button>
          </div>
        </section>

        {/* CARDS SECUNDARIAS */}
        <section className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: '📍', title: 'Mi ubicación', desc: 'El mapa detecta tu posición y te muestra las rutas más cercanas disponibles.' },
            { icon: '🕐', title: 'Horarios', desc: 'Consulta frecuencias y horarios estimados de cada ruta durante el día.' },
            { icon: '🎫', title: 'Historial de pagos', desc: 'Revisa tus últimos viajes y el monto gastado en transporte este mes.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border p-6 transition-colors"
              style={{
                background: '#1A1A12',
                borderColor: 'rgba(201,168,76,0.1)',
              }}
            >
              <span className="mb-3 block text-2xl">{item.icon}</span>
              <h3 className="mb-2 text-sm font-semibold text-[#F0E8D0]">{item.title}</h3>
              <p className="text-xs font-light leading-relaxed text-[#8A8272]">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* BANNER INFERIOR */}
        <section
          className="flex flex-col items-start justify-between gap-5 rounded-3xl border p-8 sm:flex-row sm:items-center"
          style={{
            background: 'linear-gradient(100deg, rgba(201,168,76,0.08) 0%, rgba(30,58,47,0.12) 100%)',
            borderColor: 'rgba(201,168,76,0.18)',
          }}
        >
          <div>
            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#c86a4c]">
              ¿Listo para moverte?
            </p>
            <p className="max-w-md text-sm leading-relaxed text-[#F0E8D0]/75">
              Elige ver las rutas disponibles en el mapa o paga tu camión de forma rápida y segura.
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <button
              onClick={() => navigate('/mapa')}
              className="rounded-full border px-5 py-2.5 text-sm font-semibold transition"
              style={{ borderColor: '#c86a4c', color: '#c86a4c', background: 'transparent' }}
            >
              Ver mapa
            </button>
            <button
              onClick={() => navigate('/pagar')}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
              style={{ background: '#c86a4c', color: '#0E0E0A', border: '1px solid #c86a4c' }}
            >
              💳 Pagar
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Inicio;