import { useState, useMemo } from 'react';
import { getChemical } from '../data/chemicals.js';
import ViewToggle from './ViewToggle.jsx';

const STATUS_COLORS = {
  'In Transit': '#3b82f6',
  'Loading': '#f59e0b',
  'Unloading': '#a855f7',
  'Waiting': '#64748b',
  'Available': '#22c55e',
  'Maintenance': '#ef4444',
};

const FILTERS = ['All', 'In Transit', 'Available', 'Loading', 'Unloading', 'Waiting', 'Maintenance'];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function getDriverAccounts() {
  try { return JSON.parse(localStorage.getItem('vl_users') || '[]'); } catch { return []; }
}

function saveDriverAccounts(users) {
  localStorage.setItem('vl_users', JSON.stringify(users));
}

function hasAccount(driverId) {
  return getDriverAccounts().some(u => u.driverId === driverId);
}

// Modal for owner/manager to create a driver account
function CreateAccountModal({ driver, onClose }) {
  const [phone, setPhone] = useState(driver.phone || '');
  const [tempPassword, setTempPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!phone || !tempPassword) { setError('Please fill in both fields.'); return; }
    if (tempPassword.length < 4) { setError('Password must be at least 4 characters.'); return; }
    const users = getDriverAccounts();
    if (users.some(u => u.phone === phone && u.driverId !== driver.id)) {
      setError('This phone number is already linked to another account.');
      return;
    }
    const existing = users.findIndex(u => u.driverId === driver.id);
    const account = { name: driver.name, phone, password: tempPassword, role: 'Driver', driverId: driver.id, firstLogin: true, createdAt: new Date().toISOString() };
    if (existing >= 0) users[existing] = account;
    else users.push(account);
    saveDriverAccounts(users);
    setDone(true);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 420, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Create Driver Account</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{driver.name} · {driver.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        {done ? (
          <div>
            <div style={{ background: '#052e16', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 20 }}>
              <div style={{ color: '#86efac', fontWeight: 600, marginBottom: 8 }}>Account created successfully</div>
              <div style={{ fontSize: 13, color: '#4ade80' }}>
                <div>Phone: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{phone}</span></div>
                <div style={{ marginTop: 4 }}>Temp password: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{tempPassword}</span></div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 10 }}>
                Share these credentials with {driver.name}. They will be asked to set a new password on first login.
              </div>
            </div>
            <button onClick={onClose} style={{ width: '100%', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 0', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: 13, color: 'var(--text2)' }}>
              The driver will use their phone number and this temporary password to log in. On first login they'll be asked to set a new password.
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>Phone Number</span>
              <input value={phone} onChange={e => { setPhone(e.target.value); setError(''); }}
                placeholder="+91 9700000000"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>Temporary Password</span>
              <input value={tempPassword} onChange={e => { setTempPassword(e.target.value); setError(''); }}
                placeholder="e.g. DRV001 or their last 4 digits"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
            </label>

            {error && <div style={{ background: '#450a0a', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fca5a5', fontSize: 13 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={onClose} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: 'var(--text2)', fontFamily: 'inherit', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreate} style={{ flex: 2, background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Create Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WarningBadge({ label }) {
  return (
    <span style={{ background: '#7c2d12', color: '#fca5a5', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, border: '1px solid #ef4444' }}>{label}</span>
  );
}

function DriverCard({ driver, onClick }) {
  const chem = driver.chemicalId ? getChemical(driver.chemicalId) : null;
  const utilPct = driver.capacity ? Math.round((driver.loadWeight / driver.capacity) * 100) : 0;
  const licDays = daysUntil(driver.licenseExpiry);
  const hazDays = daysUntil(driver.hazmatExpiry);

  return (
    <div onClick={() => onClick(driver)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{driver.name}</div>
          <div style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{driver.id} · {driver.experience}yr exp</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {licDays <= 90 && <WarningBadge label={`License ${licDays}d`} />}
          {hazDays <= 90 && <WarningBadge label={`HAZMAT ${hazDays}d`} />}
          <span style={{
            background: STATUS_COLORS[driver.status] + '22', color: STATUS_COLORS[driver.status],
            border: `1px solid ${STATUS_COLORS[driver.status]}44`,
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
          }}>{driver.status}</span>
        </div>
      </div>

      {driver.truckId && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12, marginBottom: 10 }}>
          <div><span style={{ color: 'var(--text3)' }}>Truck </span><span className="mono">{driver.truckId}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Tank </span>{driver.tankType}</div>
          <div><span style={{ color: 'var(--text3)' }}>Reg </span><span className="mono">{driver.truckRegistration}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Own </span>{driver.ownership}</div>
        </div>
      )}

      {chem && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: chem.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 500 }}>{chem.name}</span>
            <span className="mono" style={{ color: 'var(--text3)', fontSize: 11 }}>{chem.un} · Class {chem.hazardClass}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${utilPct}%`, height: '100%', background: utilPct > 90 ? 'var(--danger)' : utilPct > 70 ? 'var(--warning)' : 'var(--accent)', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{driver.loadWeight}T / {driver.capacity}T ({utilPct}%)</span>
          </div>
        </div>
      )}

      {driver.destination && (
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>
          <span style={{ color: 'var(--text3)' }}>To </span>{driver.destination}
        </div>
      )}
    </div>
  );
}

function SidePanel({ driver, onClose, onAssign, userRole }) {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountExists, setAccountExists] = useState(() => driver ? hasAccount(driver.id) : false);

  if (!driver) return null;
  const chem = driver.chemicalId ? getChemical(driver.chemicalId) : null;
  const licDays = daysUntil(driver.licenseExpiry);
  const hazDays = daysUntil(driver.hazmatExpiry);
  const canManageAccounts = userRole === 'Owner' || userRole === 'Manager';

  const handleAccountCreated = () => {
    setAccountExists(true);
    setShowCreateAccount(false);
  };

  return (
    <>
      <div style={{ position: 'fixed', top: 0, right: 0, width: 380, height: '100vh', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', padding: 24, overflowY: 'auto', zIndex: 100, boxShadow: '-4px 0 24px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{driver.name}</div>
            <div style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{driver.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <Section label="Driver Info">
          <Row label="Phone" value={driver.phone} mono />
          <Row label="Experience" value={`${driver.experience} years`} />
          <Row label="Status" value={driver.status} />
          <Row label="License Expiry" value={driver.licenseExpiry} warn={licDays <= 90} />
          <Row label="HAZMAT Expiry" value={driver.hazmatExpiry} warn={hazDays <= 90} />
        </Section>

        {driver.truckId && (
          <Section label="Assigned Truck">
            <Row label="Truck ID" value={driver.truckId} mono />
            <Row label="Registration" value={driver.truckRegistration} mono />
            <Row label="Tank Type" value={driver.tankType} />
            <Row label="Ownership" value={driver.ownership} />
          </Section>
        )}

        {chem && (
          <Section label="Current Trip">
            <Row label="Trip ID" value={driver.tripId} mono />
            <Row label="Chemical" value={chem.name} />
            <Row label="UN Number" value={chem.un} mono />
            <Row label="Hazard Class" value={`${chem.hazardClass} — ${chem.hazardType}`} />
            <Row label="Load" value={`${driver.loadWeight}T of ${driver.capacity}T`} />
            <Row label="Destination" value={driver.destination} />
          </Section>
        )}

        {/* App account section — only visible to Owner/Manager */}
        {canManageAccounts && (
          <Section label="App Account">
            {accountExists ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                  <span style={{ fontSize: 13, color: 'var(--success)' }}>Account active</span>
                </div>
                <button onClick={() => setShowCreateAccount(true)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', color: 'var(--text3)', fontFamily: 'inherit', fontSize: 11, cursor: 'pointer' }}>Reset</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text3)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text3)' }}>No account yet</span>
                </div>
                <button onClick={() => setShowCreateAccount(true)} style={{
                  width: '100%', background: '#052e16', border: '1px solid var(--success)',
                  borderRadius: 'var(--radius-sm)', padding: '8px 0', color: '#86efac',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>+ Create Account</button>
              </div>
            )}
          </Section>
        )}

        <button onClick={() => onAssign(driver)} style={{
          width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius-sm)', padding: '10px 0', fontFamily: 'inherit',
          fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 8,
        }}>
          {driver.truckId ? 'Edit Trip' : 'Assign Trip'}
        </button>
      </div>

      {showCreateAccount && (
        <CreateAccountModal
          driver={driver}
          onClose={() => {
            setShowCreateAccount(false);
            setAccountExists(hasAccount(driver.id));
          }}
        />
      )}
    </>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, mono, warn }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: 'var(--text3)' }}>{label}</span>
      <span style={{ fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: mono ? 12 : 13, color: warn ? 'var(--warning)' : 'var(--text)' }}>{value}</span>
    </div>
  );
}

function DriverListRow({ driver, onClick }) {
  const chem = driver.chemicalId ? getChemical(driver.chemicalId) : null;
  const licDays = daysUntil(driver.licenseExpiry);
  const hazDays = daysUntil(driver.hazmatExpiry);
  const utilPct = driver.capacity ? Math.round((driver.loadWeight / driver.capacity) * 100) : 0;
  return (
    <div onClick={() => onClick(driver)} style={{
      display: 'grid', gridTemplateColumns: '200px 100px 140px 160px 140px 100px 1fr',
      alignItems: 'center', gap: 12, padding: '10px 16px',
      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
      cursor: 'pointer', fontSize: 13,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{driver.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{driver.id}</div>
      </div>
      <span style={{ background: STATUS_COLORS[driver.status] + '22', color: STATUS_COLORS[driver.status], border: `1px solid ${STATUS_COLORS[driver.status]}44`, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>{driver.status}</span>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text2)' }}>{driver.truckId || '—'}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {chem ? <><span style={{ width: 7, height: 7, borderRadius: '50%', background: chem.color, flexShrink: 0 }} /><span style={{ fontSize: 12 }}>{chem.name}</span></> : <span style={{ color: 'var(--text3)' }}>—</span>}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{driver.destination || '—'}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {licDays <= 90 && <span style={{ background: '#7c2d12', color: '#fca5a5', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 999 }}>Lic</span>}
        {hazDays <= 90 && <span style={{ background: '#7c2d12', color: '#fca5a5', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 999 }}>HAZ</span>}
      </div>
      <div>
        {driver.capacity ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
              <div style={{ width: `${utilPct}%`, height: '100%', background: utilPct > 90 ? 'var(--danger)' : 'var(--accent)', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{utilPct}%</span>
          </div>
        ) : <span style={{ color: 'var(--text3)' }}>—</span>}
      </div>
    </div>
  );
}

export default function DriverDashboard({ drivers, onAssign, userRole }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    let list = drivers;
    if (filter !== 'All') list = list.filter(d => d.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        (d.truckId && d.truckId.toLowerCase().includes(q)) ||
        (d.chemicalId && d.chemicalId.replace(/_/g, ' ').includes(q)) ||
        (d.destination && d.destination.toLowerCase().includes(q))
      );
    }
    return list;
  }, [drivers, filter, search]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search driver, truck, chemical, destination…"
          style={{ flex: 1, minWidth: 200, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? 'var(--accent)' : 'var(--bg3)',
              color: filter === f ? '#fff' : 'var(--text2)',
              border: '1px solid ' + (filter === f ? 'var(--accent)' : 'var(--border)'),
              borderRadius: 'var(--radius-sm)', padding: '5px 12px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
            }}>{f}</button>
          ))}
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {filtered.map(d => <DriverCard key={d.id} driver={d} onClick={setSelected} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* List header */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 100px 140px 160px 140px 100px 1fr', gap: 12, padding: '6px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <div>Driver</div><div>Status</div><div>Truck</div><div>Chemical</div><div>Destination</div><div>Alerts</div><div>Load</div>
            </div>
            {filtered.map(d => <DriverListRow key={d.id} driver={d} onClick={setSelected} />)}
          </div>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 60 }}>No drivers match your search.</div>
        )}
      </div>

      <SidePanel
        driver={selected}
        onClose={() => setSelected(null)}
        onAssign={driver => { setSelected(null); onAssign(driver); }}
        userRole={userRole}
      />
    </div>
  );
}
