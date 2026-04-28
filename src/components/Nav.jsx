const OWNER_TABS = [
  { id: 'drivers', label: 'Drivers' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'map', label: 'GPS Map' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'trips', label: 'Trip History' },
  { id: 'customers', label: 'Customers' },
];

const DRIVER_TABS = [
  { id: 'drivers', label: 'My Profile' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'fleet', label: 'Maintenance' },
];

const ROLE_COLORS = {
  Owner: { bg: '#1e3a5f', color: '#60a5fa' },
  Manager: { bg: '#1a2e1a', color: '#4ade80' },
  Driver: { bg: '#2d1f4e', color: '#c084fc' },
  Customer: { bg: '#1a2e2e', color: '#22d3ee' },
};

export default function Nav({ active, onTab, alertCount, user, onLogout }) {
  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.Owner;
  const isDriver = user?.role === 'Driver';
  const tabs = isDriver ? DRIVER_TABS : OWNER_TABS;

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 56, flexShrink: 0,
    }}>
      <button onClick={() => onTab('home')} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontWeight: 700, fontSize: 16, marginRight: 24, color: 'var(--text)', letterSpacing: '-0.3px',
        fontFamily: 'inherit',
      }}>
        Sri Vijetha Logistics <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 13 }}>OPS</span>
      </button>

      {tabs.map(t => (
        <button key={t.id + t.label} onClick={() => onTab(t.id)} style={{
          background: active === t.id ? 'var(--bg3)' : 'transparent',
          border: active === t.id ? '1px solid var(--border)' : '1px solid transparent',
          color: active === t.id ? 'var(--text)' : 'var(--text2)',
          borderRadius: 'var(--radius-sm)', padding: '6px 14px',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {t.label}
          {t.id === 'alerts' && alertCount > 0 && (
            <span style={{ background: 'var(--danger)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px', lineHeight: 1.6 }}>{alertCount}</span>
          )}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{user.name || user.email}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: roleStyle.bg, color: roleStyle.color }}>
                {user.role}
              </span>
            </div>
          </div>
          <button onClick={onLogout} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '5px 12px', color: 'var(--text2)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
          }}>Sign out</button>
        </div>
      )}
    </nav>
  );
}
