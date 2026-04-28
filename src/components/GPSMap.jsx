import { useState, useEffect, useMemo } from 'react';
import { getChemical, CHEMICALS } from '../data/chemicals.js';

// Simulated GPS positions for in-transit trucks (lat/lng within India)
function simulatePosition(truckId, tick) {
  const seed = truckId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = { lat: 10.5 + (seed % 20), lng: 76 + (seed % 14) };
  return {
    lat: base.lat + Math.sin(tick / 10 + seed) * 0.3,
    lng: base.lng + Math.cos(tick / 10 + seed) * 0.4,
    speed: 40 + (seed % 60),
  };
}

// Simple equirectangular projection onto SVG viewport
function project(lat, lng) {
  const minLat = 8, maxLat = 37, minLng = 68, maxLng = 97;
  const x = ((lng - minLng) / (maxLng - minLng)) * 700;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 560;
  return { x, y };
}

const DEPOT = { lat: 13.08, lng: 80.27 }; // Chennai

export default function GPSMap({ drivers }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  const inTransit = useMemo(() => drivers.filter(d => d.status === 'In Transit' && d.truckId), [drivers]);

  const positions = useMemo(() => inTransit.map(d => ({
    driver: d,
    chem: getChemical(d.chemicalId),
    pos: simulatePosition(d.truckId, tick),
  })), [inTransit, tick]);

  const chemCounts = useMemo(() => {
    const counts = {};
    positions.forEach(p => {
      if (p.chem) counts[p.chem.id] = (counts[p.chem.id] || 0) + 1;
    });
    return counts;
  }, [positions]);

  const depot = project(DEPOT.lat, DEPOT.lng);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 24, gap: 16 }}>
      {/* Chemical count bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CHEMICALS.filter(c => chemCounts[c.id]).map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 12px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>{c.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: 'JetBrains Mono, monospace' }}>{chemCounts[c.id]}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: 'var(--text3)', alignSelf: 'center', marginLeft: 4 }}>
          {inTransit.length} trucks in transit · updates every 15s
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
        <svg viewBox="0 0 700 560" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
          {/* India outline (simplified path) */}
          <path d="M200,20 L240,10 L280,18 L310,8 L350,20 L390,15 L430,30 L460,50 L480,80 L490,110 L500,130 L510,160 L520,190 L530,210 L540,240 L530,260 L510,280 L490,300 L480,330 L460,360 L440,390 L420,420 L400,440 L380,460 L370,480 L360,500 L350,520 L340,540 L330,555 L310,545 L290,530 L270,510 L250,490 L240,470 L230,450 L220,430 L210,410 L190,380 L170,350 L160,320 L150,290 L140,260 L130,230 L120,200 L110,170 L110,140 L115,110 L120,80 L140,55 L165,35 Z"
            fill="#1e2333" stroke="var(--border)" strokeWidth="1.5" />

          {/* Depot */}
          <circle cx={depot.x} cy={depot.y} r={7} fill="#f59e0b" />
          <text x={depot.x + 10} y={depot.y + 4} fontSize="10" fill="#f59e0b">Chennai Depot</text>

          {/* Route lines and truck dots */}
          {positions.map(({ driver, chem, pos }) => {
            const { x, y } = project(pos.lat, pos.lng);
            const color = chem?.color || '#60a5fa';
            return (
              <g key={driver.id}>
                <line x1={depot.x} y1={depot.y} x2={x} y2={y} stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                <circle cx={x} cy={y} r={5} fill={color} opacity={0.9}>
                  <title>{driver.name} · {chem?.name} · {pos.speed}km/h → {driver.destination}</title>
                </circle>
              </g>
            );
          })}
        </svg>

        {inTransit.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 14 }}>
            No trucks currently in transit.
          </div>
        )}
      </div>
    </div>
  );
}
