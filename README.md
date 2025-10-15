# Car Wash Backend API

Backend API para el sistema de gestión de Car Wash desarrollado con Node.js, Express y MongoDB.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración

Copiar el archivo `.env.example` a `.env` y configurar las variables:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
MONGO_URI=mongodb://localhost:27017/carwash
JWT_SECRET=tu-clave-secreta-muy-segura
ADMIN_EMAIL=aldairleiva42@gmail.com
ADMIN_PASS=ciscoE.23
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Ejecutar Seed

Crear usuario administrador y datos iniciales:

```bash
npm run seed
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## 📡 API Endpoints

### Autenticación

#### POST /api/auth/login
Iniciar sesión con email y contraseña.

**Request:**
```json
{
  "email": "aldairleiva42@gmail.com",
  "password": "ciscoE.23"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "aldairleiva42@gmail.com",
    "role": "admin"
  }
}
```

#### POST /api/auth/logout
Cerrar sesión (requiere autenticación).

#### GET /api/auth/me
Obtener información del usuario actual (requiere autenticación).

### Vehículos

Todos los endpoints requieren autenticación.

#### GET /api/vehicles
Listar vehículos con filtros opcionales.

**Query Parameters:**
- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `employeeId`: ID del empleado
- `vehicleTypeId`: ID del tipo de vehículo

#### POST /api/vehicles
Crear nuevo registro de vehículo.

**Request:**
```json
{
  "plate": "ABC123",
  "brand": "Toyota",
  "model": "Corolla",
  "color": "Blanco",
  "vehicleType": "vehicle-type-id",
  "serviceType": "service-type-id",
  "employee": "employee-id",
  "price": 100,
  "entryTime": "2024-01-01T10:00:00Z"
}
```

#### PUT /api/vehicles/:id
Actualizar registro de vehículo.

#### DELETE /api/vehicles/:id
Eliminar registro de vehículo.

### Tipos de Vehículos

#### GET /api/vehicle-types
Listar todos los tipos de vehículos.

#### POST /api/vehicle-types
Crear nuevo tipo de vehículo.

**Request:**
```json
{
  "name": "Sedán",
  "description": "Vehículo de pasajeros de 4 puertas"
}
```

#### PUT /api/vehicle-types/:id
Actualizar tipo de vehículo.

#### DELETE /api/vehicle-types/:id
Eliminar tipo de vehículo.

### Tipos de Servicio

#### GET /api/service-types
Listar todos los tipos de servicio.

#### POST /api/service-types
Crear nuevo tipo de servicio.

**Request:**
```json
{
  "name": "Lavado Premium",
  "description": "Lavado completo interior y exterior",
  "price": 100
}
```

#### PUT /api/service-types/:id
Actualizar tipo de servicio.

#### DELETE /api/service-types/:id
Eliminar tipo de servicio.

### Empleados

#### GET /api/employees
Listar todos los empleados.

#### POST /api/employees
Crear nuevo empleado.

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "555-0101",
  "active": true
}
```

#### PUT /api/employees/:id
Actualizar empleado.

#### DELETE /api/employees/:id
Eliminar empleado.

### Reportes

#### GET /api/reports/employee
Reporte de desempeño por empleado.

**Query Parameters:**
- `startDate`: Fecha inicio
- `endDate`: Fecha fin
- `employeeId`: ID del empleado específico

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "employee-id",
      "employeeName": "Juan Pérez",
      "employeeEmail": "juan@example.com",
      "totalWashes": 45,
      "totalRevenue": 4500,
      "averagePrice": 100
    }
  ]
}
```

#### GET /api/reports/vehicles
Reporte detallado de vehículos.

**Query Parameters:**
- `startDate`: Fecha inicio
- `endDate`: Fecha fin
- `vehicleTypeId`: ID del tipo de vehículo
- `serviceTypeId`: ID del tipo de servicio
- `employeeId`: ID del empleado

#### GET /api/reports/dashboard
Estadísticas para el dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "washes": 5,
      "revenue": 500
    },
    "week": {
      "washes": 35,
      "revenue": 3500
    },
    "month": {
      "washes": 150,
      "revenue": 15000
    },
    "activeEmployees": 4
  }
}
```

## 🗄️ Modelos de Datos

### User
```javascript
{
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: ['admin', 'user']),
  createdAt: Date
}
```

### VehicleType
```javascript
{
  name: String (required, unique),
  description: String,
  createdAt: Date
}
```

### ServiceType
```javascript
{
  name: String (required, unique),
  description: String,
  price: Number (required, min: 0),
  createdAt: Date
}
```

### Employee
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  active: Boolean (default: true),
  createdAt: Date
}
```

### VehicleRecord
```javascript
{
  plate: String (required),
  brand: String,
  model: String,
  color: String,
  vehicleType: ObjectId (ref: VehicleType, required),
  serviceType: ObjectId (ref: ServiceType, required),
  employee: ObjectId (ref: Employee, required),
  entryTime: Date (default: now),
  price: Number (required, min: 0),
  createdAt: Date
}
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt antes de guardar
- JWT se firma con clave secreta y expira en 30 días
- Las cookies son HTTPOnly para prevenir XSS
- CORS configurado para permitir solo el frontend autorizado
- Todos los endpoints (excepto login) requieren autenticación

## 📝 Scripts

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar servidor con nodemon (auto-reload)
- `npm run seed` - Ejecutar script seed para crear datos iniciales
- `npm run lint` - Ejecutar ESLint
- `npm test` - Ejecutar tests (configurar Jest)

## 🌐 Despliegue

### Railway

1. Conectar repositorio en Railway
2. Configurar variables de entorno
3. Deploy automático

### Render

1. Crear Web Service
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Configurar variables de entorno

### Heroku

```bash
heroku create carwash-api
heroku config:set MONGO_URI="..."
heroku config:set JWT_SECRET="..."
git push heroku main
```

## 🐛 Troubleshooting

### Error de conexión a MongoDB
- Verificar MONGO_URI en .env
- Verificar que MongoDB esté corriendo
- En Atlas, verificar IP whitelist

### Error de autenticación
- Verificar JWT_SECRET
- Verificar que el token no haya expirado
- Verificar que las cookies estén habilitadas

## 📄 Licencia

MIT

