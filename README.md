# 🎫 TIX 2.0 - Plataforma de Eventos Nueva Generación

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> 🚀 **Plataforma moderna y completa para la gestión y venta de tickets de eventos en República Dominicana**

## ✨ Características Principales

### 🎯 **Para Usuarios**
- 🔐 **Autenticación segura** con JWT
- 🎪 **Exploración de eventos** con filtros inteligentes  
- 🛒 **Carrito de compras** intuitivo y persistente
- 💳 **Pagos seguros** con Stripe
- 📱 **Tickets digitales** con códigos QR
- 📧 **Confirmaciones por email**

### 👥 **Para Organizadores**
- 📊 **Dashboard completo** de gestión
- 🎫 **Creación de eventos** con múltiples tipos de tickets
- 📈 **Analytics en tiempo real**
- 💰 **Gestión de ventas** y comisiones
- 🎨 **Personalización visual**

### 🔧 **Para Desarrolladores**
- 🏗️ **Arquitectura de microservicios**
- ⚡ **API REST completa** con documentación
- 🔄 **Real-time updates** con WebSockets
- 📦 **Monorepo** con Turbo.js
- 🐳 **Containerización** con Docker
- 🚀 **Deploy automático** CI/CD

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 14** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Styling utilitario
- **Framer Motion** - Animaciones fluidas
- **Zustand** - Estado global ligero
- **React Query** - Gestión de datos servidor

### **Backend**
- **Fastify** - Framework web ultra-rápido
- **MongoDB** - Base de datos NoSQL
- **Redis** - Cache y sesiones
- **JWT** - Autenticación stateless
- **Stripe** - Procesamiento de pagos
- **Cloudinary** - Gestión de imágenes

### **DevOps & Tools**
- **Turbo.js** - Monorepo build system
- **Docker** - Containerización
- **pnpm** - Gestión de dependencias
- **ESLint + Prettier** - Code quality
- **Swagger** - Documentación API

## 🚀 Quick Start

### **Prerequisitos**
- Node.js 18.0+
- pnpm 8.0+
- MongoDB 7.0+
- Docker (opcional)

### **1. Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/onick/nfticket_a1.git
cd nfticket_a1

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Editar archivos .env con tus credenciales
```

### **2. Configuración de Base de Datos**
```bash
# Usando Docker (Recomendado)
docker-compose up -d mongodb redis

# O instalar localmente
# MongoDB: https://docs.mongodb.com/manual/installation/
# Redis: https://redis.io/download/
```

### **3. Ejecutar en Desarrollo**
```bash
# Método rápido (recomendado)
./quick-start.sh

# O ejecutar manualmente
pnpm dev
```

### **4. Acceder a la Aplicación**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/docs

## 📁 Estructura del Proyecto

```
nfticket_a1/
├── apps/
│   ├── api/                    # Backend API (Fastify + MongoDB)
│   │   ├── src/
│   │   │   ├── routes/         # Rutas de API
│   │   │   ├── services/       # Lógica de negocio
│   │   │   ├── models/         # Modelos de datos
│   │   │   ├── utils/          # Utilidades
│   │   │   └── server.ts       # Servidor principal
│   │   └── package.json
│   │
│   └── web/                    # Frontend (Next.js + Tailwind)
│       ├── src/
│       │   ├── app/            # App Router (Next.js 14)
│       │   ├── components/     # Componentes reutilizables
│       │   ├── lib/            # Utilidades y configuración
│       │   ├── stores/         # Estado global (Zustand)
│       │   └── types/          # Tipos TypeScript
│       └── package.json
│
├── docker-compose.yml          # Configuración Docker
├── turbo.json                  # Configuración Turbo
├── ROADMAP.md                  # Plan de desarrollo
└── README.md                   # Este archivo
```

## 🔑 Configuración

### **Variables de Entorno Importantes**

```bash
# API
DATABASE_URL=mongodb://localhost:27017/tix_dev
STRIPE_SECRET_KEY=sk_test_xxx
JWT_SECRET=your-super-secret-key

# Frontend  
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### **Credenciales de Desarrollo**
```bash
# Usuarios de prueba (modo desarrollo)
Email: organizador@tix.com | Pass: 123456789
Email: usuario@tix.com     | Pass: 123456789
```

## 📚 Documentación

### **API Endpoints**
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/events` - Listar eventos
- `POST /api/v1/events` - Crear evento
- `POST /api/v1/orders` - Crear orden
- `GET /api/v1/tickets` - Mis tickets

### **Scripts Disponibles**
```bash
pnpm dev          # Desarrollo (todos los servicios)
pnpm build        # Build para producción
pnpm test         # Ejecutar tests
pnpm lint         # Linter
pnpm type-check   # Verificar tipos TypeScript

# Por aplicación individual
pnpm dev:web      # Solo frontend
pnpm dev:api      # Solo API
```

## 🌍 Deployment

### **Desarrollo Local**
```bash
./quick-start.sh
```

### **Producción con Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### **Deploy en Vercel/Railway**
Ver archivo `deploy/README.md` para instrucciones específicas.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📈 Roadmap

- [x] **Fase 1**: MVP Core (Auth, Events, Payments)
- [x] **Fase 2**: Tickets digitales + QR codes
- [ ] **Fase 3**: App móvil React Native
- [ ] **Fase 4**: IA para recomendaciones
- [ ] **Fase 5**: Marketplace de servicios

Ver [ROADMAP.md](ROADMAP.md) para detalles completos.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Lead Developer**: [@onick](https://github.com/onick)
- **Architecture**: Full-stack TypeScript
- **Design**: Modern UI/UX

## 📞 Soporte

- 📧 Email: support@tix.do
- 💬 Discord: [TIX Community](https://discord.gg/tix)
- 📱 WhatsApp: +1-809-XXX-XXXX

---

<div align="center">

**🚀 ¡Construido con ❤️ para la comunidad de eventos de República Dominicana! 🇩🇴**

[Sitio Web](https://tix.do) • [Documentación](https://docs.tix.do) • [Discord](https://discord.gg/tix)

</div>
