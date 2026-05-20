import { db } from "../utils/db";
import { S } from "../utils/styles";

export default function Dashboard() {
  const sales    = db.getSales();
  const products = db.getProducts();
  const today    = new Date().toDateString();
  const todaySales  = sales.filter(s => new Date(s.date).toDateString() === today);
  const totalToday  = todaySales.reduce((a, s) => a + s.total, 0);
  const totalAll    = sales.reduce((a, s) => a + s.total, 0);
  const lowStock    = products.filter(p => p.stock < 20);

  const stats = [
    { label:"Ventas Hoy",   value:`$${totalToday.toLocaleString()}`, icon:"💰", color:"#22c55e" },
    { label:"Tickets Hoy",  value:todaySales.length,                  icon:"🧾", color:"#3b82f6" },
    { label:"Productos",    value:products.length,                    icon:"📦", color:"#f59e0b" },
    { label:"Total Ventas", value:`$${totalAll.toLocaleString()}`,    icon:"📊", color:"#a78bfa" },
  ];

  return (
    <div>
      <h2 style={{ margin:"0 0 20px", fontSize:20, fontWeight:700 }}>Panel Principal</h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={S.card}>
          <h3 style={{ margin:"0 0 14px", fontSize:14, color:"#94a3b8" }}>Últimas Ventas</h3>
          {sales.slice(-5).reverse().map(s => (
            <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #1e233060" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>Ticket #{s.id}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{new Date(s.date).toLocaleString()}</div>
              </div>
              <div style={{ fontWeight:700, color:"#22c55e" }}>${s.total.toLocaleString()}</div>
            </div>
          ))}
          {!sales.length && <p style={{ color:"#475569", fontSize:13 }}>Sin ventas registradas</p>}
        </div>

        <div style={S.card}>
          <h3 style={{ margin:"0 0 14px", fontSize:14, color:"#ef4444" }}>⚠️ Stock Bajo ({"<"}20)</h3>
          {lowStock.map(p => (
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1e233060" }}>
              <span style={{ fontSize:13 }}>{p.name}</span>
              <span style={S.badge("#ef4444")}>{p.stock} {p.unit}</span>
            </div>
          ))}
          {!lowStock.length && <p style={{ color:"#22c55e", fontSize:13 }}>✅ Todo el inventario en orden</p>}
        </div>
      </div>
    </div>
  );
}
