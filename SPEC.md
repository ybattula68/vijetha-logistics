# Sri Vijetha Logistics OPS — Product Specification
**Version:** 1.4 · **Date:** April 2026 · **Status:** Phase 1 Complete

---

## 1. Overview

Sri Vijetha Logistics OPS is a web-based logistics operations dashboard built for a chemical transport company. The platform enables owners and managers to monitor their full fleet in real time, manage driver assignments, track compliance, view trip history, and manage customer relationships — all from a single interface.

The business transports hazardous chemicals (sulphuric acid, caustic soda, HCl, ethanol, nitric acid, ammonia, sodium hypochlorite, and others) using a mixed fleet of owned and leased vehicles to industrial customers across India. Single depot: Hyderabad.

---

## 2. Users & Access

All roles log in through the **same web app** at the same URL. The dashboard shown after login is determined by the user's role — no separate apps or links.

| Role | Access | Phase |
|---|---|---|
| Owner | Full dashboard — all 6 modules, assign trips, edit customers, view all compliance | Phase 1 ✅ |
| Manager | Full dashboard — all 6 modules, assign trips, edit customers, view all compliance | Phase 1 ✅ |
| Driver | Own trip only — current assignment, status updates, diesel/distance logging | Phase 2 |
| Customer | Own account only — delivery history, current shipment status, credit balance | Phase 2 |

### Role interfaces
- **Owner / Manager** — full dashboard (built)
- **Driver** — simplified view: their active trip, status update buttons, trip log form (Phase 2)
- **Customer** — portal view: their deliveries, shipment tracker, account/credit summary (Phase 2)

### Home Page (built)
Accessible by clicking **"Sri Vijetha Logistics"** in the top-left of the nav bar, or on login (default landing page for all roles). Contains:
- Hero banner with tagline
- 4 content sections: About Us, Contact Us, Our Services, Coverage

Three floating buttons fixed to the bottom of the home page — each opens a popup on click:

- **Coverage** (bottom-left) — placeholder, content pending
- **Our Services** (bottom-centre) — placeholder, content pending
- **Contact Us** (bottom-right) — filled in:
  - Founder: Battula Prasad · +91 98480 37345 · battula.transport@yahoo.com
  - Proprietor: Battula Sashank · +91 97033 66668 · shasankbattula@vijethalogistics.com
  - Address: Flat 401, RV'S Sarala Sadan, Sri Nagar Colony, Yellareddyguda, Hyderabad — 500072

About Us section on the page body is placeholder — content pending from user.

### Login & Auth (built)
- Single login page at app root — accepts email or phone number
- Register page for Owner/Manager accounts
- Driver accounts created by Owner/Manager from driver profile — phone + temp password
- First-time login forces driver to set a new password
- Session persists across refresh — stay logged in until Sign Out
- Creator shortcut — faint "Creator" button at bottom of login for admin access

---

## 3. Fleet

### 3.1 Vehicle Inventory
- **30 own vehicles** — full operational control
- **50 leased vehicles** — no special assignment restrictions
- Capacities range from 10 to 20 tonnes per vehicle
- Each truck has a designated tank type: SS316, HDPE, FRP, Carbon Steel, Aluminum, or Rubber-lined

### 3.2 Tank-Chemical Compatibility Rules
Certain tank materials are incompatible with certain chemicals. The system enforces these rules during assignment:

| Chemical | Compatible Tank Types |
|---|---|
| Sulphuric Acid | SS316, FRP |
| Caustic Soda | SS316, Carbon Steel, HDPE |
| HCl | FRP, HDPE, Rubber-lined |
| Ethanol | Carbon Steel, SS316, Aluminum |
| Nitric Acid | SS316, FRP |
| Ammonia | Carbon Steel, SS316 |
| Sodium Hypochlorite | HDPE, FRP, Rubber-lined |

Incompatible trucks are hidden by default during assignment but visible under a collapsed "show incompatible" section. A live warning appears immediately when an incompatible truck is selected, and saving is blocked until corrected.

---

## 4. Modules

All modules support **grid and list view toggle**.

### 4.1 Driver Dashboard
Shows all 40 drivers. Each card displays:
- Driver name, ID, phone, and years of experience
- Current trip status (In Transit / Loading / Unloading / Waiting / Available)
- Assigned truck ID, registration, tank type, and ownership (Own / Lease)
- Chemical being transported with UN number and hazard class
- Load weight and utilisation percentage with a progress bar
- Destination
- HAZMAT or license expiry warning badge if expiring within 90 days

**Filters:** All, In Transit, Available, Loading, Unloading, Maintenance, Waiting

**Search:** By driver name, driver ID, truck ID, chemical, or destination

**Side panel** on click shows full profile + App Account section (Owner/Manager only):
- If no account: "+ Create Account" button — sets phone + temp password
- If account active: green status badge + Reset button
- Assign / Edit Trip button

### 4.2 Fleet View
Card grid of all 80 trucks. Each card shows:
- Truck ID, registration, model
- Tank type and capacity
- Ownership badge (Own / Lease)
- If assigned: driver name, chemical, destination
- If unassigned: Available status
- Warning badge if any compliance document expiring within 30 days

**Side panel** on click shows full details + all compliance doc expiry dates (colour-coded).

**Edit Vehicle modal** — edit registration, model, tank type, capacity, ownership, and all 8 compliance dates.

Searchable by truck ID, registration, or model.

**Vehicle compliance documents tracked (per truck):**
- PESO License
- Calibration
- Insurance
- Fitness
- Pollution
- National Permit
- Road Tax
- Next Service Date

All 8 documents feed into Alerts & Compliance with severity thresholds (Critical ≤14 days, High ≤30 days, Medium ≤90 days).

### 4.3 Live GPS Map
Displays all in-transit trucks as coloured dots on an India SVG map, colour-coded by chemical. Route lines connect the Chennai depot to each vehicle. Per-chemical count bar shows trucks currently on road.

**GPS Integration:** Polls a REST HTTP API at 15-second intervals. Integration layer normalises response to `{ truckId, lat, lng, speed, heading, lastSeen }`. Currently uses simulated data.

**GPS Provider:** To be confirmed.

### 4.4 Alerts & Compliance
Centralised view of all compliance risks sorted by urgency. Each alert shows:
- Days remaining (or overdue) as a prominent number
- Exact expiry date
- Severity: Critical (≤14 days), High (≤30 days), Medium (≤90 days)

Alert count badge shown in navigation bar.

**Alert triggers:**
- Driving license expiring within 90 days
- HAZMAT certification expiring within 90 days
- Any of 8 vehicle compliance documents expiring within 90 days

### 4.5 Trip History
Historical view of all completed trips. Three sub-views:
- **By Driver** — trip list per driver: ID, chemical, destination, date, load, distance, diesel, status
- **By Truck** — grouped by truck ID and registration
- **By Customer** — grouped by customer with total revenue

Each group expandable — shows last 10 trips with "+N more". Searchable across all fields.

### 4.6 Customer Management
Full customer directory with add and edit capability. Each record contains:
- Company name and ID, contact person, phone, email, address
- Chemicals accepted (tagged with hazard colours)
- Credit terms: payment days, credit limit, outstanding balance
- Credit utilisation bar (green / amber / red)
- Total trip count and lifetime revenue

**Side panel** shows full detail + last 5 trips. **Add / Edit modal** for all fields.

---

## 5. Assignment Flow

3-step modal:
1. **Select Chemical** — tile shows UN number and hazard class
2. **Select Truck** — compatible trucks auto-filtered; incompatible visible under collapsed section; live warning; save blocked on incompatible
3. **Trip Details** — destination dropdown; load weight (validated vs capacity); live utilisation bar

On save: driver status → "Loading", trip ID generated.
Unassign button available when editing existing assignment.

---

## 6. Hazardous Materials Data

| Chemical | UN Number | Hazard Class | Hazard Type | Map Colour |
|---|---|---|---|---|
| Sulphuric Acid | UN1830 | 8 | Corrosive | Red |
| Caustic Soda | UN1824 | 8 | Corrosive | Orange |
| HCl | UN1789 | 8 | Corrosive | Yellow |
| Ethanol | UN1170 | 3 | Flammable | Green |
| Nitric Acid | UN2031 | 8 | Corrosive / Oxidiser | Purple |
| Ammonia | UN2672 | 8 | Toxic / Corrosive | Cyan |
| Sodium Hypochlorite | UN1791 | 8 | Corrosive | Pink |

---

## 7. Data Persistence

### Current (Phase 1) — localStorage
All data auto-saves to browser localStorage on every change. Nothing is lost on refresh.

| localStorage Key | Data |
|---|---|
| `vl_session` | Logged-in user session |
| `vl_users` | All registered accounts + driver accounts |
| `vl_drivers` | All driver data + trip assignments |
| `vl_trucks` | All truck data + compliance dates |
| `vl_customers` | All customer records |
| `vl_trips` | All trip history |

### Future (Phase 2) — Supabase
PostgreSQL database hosted on Supabase. Migration path: swap `usePersistedState` hook for Supabase API calls. No other changes needed.

---

## 8. Phase 2 Plans

- **Driver mobile view** — own trip only, status updates, diesel/distance logging
- **Customer portal** — own deliveries, shipment tracker, credit summary
- **Backend / database** — Supabase (PostgreSQL + Auth)
- **Marketing website** — separate public-facing site for vijethalogistics.com
- **Deploy live** — Vercel hosting + vijethalogistics.com domain
- **GPS live integration** — connect real provider when confirmed

---

## 9. Open Items

| Item | Status | Notes |
|---|---|---|
| GPS provider name | Pending | REST API preferred |
| GPS API credentials | Pending | Endpoint URL + API key needed for go-live |
| Real driver names | Pending | Edit `NAMES` array in `src/data/drivers.js` |
| Real customer names | Pending | Edit `COMPANIES` array in `src/data/customers.js` |
| Real truck registrations | Pending | Edit `src/data/trucks.js` |
| Supabase setup | Not started | Planned for Phase 2 |
| GitHub push | ✅ Done | https://github.com/ybattula68/vijetha-logistics |
| Domain purchase | Not started | vijethalogistics.com — ~₹1000/year |
| Home page content | Partial | Contact done. About Us, Services, Coverage still pending |
| Marketing website content | Pending | Separate public site — content to be provided by user |
| Invoice generation | Not scoped | Potential future module |
| Multi-depot support | Not scoped | Currently single depot (Chennai) |

---

## 10. Technology

| Layer | Choice |
|---|---|
| Frontend | React 19 (JSX) |
| Build tool | Vite 8 |
| Styling | Inline styles + CSS variables; IBM Plex Sans + JetBrains Mono |
| GPS polling | REST HTTP API, 15-second interval, simulated for Phase 1 |
| State management | React useState / useMemo + usePersistedState hook |
| Data storage | Browser localStorage (Phase 1) → Supabase (Phase 2) |
| Auth | localStorage session (Phase 1) → Supabase Auth (Phase 2) |
| Hosting | Local only (Phase 1) → Vercel (Phase 2) |
| Version control | Git + GitHub (account: ybattula68) |

---

## 11. Project Setup

**Local path:** `/Users/yashwanthbattula/Desktop/vijetha-logistics`

**Run locally:**
```bash
cd /Users/yashwanthbattula/Desktop/vijetha-logistics
npm run dev
# Open http://localhost:5173
```

**Source structure:**
```
src/
├── data/
│   ├── chemicals.js
│   ├── trucks.js
│   ├── drivers.js        # Edit NAMES array for real driver names
│   ├── customers.js      # Edit COMPANIES array for real customer names
│   └── trips.js
├── components/
│   ├── Nav.jsx
│   ├── LoginPage.jsx
│   ├── DriverDashboard.jsx
│   ├── FleetView.jsx
│   ├── GPSMap.jsx
│   ├── AlertsCompliance.jsx
│   ├── TripHistory.jsx
│   ├── CustomerManagement.jsx
│   ├── AssignmentFlow.jsx
│   ├── ViewToggle.jsx
│   └── HomePage.jsx
├── hooks/
│   └── usePersistedState.js
├── styles/
│   └── variables.css
└── data-entry/
    ├── drivers.csv
    └── trucks.csv        # Includes all compliance doc columns
```

---

*Last updated: April 28, 2026 — Contact details added, driver nav restricted, login bug fixed*
