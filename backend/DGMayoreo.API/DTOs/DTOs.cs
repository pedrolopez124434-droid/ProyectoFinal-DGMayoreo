namespace DGMayoreo.API.DTOs;

// ─── AUTH ────────────────────────────────────────────────────────────
public record LoginRequest(string Username, string Password);
public record LoginResponse(int Id, string Name, string Username, string Role, string Token);

// ─── USUARIOS ────────────────────────────────────────────────────────
public record UsuarioDto(int Id, string Name, string Username, string Role, bool Active, DateTime CreatedAt);

public record CreateUsuarioRequest(
    string Name,
    string Username,
    string Password,
    string Role,
    bool   Active
);

public record UpdateUsuarioRequest(
    string Name,
    string Username,
    string? Password,   // null = no cambiar contraseña
    string Role,
    bool   Active
);

// ─── PRODUCTOS ───────────────────────────────────────────────────────
public record ProductoDto(int Id, string Name, string Sku, string Category,
                          decimal Price, decimal Cost, int Stock, string Unit, bool Active);

public record SaveProductoRequest(
    string  Name,
    string  Sku,
    string  Category,
    decimal Price,
    decimal Cost,
    int     Stock,
    string  Unit,
    bool    Active = true
);

// ─── VENTAS ──────────────────────────────────────────────────────────
public record VentaItemRequest(int ProductoId, string ProductoName, int Qty, decimal UnitPrice);

public record CreateVentaRequest(
    decimal              Total,
    decimal              Payment,
    decimal              Change,
    int                  CashierId,
    string               CashierName,
    List<VentaItemRequest> Items
);

public record VentaDetalleDto(int ProductoId, string ProductoName, int Qty, decimal UnitPrice, decimal Subtotal);

public record VentaDto(int Id, DateTime Date, decimal Total, decimal Payment, decimal Change,
                       string CashierName, List<VentaDetalleDto> Items);
