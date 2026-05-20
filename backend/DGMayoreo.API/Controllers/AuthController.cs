using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DGMayoreo.API.Data;
using DGMayoreo.API.DTOs;

namespace DGMayoreo.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IConfiguration cfg)
    {
        _db  = db;
        _cfg = cfg;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Usuarios
            .FirstOrDefaultAsync(u => u.Username == req.Username && u.Active);

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Credenciales incorrectas" });

        var token = GenerateToken(user.Id, user.Username, user.Role);
        return Ok(new LoginResponse(user.Id, user.Name, user.Username, user.Role, token));
    }

    private string GenerateToken(int id, string username, string role)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(ClaimTypes.Name,            username),
            new Claim(ClaimTypes.Role,            role),
        };
        var token = new JwtSecurityToken(
            issuer:   _cfg["Jwt:Issuer"],
            audience: _cfg["Jwt:Audience"],
            claims:   claims,
            expires:  DateTime.UtcNow.AddHours(12),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
