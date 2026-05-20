import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Venta from "./pages/Venta";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Usuarios from "./pages/Usuarios";

const NAV = [
  { id: "dashboard", label: "Panel Principal", icon: "🏠" },
  { id: "venta",     label: "Nueva Venta",     icon: "🛒" },
  { id: "productos", label: "Productos",        icon: "📦" },
  { id: "ventas",    label: "Historial Ventas", icon: "📋" },
  { id: "usuarios",  label: "Usuarios",         icon: "👥" },
];

const S = {
  app: { fontFamily: "'Sora','Segoe UI',sans-serif", display:"flex", height:"100vh", background:"#0f1117", color:"#e2e8f0", overflow:"hidden" },
  sidebar: { width:220, background:"#13161e", borderRight:"1px solid #1e2330", display:"flex", flexDirection:"column", padding:"20px 0" },
  logo: { padding:"0 20px 20px", borderBottom:"1px solid #1e2330", marginBottom:16 },
  logoTitle: { fontSize:18, fontWeight:700, color:"#fff", letterSpacing:-0.5, margin:0 },
  logoSub: { fontSize:11, color:"#64748b", margin:0, letterSpacing:1, textTransform:"uppercase" },
  navItem: (a) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", background:a?"#1a2235":"transparent", borderLeft:a?"3px solid #3b82f6":"3px solid transparent", color:a?"#93c5fd":"#94a3b8", fontSize:14, fontWeight:a?600:400, transition:"all .15s", userSelect:"none" }),
  main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
  topbar: { background:"#13161e", borderBottom:"1px solid #1e2330", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  content: { flex:1, overflow:"auto", padding:24 },
  btn: (v) => ({ cursor:"pointer", border:"none", borderRadius:8, fontWeight:600, fontSize:13, padding:"8px 16px", transition:"opacity .15s", ...(v==="ghost"?{background:"transparent",color:"#94a3b8",border:"1px solid #1e2330"}:{background:"#1e2330",color:"#e2e8f0"}) }),
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const s = localStorage.getItem("dg_session");
    if (s) setUser(JSON.parse(s));
  }, []);

  const logout = () => { localStorage.removeItem("dg_session"); setUser(null); };

  if (!user) return <Login onLogin={(u) => { localStorage.setItem("dg_session", JSON.stringify(u)); setUser(u); }} />;

  const PAGES = { dashboard: <Dashboard />, venta: <Venta user={user} />, productos: <Productos />, ventas: <Ventas />, usuarios: <Usuarios /> };

  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={{ fontSize:22, marginBottom:6 }}>🏪</div>
          <p style={S.logoTitle}>DG Mayoreo</p>
          <p style={S.logoSub}>Punto de Venta</p>
        </div>
        <div style={{ flex:1 }}>
          {NAV.map(n => (
            <div key={n.id} style={S.navItem(page===n.id)} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span>{n.label}
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 20px", borderTop:"1px solid #1e2330" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"#1e3a5f", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color:"#93c5fd" }}>{user.name[0]}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{user.name}</div>
              <div style={{ fontSize:11, color:"#64748b" }}>{user.role}</div>
            </div>
          </div>
          <button style={{ ...S.btn("ghost"), width:"100%", fontSize:12, padding:7 }} onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
      <div style={S.main}>
        <div style={S.topbar}>
          <span style={{ fontSize:14, fontWeight:600 }}>{NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}</span>
          <span style={{ fontSize:12, color:"#475569" }}>{new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span>
        </div>
        <div style={S.content}>{PAGES[page]}</div>
      </div>
    </div>
  );
}
