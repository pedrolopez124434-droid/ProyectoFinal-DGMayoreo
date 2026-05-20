using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DGMayoreo.API.Data;
using DGMayoreo.API.DTOs;
using DGMayoreo.API.Models;

namespace DGMayoreo.API.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsuariosController(AppDbContext db) => _db = db;

    // GET /api/usuarios
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Usuarios
            .OrderBy(u => u.Id)
            .Select(u => new UsuarioDto(u.Id, u.Name, u.Username, u.Role, u.Active, u.CreatedAt))
            .ToListAsync();
        return Ok(list);
    }

    // GET /api/usuarios/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var u = await _db.Usuarios.FindAsync(id);
        if (u is null) return NotFound();
        return Ok(new UsuarioDto(u.Id, u.Name, u.Username, u.Role, u.Active, u.CreatedAt));
    }

    // POST /api/usuarios
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUsuarioRequest req)
    {
        if (await _db.Usuarios.AnyAsync(u => u.Username == req.Username))
            return BadRequest(new { message = "El nombre de usuario ya existe" });

        var user = new Usuario
        {
            Name         = req.Name,
            Username     = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role         = req.Role,
            Active       = req.Active,
        };
        _db.Usuarios.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = user.Id },
            new UsuarioDto(user.Id, user.Name, user.Username, user.Role, user.Active, user.CreatedAt));
    }

    // PUT /api/usuarios/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUsuarioRequest req)
    {
        var user = await _db.Usuarios.FindAsync(id);
        if (user is null) return NotFound();

        user.Name     = req.Name;
        user.Username = req.Username;
        user.Role     = req.Role;
        user.Active   = req.Active;

        if (!string.IsNullOrWhiteSpace(req.Password))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        await _db.SaveChangesAsync();
        return Ok(new UsuarioDto(user.Id, user.Name, user.Username, user.Role, user.Active, user.CreatedAt));
    }

    // DELETE /api/usuarios/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Usuarios.FindAsync(id);
        if (user is null) return NotFound();
        _db.Usuarios.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
