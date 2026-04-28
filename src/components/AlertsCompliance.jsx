import { useMemo, useState } from 'react';
import ViewToggle from './ViewToggle.jsx';

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function severity(days) {
  if (days <= 14) return { label: 'Critical', color: '#ef4444', bg: '#450a0a' };
  if (days <= 30) return { label: 'High', color: '#f97316', bg: '#431407' };
  return { label: 'Medium', color: '#f59e0b', bg: '#451a03' };
}

export default function AlertsCompliance({ drivers, trucks }) {
  const [view, setView] = useState('list');

  const alerts = useMemo(() => {
    const list = [];
    drivers.forEach(d => {
      const licDays = daysUntil(d.licenseExpiry);
      if (licDays <= 90) list.push({ id: `${d.id}-lic`, name: d.name, ref: d.id, type: 'Driving License', days: licDays, expiry: d.licenseExpiry });
      const hazDays = daysUntil(d.hazmatExpiry);
      if (hazDays <= 90) list.push({ id: `${d.id}-haz`, name: d.name, ref: d.id, type: 'HAZMAT Certification', days: hazDays, expiry: d.hazmatExpiry });
    });
    trucks.forEach(t => {
      const docs = [
        { key: 'svc', type: 'Vehicle Maintenance', expiry: t.nextServiceDate },
        { key: 'peso', type: 'PESO License', expiry: t.pesoLicenseExpiry },
        { key: 'cal', type: 'Calibration', expiry: t.calibrationExpiry },
        { key: 'ins', type: 'Insurance', expiry: t.insuranceExpiry },
        { key: 'fit', type: 'Fitness', expiry: t.fitnessExpiry },
        { key: 'pol', type: 'Pollution', expiry: t.pollutionExpiry },
        { key: 'np', type: 'National Permit', expiry: t.nationalPermitExpiry },
        { key: 'rt', type: 'Road Tax', expiry: t.roadTaxExpiry },
      ];
      docs.forEach(doc => {
        const days = daysUntil(doc.expiry);
        if (days <= 90) list.push({ id: `${t.id}-${doc.key}`, name: t.id, ref: t.registration, type: doc.type, days, expiry: doc.expiry });
      });
    });
    return list.sort((a, b) => a.days - b.days);
  }, [drivers, trucks]);

  const critical = alerts.filter(a => a.days <= 14).length;
  const high = alerts.filter(a => a.days > 14 && a.days <= 30).length;
  const medium = alerts.filter(a => a.days > 30).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Critical', count: critical, color: '#ef4444' },
          { label: 'High', count: high, color: '#f97316' },
          { label: 'Medium', count: medium, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', border: `1px solid ${s.color}44`, borderRadius: 'var(--radius)', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.count}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* List view */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(a => {
            const sev = severity(a.days);
            return (
              <div key={a.id} style={{
                background: 'var(--bg2)', border: `1px solid ${sev.color}33`,
                borderLeft: `3px solid ${sev.color}`, borderRadius: 'var(--radius)',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: sev.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                    {a.days <= 0 ? Math.abs(a.days) : a.days}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{a.days <= 0 ? 'OVERDUE' : 'days'}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'JetBrains Mono, monospace' }}>{a.ref}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{a.type}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Expires {a.expiry}</div>
                </div>
                <span style={{ background: sev.bg, color: sev.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                  {sev.label}
                </span>
              </div>
            );
          })}
          {alerts.length === 0 && <div style={{ textAlign: 'center', color: 'var(--success)', marginTop: 60, fontSize: 16 }}>All compliant — no alerts.</div>}
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {alerts.map(a => {
            const sev = severity(a.days);
            return (
              <div key={a.id} style={{
                background: 'var(--bg2)', border: `1px solid ${sev.color}44`,
                borderTop: `3px solid ${sev.color}`, borderRadius: 'var(--radius)', padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ background: sev.bg, color: sev.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{sev.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: sev.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                      {a.days <= 0 ? Math.abs(a.days) : a.days}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>{a.days <= 0 ? 'OVERDUE' : 'days left'}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{a.ref}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{a.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Expires {a.expiry}</div>
              </div>
            );
          })}
          {alerts.length === 0 && <div style={{ textAlign: 'center', color: 'var(--success)', marginTop: 60, fontSize: 16, gridColumn: '1/-1' }}>All compliant — no alerts.</div>}
        </div>
      )}
    </div>
  );
}
