import { CHEMICALS } from './chemicals.js';

const COMPANIES = [
  'Coromandel International', 'Madras Fertilizers', 'SPIC Limited', 'Chemplast Sanmar',
  'Manali Petrochemicals', 'Tamil Nadu Petroproducts', 'Aarti Industries', 'Deepak Nitrite',
  'Gujarat Alkalies', 'GHCL Limited',
];

export const CUSTOMERS = COMPANIES.map((name, i) => ({
  id: `CUST-${String(i + 1).padStart(3, '0')}`,
  company: name,
  contact: ['Ramesh Kumar', 'Priya Nair', 'Suresh Babu', 'Anitha Devi', 'Vijay Mohan'][i % 5],
  phone: `+91 ${9800000001 + i}`,
  email: `logistics@${name.toLowerCase().replace(/\s+/g, '')}.com`,
  address: ['Chennai', 'Manali', 'Cuddalore', 'Ennore', 'Tuticorin'][i % 5] + ', Tamil Nadu',
  chemicalsAccepted: CHEMICALS.filter((_, ci) => (ci + i) % 3 !== 0).map(c => c.id),
  paymentDays: [30, 45, 60][i % 3],
  creditLimit: (i + 1) * 500000,
  outstandingBalance: (i + 1) * 200000 * (0.3 + (i % 5) * 0.1),
  totalTrips: 20 + i * 3,
  lifetimeRevenue: (i + 1) * 1200000,
}));
