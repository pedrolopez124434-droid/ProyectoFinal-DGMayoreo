{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=DGMayoreoDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key":      "DGMayoreo_SuperSecretKey_2024!@#",
    "Issuer":   "DGMayoreo.API",
    "Audience": "DGMayoreo.Frontend"
  },
  "Logging": {
    "LogLevel": {
      "Default":              "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}