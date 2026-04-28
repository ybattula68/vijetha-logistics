import { CHEMICALS } from './chemicals.js';
import { TRUCKS } from './trucks.js';
import { CUSTOMERS } from './customers.js';

const NAMES = [
  'Rajan Murugan', 'Selvam Pandi', 'Karuppaiah S', 'Thangavel R', 'Murugesan K',
  'Senthil Kumar', 'Arumugam D', 'Krishnamurthy P', 'Velusamy T', 'Palaniswamy M',
  'Subramaniam N', 'Kandasamy B', 'Mariappan C', 'Duraisamy R', 'Ponnusamy V',
  'Anbazhagan S', 'Ramasamy K', 'Chinnasamy L', 'Jayaraman P', 'Elumalai D',
  'Karthikeyan R', 'Balakrishnan M', 'Sivakumar A', 'Soundararajan T', 'Natarajan S',
  'Muthusamy P', 'Govindasamy K', 'Periasamy R', 'Chinnadurai M', 'Venkatesan S',
  'Ilango P', 'Saravanan K', 'Kumaresan R', 'Ponraj M', 'Marimuthu S',
  'Thangaraj D', 'Manickam P', 'Rengasamy K', 'Suresh Babu', 'Lingasamy T',
];

const STATUSES = ['In Transit', 'Loading', 'Unloading', 'Waiting', 'Available'];
const DESTINATIONS = [
  'Manali Industrial Area', 'Cuddalore Port', 'Ennore SEZ', 'Tuticorin Port',
  'Hosur Industrial Park', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore',
];

const today = new Date();
function daysFromNow(days) {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const DRIVERS = NAMES.map((name, i) => {
  const status = STATUSES[i % STATUSES.length];
  const isActive = status !== 'Available';
  const truck = isActive ? TRUCKS[i] : null;
  const chemical = isActive ? CHEMICALS[i % CHEMICALS.length] : null;
  const customer = isActive ? CUSTOMERS[i % CUSTOMERS.length] : null;
  const loadWeight = isActive ? Math.round((truck?.capacity || 15) * (0.5 + (i % 5) * 0.1) * 10) / 10 : 0;

  if (truck && isActive) {
    truck.status = status;
    truck.driverId = `DRV-${String(i + 1).padStart(3, '0')}`;
    truck.chemicalId = chemical.id;
    truck.destination = DESTINATIONS[i % DESTINATIONS.length];
  }

  return {
    id: `DRV-${String(i + 1).padStart(3, '0')}`,
    name,
    phone: `+91 ${9700000001 + i}`,
    experience: 3 + (i % 18),
    status,
    truckId: truck?.id || null,
    truckRegistration: truck?.registration || null,
    tankType: truck?.tankType || null,
    ownership: truck?.ownership || null,
    chemicalId: chemical?.id || null,
    loadWeight,
    capacity: truck?.capacity || null,
    destination: isActive ? DESTINATIONS[i % DESTINATIONS.length] : null,
    customerId: customer?.id || null,
    licenseExpiry: daysFromNow(20 + i * 7),
    hazmatExpiry: daysFromNow(10 + i * 11),
    tripId: isActive ? `TRIP-${String(1000 + i).padStart(4, '0')}` : null,
  };
});
