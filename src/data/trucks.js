const MODELS = ['Tata Prima 4028', 'Ashok Leyland 3518', 'BharatBenz 3523', 'Mahindra Blazo X35', 'Eicher Pro 6031'];
const TANK_TYPES = ['SS316', 'HDPE', 'FRP', 'Carbon Steel', 'Aluminum', 'Rubber-lined'];

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function makeTruck(i) {
  const own = i <= 30;
  const tankType = TANK_TYPES[i % TANK_TYPES.length];
  const capacity = 10 + (i % 11);
  return {
    id: `TRK-${String(i).padStart(3, '0')}`,
    registration: `TN${String(10 + (i % 20)).padStart(2,'0')} AB ${String(1000 + i).padStart(4,'0')}`,
    model: MODELS[i % MODELS.length],
    tankType,
    capacity,
    ownership: own ? 'Own' : 'Lease',
    status: 'Available',
    driverId: null,
    chemicalId: null,
    destination: null,
    nextServiceDate: daysFromNow(i % 60),
    pesoLicenseExpiry: daysFromNow(10 + i * 9),
    calibrationExpiry: daysFromNow(5 + i * 13),
    insuranceExpiry: daysFromNow(20 + i * 11),
    fitnessExpiry: daysFromNow(15 + i * 7),
    pollutionExpiry: daysFromNow(8 + i * 6),
    nationalPermitExpiry: daysFromNow(25 + i * 10),
    roadTaxExpiry: daysFromNow(30 + i * 8),
  };
}

export const TRUCKS = Array.from({ length: 80 }, (_, i) => makeTruck(i + 1));
