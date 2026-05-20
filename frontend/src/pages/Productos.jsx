import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { S, CATS, CAT_COLORS } from "../utils/styles";

const EMPTY = { name:"", sku:"", category:"Abarrotes", price:"", cost:"", stock:"", unit:"pza" };

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});

  useEffect(() => {
    api.getProductos().then(setProducts).catch(console.error);
  }, []);

  const save = async () => {
    const parsed = { ...form, price:+form.price, cost:+form.cost, stock:+form.stock };
    try {
      if (form.id) {
        await api.updateProducto(form.id, parsed);
      } else {
        await api.createProducto(parsed);
      }
      const updated = await api.getProductos();
      setProducts(updated);
      setModal(null);
    } catch(e) { alert("Error al guardar: " + e.message); }
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.deleteProducto(id);
      setProducts(products.filter(p => p.id !== id));
    } catch(e) { alert("Error al eliminar: " + e.message); }
  };

  const openEdit = (p) => { setForm({ ...p }); setModal("form"); };
  const openNew  = ()  => { setForm({ ...EMPTY }); setModal("form"); };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Gestión de Productos</h2>
          <p style={{ margin:0, color:"#64748b", fontSize:13 }}>{products.length} productos registrados</p>
        </div>
        <button style={{ ...S.btn("primary"), padding:"10px 20px" }} onClick={openNew}>+ Nuevo Producto</button>
      </div>

      <input style={{ ...S.input, marginBottom:16 }} placeholder="🔍 Buscar por nombre o SKU..." value={search} onChange={e=>setSearch(e.target.value)} />

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>{["SKU","Nombre","Categoría","Precio","Costo","Stock","Acciones"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background="#1a2235"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={S.td}><code style={{ fontSize:11, color:"#64748b" }}>{p.sku}</code></td>
                <td style={S.td}><b style={{ fontWeight:600 }}>{p.name}</b></td>
                <td style={S.td}><span style={S.badge(CAT_COLORS[p.category]||"#64748b")}>{p.category}</span></td>
                <td style={{ ...S.td, color:"#22c55e", fontWeight:700 }}>${p.price}</td>
                <td style={{ ...S.td, color:"#94a3b8" }}>${p.cost}</td>
                <td style={S.td}><span style={S.badge(p.stock<20?"#ef4444":"#22c55e")}>{p.stock} {p.unit}</span></td>
                <td style={S.td}>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ ...S.btn("ghost"), padding:"5px 12px" }} onClick={()=>openEdit(p)}>✏️ Editar</button>
                    <button style={{ ...S.btn("danger"), padding:"5px 12px" }} onClick={()=>del(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p style={{ textAlign:"center", color:"#475569", padding:24 }}>Sin resultados</p>}
      </div>

      {modal && (
        <div style={S.modal}>
          <div style={S.modalBox}>
            <h3 style={{ margin:"0 0 20px" }}>{form.id ? "Editar Producto" : "Nuevo Producto"}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["Nombre","name","text"],["SKU","sku","text"],["Precio ($)","price","number"],["Costo ($)","cost","number"],["Stock","stock","number"],["Unidad","unit","text"]].map(([l,k,t])=>(
                <div key={k}>
                  <label style={S.label}>{l}</label>
                  <input style={S.input} type={t} value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={S.label}>Categoría</label>
                <select style={{ ...S.input }} value={form.category||"Abarrotes"} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
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