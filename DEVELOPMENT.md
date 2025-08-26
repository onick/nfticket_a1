# 🚀 TIX 2.0 - Guía de Desarrollo

## ⚡ Inicio Rápido

### Prerequisitos
- **Node.js** 18+ 
- **pnpm** 8+ (recomendado) o npm
- **Docker** & **Docker Compose**
- **Git**

### Setup Automático
```bash
# Clonar y configurar todo de una vez
./tools/setup.sh
```

### Setup Manual
```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Iniciar bases de datos
docker-compose up -d postgres redis

# 4. Configurar base de datos
cd packages/database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
cd ../..

# 5. Iniciar desarrollo
pnpm dev
```

### Desarrollo Rápido
```bash
# Script rápido para desarrollar
./dev.sh
```

## 📁 Estructura del Proyecto

```
NFTicket A1/
├── apps/                    # Aplicaciones principales
│   ├── web/                # Frontend Next.js (Puerto 3000)
│   ├── admin/              # Dashboard Admin (Puerto 3001)
│   ├── api/                # API Gateway (Puerto 4000)
│   └── mobile/             # React Native App
├── services/               # Microservicios
│   ├── user-service/       # Gestión de usuarios
│   ├── event-service/      # Eventos y tickets
│   ├── payment-service/    # Procesamiento de pagos
│   ├── notification-service/ # Emails, SMS, push
│   ├── analytics-service/  # Métricas y reportes
│   └── ai-service/         # IA y recomendaciones
├── packages/               # Librerías compartidas
│   ├── ui/                 # Componentes UI
│   ├── database/           # Prisma schema & migrations
│   ├── shared/             # Types y utilidades
│   └── config/             # Configuraciones compartidas
├── infrastructure/         # IaC y DevOps
├── tools/                  # Scripts y herramientas
└── docs/                   # Documentación
```

## 🛠️ Comandos Principales

### Desarrollo
```bash
pnpm dev                    # Iniciar todos los servicios
pnpm dev:web               # Solo frontend web
pnpm dev:admin             # Solo dashboard admin
pnpm dev:api               # Solo API gateway
pnpm dev:mobile            # Solo app móvil
```

### Base de Datos
```bash
pnpm db:migrate            # Ejecutar migraciones
pnpm db:seed               # Poblar con datos de prueba
pnpm db:studio             # Abrir Prisma Studio
pnpm db:reset              # Resetear base de datos
```

### Build y Deploy
```bash
pnpm build                 # Build todas las apps
pnpm test                  # Ejecutar tests
pnpm lint                  # Linting
pnpm type-check           # Verificación de tipos
```

### Docker
```bash
docker-compose up -d       # Iniciar servicios de desarrollo
docker-compose down        # Parar servicios
docker-compose logs api    # Ver logs de un servicio
```

## 🌐 URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Web App** | http://localhost:3000 | Frontend principal |
| **Admin Panel** | http://localhost:3001 | Dashboard administrativo |
| **API Gateway** | http://localhost:4000 | API REST y GraphQL |
| **API Docs** | http://localhost:4000/docs | Documentación Swagger |
| **Prisma Studio** | http://localhost:5555 | GUI de base de datos |
| **MailHog** | http://localhost:8025 | Testing de emails |
| **Redis Insight** | http://localhost:8001 | GUI de Redis |

## 🗄️ Base de Datos

### Migrar Schema
```bash
cd packages/database
pnpm prisma migrate dev --name "descripcion_del_cambio"
```

### Poblar con Datos de Prueba
```bash
pnpm db:seed
```

### Explorar Datos
```bash
pnpm db:studio
```

## 🧪 Testing

### Tests Unitarios
```bash
pnpm test                  # Todos los tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # Con coverage
```

### Tests E2E
```bash
pnpm test:e2e             # Tests end-to-end
```

### Tests de API
```bash
cd apps/api
pnpm test:api             # Tests de API específicos
```

## 📱 Desarrollo Móvil

### Prerequisitos Adicionales
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS**: Xcode (solo en Mac)
- **Android**: Android Studio

### Iniciar App Móvil
```bash
cd apps/mobile
pnpm start                # Iniciar Expo
```

## 🔧 Configuración

### Variables de Entorno Principales
```bash
# Base de datos
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# JWT
JWT_SECRET="tu-clave-secreta-jwt"

# Pagos
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="tu-email"
SMTP_PASS="tu-password"

# Media
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
```

## 🚀 Deploy

### Staging
```bash
pnpm deploy:staging
```

### Producción
```bash
pnpm deploy:production
```

## 🐛 Debugging

### Logs de Desarrollo
```bash
# API logs
docker-compose logs -f api

# Base de datos logs
docker-compose logs -f postgres

# Todos los logs
docker-compose logs -f
```

### Debug con VSCode
1. Instalar extensión "Remote - Containers"
2. Abrir proyecto en container
3. Configurar breakpoints
4. F5 para debug

## 📚 Recursos Adicionales

### Documentación
- [Arquitectura del Sistema](./docs/architecture.md)
- [API Documentation](http://localhost:4000/docs)
- [Guía de Contribución](./docs/contributing.md)
- [Deployment Guide](./docs/deployment.md)

### Links Útiles
- **Next.js**: https://nextjs.org/docs
- **Fastify**: https://www.fastify.io/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Native**: https://reactnative.dev/docs

## 🆘 Solución de Problemas

### Problemas Comunes

**❌ Error: "Port already in use"**
```bash
# Matar procesos en puertos específicos
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

**❌ Error: "Database connection failed"**
```bash
# Reiniciar base de datos
docker-compose restart postgres
pnpm db:reset
```

**❌ Error: "Prisma client not generated"**
```bash
cd packages/database
pnpm prisma generate
```

**❌ Node modules corruptos**
```bash
rm -rf node_modules
pnpm install
```

### Obtener Ayuda
- **Issues**: Crear issue en GitHub
- **Slack**: Canal #tix-dev (si aplica)
- **Email**: dev@tix.do

---

**💡 Tip:** Usa `pnpm dev` para desarrollo normal y `./dev.sh` para inicio rápido.

**🔥 ¡Que empiece el desarrollo! 🚀**