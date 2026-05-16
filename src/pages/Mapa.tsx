import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { useRutas } from "../hooks/useRutas";
import { colors } from "../utils/theme";

import RutaCamion from "../componentes/mapa/RutaCamion";
import ParadasRuta from "../componentes/mapa/ParadasRuta";
import UbicacionActual from "../componentes/mapa/UbicacionActual";
import { puntosTuristicos } from "../data/rutas";

const CENTER: [number, number] = [24.0277, -104.6532];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Mapa() {
  const navigate = useNavigate();
  const { rutas } = useRutas();
  const [rutaActiva, setRutaActiva] = useState<string | null>(null);
  const [hoveredRuta, setHoveredRuta] = useState<string | null>(null);

  const rutasFiltradas = rutas.filter(
    (r) => rutaActiva === null || r.nombre === rutaActiva,
  );

  const handleClickRuta = (nombre: string) =>
    setRutaActiva((prev) => (prev === nombre ? null : nombre));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: colors.background,
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Ambient blobs */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(192,78,46,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 90% 85%, rgba(61,115,85,0.10) 0%, transparent 60%)
          `,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "24px 28px 36px",
        }}
      >
        {/* ── NAV ── */}
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 14,
                background: colors.gradients.logo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 4px 16px ${colors.terra.glow}`,
              }}
            >
              🦂
            </motion.div>
            <span
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: colors.terra.DEFAULT,
              }}
            >
              Q-Ruta
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Back button */}
            <motion.button
              whileHover={{
                y: -1,
                borderColor: colors.terra.DEFAULT,
                color: colors.terra.DEFAULT,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: `1.5px solid ${colors.border}`,
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                color: colors.text.secondary,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all .15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Inicio
            </motion.button>

            {/* Active route badge */}
            <AnimatePresence>
              {rutaActiva && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  style={{
                    background: colors.terra.soft,
                    border: `1px solid ${colors.terra.light}`,
                    borderRadius: 999,
                    padding: "7px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: colors.terra.DEFAULT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: colors.terra.DEFAULT,
                    }}
                  />
                  {rutaActiva}
                  <span
                    style={{ cursor: "pointer", opacity: 0.5, marginLeft: 2 }}
                    onClick={() => setRutaActiva(null)}
                  >
                    ✕
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>

        {/* ── HEADER ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ marginBottom: 28 }}
        >
          <motion.div
            variants={fadeUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: colors.terra.soft,
              border: `1px solid ${colors.terra.light}`,
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: colors.terra.DEFAULT,
              marginBottom: 16,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: colors.terra.DEFAULT,
                display: "inline-block",
              }}
            />
            Sistema de Transporte · Durango
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px, 4.5vw, 48px)",
              fontWeight: 700,
              color: colors.text.primary,
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            Rutas urbanas{" "}
            <em style={{ color: colors.terra.DEFAULT }}>en tiempo real.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 14,
              color: colors.text.muted,
              fontWeight: 300,
              maxWidth: 520,
            }}
          >
            Consulta rutas disponibles, sigue recorridos y encuentra las paradas
            más cercanas a ti.
          </motion.p>
        </motion.div>

        {/* ── MAIN LAYOUT ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* ── SIDEBAR: Filtros + leyenda ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {/* Filtros */}
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  color: colors.text.muted,
                  marginBottom: 14,
                }}
              >
                Filtrar ruta
              </p>

              {/* Todas */}
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRutaActiva(null)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1.5px solid ${rutaActiva === null ? colors.terra.DEFAULT : colors.border}`,
                  background:
                    rutaActiva === null ? colors.terra.soft : "transparent",
                  color:
                    rutaActiva === null
                      ? colors.terra.DEFAULT
                      : colors.text.secondary,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 16 }}>🗺️</span> Todas las rutas
              </motion.button>

              {/* Por ruta */}
              {rutas.map((ruta) => {
                const activa = rutaActiva === ruta.nombre;
                const hovered = hoveredRuta === ruta.nombre;
                return (
                  <motion.button
                    key={ruta.nombre}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleClickRuta(ruta.nombre)}
                    onHoverStart={() => setHoveredRuta(ruta.nombre)}
                    onHoverEnd={() => setHoveredRuta(null)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: `1.5px solid ${activa ? ruta.color : hovered ? ruta.color + "60" : colors.border}`,
                      background: activa ? ruta.color + "18" : "transparent",
                      color: activa ? ruta.color : colors.text.secondary,
                      fontSize: 13,
                      fontWeight: activa ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all .15s",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: ruta.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{ruta.nombre}</span>
                    {ruta.camiones && (
                      <span
                        style={{
                          fontSize: 10,
                          color: colors.text.muted,
                          background: colors.surfaceAlt,
                          borderRadius: 999,
                          padding: "2px 7px",
                        }}
                      >
                        {ruta.camiones} 🚌
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Info card */}
            <div
              style={{
                background: colors.pine.soft,
                border: `1px solid ${colors.pine.border}`,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 10 }}>📡</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.pine.DEFAULT,
                  marginBottom: 6,
                }}
              >
                GPS en tiempo real
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.text.muted,
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                Los camiones activos aparecen en el mapa. Toca una parada para
                ver el tiempo de llegada.
              </div>
            </div>

            {/* Legend */}
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  color: colors.text.muted,
                  marginBottom: 14,
                }}
              >
                Leyenda
              </p>
              {[
                { icon: "🔵", label: "Parada regular" },
                { icon: "📍", label: "Mi ubicación" },
                { icon: "🚌", label: "Camión activo" },
                { icon: "⭐", label: "Punto turístico" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                    fontSize: 13,
                    color: colors.text.secondary,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{l.icon}</span>
                  {l.label}
                </div>
              ))}
            </div>
          </motion.aside>

          {/* ── MAP ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              borderRadius: 24,
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              boxShadow: `0 20px 60px -20px rgba(44,26,14,0.15)`,
            }}
          >
            {/* Map top bar */}
            <div
              style={{
                background: colors.surface,
                borderBottom: `1px solid ${colors.border}`,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: colors.pine.DEFAULT,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: colors.text.secondary,
                  }}
                >
                  {rutaActiva
                    ? `Mostrando: ${rutaActiva}`
                    : `${rutas.length} rutas activas`}
                </span>
              </div>
              <span style={{ fontSize: 11, color: colors.text.muted }}>
                Victoria de Durango
              </span>
            </div>

            <MapContainer
              center={CENTER}
              zoom={13}
              scrollWheelZoom
              style={{ height: "70vh", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {rutasFiltradas.map((ruta) => (
                <RutaCamion
                  key={ruta.nombre}
                  waypoints={ruta.waypoints}
                  color={ruta.color}
                />
              ))}
              {rutasFiltradas.map((ruta) => (
                <ParadasRuta
                  key={`paradas-${ruta.nombre}`}
                  waypoints={ruta.waypoints}
                  color={ruta.color}
                  nombre={ruta.nombre}
                  numCamiones={ruta.camiones}
                  estado={ruta.estado}
                />
              ))}
              {puntosTuristicos.map((punto) => (
                <Marker key={punto.id} position={punto.coordenadas}>
                  <Popup>
                    <div>
                      <h3>{punto.nombre}</h3>
                      <p>{punto.descripcion}</p>
                      <small>{punto.categoria}</small>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <UbicacionActual />
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Mapa;
