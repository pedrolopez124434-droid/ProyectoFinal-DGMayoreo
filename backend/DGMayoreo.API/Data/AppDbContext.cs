using Microsoft.EntityFrameworkCore;
using DGMayoreo.API.Models;

namespace DGMayoreo.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario>     Usuarios     { get; set; }
    public DbSet<Producto>    Productos    { get; set; }
    public DbSet<Venta>       Ventas       { get; set; }
    public DbSet<VentaDetalle> VentaDetalles { get; set; }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Índice único en username
        mb.Entity<Usuario>().HasIndex(u => u.Username).IsUnique();

        // Índice único en SKU
        mb.Entity<Producto>().HasIndex(p => p.Sku).IsUnique();

        // Relación Venta → VentaDetalle
        mb.Entity<VentaDetalle>()
            .HasOne(d => d.Venta)
            .WithMany(v => v.Items)
            .HasForeignKey(d => d.VentaId);

        // ── Seed: Usuario admin ──────────────────────────────────
        mb.Entity<Usuario>().HasData(new Usuario
        {
            Id           = 1,
            Name         = "Admin",
            Username     = "admin",
            // Contraseña: 1234  (hash BCrypt)
            PasswordHash = "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
            Role         = "admin",
            Active       = true,
            CreatedAt    = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        });

        // ── Seed: Productos iniciales ────────────────────────────
        mb.Entity<Producto>().HasData(
            new Producto { Id=1, Name="Refresco 600ml", Sku="REF001", Category="Bebidas",   Price=18, Cost=10, Stock=120, Unit="pza", CreatedAt=new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new Producto { Id=2, Name="Agua 1.5L",      Sku="AGU001", Category="Bebidas",   Price=22, Cost=12, Stock=80,  Unit="pza", CreatedAt=new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new Producto { Id=3, Name="Detergente 1kg", Sku="DET001", Category="Limpieza",  Price=45, Cost=28, Stock=60,  Unit="pza", CreatedAt=new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new Producto { Id=4, Name="Arroz 1kg",      Sku="ARR001", Category="Abarrotes", Price=24, Cost=15, Stock=200, Unit="kg",  CreatedAt=new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) },
            new Producto { Id=5, Name="Azúcar 1kg",     Sku="AZU001", Category="Abarrotes", Price=28, Cost=18, Stock=150, Unit="kg",  CreatedAt=new DateTime(2024,1,1,0,0,0,DateTimeKind.Utc) }
        );
    }
}
