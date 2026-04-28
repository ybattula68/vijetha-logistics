import { useState, useMemo } from 'react';
import Nav from './components/Nav.jsx';
import DriverDashboard from './components/DriverDashboard.jsx';
import FleetView from './components/FleetView.jsx';
import GPSMap from './components/GPSMap.jsx';
import AlertsCompliance from './components/AlertsCompliance.jsx';
import TripHistory from './components/TripHistory.jsx';
import CustomerManagement from './components/CustomerManagement.jsx';
import AssignmentFlow from './components/AssignmentFlow.jsx';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import { usePersistedState } from './hooks/usePersistedState.js';
import { DRIVERS as INITIAL_DRIVERS } from './data/drivers.js';
import { TRUCKS as INITIAL_TRUCKS } from './data/trucks.js';
import { CUSTOMERS as INITIAL_CUSTOMERS } from './data/customers.js';
import { TRIPS as INITIAL_TRIPS } from './data/trips.js';

function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }

function SetNewPasswordScreen({ user, onDone }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handle = () => {
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const users = JSON.parse(localStorage.getItem('vl_users') || '[]');
    const updated = users.map(u =>
      u.driverId === user.driverId ? { ...u, password, firstLogin: false } : u
    );
    localStorage.setItem('vl_users', JSON.stringify(updated));
    setDone(true);
    setTimeout(() => onDone(), 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>🚛</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Welcome, {user.name}</div>
          <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Please set a new password to continue</div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 12, fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>
            Your account was set up with a temporary password. Choose a new one that only you know.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['New Password', password, setPassword], ['Confirm Password', confirm, setConfirm]].map(([label, val, setter]) => (
              <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                <input type="password" value={val} onChange={e => { setter(e.target.value); setError(''); }}
                  placeholder="Min. 6 characters"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 14, outline: 'none' }} />
              </label>
            ))}
            {error && <div style={{ background: '#450a0a', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fca5a5', fontSize: 13 }}>{error}</div>}
            {done && <div style={{ background: '#052e16', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#86efac', fontSize: 13 }}>Password updated! Taking you in…</div>}
            <button onClick={handle} disabled={done} style={{
              background: done ? '#15803d' : 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)',
              padding: '11px 0', color: '#fff', fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
              cursor: done ? 'not-allowed' : 'pointer', marginTop: 4,
            }}>
              {done ? 'Done!' : 'Set Password & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vl_session')); } catch { return null; }
  });
  const [tab, setTab] = useState('home');
  const [assignTarget, setAssignTarget] = useState(null);

  // All data persisted to localStorage automatically
  const [drivers, setDrivers] = usePersistedState('vl_drivers', INITIAL_DRIVERS);
  const [trucks, setTrucks] = usePersistedState('vl_trucks', INITIAL_TRUCKS);
  const [customers, setCustomers] = usePersistedState('vl_customers', INITIAL_CUSTOMERS);
  const [trips, setTrips] = usePersistedState('vl_trips', INITIAL_TRIPS);

  const alertCount = useMemo(() => {
    let n = 0;
    drivers.forEach(d => {
      if (daysUntil(d.licenseExpiry) <= 90) n++;
      if (daysUntil(d.hazmatExpiry) <= 90) n++;
    });
    trucks.forEach(t => { if (daysUntil(t.nextServiceDate) <= 30) n++; });
    return n;
  }, [drivers, trucks]);

  const handleLogin = (u) => {
    localStorage.setItem('vl_session', JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('vl_session');
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (user.firstLogin) {
    return <SetNewPasswordScreen user={user} onDone={() => setUser({ ...user, firstLogin: false })} />;
  }

  const handleAssign = driver => setAssignTarget(driver);

  const handleSave = assignment => {
    if (assignment.unassign) {
      setDrivers(ds => ds.map(d => d.id === assignment.driverId
        ? { ...d, status: 'Available', truckId: null, truckRegistration: null, tankType: null, ownership: null, chemicalId: null, loadWeight: 0, destination: null, tripId: null }
        : d));
    } else {
      const truck = trucks.find(t => t.id === assignment.truckId);
      const tripId = `TRIP-${String(Date.now()).slice(-6)}`;
      setDrivers(ds => ds.map(d => d.id === assignment.driverId
        ? { ...d, status: 'Loading', truckId: truck.id, truckRegistration: truck.registration, tankType: truck.tankType, ownership: truck.ownership, chemicalId: assignment.chemicalId, loadWeight: assignment.loadWeight, destination: assignment.destination, tripId, capacity: truck.capacity }
        : d));
    }
    setAssignTarget(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Nav active={tab} onTab={setTab} alertCount={alertCount} user={user} onLogout={handleLogout} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'home' && <HomePage />}
        {tab === 'drivers' && <DriverDashboard drivers={drivers} onAssign={handleAssign} userRole={user.role} />}
        {tab === 'fleet' && <FleetView trucks={trucks} setTrucks={setTrucks} drivers={drivers} />}
        {tab === 'map' && <GPSMap drivers={drivers} />}
        {tab === 'alerts' && <AlertsCompliance drivers={drivers} trucks={trucks} />}
        {tab === 'trips' && <TripHistory trips={trips} />}
        {tab === 'customers' && <CustomerManagement customers={customers} setCustomers={setCustomers} trips={trips} />}
      </div>
      {assignTarget && <AssignmentFlow driver={assignTarget} trucks={trucks} onClose={() => setAssignTarget(null)} onSave={handleSave} />}
    </div>
  );
}
