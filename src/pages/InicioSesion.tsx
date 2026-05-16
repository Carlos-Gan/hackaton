import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { colors } from "../utils/theme";

const InicioSesion: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-empty-pattern
  const [] = useState<"cliente" | "admin">("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "ok" | "err";
  } | null>(null);

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

  // ── Traduce códigos de error de Firebase al español ──────────
  function traducirError(code: string): string {
    const errores: Record<string, string> = {
      "auth/user-not-found": "No existe una cuenta con ese correo.",
      "auth/wrong-password": "Contraseña incorrecta.",
      "auth/email-already-in-use": "Ese correo ya está registrado.",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
      "auth/invalid-email": "El correo no tiene un formato válido.",
      "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
      "auth/invalid-credential": "Correo o contraseña incorrectos.",
    };
    return errores[code] ?? "Ocurrió un error. Intenta de nuevo.";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMensaje({ texto: "Completa todos los campos.", tipo: "err" });
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      if (modo === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      setMensaje({ texto: "¡Acceso concedido! Redirigiendo...", tipo: "ok" });

      // Redirige según rol
      setTimeout(() => {
        navigate("/empleado");
      }, 800);
    } catch (err) {
      setMensaje({
        texto: traducirError((err as { code: string }).code),
        tipo: "err",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background: colors.background,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          color: colors.text.primary,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        ← Inicio
      </button>
      <div
        className="w-full max-w-sm rounded-3xl p-9"
        style={{
          border: `0.5px solid ${colors.brand.goldBorder}`,
        }}
      >
        {/* Brand */}
        <div className="mb-7 flex items-center gap-6">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg"
            style={{ background: colors.brand.goldBorder }}
          >
            🦂
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: colors.brand.gold }}
            >
              Q-Ruta
            </p>
            <p className="text-xs" style={{ color: colors.text.muted }}>
              Sistema de Transporte Urbano
            </p>
          </div>
        </div>

        {/* Título dinámico */}
        <h1
          className="mb-1 text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {modo === "login" ? "Bienvenido" : "Crear cuenta"}
        </h1>
        <p className="mb-6 text-sm" style={{ color: colors.text.muted }}>
          {modo === "login"
            ? "Inicia sesión para continuar"
            : "Regístrate gratis"}
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="mb-1.5 block text-[10px] uppercase tracking-widest"
              style={{ color: colors.text.muted }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: C.terraSoft,
                border: `0.5px solid ${colors.brand.goldBorder}`,
                color: colors.text.primary,
              }}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-[10px] uppercase tracking-widest"
              style={{ color: colors.text.muted }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: C.terraSoft,
                border: `0.5px solid ${colors.brand.goldBorder}`,
                color: colors.text.primary,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-1 w-full rounded-xl py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
            style={{ background: colors.brand.gold, color: "#1A1200" }}
          >
            {cargando
              ? "..."
              : modo === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>

        {/* Mensaje */}
        {mensaje && (
          <div
            className="mt-4 rounded-xl px-4 py-2.5 text-center text-sm"
            style={{
              background:
                mensaje.tipo === "ok"
                  ? "rgba(76,201,143,0.12)"
                  : "rgba(226,75,74,0.12)",
              border: `0.5px solid ${mensaje.tipo === "ok" ? "#4cc98f55" : "#e24b4a55"}`,
              color: mensaje.tipo === "ok" ? "#4cc98f" : "#f09595",
            }}
          >
            {mensaje.texto}
          </div>
        )}
        <button
          onClick={() => {
            setModo(modo === "login" ? "registro" : "login");
            setMensaje(null);
          }}
          className="mt-4 w-full text-center text-sm transition hover:opacity-80"
          style={{
            color: colors.brand.gold,
            background: "transparent",
            border: "none",
          }}
        ></button>
      </div>
    </div>
  );
};

export default InicioSesion;
