import { useState, useMemo } from 'react';
import { getChemical, TANK_TYPES } from '../data/chemicals.js';
import ViewToggle from './ViewToggle.jsx';

const MODELS = ['Tata Prima 4028', 'Ashok Leyland 3518', 'BharatBenz 3523', 'Mahindra Blazo X35', 'Eicher Pro 6031'];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function DocRow({ label, date }) {
  const days = daysUntil(date);
  const color = days <= 0 ? 'var(--danger)' : days <= 14 ? 'var(--danger)' : days <= 30 ? 'var(--warning)' : days <= 90 ? '#f59e0b' : 'var(--text2)';
  const tag = days <= 0 ? 'OVERDUE' : days <= 14 ? `${days}d left` : days <= 30 ? `${days}d left` : null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)22' }}>
      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color }}>{date}</span>
        {tag && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: color + '22', color, border: `1px solid ${color}44` }}>{tag}</span>}
      </div>
    </div>
  );
}

function EditModal({ truck, onClose, onSave }) {
  const [form, setForm] = useState({ ...truck });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fields = [
    { label: 'Registration Number', key: 'registration', type: 'text' },
    { label: 'Model', key: 'model', type: 'text' },
    { label: 'Capacity (Tonnes)', key: 'capacity', type: 'number' },
  ];

  const dates = [
    { label: 'PESO License Expiry', key: 'pesoLicenseExpiry' },
    { label: 'Calibration Expiry', key: 'calibrationExpiry' },
    { label: 'Insurance Expiry', key: 'insuranceExpiry' },
    { label: 'Fitness Expiry', key: 'fitnessExpiry' },
    { label: 'Pollution Expiry', key: 'pollutionExpiry' },
    { label: 'National Permit Expiry', key: 'nationalPermitExpiry' },
    { label: 'Road Tax Expiry', key: 'roadTaxExpiry' },
    { label: 'Next Service Date', key: 'nextServiceDate' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 520, maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Edit Vehicle</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{truck.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* Basic details */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Vehicle Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {fields.map(({ label, key, type }) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                <input
                  type={type}
                  value={form[key] || ''}
                  onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
                />
              </label>
            ))}

            {/* Tank Type */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>Tank Type</span>
              <select value={form.tankType} onChange={e => set('tankType', e.target.value)}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}>
                {TANK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            {/* Ownership */}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Ownership</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Own', 'Lease'].map(opt => (
                  <button key={opt} onClick={() => set('ownership', opt)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                    background: form.ownership === opt ? (opt === 'Own' ? '#1e3a5f' : '#2d1f4e') : 'var(--bg3)',
                    color: form.ownership === opt ? (opt === 'Own' ? '#60a5fa' : '#c084fc') : 'var(--text2)',
                    border: `1px solid ${form.ownership === opt ? (opt === 'Own' ? '#3b82f6' : '#a855f7') : 'var(--border)'}`,
                  }}>{opt}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance dates */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Compliance Documents</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {dates.map(({ label, key }) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                <input
                  type="date"
                  value={form[key] || ''}
                  onChange={e => set(key, e.target.value)}
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none', colorScheme: 'dark' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: 'var(--text2)', fontFamily: 'inherit', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex: 2, background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: '#fff', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function SidePanel({ truck, driver, chem, onClose, onEdit }) {
  if (!truck) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 380, height: '100vh', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', padding: 24, overflowY: 'auto', zIndex: 100, boxShadow: '-4px 0 24px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'JetBrains Mono, monospace' }}>{truck.id}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{truck.registration}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
      </div>

      {/* Basic info */}
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 12, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><div style={{ fontSize: 11, color: 'var(--text3)' }}>Model</div><div style={{ fontSize: 13 }}>{truck.model}</div></div>
        <div><div style={{ fontSize: 11, color: 'var(--text3)' }}>Ownership</div>
          <div style={{ fontSize: 13, color: truck.ownership === 'Own' ? '#60a5fa' : '#c084fc', fontWeight: 600 }}>{truck.ownership}</div>
        </div>
        <div><div style={{ fontSize: 11, color: 'var(--text3)' }}>Tank Type</div><div style={{ fontSize: 13 }}>{truck.tankType}</div></div>
        <div><div style={{ fontSize: 11, color: 'var(--text3)' }}>Capacity</div><div style={{ fontSize: 13 }}>{truck.capacity}T</div></div>
      </div>

      {/* Current assignment */}
      {driver && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Current Assignment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Driver</span><span>{driver.name}</span></div>
            {chem && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text3)' }}>Chemical</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: chem.color }} />{chem.name}</span>
            </div>}
            {driver.destination && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Destination</span><span>{driver.destination}</span></div>}
          </div>
        </div>
      )}

      {/* Compliance documents */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Compliance Documents</div>
        <DocRow label="PESO License" date={truck.pesoLicenseExpiry} />
        <DocRow label="Calibration" date={truck.calibrationExpiry} />
        <DocRow label="Insurance" date={truck.insuranceExpiry} />
        <DocRow label="Fitness" date={truck.fitnessExpiry} />
        <DocRow label="Pollution" date={truck.pollutionExpiry} />
        <DocRow label="National Permit" date={truck.nationalPermitExpiry} />
        <DocRow label="Road Tax" date={truck.roadTaxExpiry} />
        <DocRow label="Next Service" date={truck.nextServiceDate} />
      </div>

      <button onClick={() => onEdit(truck)} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 0', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        Edit Vehicle
      </button>
    </div>
  );
}

function expiringDocCount(truck) {
  const docs = [truck.pesoLicenseExpiry, truck.calibrationExpiry, truck.insuranceExpiry, truck.fitnessExpiry, truck.pollutionExpiry, truck.nationalPermitExpiry, truck.roadTaxExpiry, truck.nextServiceDate];
  return docs.filter(d => Math.ceil((new Date(d) - new Date()) / 86400000) <= 30).length;
}

export default function FleetView({ trucks, setTrucks, drivers }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState('grid');

  const driverMap = useMemo(() => {
    const m = {};
    drivers.forEach(d => { if (d.truckId) m[d.truckId] = d; });
    return m;
  }, [drivers]);

  const filtered = useMemo(() => {
    if (!search.trim()) return trucks;
    const q = search.toLowerCase();
    return trucks.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.registration.toLowerCase().includes(q) ||
      t.model.toLowerCase().includes(q)
    );
  }, [trucks, search]);

  const handleSave = updated => {
    setTrucks(ts => ts.map(t => t.id === updated.id ? updated : t));
    setSelected(updated);
    setEditing(null);
  };

  const selectedDriver = selected ? driverMap[selected.id] : null;
  const selectedChem = selectedDriver?.chemicalId ? getChemical(selectedDriver.chemicalId) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by truck ID, registration, or model…"
          style={{ flex: 1, maxWidth: 400, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {view === 'list' && (
          <div style={{ display: 'grid', gridTemplateColumns: '110px 150px 180px 120px 70px 80px 1fr', gap: 12, padding: '6px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            <div>Truck ID</div><div>Registration</div><div>Model</div><div>Tank</div><div>Cap</div><div>Own</div><div>Status / Driver</div>
          </div>
        )}
        <div style={view === 'grid' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 } : { display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(truck => {
            const driver = driverMap[truck.id];
            const chem = driver?.chemicalId ? getChemical(driver.chemicalId) : null;
            const expiring = expiringDocCount(truck);
            if (view === 'list') {
              return (
                <div key={truck.id} onClick={() => setSelected(truck)} style={{
                  display: 'grid', gridTemplateColumns: '110px 150px 180px 120px 70px 80px 1fr',
                  gap: 12, padding: '10px 16px', background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', alignItems: 'center', fontSize: 13,
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 12 }}>{truck.id}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text2)' }}>{truck.registration}</div>
                  <div style={{ fontSize: 12 }}>{truck.model}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{truck.tankType}</div>
                  <div style={{ fontSize: 12 }}>{truck.capacity}T</div>
                  <span style={{ background: truck.ownership === 'Own' ? '#1e3a5f' : '#2d1f4e', color: truck.ownership === 'Own' ? '#60a5fa' : '#c084fc', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>{truck.ownership}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {driver ? (
                      <>
                        <span style={{ fontSize: 12 }}>{driver.name}</span>
                        {chem && <><span style={{ width: 7, height: 7, borderRadius: '50%', background: chem.color }} /><span style={{ fontSize: 12, color: 'var(--text2)' }}>{chem.name}</span></>}
                      </>
                    ) : <span style={{ color: 'var(--success)', fontSize: 12 }}>Available</span>}
                    {expiring > 0 && <span style={{ background: '#450a0a', color: '#fca5a5', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, border: '1px solid #ef4444' }}>{expiring} doc{expiring > 1 ? 's' : ''}</span>}
                  </div>
                </div>
              );
            }
            return (
              <div key={truck.id} onClick={() => setSelected(truck)} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 13 }}>{truck.id}</div>
                    <div style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{truck.registration}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{
                      background: truck.ownership === 'Own' ? '#1e3a5f' : '#2d1f4e',
                      color: truck.ownership === 'Own' ? '#60a5fa' : '#c084fc',
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    }}>{truck.ownership}</span>
                    {expiring > 0 && (
                      <span style={{ background: '#450a0a', color: '#fca5a5', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, border: '1px solid #ef4444' }}>
                        {expiring} doc{expiring > 1 ? 's' : ''} expiring
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>{truck.model}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, marginBottom: 10 }}>
                  <span style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4, color: 'var(--text2)' }}>{truck.tankType}</span>
                  <span style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4, color: 'var(--text2)' }}>{truck.capacity}T</span>
                </div>
                {driver ? (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <div style={{ fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--text3)' }}>Driver </span>{driver.name}</div>
                    {chem && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: chem.color }} />
                      <span>{chem.name}</span>
                    </div>}
                    {driver.destination && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>→ {driver.destination}</div>}
                  </div>
                ) : (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, fontSize: 12, color: 'var(--success)' }}>Available</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SidePanel
        truck={selected}
        driver={selectedDriver}
        chem={selectedChem}
        onClose={() => setSelected(null)}
        onEdit={truck => { setEditing(truck); setSelected(null); }}
      />

      {editing && (
        <EditModal
          truck={editing}
          onClose={() => { setEditing(null); setSelected(editing); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
