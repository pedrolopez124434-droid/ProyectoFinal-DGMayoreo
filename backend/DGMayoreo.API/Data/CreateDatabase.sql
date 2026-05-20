-- ============================================================
--  DG Mayoreo — Script SQL Server
--  Ejecutar en SQL Server Management Studio o Visual Studio
-- ============================================================

-- 1. Crear la base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DGMayoreoDB')
BEGIN
    CREATE DATABASE DGMayoreoDB;
    PRINT 'Base de datos DGMayoreoDB creada.';
END
GO

USE DGMayoreoDB;
GO

-- ─── TABLA: Usuarios ──────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    CREATE TABLE Usuarios (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(100) NOT NULL,
        Username     NVARCHAR(50)  NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Role         NVARCHAR(20)  NOT NULL DEFAULT 'cajero',
        Active       BIT           NOT NULL DEFAULT 1,
        CreatedAt    DATETIME2     NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Tabla Usuarios creada.';
END
GO

-- ─── TABLA: Productos ─────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Productos' AND xtype='U')
BEGIN
    CREATE TABLE Productos (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Name      NVARCHAR(150) NOT NULL,
        Sku       NVARCHAR(30)  NOT NULL UNIQUE,
        Category  NVARCHAR(50)  NOT NULL DEFAULT 'Otro',
        Price     DECIMAL(10,2) NOT NULL DEFAULT 0,
        Cost      DECIMAL(10,2) NOT NULL DEFAULT 0,
        Stock     INT           NOT NULL DEFAULT 0,
        Unit      NVARCHAR(20)  NOT NULL DEFAULT 'pza',
        Active    BIT           NOT NULL DEFAULT 1,
        CreatedAt DATETIME2     NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Tabla Productos creada.';
END
GO

-- ─── TABLA: Ventas ────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Ventas' AND xtype='U')
BEGIN
    CREATE TABLE Ventas (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Date        DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        Total       DECIMAL(10,2)  NOT NULL,
        Payment     DECIMAL(10,2)  NOT NULL,
        Change      DECIMAL(10,2)  NOT NULL DEFAULT 0,
        CashierId   INT            NOT NULL,
        CashierName NVARCHAR(100)  NOT NULL
    );
    PRINT 'Tabla Ventas creada.';
END
GO

-- ─── TABLA: VentaDetalles ─────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VentaDetalles' AND xtype='U')
BEGIN
    CREATE TABLE VentaDetalles (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        VentaId      INT            NOT NULL REFERENCES Ventas(Id) ON DELETE CASCADE,
        ProductoId   INT            NOT NULL,
        ProductoName NVARCHAR(150)  NOT NULL,
        Qty          INT            NOT NULL,
        UnitPrice    DECIMAL(10,2)  NOT NULL,
        Subtotal     DECIMAL(10,2)  NOT NULL
    );
    PRINT 'Tabla VentaDetalles creada.';
END
GO

-- ─── DATOS INICIALES ──────────────────────────────────────────
-- Usuario admin (contraseña: 1234, hash BCrypt generado por la API)
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username = 'admin')
BEGIN
    INSERT INTO Usuarios (Name, Username, PasswordHash, Role, Active)
    VALUES ('Admin', 'admin', '$2a$11$r5.9wR/Fkj5gBNY0XqGEA.fNRzDzXXMZ4vKW3mSq2jEjz4yP.Xp3i', 'admin', 1);
    PRINT 'Usuario admin insertado.';
END
GO

-- Productos de ejemplo
IF NOT EXISTS (SELECT 1 FROM Productos WHERE Sku = 'REF001')
BEGIN
    INSERT INTO Productos (Name, Sku, Category, Price, Cost, Stock, Unit) VALUES
        ('Refresco 600ml', 'REF001', 'Bebidas',   18, 10, 120, 'pza'),
        ('Agua 1.5L',      'AGU001', 'Bebidas',   22, 12,  80, 'pza'),
        ('Detergente 1kg', 'DET001', 'Limpieza',  45, 28,  60, 'pza'),
        ('Arroz 1kg',      'ARR001', 'Abarrotes', 24, 15, 200, 'kg' ),
        ('Azúcar 1kg',     'AZU001', 'Abarrotes', 28, 18, 150, 'kg' ),
        ('Aceite 1L',      'ACE001', 'Abarrotes', 55, 38,  90, 'pza'),
        ('Jabón de barra', 'JAB001', 'Limpieza',  15,  8, 200, 'pza'),
        ('Leche 1L',       'LEC001', 'Lácteos',   26, 18,  70, 'pza');
    PRINT 'Productos de ejemplo insertados.';
END
GO

PRINT '✅ Script ejecutado correctamente. Base de datos DGMayoreoDB lista.';
GO
