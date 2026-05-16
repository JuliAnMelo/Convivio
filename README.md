# Convivio

Aplicación móvil para residentes de conjuntos: reservas de áreas comunes, PQRs con administración y notificaciones.

## Requisitos previos

Instala esto **antes** de clonar el proyecto:

| Herramienta | Versión recomendada | Descarga |
|-------------|---------------------|----------|
| **Node.js** | 20 LTS o superior | https://nodejs.org/ |
| **Git** | Cualquier versión reciente | https://git-scm.com/ |
| **Expo Go** (celular) | Última en App Store / Play Store | Para probar en dispositivo físico |

Opcional (emuladores):

- **Android Studio** — emulador Android: https://developer.android.com/studio  
- **Xcode** (solo macOS) — simulador iOS  

## Instalación rápida

### Windows (PowerShell)

```powershell
git clone <URL-DE-TU-REPO>
cd Convivio-main
.\instalar.ps1
```

### macOS / Linux

```bash
git clone <URL-DE-TU-REPO>
cd Convivio-main
chmod +x instalar.sh
./instalar.sh
```

### Manual

```bash
cd front
npm install
npm start
```

## Ejecutar la aplicación

```bash
cd front
npm start
```

En la terminal de Expo:

- **`w`** — abrir en navegador web  
- **`a`** — Android (emulador o dispositivo)  
- **`i`** — iOS (solo Mac con Xcode)  
- Escanea el **código QR** con **Expo Go** (misma red Wi‑Fi que el PC)

Si el QR no aparece, en Expo Go usa **Enter URL manually**:

```
exp://<IP-DE-TU-PC>:8081
```

(La IP la muestra la terminal al iniciar con `npm start`.)

## Estructura del proyecto

```
Convivio-main/
├── front/                 # App React Native (Expo)
│   ├── App.js
│   ├── package.json
│   └── src/
│       ├── screens/       # Pantallas
│       ├── components/
│       ├── context/
│       └── services/
├── instalar.ps1           # Instalador Windows
├── instalar.sh            # Instalador Mac/Linux
└── README.md
```

## Funciones principales

- **Inicio** — últimas 3 notificaciones y enlace a ver todas  
- **Categorías** — áreas comunes, PQRs, etc.  
- **Reservas** — calendario, horarios y solicitud de área común  
- **PQR** — peticiones, quejas y reclamos con chat de respuesta  

## Problemas frecuentes

**`npm` no se reconoce**  
→ Instala Node.js y reinicia la terminal.

**`node` no se reconoce al hacer `npm start`**  
→ Añade Node al PATH o abre una terminal nueva tras instalar Node.

**No conecta Expo Go**  
→ Mismo Wi‑Fi en PC y celular; prueba `npm start` y usa la URL manual.

**Error al instalar dependencias**  
→ Borra `front/node_modules` y ejecuta de nuevo `npm install` dentro de `front/`.

## Licencia

Proyecto privado / uso del conjunto residencial.
