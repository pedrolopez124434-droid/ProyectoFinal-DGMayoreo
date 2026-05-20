// styles.js — Design tokens compartidos en toda la app
export const S = {
  card:    { background:"#13161e", border:"1px solid #1e2330", borderRadius:12, padding:20 },
  statCard:{ background:"#13161e", border:"1px solid #1e2330", borderRadius:12, padding:"18px 20px" },
  table:   { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:      { textAlign:"left", padding:"10px 12px", color:"#64748b", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:.5, borderBottom:"1px solid #1e2330" },
  td:      { padding:"12px 12px", borderBottom:"1px solid #1e233060", verticalAlign:"middle" },
  input:   { width:"100%", padding:"9px 12px", background:"#0f1117", border:"1px solid #1e2330", borderRadius:8, color:"#e2e8f0", fontSize:13, outline:"none", boxSizing:"border-box" },
  label:   { fontSize:12, color:"#64748b", fontWeight:600, marginBottom:4, display:"block" },
  modal:   { position:"fixed", inset:0, background:"#00000088", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  modalBox:{ background:"#13161e", border:"1px solid #1e2330", borderRadius:16, padding:28, width:480, maxWidth:"95vw", maxHeight:"90vh", overflow:"auto" },
  btn: (v) => ({
    cursor:"pointer", border:"none", borderRadius:8, fontWeight:600, fontSize:13, padding:"8px 16px", transition:"opacity .15s",
    ...(v==="primary" ? { background:"#3b82f6",  color:"#fff" }
      : v==="danger"  ? { background:"#ef4444",  color:"#fff" }
      : v==="success" ? { background:"#22c55e",  color:"#fff" }
      : v==="warning" ? { background:"#f59e0b",  color:"#fff" }
      : v==="ghost"   ? { background:"transparent", color:"#94a3b8", border:"1px solid #1e2330" }
      :                 { background:"#1e2330",  color:"#e2e8f0" }),
  }),
  badge: (c) => ({ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c+"22", color:c, border:`1px solid ${c}44` }),
};

export const CATS = ["Todos","Bebidas","Abarrotes","Limpieza","Dulcería","Lácteos","Botanas","Otro"];
export const CAT_COLORS = { Bebidas:"#1e6fa8", Abarrotes:"#7a4f12", Limpieza:"#0f6e56", Dulcería:"#993556", Lácteos:"#3a5a9e", Botanas:"#a3580d", Otro:"#5f5e5a" };
