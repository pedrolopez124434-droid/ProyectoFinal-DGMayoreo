// api.js — Cambia BASE_URL a tu URL de Visual Studio (IIS Express / Kestrel)
const BASE_URL = "http://localhost:5000/api";

async function req(method, endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  // Auth
  login: (username, password) => req("POST", "/auth/login", { username, password }),

  // Usuarios
  getUsuarios:   ()     => req("GET",    "/usuarios"),
  createUsuario: (data) => req("POST",   "/usuarios", data),
  updateUsuario: (id, data) => req("PUT", `/usuarios/${id}`, data),
  deleteUsuario: (id)   => req("DELETE", `/usuarios/${id}`),

  // Productos
  getProductos:   ()     => req("GET",    "/productos"),
  createProducto: (data) => req("POST",   "/productos", data),
  updateProducto: (id, data) => req("PUT", `/productos/${id}`, data),
  deleteProducto: (id)   => req("DELETE", `/productos/${id}`),

  // Ventas
  getVentas:   ()     => req("GET",  "/ventas"),
  createVenta: (data) => req("POST", "/ventas", data),
  getVenta:    (id)   => req("GET",  `/ventas/${id}`),
};