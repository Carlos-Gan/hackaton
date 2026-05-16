import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { MapContainer, useMap, TileLayer } from "react-leaflet";
import L from "leaflet";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { useRutas } from "../hooks/useRutas";
import { type RutaData } from "../data/rutas";
import { colors } from "../utils/theme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/* ─── Tokens locales del dashboard (light) ───────── */
const C = {
  bg: colors.background, // #FBF4E8
  surface: colors.surface, // #FFFDF6
  surfaceAlt: colors.surfaceAlt, // #F5EDD8
  border: colors.border, // #E8D8BB
  borderSoft: colors.borderSoft,
  terra: colors.terra.DEFAULT, // #C04E2E
  terraGlow: colors.terra.glow,
  terraL: colors.terra.light,
  terraSoft: colors.terra.soft,
  gold: colors.gold.DEFAULT, // #C97C12
  goldSoft: colors.gold.soft,
  pine: colors.pine.DEFAULT, // #3D7355
  pineSoft: colors.pine.soft,
  sky: colors.sky.DEFAULT, // #3D82A8
  skySoft: colors.sky.soft,
  text: colors.text.primary, // #2C1A0E
  textMid: colors.text.secondary, // #7A5840
  textMuted: colors.text.muted, // #BFA080
};

/* ─── Motion variants ────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* ─── Demo data ──────────────────────────────────── */
const CONGESTION_HORAS = [
  { hora: "6 AM", nivel: 40 },
  { hora: "8 AM", nivel: 95 },
  { hora: "10 AM", nivel: 55 },
  { hora: "1 PM", nivel: 70 },
  { hora: "6 PM", nivel: 100 },
  { hora: "9 PM", nivel: 35 },
];
const USO_DIARIO = [45, 60, 75, 90, 70, 95, 80];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

/* ─── Helpers ────────────────────────────────────── */
function nivelColor(n: number) {
  if (n >= 85) return C.terra;
  if (n >= 60) return C.gold;
  return C.pine;
}

function nivelBg(n: number) {
  if (n >= 85) return C.terraSoft;
  if (n >= 60) return C.goldSoft;
  return C.pineSoft;
}

/* ─── StatCard ───────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "terra",
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
  accent?: "terra" | "gold" | "pine" | "sky";
}) {
  const accentMap = {
    terra: { color: C.terra, soft: C.terraSoft, border: C.terraL },
    gold: { color: C.gold, soft: C.goldSoft, border: colors.gold.border },
    pine: { color: C.pine, soft: C.pineSoft, border: colors.pine.border },
    sky: { color: C.sky, soft: C.skySoft, border: colors.sky.border },
  };
  const a = accentMap[accent];

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(44,26,14,0.10)" }}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: "20px 18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top bar accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: a.color,
          borderRadius: "20px 20px 0 0",
        }}
      />
      {/* Icon badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          background: a.soft,
          border: `1px solid ${a.border}`,
          fontSize: 18,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: C.textMuted,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: C.textMuted, fontWeight: 300 }}>{sub}</p>
    </motion.div>
  );
}

/* ─── LineaRuta (Leaflet) ────────────────────────── */
function LineaRuta({
  waypoints,
  color,
}: {
  waypoints: [number, number][];
  color: string;
}) {
  const map = useMap();
  const lineRef = useRef<L.Polyline | null>(null);
  useEffect(() => {
    lineRef.current?.remove();
    const linea = L.polyline(waypoints, {
      color,
      weight: 5,
      opacity: 0.9,
    }).addTo(map);
    map.fitBounds(linea.getBounds(), { padding: [20, 20] });
    lineRef.current = linea;
    return () => {
      linea.remove();
    };
  }, [map, waypoints, color]);
  return null;
}

/* ─── ModalEditar ────────────────────────────────── */
function ModalEditar({
  ruta,
  onClose,
  onGuardar,
}: {
  ruta: RutaData;
  onClose: () => void;
  onGuardar: (id: number, nuevoEstado: "Activa" | "Mantenimiento") => void;
}) {
  const [estado, setEstado] = useState<"Activa" | "Mantenimiento">(ruta.estado);
  const cambio = estado !== ruta.estado;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(44,26,14,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 32px 80px rgba(44,26,14,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            fontSize: 18,
            color: C.textMuted,
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: ruta.color,
              boxShadow: `0 0 8px ${ruta.color}`,
              flexShrink: 0,
            }}
          />
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
            }}
          >
            Editar · {ruta.nombre}
          </h2>
        </div>

        {/* Estado toggle */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".25em",
            textTransform: "uppercase",
            color: C.textMuted,
            marginBottom: 10,
          }}
        >
          Estado de la ruta
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {(["Activa", "Mantenimiento"] as const).map((op) => {
            const sel = estado === op;
            const isActive = op === "Activa";
            return (
              <motion.button
                key={op}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEstado(op)}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: sel
                    ? isActive
                      ? C.pineSoft
                      : C.goldSoft
                    : C.surfaceAlt,
                  border: `1.5px solid ${sel ? (isActive ? C.pine : C.gold) : C.border}`,
                  color: sel ? (isActive ? C.pine : C.gold) : C.textMid,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all .15s",
                }}
              >
                {isActive ? "🟢 Activa" : "🔧 Mantenimiento"}
              </motion.button>
            );
          })}
        </div>

        {/* Warning */}
        <AnimatePresence>
          {cambio && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: C.goldSoft,
                border: `1px solid ${colors.gold.border}`,
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 12,
                color: C.gold,
                marginBottom: 16,
              }}
            >
              ⚠️ Cambiarás <strong>{ruta.nombre}</strong> a{" "}
              <strong>{estado}</strong>. Esto afecta el mapa y las paradas.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini map */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".25em",
            textTransform: "uppercase",
            color: C.textMuted,
            marginBottom: 10,
          }}
        >
          Recorrido de la ruta
        </p>
        <div
          style={{
            height: 200,
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            marginBottom: 18,
          }}
        >
          <MapContainer
            center={ruta.waypoints[0]}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LineaRuta waypoints={ruta.waypoints} color={ruta.color} />
          </MapContainer>
        </div>

        {/* Quick info */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {[
            { label: "Paradas", value: ruta.waypoints.length },
            { label: "Camiones", value: ruta.camiones },
            { label: "Capacidad", value: ruta.capacidad },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.text,
                  marginTop: 2,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              color: C.textMid,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ y: -1, boxShadow: `0 8px 24px ${C.terraGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onGuardar(ruta.id, estado);
              onClose();
            }}
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: C.terra,
              border: "none",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 16px ${C.terraGlow}`,
            }}
          >
            Guardar cambios
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── ModalNuevaRuta ─────────────────────────────── */
function ModalNuevaRuta({
  onClose,
  onGuardar,
}: {
  onClose: () => void;
  onGuardar: (r: RutaData) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#C04E2E");
  const [camiones, setCamiones] = useState(2);
  const [capacidad, setCapacidad] = useState(40);
  const [estado, setEstado] = useState<"Activa" | "Mantenimiento">("Activa");
  const [waypointsRaw, setWaypointsRaw] = useState(
    "24.0277, -104.6532\n24.0300, -104.6600",
  );
  const [error, setError] = useState<string | null>(null);

  const COLORES = [
    { label: "Terracota", value: "#C04E2E" },
    { label: "Dorado", value: "#C97C12" },
    { label: "Pino", value: "#3D7355" },
    { label: "Cielo", value: "#3D82A8" },
    { label: "Rojo", value: "#B83232" },
    { label: "Morado", value: "#7B4FA6" },
  ];

  function parsearWaypoints(): [number, number][] | null {
    try {
      const puntos = waypointsRaw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((linea) => {
          const p = linea.split(",").map((x) => parseFloat(x.trim()));
          if (p.length !== 2 || p.some(isNaN)) throw new Error();
          return p as [number, number];
        });
      if (puntos.length < 2) throw new Error();
      return puntos;
    } catch {
      return null;
    }
  }

  function handleGuardar() {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    const waypoints = parsearWaypoints();
    if (!waypoints) {
      setError("Formato incorrecto. Usa: latitud, longitud — uno por línea.");
      return;
    }
    onGuardar({
      id: Date.now(),
      nombre: nombre.trim(),
      color,
      estado,
      pasajeros: 0,
      camiones,
      capacidad,
      waypoints,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(44,26,14,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 32px 80px rgba(44,26,14,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            fontSize: 18,
            color: C.textMuted,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 700,
            color: C.text,
            marginBottom: 22,
          }}
        >
          + Nueva ruta
        </h2>

        {/* Nombre */}
        <FieldLabel>Nombre de la ruta</FieldLabel>
        <input
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setError(null);
          }}
          placeholder="Ej. Ruta Centro"
          style={{
            width: "100%",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 13,
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            color: C.text,
            outline: "none",
            marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
          }}
        />

        {/* Color */}
        <FieldLabel>Color</FieldLabel>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 10,
          }}
        >
          {COLORES.map((c) => (
            <motion.button
              key={c.value}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setColor(c.value)}
              style={{
                borderRadius: 10,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                background: `${c.value}18`,
                border: `1.5px solid ${color === c.value ? c.value : "transparent"}`,
                color: c.value,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {c.label}
            </motion.button>
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Color personalizado"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "transparent",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
          <span style={{ fontSize: 11, color: C.textMuted }}>{color}</span>
        </div>

        {/* Estado */}
        <FieldLabel>Estado inicial</FieldLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 18,
          }}
        >
          {(["Activa", "Mantenimiento"] as const).map((op) => {
            const sel = estado === op;
            return (
              <motion.button
                key={op}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEstado(op)}
                style={{
                  borderRadius: 12,
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: sel
                    ? op === "Activa"
                      ? C.pineSoft
                      : C.goldSoft
                    : C.surfaceAlt,
                  border: `1.5px solid ${sel ? (op === "Activa" ? C.pine : C.gold) : C.border}`,
                  color: sel ? (op === "Activa" ? C.pine : C.gold) : C.textMid,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all .15s",
                }}
              >
                {op === "Activa" ? "🟢 Activa" : "🔧 Mantenimiento"}
              </motion.button>
            );
          })}
        </div>

        {/* Camiones + Capacidad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div>
            <FieldLabel>Camiones</FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCamiones((v) => Math.max(1, v - 1))}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: C.terraSoft,
                  border: `1px solid ${C.terraL}`,
                  color: C.terra,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </motion.button>
              <span
                style={{
                  minWidth: 24,
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {camiones}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCamiones((v) => v + 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: C.pineSoft,
                  border: `1px solid ${colors.pine.border}`,
                  color: C.pine,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </motion.button>
            </div>
          </div>
          <div>
            <FieldLabel>Capacidad / camión</FieldLabel>
            <input
              type="number"
              min={1}
              value={capacidad}
              onChange={(e) =>
                setCapacidad(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{
                width: "100%",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 13,
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                color: C.text,
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Waypoints */}
        <FieldLabel>Puntos de ruta (lat, lng — uno por línea)</FieldLabel>
        <textarea
          value={waypointsRaw}
          onChange={(e) => {
            setWaypointsRaw(e.target.value);
            setError(null);
          }}
          rows={5}
          placeholder={"24.0277, -104.6532\n24.0300, -104.6600"}
          style={{
            width: "100%",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "monospace",
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            color: C.text,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            marginBottom: 6,
          }}
        />
        <p style={{ fontSize: 11, color: C.textMuted, marginBottom: 16 }}>
          Mínimo 2 puntos. Copia coordenadas desde Google Maps.
        </p>

        {/* Capacity preview */}
        <div
          style={{
            background: C.goldSoft,
            border: `1px solid ${colors.gold.border}`,
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          <span style={{ color: C.textMid }}>Capacidad total: </span>
          <span style={{ color: C.gold, fontWeight: 700 }}>
            {camiones * capacidad} pasajeros
          </span>
          <span style={{ color: C.textMuted }}>
            {" "}
            · {parsearWaypoints()?.length ?? 0} puntos
          </span>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "#FDF0EE",
                border: "1px solid rgba(192,78,46,0.3)",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 12,
                color: C.terra,
                marginBottom: 16,
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              color: C.textMid,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ y: -1, boxShadow: `0 8px 24px ${C.terraGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGuardar}
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: C.terra,
              border: "none",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 16px ${C.terraGlow}`,
            }}
          >
            Crear ruta
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── FieldLabel helper ──────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: ".22em",
        textTransform: "uppercase",
        color: C.textMuted,
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

/* ─── Congestion chart ───────────────────────────── */
function Congestion() {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
          Congestión por hora
        </h3>
        <span
          style={{
            fontSize: 11,
            color: C.textMuted,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.pine,
              display: "inline-block",
            }}
          />
          Tiempo real
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONGESTION_HORAS.map((item) => {
          const c = nivelColor(item.nivel);
          const bg = nivelBg(item.nivel);
          return (
            <div key={item.hora}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 12, color: C.textMid }}>
                  {item.hora}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: c,
                    background: bg,
                    borderRadius: 999,
                    padding: "1px 8px",
                  }}
                >
                  {item.nivel}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: C.surfaceAlt,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.nivel}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  style={{ height: "100%", borderRadius: 999, background: c }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Weekly usage chart ─────────────────────────── */
function UsoSemanal() {
  const maxVal = Math.max(...USO_DIARIO);
  const data = {
    labels: DIAS,
    datasets: [
      {
        data: USO_DIARIO,
        backgroundColor: USO_DIARIO.map((v) =>
          v === maxVal ? C.terra : `${C.terra}35`,
        ),
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
          Uso semanal
        </h3>
        <span style={{ fontSize: 11, color: C.textMuted }}>Últimos 7 días</span>
      </div>
      <div style={{ height: 160 }}>
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } },
            },
            scales: {
              x: {
                grid: { color: C.borderSoft },
                ticks: { color: C.textMuted, font: { size: 11 } },
              },
              y: {
                min: 0,
                max: 100,
                grid: { color: C.borderSoft },
                ticks: {
                  color: C.textMuted,
                  font: { size: 11 },
                  callback: (v) => v + "%",
                },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── TablaRutas ─────────────────────────────────── */
function TablaRutas({
  rutas,
  setRutas,
}: {
  rutas: RutaData[];
  setRutas: React.Dispatch<React.SetStateAction<RutaData[]>>;
}) {
  const [rutaEditando, setRutaEditando] = useState<RutaData | null>(null);
  const [modalNueva, setModalNueva] = useState(false);

  function cambiarCamiones(id: number, delta: number) {
    setRutas((prev) =>
      prev.map((r) =>
        r.id !== id ? r : { ...r, camiones: Math.max(0, r.camiones + delta) },
      ),
    );
  }
  function guardarEstado(id: number, nuevoEstado: "Activa" | "Mantenimiento") {
    setRutas((prev) =>
      prev.map((r) => (r.id !== id ? r : { ...r, estado: nuevoEstado })),
    );
  }
  function agregarRuta(nueva: RutaData) {
    setRutas((prev) => [...prev, nueva]);
  }

  return (
    <>
      <AnimatePresence>
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
      </AnimatePresence>

      <motion.div
        variants={fadeUp}
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 22,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: C.text,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Gestión de rutas
            </h3>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
              {rutas.filter((r) => r.estado === "Activa").length} activas ·{" "}
              {rutas.filter((r) => r.estado === "Mantenimiento").length} en
              mantenimiento
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2, boxShadow: `0 8px 22px ${C.terraGlow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalNueva(true)}
            style={{
              background: C.terra,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 14px ${C.terraGlow}`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            + Nueva ruta
          </motion.button>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rutas.map((ruta, i) => {
            const activa = ruta.estado === "Activa";
            return (
              <motion.div
                key={ruta.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.04,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -1,
                  boxShadow: "0 8px 24px rgba(44,26,14,0.07)",
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  background: activa ? C.surfaceAlt : `${C.goldSoft}80`,
                  border: `1px solid ${activa ? C.border : colors.gold.border}`,
                  borderRadius: 16,
                  padding: "14px 16px",
                  opacity: activa ? 1 : 0.85,
                }}
              >
                {/* Left info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: activa ? ruta.color : C.textMuted,
                      boxShadow: activa ? `0 0 8px ${ruta.color}88` : "none",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <p
                        style={{ fontSize: 14, fontWeight: 600, color: C.text }}
                      >
                        {ruta.nombre}
                      </p>
                      {!activa && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: C.goldSoft,
                            color: C.gold,
                            borderRadius: 999,
                            padding: "2px 8px",
                            border: `1px solid ${colors.gold.border}`,
                          }}
                        >
                          🔧 Mantenimiento
                        </span>
                      )}
                    </div>
                    <p
                      style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                    >
                      {ruta.pasajeros.toLocaleString()} pasajeros ·{" "}
                      {ruta.camiones} camiones · {ruta.waypoints.length} paradas
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          background: `${ruta.color}18`,
                          color: ruta.color,
                          borderRadius: 8,
                          padding: "3px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Cap. {ruta.capacidad}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          background: C.surfaceAlt,
                          color: C.textMuted,
                          borderRadius: 8,
                          padding: "3px 8px",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        Máx {ruta.camiones * ruta.capacidad} pasajeros
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  {/* Camiones counter */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: C.surfaceAlt,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "4px 8px",
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => cambiarCamiones(ruta.id, 1)}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: C.pineSoft,
                        border: `1px solid ${colors.pine.border}`,
                        color: C.pine,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </motion.button>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.text,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {ruta.camiones}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => cambiarCamiones(ruta.id, -1)}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: C.terraSoft,
                        border: `1px solid ${C.terraL}`,
                        color: C.terra,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </motion.button>
                  </div>

                  {/* Estado badge */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 10,
                      padding: "5px 12px",
                      background: activa ? C.pineSoft : C.goldSoft,
                      color: activa ? C.pine : C.gold,
                      border: `1px solid ${activa ? colors.pine.border : colors.gold.border}`,
                    }}
                  >
                    {ruta.estado}
                  </span>

                  {/* Edit button */}
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRutaEditando(ruta)}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      background: "transparent",
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      color: C.textMid,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all .15s",
                    }}
                  >
                    Editar
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main dashboard ─────────────────────────────── */
function Empleado() {
  const { rutas, setRutas } = useRutas();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut(auth);
    navigate("/login");
  }

  const totalPasajeros = rutas.reduce((s, r) => s + r.pasajeros, 0);
  const rutasActivas = rutas.filter((r) => r.estado === "Activa").length;
  const totalCamiones = rutas.reduce((s, r) => s + r.camiones, 0);
  const capacidadTotal = rutas.reduce(
    (s, r) => s + r.camiones * r.capacidad,
    0,
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: C.text,
      }}
    >
      {/* Ambient blobs */}
      {[
        { top: -80, right: -60, w: 360, h: 280, color: "rgba(192,78,46,0.08)" },
        {
          bottom: -60,
          left: -80,
          w: 300,
          h: 300,
          color: "rgba(201,124,18,0.07)",
        },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 16, 0], y: [0, 10, 0] }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            borderRadius: "50%",
            filter: "blur(55px)",
            pointerEvents: "none",
            zIndex: 0,
            width: b.w,
            height: b.h,
            background: b.color,
            top: b.top,
            right: b.right,
            bottom: b.bottom,
            left: b.left,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 28px 48px",
        }}
      >
        {/* ── NAV / HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: 20,
            marginBottom: 32,
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.terraSoft,
                border: `1px solid ${C.terraL}`,
                borderRadius: 999,
                padding: "4px 14px",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: C.terra,
                marginBottom: 12,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.terra,
                  display: "inline-block",
                }}
              />
              Q-Ruta · Panel Administrativo
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.15,
              }}
            >
              Dashboard de Transporte
            </h1>
            <p
              style={{
                fontSize: 13,
                color: C.textMuted,
                marginTop: 6,
                fontWeight: 300,
              }}
            >
              Monitorea el uso del transporte y administra rutas en tiempo real.
            </p>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {user && (
              <span
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {user.email}
              </span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.pine,
                  display: "inline-block",
                }}
              />
              Actualizado hace 2 min
            </div>
            <motion.button
              whileHover={{ y: -1, borderColor: C.terra, color: C.terra }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSignOut}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "7px 16px",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                color: C.textMuted,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all .15s",
              }}
            >
              Cerrar sesión
            </motion.button>
          </div>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard
            label="Pasajeros hoy"
            value={totalPasajeros.toLocaleString()}
            sub={`en ${rutas.length} rutas`}
            icon="🚶"
            accent="terra"
          />
          <StatCard
            label="Rutas activas"
            value={String(rutasActivas)}
            sub={`${rutas.length - rutasActivas} en mant.`}
            icon="🗺️"
            accent="pine"
          />
          <StatCard
            label="Camiones activos"
            value={String(totalCamiones)}
            sub="en circulación"
            icon="🚌"
            accent="gold"
          />
          <StatCard
            label="Capacidad total"
            value={String(capacidadTotal)}
            sub="pasajeros simultáneos"
            icon="💺"
            accent="sky"
          />
          <StatCard
            label="Congestión"
            value="Alta"
            sub="Hora pico: 6 PM"
            icon="⚠️"
            accent="terra"
          />
        </motion.div>

        {/* ── CHARTS ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <Congestion />
          <UsoSemanal />
        </motion.div>

        {/* ── TABLE ── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <TablaRutas rutas={rutas} setRutas={setRutas} />
        </motion.div>
      </div>
    </motion.main>
  );
}

export default Empleado;
