import React, { useState, useEffect, useCallback } from 'react';
import { supabase, presenceChannel } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ADMIN CSS — White Theme (scoped to .admin-root)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const adminCSS = `
.admin-root {
  --a-bg: #F3F4F6;
  --a-surface: #FFFFFF;
  --a-border: #E5E7EB;
  --a-text: #111827;
  --a-text2: #6B7280;
  --a-text3: #9CA3AF;
  --a-accent: #2563EB;
  --a-accent-light: #EFF6FF;
  --a-green: #059669;
  --a-green-bg: #ECFDF5;
  --a-orange: #D97706;
  --a-orange-bg: #FFFBEB;
  --a-red: #DC2626;
  --a-red-bg: #FEF2F2;
  --a-purple: #7C3AED;
  --a-purple-bg: #F5F3FF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  color: var(--a-text) !important;
  background: var(--a-bg) !important;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}
/* FORCE override ALL inherited dark-theme colors */
.admin-root, .admin-root * { color: inherit; }
.admin-root h1, .admin-root h2, .admin-root h3, .admin-root h4 { color: var(--a-text); }
.admin-root p, .admin-root span, .admin-root div, .admin-root td, .admin-root th, .admin-root label { color: inherit; }
.admin-root *, .admin-root *::before, .admin-root *::after { box-sizing: border-box; }
.admin-root input, .admin-root textarea, .admin-root select, .admin-root button { font-family: inherit; color: var(--a-text); }
.admin-root select option { background: #fff; color: var(--a-text); }
.admin-root a { color: var(--a-accent); text-decoration: none; }

/* Sidebar */
.a-sidebar {
  position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
  background: var(--a-surface); border-right: 1px solid var(--a-border);
  display: flex; flex-direction: column; z-index: 50; overflow-y: auto;
}
.a-sidebar-brand { padding: 24px 24px 16px; border-bottom: 1px solid var(--a-border); }
.a-sidebar-brand h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
.a-sidebar-brand p { font-size: 12px; color: var(--a-text3); margin: 4px 0 0; }
.a-nav { padding: 12px; flex: 1; }
.a-nav-btn {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 10px 16px; border: none; border-radius: 10px;
  background: transparent; color: var(--a-text2); font-size: 14px;
  font-weight: 600; cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
  text-align: left;
}
.a-nav-btn:hover { background: var(--a-bg); color: var(--a-text); }
.a-nav-btn.active { background: var(--a-accent-light); color: var(--a-accent); }
.a-nav-btn .icon { font-size: 18px; width: 24px; text-align: center; }
.a-badge {
  margin-left: auto; background: var(--a-accent); color: #fff;
  font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px;
}
.a-sidebar-footer { padding: 16px; border-top: 1px solid var(--a-border); }
.a-sidebar-footer a {
  display: flex; align-items: center; gap: 8px;
  color: var(--a-text3); text-decoration: none; font-size: 13px; font-weight: 600;
  padding: 8px 12px; border-radius: 8px; transition: all 0.15s;
}
.a-sidebar-footer a:hover { background: var(--a-bg); color: var(--a-text); }

/* Main */
.a-main { margin-left: 260px; padding: 32px; min-height: 100vh; }
.a-page-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 24px; }

/* Cards */
.a-card {
  background: var(--a-surface); border: 1px solid var(--a-border);
  border-radius: 14px; overflow: hidden;
}
.a-card-header {
  padding: 16px 20px; border-bottom: 1px solid var(--a-border);
  display: flex; align-items: center; justify-content: space-between;
}
.a-card-header h3 { font-size: 15px; font-weight: 700; margin: 0; }

/* Stat cards */
.a-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.a-stat {
  background: var(--a-surface); border: 1px solid var(--a-border);
  border-radius: 14px; padding: 20px; transition: box-shadow 0.2s;
}
.a-stat:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.a-stat-label { font-size: 12px; font-weight: 600; color: var(--a-text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.a-stat-value { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
.a-stat-sub { font-size: 12px; color: var(--a-text3); margin-top: 4px; }
.a-stat-icon { float: right; font-size: 28px; opacity: 0.6; margin-top: -4px; }

/* Tables */
.a-table { width: 100%; border-collapse: collapse; text-align: left; }
.a-table th {
  padding: 12px 20px; font-size: 12px; font-weight: 700; color: var(--a-text3);
  text-transform: uppercase; letter-spacing: 0.5px; background: var(--a-bg);
  border-bottom: 1px solid var(--a-border); position: sticky; top: 0;
}
.a-table td { padding: 14px 20px; font-size: 14px; border-bottom: 1px solid var(--a-border); vertical-align: middle; }
.a-table tr:hover td { background: #F9FAFB; }
.a-table-empty { padding: 48px 20px; text-align: center; color: var(--a-text3); font-size: 14px; }

/* Badges */
.a-badge-status {
  display: inline-block; padding: 4px 12px; border-radius: 8px;
  font-size: 12px; font-weight: 700; text-transform: capitalize; white-space: nowrap;
}
.a-badge-pending   { background: var(--a-orange-bg); color: var(--a-orange); }
.a-badge-accepted  { background: var(--a-accent-light); color: var(--a-accent); }
.a-badge-shipped   { background: var(--a-purple-bg); color: var(--a-purple); }
.a-badge-delivered { background: var(--a-green-bg); color: var(--a-green); }
.a-badge-cancelled { background: var(--a-red-bg); color: var(--a-red); }

/* Buttons */
.a-btn {
  padding: 8px 18px; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  display: inline-flex; align-items: center; gap: 6px;
}
.a-btn-primary { background: var(--a-accent); color: #fff !important; }
.a-btn-primary:hover { background: #1D4ED8; color: #fff !important; }
.a-btn-ghost { background: #fff; color: var(--a-text2) !important; border: 1px solid var(--a-border); }
.a-btn-ghost:hover { background: var(--a-border); color: var(--a-text) !important; }
.a-btn-ghost.active { background: var(--a-accent); color: #fff !important; border-color: var(--a-accent); }
.a-btn-danger { background: var(--a-red-bg); color: var(--a-red) !important; }
.a-btn-danger:hover { background: #FEE2E2; }
.a-btn-success { background: var(--a-green-bg); color: var(--a-green) !important; }
.a-btn-success:hover { background: #D1FAE5; }

/* Inputs */
.a-input {
  width: 100%; padding: 10px 14px; border: 1px solid var(--a-border);
  border-radius: 10px; font-size: 14px; background: #FFFFFF !important;
  color: var(--a-text) !important; outline: none; transition: border 0.15s;
}
.a-input::placeholder { color: var(--a-text3) !important; }
.a-input:focus { border-color: var(--a-accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.a-label { display: block; font-size: 12px; font-weight: 700; color: var(--a-text2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }

/* Live dot */
.a-live-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: var(--a-green); margin-right: 6px;
  animation: a-pulse 2s ease-in-out infinite;
}
@keyframes a-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

/* Expand panel */
.a-expand {
  padding: 20px; background: var(--a-bg);
  border-bottom: 1px solid var(--a-border);
  animation: a-slideDown 0.2s ease;
}
@keyframes a-slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 600px; } }

/* User avatar */
.a-avatar {
  width: 32px; height: 32px; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-weight: 700;
  font-size: 13px; flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .a-sidebar { display: none; }
  .a-main { margin-left: 0; padding: 16px; }
  .a-stats { grid-template-columns: repeat(2, 1fr); }
  .a-mob-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--a-surface); border-top: 1px solid var(--a-border);
    display: flex; z-index: 50; overflow-x: auto; padding: 4px;
  }
  .a-mob-nav button {
    flex: 1; padding: 10px 4px; border: none; background: none;
    font-size: 10px; font-weight: 600; color: var(--a-text3);
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    cursor: pointer; white-space: nowrap;
  }
  .a-mob-nav button.active { color: var(--a-accent); }
  .a-mob-nav button .icon { font-size: 20px; }
}
@media (min-width: 769px) { .a-mob-nav { display: none; } }
`;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TABS CONFIG
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TABS = [
  { id: 'overview',      label: 'Overview',       icon: '📊' },
  { id: 'orders',        label: 'Orders',         icon: '📦' },
  { id: 'stock',         label: 'Stock',          icon: '⚡' },
  { id: 'customers',     label: 'Customers',      icon: '👥' },
  { id: 'jobs',          label: 'Jobs',           icon: '💼' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
  { id: 'settings',      label: 'Settings',       icon: '⚙️' },
];


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN EXPORT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Real-time presence — count active site visitors (safe polling to avoid channel crash)
  useEffect(() => {
    const iv = setInterval(() => {
      try {
        const state = presenceChannel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      } catch (err) {}
    }, 2000);

    return () => clearInterval(iv);
  }, []);

  // Real-time notifications
  useEffect(() => {
    const ch = supabase.channel('admin-notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (p) => {
        const o = p.new;
        setNotifications(prev => [{ id: o.id, type: 'order', title: `New order — ${o.customer_name}`, detail: `${o.variant} · ₹${(o.amount/100).toLocaleString()}`, time: new Date(o.created_at), read: false }, ...prev].slice(0, 50));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'job_applications' }, (p) => {
        const a = p.new;
        setNotifications(prev => [{ id: a.id, type: 'application', title: `New application — ${a.full_name}`, detail: a.email, time: new Date(a.created_at), read: false }, ...prev].slice(0, 50));
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="admin-root">
      <style>{adminCSS}</style>

      {/* ── Desktop Sidebar ── */}
      <aside className="a-sidebar">
        <div className="a-sidebar-brand">
          <h2>DENTY Admin</h2>
          <p>ZERO Dashboard</p>
        </div>

        {/* User card */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="a-avatar" style={{ background: 'var(--a-accent-light)', color: 'var(--a-accent)' }}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: 'var(--a-accent)', fontWeight: 600 }}>Administrator</div>
          </div>
        </div>

        {/* Live users */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="a-live-dot" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-green)' }}>{onlineUsers}</span>
          <span style={{ fontSize: 12, color: 'var(--a-text3)' }}>users online now</span>
        </div>

        <nav className="a-nav">
          {TABS.map(t => (
            <button key={t.id} className={`a-nav-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <span className="icon">{t.icon}</span> {t.label}
              {t.id === 'notifications' && unreadCount > 0 && <span className="a-badge">{unreadCount}</span>}
            </button>
          ))}
        </nav>

        <div className="a-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link to="/">← Back to Site</Link>
          <button 
            onClick={signOut} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, color: 'var(--a-red)', 
              background: 'none', border: 'none', fontSize: 13, fontWeight: 600, 
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', 
              transition: 'all 0.15s' 
            }} 
            onMouseOver={e => e.currentTarget.style.background = 'var(--a-red-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: 16 }}>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Tab Bar ── */}
      <div className="a-mob-nav">
        {TABS.map(t => (
          <button key={t.id} className={activeTab === t.id ? 'active' : ''} onClick={() => setActiveTab(t.id)}>
            <span className="icon">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="a-main">
        {activeTab === 'overview' && <OverviewView onlineUsers={onlineUsers} />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'stock' && <StockView />}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'jobs' && <JobsView />}
        {activeTab === 'notifications' && <NotificationsView notifications={notifications} setNotifications={setNotifications} />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. OVERVIEW
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function OverviewView({ onlineUsers }) {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, visitors: 0, stock: 0, pending: 0, shipped: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [{ data: orders }, { data: stockData }, { count: views }] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('stock').select('*'),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
      ]);
      const all = orders || [];
      setStats({
        revenue: all.reduce((s, o) => s + (o.amount || 0), 0),
        orders: all.length,
        visitors: views || 0,
        stock: (stockData || []).reduce((s, i) => s + i.quantity, 0),
        pending: all.filter(o => o.status === 'pending' || o.status === 'accepted').length,
        shipped: all.filter(o => o.status === 'shipped').length,
      });
      setRecentOrders(all.slice(0, 8));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase.channel('overview-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAll).subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetchAll]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="a-page-title">Overview</h1>

      <div className="a-stats">
        <StatCard label="Revenue" value={`₹${(stats.revenue / 100).toLocaleString()}`} icon="💰" sub={`${stats.orders} orders`} />
        <StatCard label="Orders" value={stats.orders} icon="📦" sub={`${stats.pending} pending · ${stats.shipped} shipped`} />
        <StatCard label="Page Views" value={stats.visitors.toLocaleString()} icon="👁️" sub="Last 90 days" />
        <StatCard label="Online Now" value={onlineUsers} icon="🟢" sub="Real-time visitors" accent />
      </div>

      {/* Stock overview */}
      <div className="a-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <StatCard label="Total Stock" value={stats.stock} icon="⚡" sub="Units available" />
        <StatCard label="Pending Orders" value={stats.pending} icon="⏳" sub="Awaiting action" />
        <StatCard label="Shipped" value={stats.shipped} icon="🚚" sub="In transit" />
      </div>

      {/* Recent Orders */}
      <div className="a-card">
        <div className="a-card-header"><h3>Recent Orders</h3></div>
        <table className="a-table">
          <thead><tr>
            <th>Order #</th><th>Customer</th><th>Variant</th><th>Amount</th><th>Status</th><th>Date</th>
          </tr></thead>
          <tbody>
            {recentOrders.length === 0 ? <tr><td colSpan="6" className="a-table-empty">No orders yet</td></tr> : recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--a-accent)', fontWeight: 600 }}>{o.order_number || o.id.slice(0,8)}</td>
                <td>{o.customer_name}</td>
                <td><span style={{ fontWeight: 700 }}>{o.variant}</span></td>
                <td style={{ fontWeight: 600 }}>₹{(o.amount/100).toLocaleString()}</td>
                <td><StatusBadge s={o.status} /></td>
                <td style={{ color: 'var(--a-text3)', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, sub, accent }) {
  return (
    <div className="a-stat" style={accent ? { borderColor: 'var(--a-green)', borderWidth: 2 } : {}}>
      <span className="a-stat-icon">{icon}</span>
      <div className="a-stat-label">{label}</div>
      <div className="a-stat-value" style={accent ? { color: 'var(--a-green)' } : {}}>{value}</div>
      <div className="a-stat-sub">{sub}</div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. ORDERS — Full CRUD, Filters, Search, Realtime
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [tracking, setTracking] = useState({});
  const [notes, setNotes] = useState({});

  const fetch = useCallback(async () => {
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    if (data) setOrders(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetch();
    const ch = supabase.channel('orders-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetch).subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetch]);

  const updateStatus = async (id, status) => { await supabase.from('orders').update({ status }).eq('id', id); fetch(); };
  const saveDetails = async (id) => {
    const u = {};
    if (tracking[id]) u.tracking_number = tracking[id];
    if (notes[id]) u.admin_notes = notes[id];
    if (Object.keys(u).length) { await supabase.from('orders').update(u).eq('id', id); fetch(); }
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const t = search.toLowerCase();
    return [o.customer_name, o.customer_email, o.order_number, o.customer_phone].some(f => f?.toLowerCase().includes(t));
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="a-page-title">Orders</h1>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        {['all','pending','accepted','shipped','delivered','cancelled'].map(s => (
          <button key={s} className={`a-btn a-btn-ghost ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <input className="a-input" placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280, marginLeft: 'auto' }} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--a-text3)', marginBottom: 12 }}>{filtered.length} order{filtered.length !== 1 ? 's' : ''} {filter !== 'all' && `(${filter})`}</p>

      <div className="a-card">
        <table className="a-table">
          <thead><tr>
            <th>Order #</th><th>Customer</th><th>Variant</th><th>Amount</th><th>Status</th><th>Date</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="7" className="a-table-empty">No orders found</td></tr> : filtered.map(o => (
              <React.Fragment key={o.id}>
                <tr onClick={() => setExpanded(expanded === o.id ? null : o.id)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--a-accent)', fontWeight: 600, fontSize: 13 }}>{o.order_number || o.id.slice(0,8)}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--a-text3)' }}>{o.customer_email}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{o.variant}</td>
                  <td style={{ fontWeight: 600 }}>₹{(o.amount/100).toLocaleString()}</td>
                  <td><StatusBadge s={o.status} /></td>
                  <td style={{ color: 'var(--a-text3)', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{ color: 'var(--a-text3)' }}>{expanded === o.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === o.id && (
                  <tr><td colSpan="7" style={{ padding: 0 }}>
                    <div className="a-expand">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {/* Details */}
                        <div>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-accent)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Delivery Details</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '6px 12px', fontSize: 14 }}>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Name</span><span>{o.customer_name}</span>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Email</span><span>{o.customer_email}</span>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Phone</span><span>{o.customer_phone}</span>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Address</span><span>{o.delivery_address}</span>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>City</span><span>{o.city}, {o.state} — {o.pincode}</span>
                            <span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Payment</span><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.payment_id}</span>
                            {o.tracking_number && <><span style={{ color: 'var(--a-text3)', fontWeight: 600 }}>Tracking</span><span style={{ fontFamily: 'monospace', color: 'var(--a-accent)' }}>{o.tracking_number}</span></>}
                          </div>
                        </div>
                        {/* Actions */}
                        <div>
                          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-accent)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Actions</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <input className="a-input" placeholder="Tracking number (DTDC)" defaultValue={o.tracking_number || ''} onChange={e => setTracking(p => ({...p, [o.id]: e.target.value}))} />
                            <textarea className="a-input" placeholder="Admin notes" defaultValue={o.admin_notes || ''} onChange={e => setNotes(p => ({...p, [o.id]: e.target.value}))} style={{ resize: 'none', height: 72 }} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {o.status === 'pending' && <button className="a-btn a-btn-primary" onClick={() => updateStatus(o.id, 'accepted')}>✓ Accept</button>}
                              {o.status === 'accepted' && <button className="a-btn a-btn-primary" onClick={() => updateStatus(o.id, 'shipped')}>🚚 Ship</button>}
                              {o.status === 'shipped' && <button className="a-btn a-btn-success" onClick={() => updateStatus(o.id, 'delivered')}>✅ Delivered</button>}
                              {!['cancelled','delivered'].includes(o.status) && <button className="a-btn a-btn-danger" onClick={() => updateStatus(o.id, 'cancelled')}>✕ Cancel</button>}
                              <button className="a-btn a-btn-ghost" onClick={() => saveDetails(o.id)}>💾 Save</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. STOCK — Live CRUD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StockView() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editQty, setEditQty] = useState({});
  const [editPrice, setEditPrice] = useState({});
  const [saving, setSaving] = useState({});
  const colors = { BUDDY: '#059669', LUNA: '#DB2777', BATMAN: '#D97706' };

  const fetchStock = async () => { const { data } = await supabase.from('stock').select('*').order('variant'); if (data) setStock(data); setLoading(false); };
  useEffect(() => {
    fetchStock();
    const ch = supabase.channel('stock-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'stock' }, fetchStock).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const save = async (v) => {
    const qty = editQty[v] !== undefined ? parseInt(editQty[v]) : stock.find(s => s.variant === v).quantity;
    const price = editPrice[v] !== undefined ? parseInt(editPrice[v]) : stock.find(s => s.variant === v).price || 1199;
    if (isNaN(qty) || qty < 0 || isNaN(price) || price < 0) return;
    
    setSaving(p => ({...p,[v]:true}));
    await supabase.from('stock').update({ quantity: qty, price: price }).eq('variant', v);
    setSaving(p => ({...p,[v]:false})); 
    setEditQty(p => ({...p,[v]:undefined}));
    setEditPrice(p => ({...p,[v]:undefined}));
    fetchStock();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="a-page-title">Stock Management</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {stock.map(item => {
          const c = colors[item.variant] || '#6B7280';
          return (
            <div key={item.variant} className="a-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: c }}>{item.variant}</span>
                {item.quantity < 20 && item.quantity > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--a-orange)', background: 'var(--a-orange-bg)', padding: '3px 10px', borderRadius: 8 }}>⚠ Low</span>}
                {item.quantity === 0 && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--a-red)', background: 'var(--a-red-bg)', padding: '3px 10px', borderRadius: 8 }}>Out of Stock</span>}
              </div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--a-text3)', textTransform: 'uppercase', marginBottom: 2 }}>Stock</div>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{item.quantity}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--a-text3)', textTransform: 'uppercase', marginBottom: 2 }}>Price</div>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>₹{item.price || 1199}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--a-text3)', marginBottom: 24 }}>updated {new Date(item.updated_at).toLocaleDateString('en-IN')}</div>
              
              <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--a-text3)', display: 'block', marginBottom: 4 }}>Qty</label>
                    <input type="number" min="0" className="a-input" value={editQty[item.variant] !== undefined ? editQty[item.variant] : item.quantity} onChange={e => setEditQty(p => ({...p, [item.variant]: e.target.value}))} style={{ width: '100%', fontWeight: 700 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--a-text3)', display: 'block', marginBottom: 4 }}>Price (₹)</label>
                    <input type="number" min="0" className="a-input" value={editPrice[item.variant] !== undefined ? editPrice[item.variant] : (item.price || 1199)} onChange={e => setEditPrice(p => ({...p, [item.variant]: e.target.value}))} style={{ width: '100%', fontWeight: 700 }} />
                  </div>
                </div>
                <button className="a-btn a-btn-primary" onClick={() => save(item.variant)} disabled={saving[item.variant]} style={{ width: '100%' }}>
                  {saving[item.variant] ? 'Saving…' : 'Update Specs'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. CUSTOMERS — Profiles from Supabase
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setCustomers(data); setLoading(false); });
  }, []);

  const filtered = customers.filter(c => !search || c.full_name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>Customers</h1>
        <input className="a-input" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--a-text3)', marginBottom: 12 }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''} registered</p>

      <div className="a-card">
        <table className="a-table">
          <thead><tr><th>#</th><th>Name</th><th>Role</th><th>Joined</th><th>User ID</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="5" className="a-table-empty">No customers found</td></tr> : filtered.map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: 'var(--a-text3)', fontSize: 13 }}>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="a-avatar" style={{ background: c.role === 'admin' ? 'var(--a-accent-light)' : '#F3F4F6', color: c.role === 'admin' ? 'var(--a-accent)' : 'var(--a-text3)' }}>
                      {(c.full_name || '?').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{c.full_name || 'Unknown'}</span>
                  </div>
                </td>
                <td>
                  <span className="a-badge-status" style={{ background: c.role === 'admin' ? 'var(--a-accent-light)' : '#F3F4F6', color: c.role === 'admin' ? 'var(--a-accent)' : 'var(--a-text3)' }}>{c.role}</span>
                </td>
                <td style={{ color: 'var(--a-text3)', fontSize: 13 }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--a-text3)' }}>{c.id.slice(0,14)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5. JOBS — Full CRUD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function JobsView() {
  const [tab, setTab] = useState('listings');
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchJobs = async () => { const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false }); if (data) setJobs(data); setLoading(false); };
  const fetchApps = async () => { const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false }); if (data) setApps(data); };

  useEffect(() => { fetchJobs(); fetchApps(); }, []);

  const toggleActive = async (id, active) => { await supabase.from('jobs').update({ is_active: !active }).eq('id', id); fetchJobs(); };
  const deleteJob = async (id) => { if (!confirm('Delete this job and all its applications?')) return; await supabase.from('jobs').delete().eq('id', id); fetchJobs(); fetchApps(); };
  const postJob = async (e) => {
    e.preventDefault(); setPosting(true);
    const f = e.target;
    const { error } = await supabase.from('jobs').insert([{
      title: f.title.value, 
      department: 'Careers', 
      location: 'Remote',
      employment_type: f.duration.value, 
      salary_range: f.salary.value,
      description: f.experience.value, 
      requirements: f.skills.value, 
      is_active: true,
    }]);
    setPosting(false);
    if (error) {
      alert('Error posting job: ' + error.message);
    } else {
      f.reset(); setTab('listings'); fetchJobs();
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>Jobs Dashboard</h1>
        <div style={{ display: 'flex', gap: 4, background: 'var(--a-bg)', padding: 4, borderRadius: 12, border: '1px solid var(--a-border)' }}>
          {[['listings', `Listings (${jobs.length})`], ['post', 'Post Job'], ['apps', `Applications (${apps.length})`]].map(([k, l]) => (
            <button key={k} className={`a-btn ${tab === k ? 'a-btn-primary' : 'a-btn-ghost'}`} style={{ border: 'none' }} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.length === 0 ? <div className="a-card" style={{ padding: 48, textAlign: 'center', color: 'var(--a-text3)' }}>No jobs posted yet</div> : jobs.map(j => (
            <div key={j.id} className="a-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>{j.title}</span>
                    <span className="a-badge-status" style={{ background: j.is_active ? 'var(--a-green-bg)' : '#F3F4F6', color: j.is_active ? 'var(--a-green)' : 'var(--a-text3)' }}>
                      {j.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--a-text3)', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                    <span>⏳ {j.employment_type}</span>
                    {j.salary_range && <span>💰 {j.salary_range}</span>}
                    <span>🎓 {j.description}</span>
                    <span style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>🛠️ {j.requirements}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="a-btn a-btn-ghost" onClick={() => toggleActive(j.id, j.is_active)}>{j.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button className="a-btn a-btn-danger" onClick={() => deleteJob(j.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'post' && (
        <div className="a-card" style={{ padding: 28, maxWidth: 640 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Post New Job</h3>
          <form onSubmit={postJob} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label className="a-label">Job Title *</label><input name="title" className="a-input" required placeholder="e.g. Senior Frontend Engineer" /></div>
              <div><label className="a-label">Duration *</label><input name="duration" className="a-input" placeholder="e.g. Full-time, 6 Months" required /></div>
              <div><label className="a-label">Salary *</label><input name="salary" className="a-input" placeholder="e.g. ₹6L – ₹12L" required /></div>
            </div>
            <div><label className="a-label">Experience Required *</label><input name="experience" className="a-input" required placeholder="e.g. 3+ years in React" /></div>
            <div><label className="a-label">Skills *</label><textarea name="skills" className="a-input" required placeholder="React, Node.js, Supabase..." style={{ resize: 'none', height: 80 }} /></div>
            <button className="a-btn a-btn-primary" type="submit" disabled={posting} style={{ alignSelf: 'flex-start', padding: '10px 28px' }}>
              {posting ? 'Posting…' : 'Post Job'}
            </button>
          </form>
        </div>
      )}

      {tab === 'apps' && (
        <div className="a-card">
          <table className="a-table">
            <thead><tr><th>Applicant</th><th>Email</th><th>Phone</th><th>Resume</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {apps.length === 0 ? <tr><td colSpan="6" className="a-table-empty">No applications yet</td></tr> : apps.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.full_name}</td>
                  <td style={{ color: 'var(--a-text2)' }}>{a.email}</td>
                  <td style={{ color: 'var(--a-text2)' }}>{a.phone}</td>
                  <td><a href={a.resume_url} target="_blank" rel="noreferrer" style={{ color: 'var(--a-accent)', fontWeight: 600, textDecoration: 'none' }}>View ↗</a></td>
                  <td><StatusBadge s={a.status} /></td>
                  <td style={{ color: 'var(--a-text3)', fontSize: 13 }}>{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   6. NOTIFICATIONS — Real-time
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NotificationsView({ notifications, setNotifications }) {
  const icons = { order: '📦', application: '💼' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>Notifications</h1>
        <button className="a-btn a-btn-ghost" onClick={() => setNotifications(p => p.map(n => ({...n, read: true})))}>Mark all read</button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--a-text3)', marginBottom: 16 }}>{notifications.filter(n => !n.read).length} unread</p>

      {notifications.length === 0 ? (
        <div className="a-card" style={{ padding: 48, textAlign: 'center', color: 'var(--a-text3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <p>No notifications yet. New orders and applications will appear here in real time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} className="a-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, borderLeft: !n.read ? '4px solid var(--a-accent)' : undefined }}>
              <div className="a-avatar" style={{ background: 'var(--a-accent-light)', color: 'var(--a-accent)', fontSize: 18 }}>{icons[n.type] || '🔔'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--a-text3)' }}>{n.detail}</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--a-text3)', whiteSpace: 'nowrap' }}>{timeAgo(n.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7. SETTINGS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SettingsView() {
  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--a-border)' }}>
      <span style={{ fontWeight: 600, color: 'var(--a-text2)', fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{value} <span style={{ color: 'var(--a-green)' }}>✓</span></span>
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 className="a-page-title">Settings</h1>

      <div className="a-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Store Configuration</h3>
        <Row label="Currency" value="INR (₹)" />
        <Row label="Courier" value="DTDC Express" />
        <Row label="Payments" value="Razorpay" />
        <Row label="Admin Email" value="zero.denty.support@gmail.com" />
        <p style={{ fontSize: 12, color: 'var(--a-text3)', marginTop: 16, fontStyle: 'italic' }}>Contact zero.denty.support@gmail.com to modify store settings.</p>
      </div>

      <div className="a-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Database</h3>
        <Row label="Schema" value="v2.0 Production" />
        <Row label="Storage" value="500 MB" />
        <Row label="Tables" value="6 active" />
      </div>

      <div className="a-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Theme</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="a-btn a-btn-primary" style={{ flex: 1, padding: '12px 0', justifyContent: 'center' }}>☀ Light (Active)</button>
          <button className="a-btn a-btn-ghost" style={{ flex: 1, padding: '12px 0', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}>🌙 Dark (Soon)</button>
        </div>
      </div>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHARED
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatusBadge({ s }) {
  const cls = { pending: 'a-badge-pending', accepted: 'a-badge-accepted', shipped: 'a-badge-shipped', delivered: 'a-badge-delivered', cancelled: 'a-badge-cancelled', received: 'a-badge-accepted', reviewing: 'a-badge-pending', shortlisted: 'a-badge-shipped', rejected: 'a-badge-cancelled', hired: 'a-badge-delivered' };
  return <span className={`a-badge-status ${cls[s] || ''}`}>{s}</span>;
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--a-border)', borderTopColor: 'var(--a-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
