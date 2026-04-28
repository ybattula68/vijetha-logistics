import { useState, useMemo } from 'react';
import { getChemical, CHEMICALS } from '../data/chemicals.js';
import ViewToggle from './ViewToggle.jsx';

function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function CreditBar({ used, limit }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 80 ? 'var(--danger)' : pct >= 60 ? 'var(--warning)' : 'var(--success)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>
        <span>Credit Used</span><span style={{ color }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(customer || {
    company: '', contact: '', phone: '', email: '', address: '',
    chemicalsAccepted: [], paymentDays: 30, creditLimit: 0, outstandingBalance: 0,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleChem = id => set('chemicalsAccepted', form.chemicalsAccepted.includes(id)
    ? form.chemicalsAccepted.filter(c => c !== id)
    : [...form.chemicalsAccepted, id]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: 520, maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{customer ? 'Edit Customer' : 'Add Customer'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[['Company Name', 'company'], ['Contact Person', 'contact'], ['Phone', 'phone'], ['Email', 'email'], ['Address', 'address']].map(([label, key]) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
              <input value={form[key] || ''} onChange={e => set(key, e.target.value)}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
            </label>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['Payment Days', 'paymentDays'], ['Credit Limit', 'creditLimit'], ['Outstanding', 'outstandingBalance']].map(([label, key]) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                <input type="number" value={form[key] || 0} onChange={e => set(key, Number(e.target.value))}
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
              </label>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Chemicals Accepted</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CHEMICALS.map(c => (
                <button key={c.id} onClick={() => toggleChem(c.id)} style={{
                  background: form.chemicalsAccepted.includes(c.id) ? c.color + '33' : 'var(--bg3)',
                  color: form.chemicalsAccepted.includes(c.id) ? c.color : 'var(--text2)',
                  border: `1px solid ${form.chemicalsAccepted.includes(c.id) ? c.color : 'var(--border)'}`,
                  borderRadius: 999, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: 'var(--text2)', fontFamily: 'inherit', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex: 1, background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 0', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function SidePanel({ customer, trips, onClose, onEdit }) {
  if (!customer) return null;
  const lastTrips = trips.filter(t => t.customerId === customer.id).slice(0, 5);
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 380, height: '100vh', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', padding: 24, overflowY: 'auto', zIndex: 100, boxShadow: '-4px 0 24px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{customer.company}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {[['Contact', customer.contact], ['Phone', customer.phone], ['Email', customer.email], ['Address', customer.address], ['Payment Terms', `${customer.paymentDays} days`], ['Credit Limit', fmt(customer.creditLimit)]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text3)' }}>{k}</span><span>{v}</span>
          </div>
        ))}
      </div>
      <CreditBar used={customer.outstandingBalance} limit={customer.creditLimit} />
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Chemicals Accepted</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {customer.chemicalsAccepted.map(id => { const c = getChemical(id); return c ? <span key={id} style={{ background: c.color + '22', color: c.color, border: `1px solid ${c.color}44`, fontSize: 11, padding: '2px 8px', borderRadius: 999 }}>{c.name}</span> : null; })}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Last 5 Trips</div>
        {lastTrips.length === 0 ? <div style={{ fontSize: 12, color: 'var(--text3)' }}>No trips yet.</div> : lastTrips.map(t => (
          <div key={t.id} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="mono">{t.id}</span><span>{t.date}</span></div>
            <div style={{ color: 'var(--text2)', marginTop: 2 }}>{t.chemicalName} → {t.destination}</div>
          </div>
        ))}
      </div>
      <button onClick={() => onEdit(customer)} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 0', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 12 }}>Edit Customer</button>
    </div>
  );
}

export default function CustomerManagement({ customers, setCustomers, trips }) {
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => c.company.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q));
  }, [customers, search]);

  const handleSave = form => {
    if (form.id) {
      setCustomers(cs => cs.map(c => c.id === form.id ? form : c));
    } else {
      setCustomers(cs => [...cs, { ...form, id: `CUST-${String(cs.length + 1).padStart(3, '0')}`, totalTrips: 0, lifetimeRevenue: 0 }]);
    }
    setModal(null);
    setSelected(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
          style={{ flex: 1, maxWidth: 360, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
        <ViewToggle view={view} onChange={setView} />
        <button onClick={() => setModal({})} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '7px 16px', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>+ Add Customer</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {filtered.map(c => (
              <div key={c.id} onClick={() => setSelected(c)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.company}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>{c.contact} · {c.phone}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{c.totalTrips}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Trips</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>₹{(c.lifetimeRevenue / 100000).toFixed(1)}L</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Revenue</div>
                  </div>
                </div>
                <CreditBar used={c.outstandingBalance} limit={c.creditLimit} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 150px 160px 80px 120px 1fr', gap: 12, padding: '6px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <div>Company</div><div>Contact</div><div>Address</div><div>Trips</div><div>Revenue</div><div>Credit</div>
            </div>
            {filtered.map(c => {
              const pct = Math.min(100, Math.round((c.outstandingBalance / c.creditLimit) * 100));
              const creditColor = pct >= 80 ? 'var(--danger)' : pct >= 60 ? 'var(--warning)' : 'var(--success)';
              return (
                <div key={c.id} onClick={() => setSelected(c)} style={{
                  display: 'grid', gridTemplateColumns: '200px 150px 160px 80px 120px 1fr',
                  gap: 12, padding: '10px 16px', background: 'var(--bg2)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', alignItems: 'center', fontSize: 13,
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.company}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{c.contact}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{c.address}</div>
                  <div style={{ fontWeight: 600 }}>{c.totalTrips}</div>
                  <div style={{ fontWeight: 600, color: 'var(--success)' }}>₹{(c.lifetimeRevenue / 100000).toFixed(1)}L</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: creditColor, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: creditColor, whiteSpace: 'nowrap' }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <SidePanel customer={selected} trips={trips} onClose={() => setSelected(null)} onEdit={c => { setModal(c); setSelected(null); }} />
      {modal !== null && <CustomerModal customer={modal.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
