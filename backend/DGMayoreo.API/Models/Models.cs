using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DGMayoreo.API.Models;

// ─── USUARIO ────────────────────────────────────────────────────────
public class Usuario
{
    [Key] public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = "";

    [Required, MaxLength(50)]
    public string Username { get; set; } = "";

    [Required]
    public string PasswordHash { get; set; } = "";

    [MaxLength(20)]
    public string Role { get; set; } = "cajero";   // admin | cajero

    public bool Active { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── PRODUCTO ───────────────────────────────────────────────────────
public class Producto
{
    [Key] public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = "";

    [MaxLength(30)]
    public string Sku { get; set; } = "";

    [MaxLength(50)]
    public string Category { get; set; } = "Otro";

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Cost { get; set; }

    public int Stock { get; set; }

    [MaxLength(20)]
    public string Unit { get; set; } = "pza";

    public bool Active { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── VENTA ──────────────────────────────────────────────────────────
public class Venta
{
    [Key] public int Id { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Payment { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Change { get; set; }

    public int CashierId { get; set; }

    [MaxLength(100)]
    public string CashierName { get; set; } = "";

    // Relación
    public ICollection<VentaDetalle> Items { get; set; } = new List<VentaDetalle>();
}

// ─── VENTA DETALLE ──────────────────────────────────────────────────
public class VentaDetalle
{
    [Key] public int Id { get; set; }

    public int VentaId { get; set; }
    public Venta? Venta { get; set; }

    public int ProductoId { get; set; }

    [MaxLength(150)]
    public string ProductoName { get; set; } = "";

    public int Qty { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }
}
