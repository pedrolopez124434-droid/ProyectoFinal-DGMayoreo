import { useState } from "react";
import { db } from "../utils/db";
import { S } from "../utils/styles";

export default function Ventas() {
  const sales = db.getSales();
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");

  const total = sales.reduce((a,s) => a + s.total, 0);
  const filtered = [...sales].reverse().filter(s =>
    String(s.id).includes(search) || (s.cashier||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Historial de Ventas</h2>
          <p style={{ margin:0, color:"#64748b", fontSize:13 }}>
            {sales.length} ventas registradas · Total: <b style={{ color:"#22c55e" }}>${total.toLocaleString()}</b>
          </p>
        </div>
      </div>

      <input style={{ ...S.input, marginBottom:16 }} placeholder="🔍 Buscar por ticket o cajero..." value={search} onChange={e=>setSearch(e.target.value)} />

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>{["Ticket","Fecha","Artículos","Cajero","Total","Acciones"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} onMouseEnter={e=>e.currentTarget.style.background="#1a2235"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{ ...S.td, color:"#3b82f6", fontWeight:700 }}>#{s.id}</td>
                <td style={{ ...S.td, color:"#94a3b8", fontSize:12 }}>{new Date(s.date).toLocaleString()}</td>
                <td style={S.td}>{s.items.length} items</td>
                <td style={S.td}>{s.cashier}</td>
                <td style={{ ...S.td, color:"#22c55e", fontWeight:700 }}>${s.total.toLocaleString()}</td>
                <td style={S.td}>
                  <button style={{ ...S.btn("ghost"), padding:"4px 12px" }} onClick={()=>setSelected(s)}>Ver detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p style={{ textAlign:"center", color:"#475569", padding:24 }}>Sin ventas registradas aún</p>}
      </div>

      {selected && (
        <div style={S.modal} onClick={()=>setSelected(null)}>
          <div style={S.modalBox} onClick={e=>e.stopPropagation()}>
            <h3 style={{ margin:"0 0 4px" }}>🧾 Ticket #{selected.id}</h3>
            <p style={{ margin:"0 0 16px", color:"#64748b", fontSize:12 }}>
              {new Date(selected.date).toLocaleString()} · Cajero: {selected.cashier}
            </p>
            <div style={{ background:"#0f1117", borderRadius:10, padding:16, marginBottom:16 }}>
              {selected.items.map(i => (
                <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:"1px solid #1e233060" }}>
                  <span>{i.name} × {i.qty}</span>
                  <span style={{ color:"#22c55e", fontWeight:600 }}>${(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontWeight:700, fontSize:16 }}>
                <span>Total</span><span style={{ color:"#22c55e" }}>${selected.total.toLocaleString()}</span>
              </div>
              {selected.payment && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#94a3b8", marginTop:6 }}>
                    <span>Pagó</span><span>${selected.payment?.toLocaleString()}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#f59e0b", fontWeight:600 }}>
                    <span>Cambio</span><span>${selected.change?.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            <button style={{ ...S.btn("ghost"), width:"100%", padding:10 }} onClick={()=>setSelected(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
