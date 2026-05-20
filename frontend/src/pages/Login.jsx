import { useState } from "react";
import { db, initDB } from "../utils/db";
import { S } from "../utils/styles";

export default function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    initDB();
    const users = db.getUsers();
    const found = users.find(x => x.username === u && x.password === p && x.active);
    if (found) onLogin(found);
    else setErr("Usuario o contraseña incorrectos");
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0f1117" }}>
      <div style={{ background:"#13161e", border:"1px solid #1e2330", borderRadius:20, padding:40, width:380, textAlign:"center" }}>
        <div style={{ width:60, height:60, borderRadius:16, background:"#1e3a5f", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:30 }}>🏪</div>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:700 }}>DG Mayoreo</h2>
        <p style={{ margin:"0 0 28px", color:"#64748b", fontSize:13 }}>Sistema Punto de Venta</p>

        <div style={{ textAlign:"left", marginBottom:14 }}>
          <label style={S.label}>Usuario</label>
          <input style={S.input} value={u} onChange={e=>setU(e.target.value)} placeholder="Escribe tu usuario" onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <div style={{ textAlign:"left", marginBottom:20 }}>
          <label style={S.label}>Contraseña</label>
          <input style={S.input} type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        {err && <p style={{ color:"#ef4444", fontSize:12, marginBottom:12 }}>{err}</p>}
        <button style={{ ...S.btn("primary"), width:"100%", padding:12, fontSize:15 }} onClick={submit}>
          Iniciar Sesión
        </button>
        <p style={{ marginTop:16, fontSize:12, color:"#475569" }}>
          Usuario: <b style={{ color:"#94a3b8" }}>admin</b> · Contraseña: <b style={{ color:"#94a3b8" }}>1234</b>
        </p>
      </div>
    </div>
  );
}
