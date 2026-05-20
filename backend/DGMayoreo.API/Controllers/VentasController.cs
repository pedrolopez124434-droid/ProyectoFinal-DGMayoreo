using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DGMayoreo.API.Data;
using DGMayoreo.API.DTOs;
using DGMayoreo.API.Models;

namespace DGMayoreo.API.Controllers;

[ApiController]
[Route("api/ventas")]
public class VentasController : ControllerBase
{
    private readonly AppDbContext _db;
    public VentasController(AppDbContext db) => _db = db;

    // GET /api/ventas
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Ventas
            .Include(v => v.Items)
            .OrderByDescending(v => v.Date)
            .Select(v => new VentaDto(
                v.Id, v.Date, v.Total, v.Payment, v.Change, v.CashierName,
                v.Items.Select(i => new VentaDetalleDto(i.ProductoId, i.ProductoName, i.Qty, i.UnitPrice, i.Subtotal)).ToList()
            ))
            .ToListAsync();
        return Ok(list);
    }

    // GET /api/ventas/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var v = await _db.Ventas.Include(v => v.Items).FirstOrDefaultAsync(v => v.Id == id);
        if (v is null) return NotFound();
        return Ok(new VentaDto(
            v.Id, v.Date, v.Total, v.Payment, v.Change, v.CashierName,
            v.Items.Select(i => new VentaDetalleDto(i.ProductoId, i.ProductoName, i.Qty, i.UnitPrice, i.Subtotal)).ToList()
        ));
    }

    // POST /api/ventas
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVentaRequest req)
    {
        // Verificar stock
        foreach (var item in req.Items)
        {
            var prod = await _db.Productos.FindAsync(item.ProductoId);
            if (prod is null) return BadRequest(new { message = $"Producto {item.ProductoId} no encontrado" });
            if (prod.Stock < item.Qty) return BadRequest(new { message = $"Stock insuficiente para {prod.Name}" });
        }

        // Crear venta
        var venta = new Venta
        {
            Date        = DateTime.UtcNow,
            Total       = req.Total,
            Payment     = req.Payment,
            Change      = req.Change,
            CashierId   = req.CashierId,
            CashierName = req.CashierName,
            Items       = req.Items.Select(i => new VentaDetalle
            {
                ProductoId   = i.ProductoId,
                ProductoName = i.ProductoName,
                Qty          = i.Qty,
                UnitPrice    = i.UnitPrice,
                Subtotal     = i.UnitPrice * i.Qty,
            }).ToList(),
        };

        _db.Ventas.Add(venta);

        // Descontar stock
        foreach (var item in req.Items)
        {
            var prod = await _db.Productos.FindAsync(item.ProductoId);
            if (prod != null) prod.Stock -= item.Qty;
        }

        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = venta.Id },
            new VentaDto(venta.Id, venta.Date, venta.Total, venta.Payment, venta.Change, venta.CashierName,
                venta.Items.Select(i => new VentaDetalleDto(i.ProductoId, i.ProductoName, i.Qty, i.UnitPrice, i.Subtotal)).ToList()
            ));
    }
}
