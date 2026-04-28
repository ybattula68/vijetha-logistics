import { useState } from 'react';

const ROLES = ['Owner', 'Manager', 'Driver', 'Customer'];

const ROLE_COLORS = {
  Owner: { bg: '#1e3a5f', color: '#60a5fa' },
  Manager: { bg: '#1a2e1a', color: '#4ade80' },
  Driver: { bg: '#2d1f4e', color: '#c084fc' },
  Customer: { bg: '#1a2e2e', color: '#22d3ee' },
};

function getUsers() {
  try { return JSON.parse(localStorage.getItem('vl_users') || '[]'); } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem('vl_users', JSON.stringify(users));
}

function Brand() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 36 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', fontSize: 26,
      }}>🚛</div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>Sri Vijetha Logistics</div>
      <div style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Operations Dashboard</div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          background: 'var(--bg3)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', padding: '10px 12px',
          color: 'var(--text)', fontFamily: 'inherit', fontSize: 14, outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </label>
  );
}

function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async e => {
    e?.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    // Match by email OR phone number
    const match = users.find(u =>
      (u.email && u.email.toLowerCase() === email.toLowerCase() && u.password === password) ||
      (u.phone && u.phone.replace(/\s+/g, '') === email.replace(/\s+/g, '') && u.password === password)
    );
    if (match) {
      onLogin({ email: match.email || match.phone, name: match.name, role: match.role, driverId: match.driverId || null, firstLogin: match.firstLogin || false });
    } else {
      setError('No account found with those credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32 }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Sign in to your account</div>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email or Phone Number" type="text" value={email} onChange={v => { setEmail(v); setError(''); }} placeholder="Email or +91 phone number" autoComplete="username" />
        <Field label="Password" type="password" value={password} onChange={v => { setPassword(v); setError(''); }} placeholder="••••••••" autoComplete="current-password" />
        {error && (
          <div style={{ background: '#450a0a', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} style={{
          background: loading ? 'var(--accent2)' : 'var(--accent)', border: 'none',
          borderRadius: 'var(--radius-sm)', padding: '11px 0', color: '#fff',
          fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
          cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
        }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
        Don't have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>
          Register
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ onLogin, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('Owner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async e => {
    e?.preventDefault();
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }
    const newUser = { name, email, password, role, createdAt: new Date().toISOString() };
    saveUsers([...users, newUser]);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 800));
    onLogin({ email, name, role });
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32 }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Create your account</div>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Full Name" value={name} onChange={v => { setName(v); setError(''); }} placeholder="Your name" autoComplete="name" />
        <Field label="Email or Phone Number" type="text" value={email} onChange={v => { setEmail(v); setError(''); }} placeholder="Email or +91 phone number" autoComplete="username" />

        {/* Role selector */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, marginBottom: 8 }}>Role</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {ROLES.map(r => {
              const rc = ROLE_COLORS[r];
              return (
                <button key={r} type="button" onClick={() => setRole(r)} style={{
                  padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 12, textAlign: 'center',
                  background: role === r ? rc.bg : 'var(--bg3)',
                  color: role === r ? rc.color : 'var(--text2)',
                  border: `1px solid ${role === r ? rc.color + '66' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}>{r}</button>
              );
            })}
          </div>
        </div>

        <Field label="Password" type="password" value={password} onChange={v => { setPassword(v); setError(''); }} placeholder="Min. 6 characters" autoComplete="new-password" />
        <Field label="Confirm Password" type="password" value={confirm} onChange={v => { setConfirm(v); setError(''); }} placeholder="Repeat password" autoComplete="new-password" />

        {error && (
          <div style={{ background: '#450a0a', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#052e16', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: '#86efac', fontSize: 13 }}>
            Account created! Signing you in…
          </div>
        )}

        <button type="submit" disabled={loading || success} style={{
          background: success ? '#15803d' : loading ? 'var(--accent2)' : 'var(--accent)',
          border: 'none', borderRadius: 'var(--radius-sm)', padding: '11px 0', color: '#fff',
          fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
          cursor: loading || success ? 'not-allowed' : 'pointer', marginTop: 4,
        }}>
          {success ? 'Account created!' : loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
        Already have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>
          Sign in
        </button>
      </div>
    </div>
  );
}

// Change this code to whatever you want your secret login to be
const CREATOR_CODE = 'yashwanth';

function CreatorAccess({ onLogin }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handle = () => {
    if (code === CREATOR_CODE) {
      onLogin({ name: 'Yashwanth', email: 'ybattula68@gmail.com', role: 'Owner' });
    } else {
      setError('Incorrect code.');
      setCode('');
    }
  };

  if (!open) {
    return (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => setOpen(true)} style={{
          background: 'none', border: 'none', color: 'var(--text3)',
          fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
          opacity: 0.4,
        }}>Creator</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Enter creator code</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          value={code}
          onChange={e => { setCode(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handle()}
          placeholder="Secret code"
          autoFocus
          style={{
            flex: 1, background: 'var(--bg3)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: 'var(--text)',
            fontFamily: 'inherit', fontSize: 13, outline: 'none',
          }}
        />
        <button onClick={handle} style={{
          background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)',
          padding: '8px 14px', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer',
        }}>Go</button>
      </div>
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>{error}</div>}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [page, setPage] = useState('login');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Brand />
        {page === 'login'
          ? <LoginForm onLogin={onLogin} onSwitch={() => setPage('register')} />
          : <RegisterForm onLogin={onLogin} onSwitch={() => setPage('login')} />
        }
        <CreatorAccess onLogin={onLogin} />
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text3)' }}>
          Sri Vijetha Logistics Pvt. Ltd. · Hyderabad
        </div>
      </div>
    </div>
  );
}
