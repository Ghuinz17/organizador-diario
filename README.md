<p align="center">
  <img src="assets/logo.png" width="180" alt="Logo de Organizador Diario">
</p>

<h1 align="center">Organizador Diario</h1>

<p align="center">
  Organiza tu día a día con un calendario, tareas con horario y<br>
  <strong>notificaciones locales que te avisan de cuándo cambiar de tarea</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white" alt="Expo SDK 57">
  <img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/licencia-MIT-2563EB.svg" alt="Licencia MIT">
</p>

---

## 📲 Prueba la app

<p align="center">
  <img src="assets/qr-expo.svg" width="260" alt="QR de descarga: https://expo.dev/@amolper/organizador-diario">
</p>

<p align="center">
  <b>Escanea el código con la cámara del móvil</b> →
  <a href="https://expo.dev/@amolper/organizador-diario">página del proyecto en expo.dev</a>
</p>

1. Instala **[Expo Go](https://expo.dev/go)** desde Play Store o App Store (es gratis).
2. Escanea el QR de arriba con la cámara del teléfono.
3. En la página del proyecto, toca **"Open in Expo Go"** (o descarga el build si está publicado).

<details>
<summary><b>O ejecutarla en local con el QR del terminal</b></summary>

```bash
git clone https://github.com/Ghuinz17/organizador-diario.git
cd organizador-diario
npm install
npx expo start
```

Escanea con Expo Go el QR que aparece en la terminal (el móvil y el PC deben estar en la misma red, o usa `npx expo start --tunnel`).
</details>

---

## 🧭 Cómo funciona la aplicación

### 1. Calendario (pantalla principal)

- Vista de mes con **puntos de color** en cada día que tiene tareas (el color corresponde a la primera tarea del día).
- Al tocar un día se selecciona y debajo aparece el resumen de sus tareas ordenadas por hora.
- Botones **«Gestionar día»** (abre la agenda de ese día) y **«Nueva tarea»**.
- En la cabecera: el **selector de idioma 🇪🇸 ES / 🇬🇧 EN** y el **selector de tema ☀️/🌙**.

### 2. Tareas

- Cada tarea tiene **título, fecha, horario, color y notas opcionales**.
- Dos modos de horario que elige el usuario en el formulario:
  - **Inicio y fin** → bloque de tiempo (`09:00 – 10:00`).
  - **Hora fija** → una hora concreta (`09:00 · hora fija`), sin hora de fin.
- **Editar**: toca la tarjeta de la tarea (queda resaltada con la etiqueta «editando»).
- **Eliminar**: icono de papelera en la tarjeta o botón «Eliminar tarea» dentro del formulario, siempre con diálogo de confirmación.
- Las tareas guardadas con versiones antiguas de la app se **migran automáticamente** al cargar.

### 3. Notificaciones de cambio de tarea

Al crear, editar o eliminar una tarea **se reprograman todos los avisos**:

- Cada tarea genera un aviso local en su **hora de inicio** (solo se programan horas futuras).
- El cuerpo del aviso indica la transición: **«Termina «X» → empieza «Y»»** (o «Comienza «X»» si es la primera del día).
- Al tocar el aviso, la app se abre directamente en la agenda de ese día.
- Botón **«Probar notificación (5 s)»** en la pantalla del día para verificar que el sistema funciona.
- En Android se crea el canal *«Cambios de tarea»* con prioridad máxima y la app pide los permisos necesarios (`SCHEDULE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED`).

> **Nota sobre Expo Go:** verás un aviso en consola del tipo *"`expo-notifications` functionality is not fully supported in Expo Go"*. Se emite automáticamente al importar la librería dentro de Expo Go, es **informativo** y no afecta a las notificaciones locales. Para máxima fiabilidad (alarmas exactas en segundo plano) usa un [development build](https://expo.dev/fyi/dev-client).

### 4. Temas claro / oscuro

- Dos paletas **basadas en azul** (`#2563EB` en claro, `#60A5FA` en oscuro).
- Botón ☀️ **sol** en tema claro / 🌙 **luna** en tema oscuro; la elección **se guarda** y se aplica al reiniciar.
- También respeta el sistema si es la primera vez que se abre.

### 5. Idiomas: castellano e inglés

- Chip de bandera **🇪🇸 ES ↔ 🇬🇧 EN** en la cabecera (solo esos dos idiomas).
- Se traduce **toda la app**: interfaz, formularios, alertas, fechas y **las propias notificaciones** (se reprograman al cambiar de idioma).
- El calendario cambia a mes y días en castellano o inglés.
- La preferencia **se guarda** entre sesiones.

### 6. Tus datos, en tu móvil

Todo se guarda localmente con `AsyncStorage` (tareas, tema e idioma). **No hay servidor ni cuenta**: si desinstalas la app, se borran.

---

## 🛠 Instalación

**Requisitos:** Node.js 20+, npm y una app con **Expo Go** instalada en el móvil (o emulador Android/iOS).

```bash
git clone https://github.com/Ghuinz17/organizador-diario.git
cd organizador-diario
npm install
npx expo start
```

| Comando               | Descripción                              |
| --------------------- | ---------------------------------------- |
| `npx expo start`      | Arranca el servidor de desarrollo        |
| `npx expo start --android` / `--ios`  | Abre directamente en el dispositivo/emulador |
| `npx expo start --web`| Versión web en el navegador               |
| `npm run lint`        | Lint con ESLint (config Expo)            |
| `npx tsc --noEmit`    | Comprobación de tipos                    |
| `npx expo-doctor`     | Diagnóstico de dependencias y config     |

---

## 📂 Estructura del proyecto

```
organizador-diario/
├── app.json               # Config de Expo: icono, splash, plugins, permisos, EAS
├── eas.json               # Perfiles de EAS Build y canales de EAS Update
├── assets/                # Icono, logo, splash y QR de descarga
└── src/
    ├── app/               # Rutas (Expo Router) — envoltorios finos
    │   ├── _layout.tsx    #   providers (tema, i18n, tareas) + navegación
    │   ├── index.tsx      #   → CalendarScreen
    │   └── task/[date]/   #   → TaskScreen (deep-link desde notificaciones)
    ├── screens/           # CalendarScreen, TaskScreen
    ├── components/        # CalendarView, TaskCard, TaskForm, TimePickerField,
    │                      # ThemeToggle, LanguageToggle
    ├── context/           # TasksContext (tareas + reprogramación de avisos)
    ├── i18n/              # Diccionarios ES/EN + LocaleConfig del calendario
    ├── services/          # notificationManager, taskStore (AsyncStorage)
    ├── theme/             # Paletas colors.ts + ThemeContext (sol/luna)
    ├── types/             # Modelo Task (timeMode: 'range' | 'fixed')
    └── utils/             # Fechas (formato ES/EN, HH:mm, unión fecha+hora)
```

---

## 🚀 Publicar con EAS

El proyecto está vinculado a **[`@amolper/organizador-diario`](https://expo.dev/@amolper/organizador-diario)** y ya tiene una actualización publicada en el canal `production`.

```bash
# Actualización de JS/sin nativos (segundos, sin compilar)
npx eas-cli@latest update --channel production --message "Descripción del cambio" --environment production

# Compilar APK de prueba (interna) / build de producción
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform android --profile production

# Subir a tiendas
npx eas-cli@latest submit --platform android
```

---

## 📚 Tecnologías

- **[Expo SDK 57](https://docs.expo.dev/)** + **React Native 0.86** + **TypeScript 6**
- **[Expo Router](https://docs.expo.dev/router/introduction/)** — navegación por rutas en `src/app`
- **[expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** — notificaciones locales programadas
- **[react-native-calendars](https://github.com/wix/react-native-calendars)** — calendario con locales ES/EN
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** — persistencia local
- **EAS Update + EAS Build** — actualizaciones OTA y compilaciones en la nube

---

## 📄 Licencia

Distribuido bajo la [licencia MIT](LICENSE). © 2026 Ghuinz17.
