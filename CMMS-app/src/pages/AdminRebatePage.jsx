import { useState, useEffect, useMemo } from "react";
import api from "../Api";
import NavBar from "../components/utils/NavBar";

// ── Inline SVG Icon Components ─────────────────────────────────────────────
const Icon = ({ children, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const Icons = {
  Menu: (p) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>,
  Utensils: (p) => <Icon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></Icon>,
  Bell: (p) => <Icon {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>,
  User: (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  FileText: (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>,
  Clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
  CheckCircle: (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
  XCircle: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Icon>,
  Rupee: (p) => <Icon {...p}><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13l8.5 8"/><path d="M6 13h3a4 4 0 0 0 0-8"/></Icon>,
  Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>,
  Eye: (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>,
  Check: (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>,
  X: (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>,
  ArrowRight: (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>,
  Calendar: (p) => <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
  Inbox: (p) => <Icon {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Icon>,
  Save: (p) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>,
  CheckCircle2: (p) => <Icon {...p}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="m9 12 2 2 4-4"/></Icon>,
  Loader: (p) => <Icon {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Icon>,
};

// ── Status helpers ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:  { bg: "#fef3c7", color: "#f59e0b", Icon: Icons.Clock,       label: "Pending" },
  approved: { bg: "#dcfce7", color: "#22c55e", Icon: Icons.CheckCircle, label: "Approved" },
  rejected: { bg: "#fee2e2", color: "#ef4444", Icon: Icons.XCircle,     label: "Rejected" },
};

// ── Styles (CSS-in-JS objects) ────────────────────────────────────────────
const S = {
  // layout
  body:       { fontFamily:"'Manrope', sans-serif", background:"#f0f1fb", minHeight:"100vh", color:"#1a1b3a" },
  nav:        { background:"#fff", borderBottom:"1px solid #e5e6f7", display:"flex", alignItems:"center", padding:"0 28px", height:64, gap:14, position:"sticky", top:0, zIndex:100 },
  navIcon:    { width:38, height:38, background:"#5b5ef4", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 },
  navTitle:   { fontWeight:800, fontSize:17, color:"#1a1b3a", lineHeight:1.1 },
  navSub:     { fontSize:10, letterSpacing:".12em", color:"#7b7da8", fontWeight:600, textTransform:"uppercase" },
  navAvatar:  { width:36, height:36, borderRadius:"50%", background:"#f7f7fd", display:"flex", alignItems:"center", justifyContent:"center", color:"#7b7da8", cursor:"pointer", border:"2px solid #e5e6f7" },
  navBellWrap:{ position:"relative", cursor:"pointer", display:"flex", alignItems:"center", color:"#7b7da8" },
  navDot:     { position:"absolute", top:0, right:0, width:8, height:8, background:"#ef4444", borderRadius:"50%", border:"2px solid #fff" },
  main:       { padding:"32px 40px", maxWidth:1320, margin:"0 auto" },

  // hero
  hero:       { background:"#fff", borderRadius:16, padding:"28px 32px", display:"flex", alignItems:"center", gap:20, boxShadow:"0 2px 16px rgba(91,94,244,0.07)", marginBottom:28 },
  heroIcon:   { width:52, height:52, background:"#ededfd", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:"#5b5ef4", flexShrink:0 },
  heroBadge:  { marginLeft:"auto", background:"#5b5ef4", color:"#fff", padding:"6px 16px", borderRadius:50, fontSize:12, fontWeight:700, whiteSpace:"nowrap" },

  // stats
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 },
  statCard:   { background:"#fff", borderRadius:10, padding:"20px 22px", boxShadow:"0 2px 16px rgba(91,94,244,0.07)", display:"flex", alignItems:"center", gap:14, cursor:"pointer", transition:"transform .18s, box-shadow .18s" },
  statIcon:   { width:42, height:42, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  statNum:    { fontSize:26, fontWeight:800, color:"#1a1b3a", lineHeight:1 },
  statLabel:  { fontSize:12, color:"#7b7da8", fontWeight:600, marginTop:3 },

  // toolbar
  toolbar:    { display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" },
  searchWrap: { position:"relative", flex:1, minWidth:200 },
  searchIcon: { position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#7b7da8", display:"flex", alignItems:"center", pointerEvents:"none" },
  input:      { width:"100%", padding:"10px 14px 10px 38px", border:"1.5px solid #e5e6f7", borderRadius:10, background:"#fff", fontFamily:"inherit", fontSize:14, color:"#1a1b3a", outline:"none" },
  select:     { padding:"10px 32px 10px 14px", border:"1.5px solid #e5e6f7", borderRadius:10, background:"#fff", fontFamily:"inherit", fontSize:14, color:"#1a1b3a", outline:"none", cursor:"pointer", appearance:"none",
                backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7da8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" },

  // table
  tableWrap:  { background:"#fff", borderRadius:16, boxShadow:"0 2px 16px rgba(91,94,244,0.07)", overflow:"hidden" },
  thead:      { background:"#f7f7fd" },
  th:         { padding:"14px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#7b7da8", textTransform:"uppercase", letterSpacing:".1em", borderBottom:"1.5px solid #e5e6f7" },
  td:         { padding:"16px 18px", fontSize:14, verticalAlign:"middle", borderBottom:"1px solid #e5e6f7" },

  // badges
  catBadge:   { display:"inline-block", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:".06em", background:"#ededfd", color:"#5b5ef4" },
  daysBadge:  { display:"inline-flex", alignItems:"center", gap:4, background:"#ededfd", color:"#5b5ef4", padding:"4px 10px", borderRadius:6, fontSize:12, fontWeight:700 },

  // action btns
  aibtn:      { width:32, height:32, borderRadius:8, border:"1.5px solid #e5e6f7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", transition:"all .15s" },

  // modal
  overlay:    { position:"fixed", inset:0, background:"rgba(26,27,58,.45)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" },
  modal:      { background:"#fff", borderRadius:16, padding:32, width:560, maxWidth:"95vw", boxShadow:"0 4px 24px rgba(91,94,244,0.12)", animation:"slideUp .22s ease" },
  mlabel:     { fontSize:11, fontWeight:700, color:"#7b7da8", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6 },
  mval:       { fontSize:14, fontWeight:600, color:"#1a1b3a" },
  mdesc:      { background:"#f7f7fd", border:"1.5px solid #e5e6f7", borderRadius:10, padding:14, fontSize:14, lineHeight:1.65, color:"#1a1b3a" },
  calcBox:    { background:"#ededfd", borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 },
  mnote:      { width:"100%", padding:"10px 14px", border:"1.5px solid #e5e6f7", borderRadius:10, fontFamily:"inherit", fontSize:14, color:"#1a1b3a", background:"#f7f7fd", outline:"none", resize:"vertical", minHeight:72 },

  // loading
  loadingWrap: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16 },
};

// ── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ status, size = 11 }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Ic = cfg.Icon;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 11px", borderRadius:50, fontSize:12, fontWeight:700, background:cfg.bg, color:cfg.color }}>
      <Ic size={size} /> {cfg.label}
    </span>
  );
}

function ActionBtn({ onClick, color, hoverBg, title, children, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.aibtn, color: hov ? "#fff" : color, background: hov ? hoverBg : "#fff", borderColor: hov ? hoverBg : "#e5e6f7", opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      {children}
    </button>
  );
}

function StatCard({ label, value, iconBg, iconColor, IconComp, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.statCard, transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 4px 24px rgba(91,94,244,0.12)" : "0 2px 16px rgba(91,94,244,0.07)" }}>
      <div style={{ ...S.statIcon, background: iconBg, color: iconColor }}>
        <IconComp size={20} />
      </div>
      <div>
        <div style={S.statNum}>{value}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
function RebateModal({ item, onClose, onAction, isActioning }) {
  const [note, setNote] = useState(item.admin_note || "");

  if (!item) return null;

  const handleAction = (newStatus) => {
    onAction(item.id, newStatus, note);
  };

  const dailyRate = item.amount && item.days ? Math.round(item.amount / item.days) : 120;

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <div style={{ fontSize:18, fontWeight:800 }}>Rebate Application</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#7b7da8", width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icons.X size={18} />
          </button>
        </div>

        {/* Student info */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          {[["Student Name", item.user_name], ["Roll No.", item.user_roll_no], ["Mess / Hall", item.user_hall], ["Applied On", item.created_at ? new Date(item.created_at).toLocaleDateString() : ""]].map(([label, val]) => (
            <div key={label}>
              <div style={S.mlabel}>{label}</div>
              <div style={S.mval}>{val || "—"}</div>
            </div>
          ))}
        </div>

        <hr style={{ border:"none", borderTop:"1px solid #e5e6f7", margin:"0 0 16px" }} />

        {/* Leave details */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          {[["From Date", item.start_date], ["To Date", item.end_date], ["Total Days", item.days + " days"], ["Daily Rate", "₹" + dailyRate + " / day"]].map(([label, val]) => (
            <div key={label}>
              <div style={S.mlabel}>{label}</div>
              <div style={S.mval}>{val}</div>
            </div>
          ))}
        </div>

        {/* Reason / Location */}
        <div style={{ marginBottom:16 }}>
          <div style={S.mlabel}>Reason / Location</div>
          <div style={S.mdesc}>{item.location}</div>
        </div>

        {/* Rebate calc */}
        <div style={S.calcBox}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#5b5ef4" }}>Calculated Rebate Amount</div>
            <div style={{ fontSize:11, color:"#5b5ef4", opacity:.7, marginTop:1 }}>{item.days}d × ₹{dailyRate}/day</div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:"#5b5ef4" }}>₹{(item.amount || 0).toLocaleString("en-IN")}</div>
        </div>

        {/* Admin note */}
        <div style={{ marginBottom:20 }}>
          <div style={S.mlabel}>Admin Note (optional)</div>
          <textarea style={S.mnote} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the student…" />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <ModalBtn color="#22c55e" onClick={() => handleAction("approved")} disabled={isActioning}>
            <Icons.Check size={15} /> Approve
          </ModalBtn>
          <ModalBtn color="#ef4444" onClick={() => handleAction("rejected")} disabled={isActioning}>
            <Icons.X size={15} /> Reject
          </ModalBtn>
        </div>
      </div>
    </div>
  );
}

function ModalBtn({ color, onClick, children, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flex:1, padding:12, borderRadius:10, fontFamily:"inherit", fontSize:14, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer", border:"none", background:color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity: hov && !disabled ? .88 : disabled ? .5 : 1, transform: hov && !disabled ? "translateY(-1px)" : "none", transition:"all .15s" }}>
      {children}
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{
      position:"fixed", bottom:28, left:"50%",
      transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)",
      background:"#1a1b3a", color:"#fff", padding:"12px 22px", borderRadius:50,
      fontSize:14, fontWeight:600, zIndex:300, pointerEvents:"none", whiteSpace:"nowrap",
      display:"flex", alignItems:"center", gap:8,
      transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",
    }}>
      <Icons.CheckCircle2 size={16} /> <span>{msg}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AdminRebatePage() {
  // ── State ──
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total_approved_amount: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isActioning, setIsActioning] = useState(false);
  const PER = 8;

  // ── Fetch rebates + stats from backend API ──
  const fetchData = async () => {
    try {
      const [rebatesRes, statsRes, profileRes, notifRes] = await Promise.all([
        api.get("/api/rebates/"),
        api.get("/api/rebates/stats/"),
        api.get("/api/profile/"),
        api.get("/api/notifications/"),
      ]);
      setData(rebatesRes.data || []);
      setStats(statsRes.data || { pending: 0, approved: 0, rejected: 0, total_approved_amount: 0, total: 0 });
      setProfile(profileRes.data);
      setNotifications(notifRes.data?.results || notifRes.data || []);
    } catch (err) {
      console.error("Failed to fetch rebate data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNotifications = async () => {
    const hasUnseen = notifications.some(n => n.category === 'unseen');
    if (!hasUnseen) return;
    setNotifications(prev => prev.map(n => ({ ...n, category: 'seen' })));
    try { await api.post('/api/notifications/mark-seen/'); } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Filtered list (search + status + month) ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(d =>
      (!q || (d.user_name || "").toLowerCase().includes(q) || (d.user_roll_no || "").includes(q) || (d.location || "").toLowerCase().includes(q)) &&
      (!statusFilter || d.status === statusFilter) &&
      (!monthFilter || (d.start_date || "").startsWith(monthFilter) || (d.end_date || "").startsWith(monthFilter))
    );
  }, [data, search, statusFilter, monthFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const safePage = Math.min(currentPage, pages);
  const slice = filtered.slice((safePage - 1) * PER, safePage * PER);

  const activeItem = data.find(d => d.id === activeId) || null;

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  // ── Quick approve/reject via PATCH /api/rebates/<id>/ ──
  const quickStatus = async (id, newStatus) => {
    const item = data.find(d => d.id === id);
    setIsActioning(true);
    try {
      await api.patch(`/api/rebates/${id}/`, { status: newStatus });
      // Optimistic update
      setData(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      showToast((newStatus === "approved" ? "✓ Approved: " : "✗ Rejected: ") + (item?.user_name || ""));
      // Refresh stats
      const statsRes = await api.get("/api/rebates/stats/");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to update rebate status:", err);
      showToast("⚠ Failed to update status");
    } finally {
      setIsActioning(false);
    }
  };

  // ── Modal approve/reject with note via PATCH /api/rebates/<id>/ ──
  const handleModalAction = async (id, newStatus, note) => {
    const item = data.find(d => d.id === id);
    setIsActioning(true);
    try {
      const res = await api.patch(`/api/rebates/${id}/`, { status: newStatus, admin_note: note });
      // Update with full response from backend
      setData(prev => prev.map(d => d.id === id ? res.data : d));
      showToast((newStatus === "approved" ? "✓ Rebate approved — " : "✗ Application rejected — ") + (item?.user_name || ""));
      setActiveId(null);
      // Refresh stats
      const statsRes = await api.get("/api/rebates/stats/");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to update rebate:", err);
      showToast("⚠ Failed to update rebate");
    } finally {
      setIsActioning(false);
    }
  };

  const filterByStatus = (s) => { setStatusFilter(s); setCurrentPage(1); };

  // ── Auto-generate month filter options from actual data ──
  const monthOptions = useMemo(() => {
    const months = new Set();
    data.forEach(d => {
      if (d.start_date) months.add(d.start_date.substring(0, 7));
      if (d.end_date) months.add(d.end_date.substring(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [data]);

  const formatMonth = (ym) => {
    const [y, m] = ym.split("-");
    const names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${names[parseInt(m)]} ${y}`;
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div style={S.body}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.loadingWrap}>
          <Icons.Loader size={40} style={{ color: "#5b5ef4", animation: "spin 1s linear infinite" }} />
          <div style={{ color: "#7b7da8", fontWeight: 600 }}>Loading rebate applications…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Manrope', sans-serif; margin: 0; padding: 0; }
        @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: none; opacity:1; } }
        tr:hover td { background: #f7f7fd; }
        input:focus { border-color: #5b5ef4 !important; }
        select:focus { border-color: #5b5ef4 !important; }
        textarea:focus { border-color: #5b5ef4 !important; }
      `}</style>

      <div style={S.body}>

        {/* ── NAV ── */}
        <NavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />

        {/* ── MAIN ── */}
        <main style={S.main}>

          {/* Hero */}
          <div style={S.hero}>
            <div style={S.heroIcon}><Icons.FileText size={26} /></div>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800, color:"#1a1b3a" }}>Rebate Management</h1>
              <p style={{ color:"#7b7da8", fontSize:14, marginTop:2, fontWeight:500 }}>Review and approve student mess leave and rebate applications.</p>
            </div>
            <div style={S.heroBadge}>{stats.total} Total Applications</div>
          </div>

          {/* Stats — powered by GET /api/rebates/stats/ */}
          <div style={S.statsGrid}>
            <StatCard label="Pending"        value={stats.pending}  iconBg="#fef3c7" iconColor="#f59e0b" IconComp={Icons.Clock}       onClick={() => filterByStatus("pending")} />
            <StatCard label="Approved"       value={stats.approved} iconBg="#dcfce7" iconColor="#22c55e" IconComp={Icons.CheckCircle}  onClick={() => filterByStatus("approved")} />
            <StatCard label="Rejected"       value={stats.rejected} iconBg="#fee2e2" iconColor="#ef4444" IconComp={Icons.XCircle}      onClick={() => filterByStatus("rejected")} />
            <StatCard label="Total Approved" value={"₹" + (stats.total_approved_amount || 0).toLocaleString("en-IN")} iconBg="#ededfd" iconColor="#5b5ef4" IconComp={Icons.Rupee} onClick={() => filterByStatus("")} />
          </div>

          {/* Toolbar */}
          <div style={S.toolbar}>
            <div style={S.searchWrap}>
              <div style={S.searchIcon}><Icons.Search size={15} /></div>
              <input style={S.input} placeholder="Search by roll no, name, reason…" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <select style={S.select} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select style={S.select} value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">All Months</option>
              {monthOptions.map(ym => (
                <option key={ym} value={ym}>{formatMonth(ym)}</option>
              ))}
            </select>
          </div>

          {/* Table — data from GET /api/rebates/ */}
          <div style={S.tableWrap}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={S.thead}>
                <tr>
                  {["#","Student","Leave Period","Days","Reason","Applied On","Rebate Amt","Status","Actions"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign:"center", padding:"60px 20px", color:"#7b7da8", fontWeight:600 }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:"#e5e6f7" }}>
                        <Icons.Inbox size={48} />
                      </div>
                      No rebate applications match your filters.
                    </td>
                  </tr>
                ) : slice.map((d, i) => {
                  const dailyRate = d.amount && d.days ? Math.round(d.amount / d.days) : 120;
                  return (
                  <tr key={d.id}>
                    <td style={{ ...S.td, color:"#7b7da8", fontWeight:700, fontSize:13 }}>{(safePage-1)*PER+i+1}</td>

                    <td style={S.td}>
                      <div style={{ fontWeight:700 }}>{d.user_name}</div>
                      <div style={{ fontSize:12, color:"#7b7da8", marginTop:2 }}>{d.user_roll_no} · {d.user_hall}</div>
                    </td>

                    <td style={S.td}>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600 }}>
                        <span>{d.start_date}</span>
                        <span style={{ color:"#7b7da8" }}><Icons.ArrowRight size={12} /></span>
                        <span>{d.end_date}</span>
                      </div>
                    </td>

                    <td style={S.td}>
                      <span style={S.daysBadge}>
                        <Icons.Calendar size={11} /> {d.days}d
                      </span>
                    </td>

                    <td style={S.td}>
                      <span style={{ color:"#1a1b3a", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:180, display:"block" }}>{d.location}</span>
                    </td>

                    <td style={{ ...S.td, color:"#7b7da8", fontSize:13, fontWeight:600 }}>{d.created_at ? new Date(d.created_at).toLocaleDateString() : ""}</td>

                    <td style={S.td}>
                      <div style={{ fontWeight:800, fontSize:14 }}>₹{(d.amount || 0).toLocaleString("en-IN")}</div>
                      <div style={{ fontSize:11, color:"#7b7da8", marginTop:1 }}>{d.days}d × ₹{dailyRate}</div>
                    </td>

                    <td style={S.td}><StatusBadge status={d.status} /></td>

                    <td style={{ ...S.td, borderBottom: i === slice.length - 1 ? "none" : "1px solid #e5e6f7" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        {/* View detail — opens modal with data from GET /api/rebates/<id>/ */}
                        <ActionBtn color="#5b5ef4" hoverBg="#5b5ef4" title="View & Manage" onClick={() => setActiveId(d.id)}>
                          <Icons.Eye size={15} />
                        </ActionBtn>
                        {d.status !== "approved" && (
                          <ActionBtn color="#22c55e" hoverBg="#22c55e" title="Approve" onClick={() => quickStatus(d.id, "approved")} disabled={isActioning}>
                            <Icons.Check size={15} />
                          </ActionBtn>
                        )}
                        {d.status !== "rejected" && (
                          <ActionBtn color="#ef4444" hoverBg="#ef4444" title="Reject" onClick={() => quickStatus(d.id, "rejected")} disabled={isActioning}>
                            <Icons.X size={15} />
                          </ActionBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, padding:"16px 18px", borderTop:"1px solid #e5e6f7" }}>
                <span style={{ fontSize:13, color:"#7b7da8", fontWeight:600, marginRight:4 }}>Page {safePage} of {pages}</span>
                <PgBtn disabled={safePage === 1}   onClick={() => setCurrentPage(p => p - 1)}>‹</PgBtn>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <PgBtn key={p} active={p === safePage} onClick={() => setCurrentPage(p)}>{p}</PgBtn>
                ))}
                <PgBtn disabled={safePage === pages} onClick={() => setCurrentPage(p => p + 1)}>›</PgBtn>
              </div>
            )}
          </div>
        </main>

        {/* Modal — actions call PATCH /api/rebates/<id>/ */}
        {activeId && activeItem && (
          <RebateModal item={activeItem} onClose={() => setActiveId(null)} onAction={handleModalAction} isActioning={isActioning} />
        )}

        {/* Toast */}
        <Toast show={toast.show} msg={toast.msg} />
      </div>
    </>
  );
}

function PgBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false);
  const highlight = active || hov;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:34, height:34, borderRadius:9, border:"1.5px solid " + (highlight ? "#5b5ef4" : "#e5e6f7"), background: highlight ? "#5b5ef4" : "#fff", color: highlight ? "#fff" : "#1a1b3a", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity: disabled ? .35 : 1, transition:"all .15s" }}>
      {children}
    </button>
  );
}
