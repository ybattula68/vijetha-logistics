import { useState, useMemo } from 'react';

const VIEWS = ['By Driver', 'By Truck', 'By Customer'];

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function GroupCard({ title, sub, tripCount, revenue, trips, expanded, onToggle }) {
  const shown = trips.slice(0, 10);
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 8, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{sub}</div>}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{tripCount} trips</div>
            <div style={{ fontWeight: 600, color: 'var(--success)' }}>{fmt(revenue)}</div>
          </div>
          <span style={{ color: 'var(--text3)', fontSize: 18 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 80px 80px 80px 90px', gap: 0 }}>
            {['Trip ID', 'Chemical', 'Destination', 'Date', 'Load', 'Dist', 'Diesel', 'Revenue'].map(h => (
              <div key={h} style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</div>
            ))}
          </div>
          {shown.map(t => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 80px 80px 80px 90px', borderBottom: '1px solid var(--border)22' }}>
              <Cell mono>{t.id}</Cell>
              <Cell>{t.chemicalName}</Cell>
              <Cell>{t.destination}</Cell>
              <Cell mono>{t.date}</Cell>
              <Cell>{t.loadWeight}T</Cell>
              <Cell>{t.distance}km</Cell>
              <Cell>{t.dieselUsed}L</Cell>
              <Cell style={{ color: 'var(--success)' }}>{fmt(t.revenue)}</Cell>
            </div>
          ))}
          {trips.length > 10 && (
            <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text3)' }}>+{trips.length - 10} more trips</div>
          )}
        </div>
      )}
    </div>
  );
}

function Cell({ children, mono, style }) {
  return (
    <div style={{ padding: '8px 12px', fontSize: 12, fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', ...style }}>
      {children}
    </div>
  );
}

export default function TripHistory({ trips }) {
  const [view, setView] = useState('By Driver');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    if (!search.trim()) return trips;
    const q = search.toLowerCase();
    return trips.filter(t =>
      t.driverName.toLowerCase().includes(q) ||
      t.truckId.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.chemicalName.toLowerCase().includes(q)
    );
  }, [trips, search]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(t => {
      const key = view === 'By Driver' ? t.driverId : view === 'By Truck' ? t.truckId : t.customerId;
      const label = view === 'By Driver' ? t.driverName : view === 'By Truck' ? t.truckId : t.customerName;
      const sub = view === 'By Truck' ? t.truckRegistration : null;
      if (!groups[key]) groups[key] = { key, label, sub, trips: [], revenue: 0 };
      groups[key].trips.push(t);
      groups[key].revenue += t.revenue;
    });
    return Object.values(groups).sort((a, b) => b.revenue - a.revenue);
  }, [filtered, view]);

  const toggle = key => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search driver, truck, customer, chemical…"
          style={{ flex: 1, minWidth: 200, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? 'var(--accent)' : 'var(--bg3)',
              color: view === v ? '#fff' : 'var(--text2)',
              border: '1px solid ' + (view === v ? 'var(--accent)' : 'var(--border)'),
              borderRadius: 'var(--radius-sm)', padding: '5px 14px', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
            }}>{v}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {grouped.map(g => (
          <GroupCard key={g.key} title={g.label} sub={g.sub} tripCount={g.trips.length} revenue={g.revenue} trips={g.trips} expanded={!!expanded[g.key]} onToggle={() => toggle(g.key)} />
        ))}
        {grouped.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text3)', marginTop: 60 }}>No trips found.</div>}
      </div>
    </div>
  );
}
