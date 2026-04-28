import { useState, useMemo } from 'react';
import { CHEMICALS, getChemical, isCompatible } from '../data/chemicals.js';

const DESTINATIONS = [
  'Manali Industrial Area', 'Cuddalore Port', 'Ennore SEZ', 'Tuticorin Port',
  'Hosur Industrial Park', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore',
];

export default function AssignmentFlow({ driver, trucks, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [chemId, setChemId] = useState(driver?.chemicalId || null);
  const [truckId, setTruckId] = useState(driver?.truckId || null);
  const [destination, setDestination] = useState(driver?.destination || '');
  const [loadWeight, setLoadWeight] = useState(driver?.loadWeight || '');
  const [showIncompat, setShowIncompat] = useState(false);
  const [incompatWarning, setIncompatWarning] = useState(false);

  const selectedTruck = useMemo(() => trucks.find(t => t.id === truckId), [trucks, truckId]);
  const chem = chemId ? getChemical(chemId) : null;

  const compatible = useMemo(() => {
    if (!chemId) return trucks;
    return trucks.filter(t => isCompatible(chemId, t.tankType) && (t.driverId === null || t.driverId === driver?.id));
  }, [trucks, chemId, driver]);

  const incompatible = useMemo(() => {
    if (!chemId) return [];
    return trucks.filter(t => !isCompatible(chemId, t.tankType) && (t.driverId === null || t.driverId === driver?.id));
  }, [trucks, chemId, driver]);

  const selectTruck = t => {
    setTruckId(t.id);
    setIncompatWarning(!isCompatible(chemId, t.tankType));
  };

  const utilPct = selectedTruck && loadWeight ? Math.round((Number(loadWeight) / selectedTruck.capacity) * 100) : 0;
  const canSave = chemId && truckId && destination && loadWeight && !incompatWarning && Number(loadWeight) <= (selectedTruck?.capacity || 0);

  const handleSave = () => {
    onSave({
      driverId: driver.id,
      chemicalId: chemId,
      truckId,
      destination,
      loadWeight: Number(loadWeight),
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 600, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Assign Trip — {driver?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Step {step} of 3</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', padding: '12px 24px', gap: 8, borderBottom: '1px solid var(--border)' }}>
          {[['1', 'Chemical'], ['2', 'Truck'], ['3', 'Details']].map(([n, label]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: Number(n) <= step ? 'var(--accent)' : 'var(--bg3)', color: Number(n) <= step ? '#fff' : 'var(--text3)' }}>{n}</div>
              <span style={{ fontSize: 12, color: Number(n) <= step ? 'var(--text)' : 'var(--text3)' }}>{label}</span>
              {n !== '3' && <span style={{ color: 'var(--text3)', marginLeft: 4 }}>›</span>}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Select the chemical to be transported.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CHEMICALS.map(c => (
                  <div key={c.id} onClick={() => setChemId(c.id)} style={{
                    background: chemId === c.id ? c.color + '22' : 'var(--bg3)',
                    border: `1px solid ${chemId === c.id ? c.color : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', padding: '12px 14px', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{c.un} · Class {c.hazardClass}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{c.hazardType}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              {incompatWarning && (
                <div style={{ background: '#450a0a', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                  ⚠ Incompatible tank type for {chem?.name}. Change selection to proceed.
                </div>
              )}
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Compatible trucks for {chem?.name}:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {compatible.map(t => (
                  <TruckRow key={t.id} truck={t} selected={truckId === t.id} onSelect={() => selectTruck(t)} />
                ))}
                {compatible.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13 }}>No compatible trucks available.</div>}
              </div>
              {incompatible.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <button onClick={() => setShowIncompat(p => !p)} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                    {showIncompat ? '▲' : '▼'} Show {incompatible.length} incompatible trucks
                  </button>
                  {showIncompat && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {incompatible.map(t => (
                        <TruckRow key={t.id} truck={t} selected={truckId === t.id} onSelect={() => selectTruck(t)} incompatible />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Destination</div>
                <select value={destination} onChange={e => setDestination(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: destination ? 'var(--text)' : 'var(--text3)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}>
                  <option value="">Select destination…</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Load Weight (tonnes) — max {selectedTruck?.capacity}T</div>
                <input type="number" min={0} max={selectedTruck?.capacity} value={loadWeight} onChange={e => setLoadWeight(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
                {loadWeight && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, utilPct)}%`, height: '100%', background: utilPct > 100 ? 'var(--danger)' : utilPct > 80 ? 'var(--warning)' : 'var(--accent)', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: utilPct > 100 ? 'var(--danger)' : 'var(--text3)', marginTop: 4 }}>{utilPct}% utilisation{utilPct > 100 ? ' — EXCEEDS CAPACITY' : ''}</div>
                  </div>
                )}
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: 14, fontSize: 13 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div><span style={{ color: 'var(--text3)' }}>Driver </span>{driver?.name}</div>
                  <div><span style={{ color: 'var(--text3)' }}>Chemical </span>{chem?.name} ({chem?.un})</div>
                  <div><span style={{ color: 'var(--text3)' }}>Truck </span>{truckId} · {selectedTruck?.tankType}</div>
                  {destination && <div><span style={{ color: 'var(--text3)' }}>To </span>{destination}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', color: 'var(--text2)', fontFamily: 'inherit', cursor: 'pointer' }}>Back</button>}
            {driver?.truckId && <button onClick={() => onSave({ driverId: driver.id, unassign: true })} style={{ background: 'transparent', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', color: 'var(--danger)', fontFamily: 'inherit', cursor: 'pointer' }}>Unassign</button>}
          </div>
          {step < 3
            ? <button disabled={step === 1 ? !chemId : !truckId || incompatWarning} onClick={() => setStep(s => s + 1)} style={{ background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', opacity: (step === 1 ? !chemId : !truckId || incompatWarning) ? 0.4 : 1 }}>Next</button>
            : <button disabled={!canSave} onClick={handleSave} style={{ background: 'var(--success)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', color: '#fff', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', opacity: !canSave ? 0.4 : 1 }}>Confirm Assignment</button>
          }
        </div>
      </div>
    </div>
  );
}

function TruckRow({ truck, selected, onSelect, incompatible }) {
  return (
    <div onClick={onSelect} style={{
      background: selected ? 'var(--accent)11' : incompatible ? '#450a0a22' : 'var(--bg3)',
      border: `1px solid ${selected ? 'var(--accent)' : incompatible ? 'var(--danger)44' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)', padding: '10px 14px', cursor: 'pointer',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 13 }}>{truck.id}</span>
        <span style={{ color: 'var(--text3)', fontSize: 12, marginLeft: 10 }}>{truck.registration}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, fontSize: 11, alignItems: 'center' }}>
        <span style={{ background: 'var(--bg2)', padding: '2px 8px', borderRadius: 4, color: incompatible ? 'var(--danger)' : 'var(--text2)' }}>{truck.tankType}</span>
        <span style={{ color: 'var(--text3)' }}>{truck.capacity}T</span>
        <span style={{ color: truck.ownership === 'Own' ? '#60a5fa' : '#c084fc' }}>{truck.ownership}</span>
      </div>
    </div>
  );
}
