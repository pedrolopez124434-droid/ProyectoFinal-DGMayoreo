import { useState } from "react";
import { db } from "../utils/db";
import { S } from "../utils/styles";

const EMPTY = { name:"", username:"", password:"", role:"cajero", active:true };

export default function Usuarios() {
  const [users, setUsers] = useState(() => db.getUsers());
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({});

  const save = () => {
    const updated = form.id
      ? users.map(u => u.id === form.id ? form : u)
      : [...users, { ...form, id: Date.now() }];
    db.setUsers(updated);
    setUsers(updated);
    setModal(null);
  };

  const del = (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const updated = users.filter(u => u.id !== id);
    db.setUsers(updated);
    setUsers(updated);
  };

  const openEdit = (u) => { setForm({ ...u }); setModal("form"); };
  const openNew  = ()  => { setForm({ ...EMPTY }); setModal("form"); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Gestión de Usuarios</h2>
          <p style={{ margin:0, color:"#64748b", fontSize:13 }}>{users.length} usuarios registrados</p>
        </div>
        <button style={{ ...S.btn("primary"), padding:"10px 20px" }} onClick={openNew}>+ Nuevo Usuario</button>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>{["#","Nombre","Usuario","Rol","Estado","Acciones"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {users.map((u,i) => (
              <tr key={u.id} onMouseEnter={e=>e.currentTarget.style.background="#1a2235"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{ ...S.td, color:"#3b82f6", fontWeight:700 }}>#{i+1}</td>
                <td style={S.td}><b style={{ fontWeight:600 }}>{u.name}</b></td>
                <td style={S.td}><code style={{ color:"#94a3b8", fontSize:12 }}>@{u.username}</code></td>
                <td style={S.td}><span style={S.badge(u.role==="admin"?"#a78bfa":"#3b82f6")}>{u.role}</span></td>
                <td style={S.td}><span style={S.badge(u.active?"#22c55e":"#ef4444")}>{u.active?"Activo":"Inactivo"}</span></td>
                <td style={S.td}>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ ...S.btn("ghost"), padding:"5px 12px" }} onClick={()=>openEdit(u)}>✏️ Editar</button>
                    <button style={{ ...S.btn("danger"), padding:"5px 12px" }} onClick={()=>del(u.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={S.modal}>
          <div style={S.modalBox}>
            <h3 style={{ margin:"0 0 20px" }}>{form.id ? "Editar Usuario" : "Nuevo Usuario"}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["Nombre completo","name","text"],["Usuario","username","text"],["Contraseña","password","password"]].map(([l,k,t])=>(
                <div key={k}>
                  <label style={S.label}>{l}</label>
                  <input style={S.input} type={t} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={S.label}>Rol</label>
                <select style={S.input} value={form.role||"cajero"} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="cajero">Cajero</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Estado</label>
                <select style={S.input} value={form.active?"true":"false"} onChange={e=>setForm({...form,active:e.target.value==="true"})}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button style={S.btn("ghost")} onClick={()=>setModal(null)}>Cancelar</button>
              <button style={S.btn("primary")} onClick={save}>💾 Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
