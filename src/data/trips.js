import { CHEMICALS } from './chemicals.js';
import { DRIVERS } from './drivers.js';
import { TRUCKS } from './trucks.js';
import { CUSTOMERS } from './customers.js';

const DESTINATIONS = [
  'Manali Industrial Area', 'Cuddalore Port', 'Ennore SEZ', 'Tuticorin Port',
  'Hosur Industrial Park', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore',
];

function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString().split('T')[0];
}

export const TRIPS = Array.from({ length: 200 }, (_, i) => {
  const driver = DRIVERS[i % DRIVERS.length];
  const truck = TRUCKS[i % TRUCKS.length];
  const chemical = CHEMICALS[i % CHEMICALS.length];
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  const distance = 80 + (i % 400);
  const load = Math.round((truck.capacity * (0.6 + (i % 4) * 0.1)) * 10) / 10;
  const revenue = Math.round(distance * load * 120);
  return {
    id: `TRIP-${String(2000 + i).padStart(4, '0')}`,
    driverId: driver.id,
    driverName: driver.name,
    truckId: truck.id,
    truckRegistration: truck.registration,
    chemicalId: chemical.id,
    chemicalName: chemical.name,
    customerId: customer.id,
    customerName: customer.company,
    destination: DESTINATIONS[i % DESTINATIONS.length],
    date: randomDate(180),
    loadWeight: load,
    distance,
    dieselUsed: Math.round(distance * 0.35),
    status: i % 10 === 0 ? 'Delayed' : 'Delivered',
    revenue,
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));
