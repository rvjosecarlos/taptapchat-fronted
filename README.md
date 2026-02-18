# 💬 TapTapChat - Frontend

Aplicación de mensajería instantánea en tiempo real. Los usuarios pueden chatear con otros usuarios de forma instantánea.

## 🚀 Demo

[🔗 Ver demo en vivo](https://taptapchat-fronted.vercel.app/) 

## 📸 Capturas

![Vista Chat](https://res.cloudinary.com/domj6qqht/image/upload/v1771368771/taptapchat2_on3r7z.gif)
![Vista Chat](https://res.cloudinary.com/domj6qqht/image/upload/v1771368771/taptapchat1_bqfirp.gif)
![Vista Chat](https://res.cloudinary.com/domj6qqht/image/upload/v1771368771/taptapchat3_dkjpqk.gif)
![TapTapChat en acción](https://res.cloudinary.com/domj6qqht/image/upload/w_400/v1771368794/screenshot1_gbgszg.jpg)

## 🛠️ Stack Tecnológico

- **Framework:** React 18
- **Lenguaje:** TypeScript
- **Estilos:** CSS / Tailwind
- **Tiempo real:** Socket.io-client
- **Estado:** Zustand
- **Peticiones:** Axios

## 🧠 Arquitectura Frontend

- **Estado global desacoplado** con Zustand para sesión, usuarios y mensajes.
- **Conexión WebSocket centralizada** fuera de componentes UI.
- **Actualización reactiva de mensajes** sin recarga.
- Manejo básico de reconexión automática.

## ✨ Características

- 💬 **Mensajería en tiempo real** - Los mensajes aparecen sin recargar
- 👥 **Usuarios conectados** - Ve quién está en línea en cada sala
- 📱 **Diseño responsive** - Funciona en móvil y escritorio
- 🔔 **Notificaciones** - Alertas de nuevos mensajes

## 📦 Instalación local

```bash
# Clonar repositorio
git clone https://github.com/rvjosecarlos/taptapchat-fronted.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```
