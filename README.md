# Q-Ruta 🚍

Sistema web de monitoreo y administración de rutas de transporte público desarrollado con React, TypeScript y Leaflet.

## 📌 Descripción

Q-Ruta es una plataforma enfocada en la gestión y visualización de rutas de transporte urbano en tiempo real.
El proyecto permite administrar rutas, visualizar recorridos en mapa, monitorear congestión y controlar la cantidad de camiones activos por ruta.

Incluye:

* Visualización de rutas sobre mapa interactivo
* Simulación de transporte urbano
* Panel administrativo
* Gestión de camiones por ruta
* Persistencia de datos con LocalStorage
* Estadísticas y gráficas de uso
* Estimaciones de espera
* Sistema visual moderno y responsivo

---

# 🛠 Tecnologías utilizadas

* React
* TypeScript
* Vite
* TailwindCSS
* React Leaflet
* Leaflet
* Chart.js
* React ChartJS 2

---

# 🚀 Instalación

Clona el repositorio:

```bash
git clone TU_REPOSITORIO
```

Entra al proyecto:

```bash
cd q-ruta
```

Instala dependencias:

```bash
npm install
```

Ejecuta el servidor:

```bash
npm run dev
```

---

# 📂 Estructura del proyecto

```bash
src/
│
├── componentes/
│   ├── mapa/
│   ├── ui/
│   └── ...
│
├── data/
│   └── rutas.ts
│
├── pages/
│   ├── Empleado.tsx
│   ├── Inicio.tsx
│   └── ...
│
├── utils/
│   ├── geo.ts
│   ├── estimaciones.ts
│   └── theme.ts
│
└── constants/
```

---

# 🗺 Funcionalidades

## 📍 Mapa interactivo

* Visualización de rutas
* Paradas dinámicas
* Ubicación actual del usuario
* Waypoints personalizados

---

## 🚌 Administración de rutas

* Ver rutas activas
* Rutas en mantenimiento
* Cantidad de camiones por ruta
* Capacidad máxima por ruta

---

## 📊 Estadísticas

* Congestión por hora
* Uso semanal
* Pasajeros diarios
* Capacidad total del sistema

---

# 💾 Persistencia de datos

Los cambios administrativos se almacenan usando:

```js
localStorage
```

Esto permite conservar:

* Cantidad de camiones
* Cambios de administración
* Datos temporales del sistema

aunque la página se recargue.

---

# 🎨 Diseño

La interfaz utiliza una temática inspirada en:

* tonos café
* dorado
* naranja
* verde
* estilo dashboard moderno

---

# 📌 Estado del proyecto

Proyecto en desarrollo.

Posibles futuras mejoras:

* Backend real
* Base de datos
* Autenticación
* GPS en tiempo real
* WebSockets
* Panel de usuarios
* Integración con pagos
* App móvil

---

# 👨‍💻 Autor

Carlos Gandara

---

# 📄 Licencia

Proyecto académico / prototipo.
