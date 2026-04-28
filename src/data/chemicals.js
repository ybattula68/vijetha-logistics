export const CHEMICALS = [
  { id: 'sulphuric_acid', name: 'Sulphuric Acid', un: 'UN1830', hazardClass: '8', hazardType: 'Corrosive', compatibleTanks: ['SS316', 'FRP'], color: '#ef4444' },
  { id: 'caustic_soda', name: 'Caustic Soda', un: 'UN1824', hazardClass: '8', hazardType: 'Corrosive', compatibleTanks: ['SS316', 'Carbon Steel', 'HDPE'], color: '#f97316' },
  { id: 'hcl', name: 'HCl', un: 'UN1789', hazardClass: '8', hazardType: 'Corrosive', compatibleTanks: ['FRP', 'HDPE', 'Rubber-lined'], color: '#eab308' },
  { id: 'ethanol', name: 'Ethanol', un: 'UN1170', hazardClass: '3', hazardType: 'Flammable', compatibleTanks: ['Carbon Steel', 'SS316', 'Aluminum'], color: '#22c55e' },
  { id: 'nitric_acid', name: 'Nitric Acid', un: 'UN2031', hazardClass: '8', hazardType: 'Corrosive / Oxidiser', compatibleTanks: ['SS316', 'FRP'], color: '#a855f7' },
  { id: 'ammonia', name: 'Ammonia', un: 'UN2672', hazardClass: '8', hazardType: 'Toxic / Corrosive', compatibleTanks: ['Carbon Steel', 'SS316'], color: '#06b6d4' },
  { id: 'sodium_hypochlorite', name: 'Sodium Hypochlorite', un: 'UN1791', hazardClass: '8', hazardType: 'Corrosive', compatibleTanks: ['HDPE', 'FRP', 'Rubber-lined'], color: '#ec4899' },
];

export const TANK_TYPES = ['SS316', 'HDPE', 'FRP', 'Carbon Steel', 'Aluminum', 'Rubber-lined'];

export function getChemical(id) {
  return CHEMICALS.find(c => c.id === id);
}

export function isCompatible(chemicalId, tankType) {
  const chem = getChemical(chemicalId);
  return chem ? chem.compatibleTanks.includes(tankType) : true;
}
