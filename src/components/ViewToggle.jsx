export default function ViewToggle({ view, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {[
        { id: 'grid', icon: <GridIcon /> },
        { id: 'list', icon: <ListIcon /> },
      ].map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          background: view === v.id ? 'var(--accent)' : 'transparent',
          border: 'none', padding: '6px 10px', cursor: 'pointer',
          color: view === v.id ? '#fff' : 'var(--text3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          {v.icon}
        </button>
      ))}
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <rect x="0" y="0" width="6" height="6" rx="1" />
      <rect x="9" y="0" width="6" height="6" rx="1" />
      <rect x="0" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <rect x="0" y="1" width="15" height="2.5" rx="1" />
      <rect x="0" y="6" width="15" height="2.5" rx="1" />
      <rect x="0" y="11" width="15" height="2.5" rx="1" />
    </svg>
  );
}
