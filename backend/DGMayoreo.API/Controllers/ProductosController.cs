using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DGMayoreo.API.Data;
using DGMayoreo.API.DTOs;
using DGMayoreo.API.Models;

namespace DGMayoreo.API.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductosController(AppDbContext db) => _db = db;

    // GET /api/productos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Productos
            .Where(p => p.Active)
            .OrderBy(p => p.Name)
            .Select(p => new ProductoDto(p.Id, p.Name, p.Sku, p.Category, p.Price, p.Cost, p.Stock, p.Unit, p.Active))
            .ToListAsync();
        return Ok(list);
    }

    // GET /api/productos/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _db.Productos.FindAsync(id);
        if (p is null) return NotFound();
        return Ok(new ProductoDto(p.Id, p.Name, p.Sku, p.Category, p.Price, p.Cost, p.Stock, p.Unit, p.Active));
    }

    // POST /api/productos
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SaveProductoRequest req)
    {
        var prod = new Producto
        {
            Name     = req.Name,
            Sku      = req.Sku.ToUpper(),
            Category = req.Category,
            Price    = req.Price,
            Cost     = req.Cost,
            Stock    = req.Stock,
            Unit     = req.Unit,
            Active   = req.Active,
        };
        _db.Productos.Add(prod);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = prod.Id },
            new ProductoDto(prod.Id, prod.Name, prod.Sku, prod.Category, prod.Price, prod.Cost, prod.Stock, prod.Unit, prod.Active));
    }

    // PUT /api/productos/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SaveProductoRequest req)
    {
        var prod = await _db.Productos.FindAsync(id);
        if (prod is null) return NotFound();

        prod.Name     = req.Name;
        prod.Sku      = req.Sku.ToUpper();
        prod.Category = req.Category;
        prod.Price    = req.Price;
        prod.Cost     = req.Cost;
        prod.Stock    = req.Stock;
        prod.Unit     = req.Unit;
        prod.Active   = req.Active;

        await _db.SaveChangesAsync();
        return Ok(new ProductoDto(prod.Id, prod.Name, prod.Sku, prod.Category, prod.Price, prod.Cost, prod.Stock, prod.Unit, prod.Active));
    }

    // DELETE /api/productos/{id}  (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var prod = await _db.Productos.FindAsync(id);
        if (prod is null) return NotFound();
        prod.Active = false;          // soft delete
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
