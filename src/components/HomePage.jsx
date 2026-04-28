import { useState } from 'react';

function Popup({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 28, width: 340,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', marginBottom: 72,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ContactPopup({ onClose }) {
  return (
    <Popup title="Contact Us" onClose={onClose}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Founder</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Battula Prasad</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <a href="tel:+919848037345" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>
            <span>📞</span> +91 98480 37345
          </a>
          <a href="mailto:battula.transport@yahoo.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>
            <span>✉</span> battula.transport@yahoo.com
          </a>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Proprietor</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Battula Sashank</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <a href="tel:+919703366668" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>
            <span>📞</span> +91 97033 66668
          </a>
          <a href="mailto:shasankbattula@vijethalogistics.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>
            <span>✉</span> shasankbattula@vijethalogistics.com
          </a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
          <span style={{ marginTop: 2 }}>📍</span>
          <span>Flat 401, RV'S Sarala Sadan,<br />Sri Nagar Colony, Yellareddyguda,<br />Hyderabad — 500072</span>
        </div>
      </div>
    </Popup>
  );
}

function ServicesPopup({ onClose }) {
  return (
    <Popup title="Our Services" onClose={onClose}>
      <div style={{ color: 'var(--text3)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.8 }}>
        Content coming soon — share your services and we'll add them here.
      </div>
    </Popup>
  );
}

function CoveragePopup({ onClose }) {
  return (
    <Popup title="Coverage" onClose={onClose}>
      <div style={{ color: 'var(--text3)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.8 }}>
        Content coming soon — share your coverage areas and we'll add them here.
      </div>
    </Popup>
  );
}

const BTN_STYLE = {
  border: 'none', borderRadius: 999,
  padding: '12px 22px', fontFamily: 'inherit',
  fontWeight: 600, fontSize: 14, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8,
  position: 'fixed', bottom: 28, zIndex: 100,
};

export default function HomePage() {
  const [popup, setPopup] = useState(null);

  return (
    <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1117 0%, #1e2333 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '64px 48px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 10 }}>
          Sri Vijetha Logistics
        </div>
        <div style={{ fontSize: 14, color: 'var(--text3)', letterSpacing: 1, marginBottom: 16 }}>
          Hyderabad, India
        </div>
        <div style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 540, margin: '0 auto' }}>
          Safe, reliable and compliant transport of hazardous chemicals across India.
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px', paddingBottom: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>

          {/* About Us */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>About Us</div>
            <div style={{ color: 'var(--text3)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.8 }}>
              Content coming soon — share your about us details and we'll add them here.
            </div>
          </div>

        </div>
      </div>

      {/* Three floating buttons at the bottom */}
      <button onClick={() => setPopup('coverage')} style={{ ...BTN_STYLE, left: 28, background: '#1a2e2e', color: '#22d3ee', boxShadow: '0 4px 20px rgba(34,211,238,0.2)' }}>
        <span>🗺</span> Coverage
      </button>

      <button onClick={() => setPopup('services')} style={{ ...BTN_STYLE, left: '50%', transform: 'translateX(-50%)', background: '#1a2e1a', color: '#4ade80', boxShadow: '0 4px 20px rgba(74,222,128,0.2)' }}>
        <span>🚛</span> Our Services
      </button>

      <button onClick={() => setPopup('contact')} style={{ ...BTN_STYLE, right: 28, background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}>
        <span>✉</span> Contact Us
      </button>

      {popup === 'contact' && <ContactPopup onClose={() => setPopup(null)} />}
      {popup === 'services' && <ServicesPopup onClose={() => setPopup(null)} />}
      {popup === 'coverage' && <CoveragePopup onClose={() => setPopup(null)} />}
    </div>
  );
}
