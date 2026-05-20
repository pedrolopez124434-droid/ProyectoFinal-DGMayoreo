// db.js — Base de datos local (localStorage) como fallback offline
// En producción, reemplaza con llamadas a api.js

const KEYS = { users:"dg_users", products:"dg_products", sales:"dg_sales" };

const initialUsers = [{ id:1, name:"Admin", username:"admin", password:"1234", role:"admin", active:true }];
const initialProducts = [
  { id:1, name:"Refresco 600ml",  sku:"REF001", category:"Bebidas",   price:18, cost:10, stock:120, unit:"pza" },
  { id:2, name:"Agua 1.5L",       sku:"AGU001", category:"Bebidas",   price:22, cost:12, stock:80,  unit:"pza" },
  { id:3, name:"Detergente 1kg",  sku:"DET001", category:"Limpieza",  price:45, cost:28, stock:60,  unit:"pza" },
  { id:4, name:"Arroz 1kg",       sku:"ARR001", category:"Abarrotes", price:24, cost:15, stock:200, unit:"kg"  },
  { id:5, name:"Azúcar 1kg",      sku:"AZU001", category:"Abarrotes", price:28, cost:18, stock:150, unit:"kg"  },
  { id:6, name:"Aceite 1L",       sku:"ACE001", category:"Abarrotes", price:55, cost:38, stock:90,  unit:"pza" },
  { id:7, name:"Jabón de barra",  sku:"JAB001", category:"Limpieza",  price:15, cost:8,  stock:200, unit:"pza" },
  { id:8, name:"Leche 1L",        sku:"LEC001", category:"Lácteos",   price:26, cost:18, stock:70,  unit:"pza" },
];

export function initDB() {
  if (!localStorage.getItem(KEYS.users))    localStorage.setItem(KEYS.users,    JSON.stringify(initialUsers));
  if (!localStorage.getItem(KEYS.products)) localStorage.setItem(KEYS.products, JSON.stringify(initialProducts));
  if (!localStorage.getItem(KEYS.sales))    localStorage.setItem(KEYS.sales,    JSON.stringify([]));
}

export const db = {
  getUsers:    ()     => JSON.parse(localStorage.getItem(KEYS.users)    || "[]"),
  setUsers:    (v)    => localStorage.setItem(KEYS.users,    JSON.stringify(v)),
  getProducts: ()     => JSON.parse(localStorage.getItem(KEYS.products) || "[]"),
  setProducts: (v)    => localStorage.setItem(KEYS.products, JSON.stringify(v)),
  getSales:    ()     => JSON.parse(localStorage.getItem(KEYS.sales)    || "[]"),
  setSales:    (v)    => localStorage.setItem(KEYS.sales,    JSON.stringify(v)),
};
