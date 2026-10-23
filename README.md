# DisplaceOS 🚨
### AI-Powered Disaster Relief Coordination & Emergency Response Platform

> **“When Disaster Strikes, Every Second Matters.”**  
> *One platform. Every rescue. Every resource. Every life.*

---

## 📌 Executive Overview

**DisplaceOS** is a production-quality, responsive emergency command and disaster relief platform engineered for civil defense authorities, national rescue taskforces (e.g., NDRF), municipal emergency operations centers (EOC), relief NGOs, and affected citizens.

During disasters like flash floods, structural building collapses, landslides, and cyclones, response delays cost human lives. DisplaceOS solves this through real-time geospatial intelligence, deterministic & AI-assisted emergency triage, automated rescue squad dispatch, live shelter capacity tracking, negative-balance protected relief logistics, and multilingual offline-resilient citizen reporting.

---

## 🛡️ Key Architectural Principles & Responsible AI

1. **AI Assists, Humans Decide:** AI triage suggests classifications (P0, P1, P2, P3) and flags perils, but consequential dispatch orders require dispatcher verification.
2. **Deterministic Safety Baseline:** A deterministic rule engine guarantees immediate escalation for active entrapment, casualties, or vulnerable individuals even if cloud AI services are unreachable.
3. **Audit Trail Accountability:** Every priority override, squad dispatch, alert issuance, and stock deduction is permanently recorded in the immutable audit log.
4. **Zero-Trust Privacy:** Citizen telephone numbers and precise indoor coordinates are automatically redacted for unauthorized public view.
5. **Offline-First Resilience:** In-browser persistent draft and offline queues ensure citizen reports are cached locally and synchronized via idempotency keys once network returns.

---

## 🚀 Live Demo Accounts & Roles

DisplaceOS features role-based access control (RBAC). For testing and hackathon evaluation, click any role pill in the **top simulation bar** or use the credentials below:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Command Center (Admin)** | `commander@displaceos.org` | `EmergencyPass2026!` | Full EOC Dashboard, AI Triage Overrides, Fleet Dispatch, Alerts, Audit Logs |
| **Rescue Team Leader** | `team.alpha@displaceos.org` | `EmergencyPass2026!` | Active Missions, Accept/Decline, En Route/On Scene Status, Live GPS Telemetry |
| **Shelter Manager** | `shelter.metro@displaceos.org` | `EmergencyPass2026!` | Bed Capacity Sliders, Supply Rations, Family Check-In/Check-Out |
| **Medical Responder** | `medic.sarah@displaceos.org` | `EmergencyPass2026!` | Trauma Case Triage, ALS Ambulance Coordination, Hospital Referrals |
| **Affected Citizen** | `citizen.rahul@gmail.com` | `EmergencyPass2026!` | Guided SOS Report, Geolocation Auto-Capture, Track Request, Missing Persons |

---

## ⚙️ Core Modules Implemented

- **Module 1: Executive Command Dashboard:** Real KPIs calculated directly from database records, severity & category Recharts graphs, and operational summary feeds.
- **Module 2: Interactive Disaster Intelligence Map:** Dominant Leaflet GIS with cluster markers, severity indicators, hazard perimeter circles, road blockages, shelter markers, and route approximations.
- **Module 3: Emergency Incident Reporting:** Guided multi-variable report with GPS capture, entrapment counters, vulnerability tags, draft saving, and offline sync.
- **Module 4: AI Emergency Triage Engine:** Structured triage classifying incidents into P0 (Life threat), P1 (Urgent), P2 (Essential), and P3 (Support) with confidence scores, identified risks, and recommended actions.
- **Module 5: Smart Rescue Dispatch:** Algorithmic squad recommendation evaluating Haversine distance, equipment capabilities (water rescue, collapse search, ALS medical), and workload balancing.
- **Module 6: Rescue Team Tracking & Responder Portal:** Dedicated squad console with mission acceptance, status steppers (Assigned → Accepted → En Route → On Scene → Completed), and victim assistance logs.
- **Module 7: Shelter Management:** Verified directory tracking total capacity, occupancy percentages, essential supplies (water, food, medical, power), and check-in/out rosters.
- **Module 8: Relief Inventory & Logistics:** Multi-depot supply tracking with transaction history, zero-negative-stock protection, and low-stock alerts.
- **Module 9: Missing Persons & Family Reunification:** Privacy-conscious reporting, authorized lead updates, and search roster.
- **Module 10: Alerts & Early-Warning Center:** Broadcast hazard bulletins, meteorology advisories, and mandatory evacuation orders.
- **Module 11: Disaster Risk & Impact Analytics:** Data-driven operational debriefs, response time distributions, and one-click CSV dataset export.
- **Module 12: Road Accessibility & Route Planning:** Impassable road blockage logging and emergency route calculation.
- **Module 13: Accessibility & Multilingual Interface:** English & Hindi interface toggle, high-contrast readability, and WCAG 2.2 AA accessibility principles.
- **Module 14: Low-Network & Offline-First Support:** LocalStorage drafts and queued reports with automatic background sync.
- **Module 15: Real-Time Telemetry & WebSocket Broadcasting:** WebSocket streaming on `/ws` notifying all connected browsers of new incidents, dispatch orders, and status mutations.
- **Module 16: System Audit Logs:** Immutable compliance log recording all sensitive actions and officer identifiers.
- **Module 17: Interactive Simulation Controller:** Sticky demo toolbar allowing evaluators to simulate emergency surges (+3 incidents), move responder GPS, consume depot supplies, and close roads.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6, TanStack Query, Leaflet & React-Leaflet, Recharts.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite (zero-config, high-performance relational database with PostgreSQL compatibility), WebSockets (`ws`), Zod validation, JWT authentication, Argon2/bcryptjs password hashing.
- **Testing:** Vitest test suite for AI triage rules, geospatial distance calculation, inventory transaction integrity, and shelter constraints.

---

## 💻 Local Setup & Quickstart

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Installation
Clone the repository and install root, backend, and frontend dependencies:
```bash
# In project root:
npm run setup
```
*(This command installs backend dependencies, initializes Prisma schema, pushes the database, seeds rich disaster demo data, and installs frontend dependencies.)*

### 2. Environment Configuration
Backend `.env` is pre-configured with default local settings in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="displaceos_emergency_jwt_secret_key_prod_2026"
CORS_ORIGIN="http://localhost:5173"
AI_PROVIDER="rule_engine"
```

### 3. Run Development Servers
Start both backend API and frontend Vite servers concurrently:
```bash
npm run dev
```
- **Frontend Command Center:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **WebSocket Telemetry Stream:** `ws://localhost:5000/ws`

### 4. Run Test Suite
Run backend unit and integration tests:
```bash
npm test
```

### 5. Production Build
Verify production bundles:
```bash
npm run build
```

---

## 📡 REST API Summary

- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/demo-login` — 1-click evaluation login for any role
- `GET /api/incidents` — List incidents with category, priority, status filters
- `POST /api/incidents` — Report incident with AI triage evaluation
- `POST /api/incidents/:id/verify` — Verify incoming community report (EOC)
- `POST /api/incidents/:id/override-priority` — Human priority override with audit log
- `POST /api/incidents/:id/assign` — Dispatch rescue squad to incident
- `GET /api/map/all-layers` — Single-payload geospatial layers (incidents, shelters, teams, hazards, road cuts)
- `GET /api/map/route-estimate` — Distance, waypoints, and ETA calculation
- `GET /api/teams` — Rescue fleet tracking and availability status
- `GET /api/missions` — Field responder missions queue
- `POST /api/missions/:id/accept` — Squad accepts mission
- `POST /api/missions/:id/complete` — Conclude mission with victim count
- `GET /api/shelters` — Shelters directory and live occupancy
- `POST /api/shelters/:id/check-in` — Family arrival check-in
- `GET /api/inventory` — Depot inventory stock
- `POST /api/inventory/transactions` — Record supply consumption or intake
- `GET /api/alerts` — Hazard early-warning notices
- `GET /api/analytics/overview` — Real KPIs computed from application database
- `GET /api/analytics/export-csv` — Download operational summary CSV
- `GET /api/audit` — Immutable compliance audit logs
- `POST /api/simulation/spike` — Simulation: Trigger incident volume surge
- `POST /api/simulation/move-teams` — Simulation: Advance responder GPS coordinates
- `POST /api/simulation/consume-supplies` — Simulation: Deduct field depot stock
- `POST /api/simulation/road-closure` — Simulation: Trigger impassable road blockage

---

## 📄 License & Attribution
DisplaceOS is open-source software built for humanitarian disaster management. Map tiles provided via OpenStreetMap and CartoDB under open attribution standards.
