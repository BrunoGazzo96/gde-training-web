# GDE Training Web

Frontend para una plataforma de gestión de rutinas de entrenamiento. Permite a entrenadores/admins crear y asignar rutinas a sus atletas, y a los atletas consultar sus rutinas del día.

---

## Funcionalidades

### Panel de Administrador
- **Gestión de usuarios** — crear, editar y eliminar atletas. Configurar rol, estado (activo/inactivo) y datos biométricos (peso, talla).
- **Gestión de rutinas** — crear rutinas con desglose por día de la semana: tipo de actividad, descripción, duración, notas y link a video.
- **Asignación** — asignar o desasignar rutinas a uno o varios atletas desde un modal.

### Vista del Atleta
- Ver todas las rutinas asignadas.
- Consultar el detalle de cada día: actividad, descripción, duración, notas y video.
- Identificar días de descanso vs. días de entrenamiento.

### Autenticación
- Login con email y contraseña.
- JWT almacenado en `localStorage`, inyectado automáticamente en cada request.
- Rutas protegidas por rol (`admin` / `athlete`).

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router 7 |
| Server state | TanStack React Query 5 |
| Estilos | Tailwind CSS 4 |
| Formularios | React Hook Form + Zod |
| HTTP | Axios |
| Iconos | Lucide React |

---

## Estructura del proyecto

```
src/
├── api/            # Clientes HTTP (auth, users, routines)
├── components/     # Layout y ProtectedRoute
├── context/        # AuthContext (estado global de sesión)
├── pages/
│   ├── admin/      # Users, UserForm, Routines, RoutineForm
│   └── athlete/    # MyRoutines
└── types/          # Tipos TypeScript globales
```

---

## Requisitos previos

- Node.js 18+
- Backend corriendo en `http://localhost:5247` (ver sección de API)

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Build de producción
npm run build
```

## Variables de entorno

El proxy de desarrollo redirige `/api` a `http://localhost:5247`. Si el backend corre en otro puerto, editá `vite.config.ts`:

```ts
proxy: {
  '/api': 'http://localhost:PUERTO'
}
```

---

## API esperada

El frontend consume los siguientes endpoints REST:

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autenticación |
| GET | `/api/auth/me` | Usuario actual |
| GET/POST/PUT/DELETE | `/api/users` | CRUD de usuarios |
| GET/POST/PUT/DELETE | `/api/routines` | CRUD de rutinas |
| GET | `/api/routines/user/{userId}` | Rutinas de un atleta |
| POST | `/api/routines/{id}/assign` | Asignar rutina |
| DELETE | `/api/routines/{id}/unassign/{userId}` | Desasignar rutina |
