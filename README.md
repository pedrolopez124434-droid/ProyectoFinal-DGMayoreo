# 🏪 DG Mayoreo — Sistema Punto de Venta

Sistema completo de punto de venta con React (frontend) + ASP.NET Core 8 (backend) + SQL Server.

---

## 📁 Estructura del proyecto

```
DGMayoreo/
├── frontend/                  ← Aplicación React (Vite)
│   ├── src/
│   │   ├── App.jsx            ← Raíz: sidebar, navegación, sesión
│   │   ├── main.jsx           ← Punto de entrada React
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Venta.jsx      ← POS: carrito, cobro, ticket
│   │   │   ├── Productos.jsx  ← CRUD productos
│   │   │   ├── Ventas.jsx     ← Historial de ventas
│   │   │   └── Usuarios.jsx   ← CRUD usuarios
│   │   └── utils/
│   │       ├── db.js          ← localStorage (fallback offline)
│   │       ├── api.js         ← Llamadas al backend API
│   │       └── styles.js      ← Design tokens compartidos
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    └── DGMayoreo.API/         ← ASP.NET Core 8 Web API
        ├── Controllers/
        │   ├── AuthController.cs
        │   ├── UsuariosController.cs
        │   ├── ProductosController.cs
        │   └── VentasController.cs
        ├── Models/Models.cs   ← Entidades EF Core
        ├── Data/
        │   ├── AppDbContext.cs
        │   └── CreateDatabase.sql
        ├── DTOs/DTOs.cs
        ├── Program.cs
        ├── appsettings.json
        └── DGMayoreo.API.csproj
```

---

## 🚀 Cómo ejecutar

### Opción A — Solo Frontend (sin backend, datos en localStorage)

El frontend funciona completamente sin el backend usando `localStorage` como base de datos local.

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:3000`  
**Usuario:** `admin` | **Contraseña:** `1234`

---

### Opción B — Con Backend SQL Server (Visual Studio Enterprise)

#### 1. Crear la base de datos

Abre **SQL Server Management Studio** y ejecuta:
```
backend/DGMayoreo.API/Data/CreateDatabase.sql
```

#### 2. Configurar cadena de conexión

Edita `backend/DGMayoreo.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR\\SQLEXPRESS;Database=DGMayoreoDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Cambia `TU_SERVIDOR` por el nombre de tu instancia SQL Server.  
Ejemplo: `localhost\\SQLEXPRESS`, `(localdb)\\MSSQLLocalDB`

#### 3. Abrir en Visual Studio Enterprise

- Abre `backend/DGMayoreo.API/DGMayoreo.API.csproj`
- Presiona **F5** para ejecutar
- La API arranca en `https://localhost:7001`
- Swagger disponible en `https://localhost:7001/swagger`

#### 4. Aplicar migraciones EF Core (Package Manager Console)

```powershell
Add-Migration InitialCreate
Update-Database
```

O desde terminal:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 5. Ejecutar el frontend conectado a la API

El proxy en `vite.config.js` ya redirige `/api` al backend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Base de datos — Tablas

| Tabla          | Descripción                                |
|----------------|--------------------------------------------|
| `Usuarios`     | Cajeros y administradores del sistema      |
| `Productos`    | Catálogo de productos con stock y precios  |
| `Ventas`       | Encabezado de cada venta / ticket          |
| `VentaDetalles`| Líneas de cada venta (producto, qty, precio)|

---

## 🔑 Credenciales por defecto

| Campo      | Valor   |
|------------|---------|
| Usuario    | `admin` |
| Contraseña | `1234`  |
| Rol        | admin   |

---

## 📋 Funcionalidades

- ✅ **Login** con sesión persistente
- ✅ **Dashboard** — ventas del día, stock bajo, últimas transacciones
- ✅ **Nueva Venta (POS)** — catálogo, carrito, cobro, cambio, ticket
- ✅ **Productos** — agregar, editar, eliminar, categorías, stock
- ✅ **Historial de Ventas** — todos los tickets con detalle
- ✅ **Usuarios** — registrar, editar, roles (admin/cajero)
- ✅ **Backend API REST** — ASP.NET Core 8, JWT, Entity Framework Core
- ✅ **SQL Server** — migraciones automáticas, seed data

---

## 🛠️ Tecnologías

**Frontend:** React 18, Vite, localStorage  
**Backend:** ASP.NET Core 8, Entity Framework Core 8, BCrypt, JWT  
**Base de datos:** SQL Server / SQL Server Express / LocalDB  
**IDE recomendado:** Visual Studio Enterprise 2022+
