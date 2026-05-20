import { useState } from "react";
import { db } from "../utils/db";
import { S, CATS, CAT_COLORS } from "../utils/styles";

export default function Venta({ user }) {
  const [products, setProducts] = useState(() => db.getProducts());
  const [cart, setCart]         = useState([]);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("Todos");
  const [payment, setPayment]   = useState("");
  const [ticket, setTicket]     = useState(null);

  const filtered = products.filter(p =>
    (cat === "Todos" || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku||"").toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (prod) => {
    if (prod.stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(c => c.id === prod.id);
      if (ex) return prev.map(c => c.id === prod.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...prod, qty:1 }];
    });
  };

  const changeQty = (id, delta) =>
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const total  = cart.reduce((a,c) => a + c.price * c.qty, 0);
  const change = payment ? Math.max(0, parseFloat(payment) - total) : 0;

  const finishSale = () => {
    if (!cart.length) return;
    const sales = db.getSales();
    const prods = db.getProducts();
    const newSale = {
      id: Date.now(), date: new Date().toISOString(),
      items: cart, total, cashier: user.name,
      payment: parseFloat(payment) || total, change,
    };
    const updProds = prods.map(p => {
      const item = cart.find(c => c.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    });
    db.setSales([...sales, newSale]);
    db.setProducts(updProds);
    setProducts(updProds);
    setTicket(newSale);
    setCart([]);
    setPayment("");
  };

  return (
    <div style={{ display:"flex", gap:20, height:"calc(100vh - 120px)" }}>
      {/* Catálogo */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
        <input style={S.input} placeholder="🔍 Buscar producto o SKU..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {CATS.map(c => (
            <button key={c} style={{ ...S.btn(cat===c?"primary":"ghost"), padding:"5px 12px", fontSize:12 }} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
        <div style={{ flex:1, overflow:"auto", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10, alignContent:"start" }}>
          {filtered.map(p => (
            <div key={p.id} onClick={()=>addToCart(p)}
              style={{ background:"#13161e", border:"1px solid #1e2330", borderRadius:10, padding:14, cursor:"pointer", opacity: p.stock<=0?.5:1 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#3b82f6"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#1e2330"}>
              <div style={{ fontSize:26, textAlign:"center", marginBottom:6 }}>📦</div>
              <div style={{ fontSize:12, fontWeight:600, lineHeight:1.3, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:11, color:"#64748b", marginBottom:6 }}>{p.sku}</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#22c55e" }}>${p.price}</div>
              <div style={{ fontSize:10, color: p.stock<20?"#ef4444":"#475569" }}>Stock: {p.stock} {p.unit}</div>
              <div style={{ ...S.badge(CAT_COLORS[p.category]||"#64748b"), marginTop:6, fontSize:10 }}>{p.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div style={{ width:320, display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ ...S.card, flex:1, overflow:"auto" }}>
          <h3 style={{ margin:"0 0 14px", fontSize:14, color:"#94a3b8", display:"flex", justifyContent:"space-between" }}>
            🛒 Carrito <span style={{ color:"#64748b", fontWeight:400 }}>{cart.length} items</span>
          </h3>
          {!cart.length && <p style={{ color:"#475569", fontSize:13 }}>Agrega productos haciendo clic</p>}
          {cart.map(item => (
            <div key={item.id} style={{ padding:"10px 0", borderBottom:"1px solid #1e233060" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{item.name}</span>
                <button style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:14 }} onClick={()=>removeItem(item.id)}>✕</button>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button style={{ ...S.btn(), padding:"2px 8px" }} onClick={()=>changeQty(item.id,-1)}>−</button>
                  <span style={{ fontSize:14, fontWeight:600, minWidth:24, textAlign:"center" }}>{item.qty}</span>
                  <button style={{ ...S.btn(), padding:"2px 8px" }} onClick={()=>changeQty(item.id,1)}>+</button>
                </div>
                <span style={{ fontSize:14, fontWeight:700, color:"#22c55e" }}>${(item.price*item.qty).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, fontSize:20, fontWeight:700 }}>
            <span>Total</span><span style={{ color:"#22c55e" }}>${total.toLocaleString()}</span>
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={S.label}>Pago con ($)</label>
            <input style={S.input} type="number" placeholder="Monto recibido" value={payment} onChange={e=>setPayment(e.target.value)} />
          </div>
          {payment && (
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:12, color:"#f59e0b", fontWeight:600 }}>
              <span>Cambio:</span><span>${change.toFixed(2)}</span>
            </div>
          )}
          <button style={{ ...S.btn("success"), width:"100%", padding:12, fontSize:15 }} onClick={finishSale} disabled={!cart.length}>
            ✅ Cobrar ${total.toLocaleString()}
          </button>
          <button style={{ ...S.btn("ghost"), width:"100%", padding:8, marginTop:8, fontSize:13 }} onClick={()=>setCart([])}>
            Limpiar carrito
          </button>
        </div>
      </div>

      {/* Ticket modal */}
      {ticket && (
        <div style={S.modal} onClick={()=>setTicket(null)}>
          <div style={{ ...S.modalBox, textAlign:"center" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:48, marginBottom:8 }}>✅</div>
            <h2 style={{ margin:"0 0 4px", color:"#22c55e" }}>Venta Exitosa</h2>
            <p style={{ color:"#64748b", margin:"0 0 20px" }}>Ticket #{ticket.id}</p>
            <div style={{ textAlign:"left", background:"#0f1117", borderRadius:10, padding:16, marginBottom:16 }}>
              {ticket.items.map(i => (
                <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"4px 0" }}>
                  <span>{i.name} ×{i.qty}</span>
                  <span>${(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #1e2330", marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:16 }}>
                <span>Total</span><span style={{ color:"#22c55e" }}>${ticket.total.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#94a3b8", marginTop:6 }}>
                <span>Pagó</span><span>${ticket.payment?.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#f59e0b", fontWeight:600 }}>
                <span>Cambio</span><span>${ticket.change?.toFixed(2)}</span>
              </div>
            </div>
            <button style={{ ...S.btn("primary"), padding:"10px 32px" }} onClick={()=>setTicket(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
