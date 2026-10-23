<div align="center">

# 🚨 DisplaceOS

### AI-Powered Disaster Relief Coordination & Emergency Response Platform

**"When Disaster Strikes, Every Second Matters."**
*One platform. Every rescue. Every resource. Every life.*

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Zero--Config-003B57?logo=sqlite&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-010101)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-Open%20Source-brightgreen)

[Overview](#-executive-overview) •
[Problem](#-the-problem) •
[Architecture](#-system-architecture) •
[Features](#-core-modules) •
[Quickstart](#-local-setup--quickstart) •
[API](#-rest-api-reference) •
[Roadmap](#-roadmap)

</div>

---

## 📑 Table of Contents

1. [Executive Overview](#-executive-overview)
2. [The Problem](#-the-problem)
3. [Key Principles & Responsible AI](#-key-architectural-principles--responsible-ai)
4. [System Architecture](#-system-architecture)
5. [Data Flow Diagrams](#-data-flow-diagrams)
6. [Data Model (ER Diagram)](#-data-model-er-diagram)
7. [Roles & Demo Accounts](#-live-demo-accounts--roles)
8. [Core Modules](#-core-modules)
9. [AI Triage Engine](#-ai-triage-engine)
10. [Smart Dispatch Engine](#-smart-dispatch-engine)
11. [Security & Privacy](#-security--privacy)
12. [Tech Stack](#-tech-stack)
13. [Project Structure](#-project-structure)
14. [Local Setup & Quickstart](#-local-setup--quickstart)
15. [Environment Variables](#-environment-variables)
16. [REST API Reference](#-rest-api-reference)
17. [WebSocket Events](#-websocket-telemetry)
18. [Testing](#-testing)
19. [Simulation Guide for Evaluators](#-simulation-guide-for-evaluators)
20. [Roadmap](#-roadmap)
21. [Contributing](#-contributing)
22. [License](#-license--attribution)

---

## 📌 Executive Overview

**DisplaceOS** is a production-quality, responsive emergency command and disaster relief platform for civil defense authorities, national rescue taskforces (e.g., NDRF), municipal Emergency Operations Centers (EOC), relief NGOs, and affected citizens.

During floods, structural collapses, landslides, fires, and cyclones, response delays cost lives. DisplaceOS addresses this with:

- 🗺️ **Real-time geospatial intelligence** – one live map of incidents, teams, shelters, hazards and blocked roads
- 🧠 **Deterministic + AI-assisted triage** – P0–P3 classification that works even with no internet/cloud AI
- 🚒 **Automated squad recommendation** – distance, capability and workload-aware dispatch scoring
- 🏠 **Live shelter capacity tracking** – occupancy, supplies, check-in/check-out
- 📦 **Negative-balance-protected logistics** – multi-depot inventory with immutable transaction history
- 🌐 **Multilingual, offline-resilient citizen reporting** – English/Hindi, local draft queue, idempotent sync

---

## ❗ The Problem

| Pain point in real disasters | How DisplaceOS responds |
| :--- | :--- |
| Reports arrive via scattered calls, WhatsApp, and radio — no single picture | One unified incident intake with GPS capture and a live command map |
| Dispatchers manually decide who to send first | Rule-based triage + ranked squad recommendations with explanations |
| Networks degrade exactly when they're needed most | Offline-first reporting with local queue and automatic sync |
| Relief stock is over-allocated or untracked | Transactional inventory with zero-negative-stock protection |
| Shelter capacity is unknown to citizens and responders | Live occupancy and supplies per shelter |
| Decisions are hard to audit after the event | Immutable audit log of every sensitive action |
| Families are separated and can't find each other | Privacy-conscious missing persons workflow |

---

## 🛡️ Key Architectural Principles & Responsible AI

1. **AI Assists, Humans Decide** – AI suggests P0–P3 and flags perils; consequential dispatch orders require dispatcher verification.
2. **Deterministic Safety Baseline** – A rule engine guarantees immediate escalation for entrapment, casualties, or vulnerable individuals even if cloud AI is unreachable (`AI_PROVIDER="rule_engine"`).
3. **Audit Trail Accountability** – Priority overrides, dispatches, alerts, and stock deductions are recorded in the audit log with the acting officer.
4. **Zero-Trust Privacy** – Citizen phone numbers and precise indoor coordinates are redacted for unauthorized viewers.
5. **Offline-First Resilience** – Drafts and queued reports persist in the browser and sync using idempotency keys, preventing duplicates.
6. **Explainability** – Every triage result and dispatch recommendation ships with reasons, risks, and a confidence score.

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
flowchart TB
    subgraph CLIENTS["👥 Client Layer · React 18 + Vite + Tailwind"]
        direction LR
        CMD["🎖️ Command Center<br/>(Admin / EOC)"]
        RESP["🚒 Rescue Team<br/>Responder Portal"]
        SHEL["🏠 Shelter<br/>Manager"]
        MED["🩺 Medical<br/>Responder"]
        CIT["🧑 Affected<br/>Citizen"]
    end

    subgraph FE["🖥️ Frontend Services"]
        direction LR
        ROUTER["React Router v6<br/>Role-guarded routes"]
        RQ["TanStack Query<br/>Server-state cache"]
        I18N["i18n<br/>EN / हिन्दी"]
        OFFQ["Offline Queue<br/>LocalStorage + Idempotency Keys"]
        MAP["Leaflet GIS<br/>Clusters · Hazards · Routes"]
        CHART["Recharts<br/>Analytics"]
    end

    subgraph EDGE["🌐 Transport"]
        direction LR
        REST["REST / JSON<br/>HTTPS + JWT Bearer"]
        WS["WebSocket<br/>/ws"]
    end

    subgraph BE["⚙️ Backend · Node.js + Express + TypeScript"]
        direction TB
        MW["Middleware<br/>CORS · JSON parser · JWT Auth · RBAC · Zod validation"]
        subgraph ROUTES["Route Modules"]
            direction LR
            R1["auth"] ~~~ R2["incidents"] ~~~ R3["missions"] ~~~ R4["teams"] ~~~ R5["shelters"]
            R6["inventory"] ~~~ R7["missing-persons"] ~~~ R8["alerts"] ~~~ R9["map"] ~~~ R10["analytics"]
            R11["audit"] ~~~ R12["simulation"]
        end
        subgraph SVC["Domain Services"]
            direction LR
            TRI["🧠 aiTriage<br/>Rule engine + optional AI"]
            DIS["🚒 dispatchEngine<br/>Haversine + capability scoring"]
            NOTIF["🔔 notificationService<br/>WS broadcast + persisted notices"]
            AUD["📜 auditLogger"]
            SIM["🎮 simulationEngine"]
        end
        WSS["WebSocket Server<br/>client registry by user / role"]
    end

    subgraph DATA["🗄️ Data Layer"]
        direction LR
        PRISMA["Prisma ORM"]
        DB[("SQLite<br/>PostgreSQL-compatible schema")]
    end

    subgraph EXT["🔌 External / Optional"]
        direction LR
        OSM["OpenStreetMap / CartoDB<br/>Map tiles"]
        LLM["Cloud AI Provider<br/>(optional, pluggable)"]
    end

    CMD & RESP & SHEL & MED & CIT --> ROUTER
    ROUTER --> RQ --> REST
    ROUTER --> OFFQ --> REST
    ROUTER --- I18N
    ROUTER --- MAP
    ROUTER --- CHART
    MAP -. tiles .-> OSM
    RQ -. live updates .-> WS

    REST --> MW --> ROUTES
    ROUTES --> SVC
    SVC --> PRISMA --> DB
    ROUTES --> PRISMA
    NOTIF --> WSS
    WS <--> WSS
    TRI -. optional .-> LLM

    classDef client fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e;
    classDef backend fill:#fef3c7,stroke:#d97706,color:#78350f;
    classDef data fill:#dcfce7,stroke:#16a34a,color:#14532d;
    classDef ext fill:#f3e8ff,stroke:#9333ea,color:#581c87;
    class CMD,RESP,SHEL,MED,CIT client;
    class TRI,DIS,NOTIF,AUD,SIM,WSS,MW backend;
    class PRISMA,DB data;
    class OSM,LLM ext;
```

### Layered View

```mermaid
flowchart LR
    A["Presentation<br/>React pages & components"] --> B["State & Sync<br/>TanStack Query · Context · Offline Queue"]
    B --> C["API Gateway Layer<br/>Express routes · Zod · JWT · RBAC"]
    C --> D["Domain Services<br/>Triage · Dispatch · Notify · Audit · Simulate"]
    D --> E["Persistence<br/>Prisma ORM"]
    E --> F[("SQLite / PostgreSQL")]
    D -. push .-> G["Realtime<br/>WebSocket /ws"]
    G -. events .-> A
```

### Deployment Topology

```mermaid
flowchart LR
    U["Browser / PWA-ready client"] -->|HTTPS| FEH["Static hosting<br/>Vite build (dist/)"]
    U -->|REST + WSS| API["Node.js API server<br/>Express + ws"]
    API --> ORM["Prisma Client"]
    ORM --> DBS[("SQLite file (dev)<br/>PostgreSQL (prod)")]
    API -. optional .-> AI["AI provider"]
    U -. tiles .-> TILES["OSM / CartoDB tiles"]
```

---

## 🔄 Data Flow Diagrams

### 1. Citizen SOS → Triage → Dispatch → Completion

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant UI as React UI
    participant Q as Offline Queue
    participant API as Express API
    participant T as aiTriage
    participant DB as Prisma / DB
    participant WS as WebSocket Hub
    actor EOC as Dispatcher (EOC)
    participant D as dispatchEngine
    actor Team as Rescue Team

    Citizen->>UI: Fill guided SOS report (GPS, trapped, injured, tags)
    alt Network available
        UI->>API: POST /api/incidents (Idempotency-Key)
    else Offline
        UI->>Q: Save draft + queue with Idempotency-Key
        Q-->>API: Auto-sync when connectivity returns
    end
    API->>T: runDeterministicTriage(input)
    T-->>API: Priority P0–P3 · risks · actions · confidence
    API->>DB: Save Incident + AIRecommendation + StatusHistory
    API->>WS: Broadcast INCIDENT_CREATED
    WS-->>EOC: Live alert on command dashboard / map
    EOC->>API: POST /incidents/:id/verify
    opt Human disagrees with AI
        EOC->>API: POST /incidents/:id/override-priority
        API->>DB: Write AuditLog
    end
    EOC->>D: Request recommendations
    D->>DB: Load incident + teams + active missions
    D-->>EOC: Ranked squads (distance · ETA · match score · reasons)
    EOC->>API: POST /incidents/:id/assign
    API->>DB: Create Mission + AuditLog
    API->>WS: Broadcast MISSION_ASSIGNED
    WS-->>Team: Mission notification
    Team->>API: accept → en route → on scene
    Team->>API: POST /missions/:id/complete (victims assisted)
    API->>DB: Update Mission, Incident, Team status
    API->>WS: Broadcast status change
    WS-->>Citizen: Request status updated
```

### 2. Incident Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> REPORTED: Citizen / field submits
    REPORTED --> VERIFIED: EOC verifies
    REPORTED --> REJECTED: Duplicate / false report
    VERIFIED --> ASSIGNED: Squad dispatched
    ASSIGNED --> IN_PROGRESS: Team accepted / en route / on scene
    IN_PROGRESS --> RESOLVED: Mission completed
    ASSIGNED --> VERIFIED: Team declined (re-queue)
    RESOLVED --> [*]
    REJECTED --> [*]
```

> Exact state names are defined in `backend/prisma/schema.prisma` and the route handlers; the diagram shows the intended lifecycle.

### 3. Mission Status Stepper (Responder Portal)

```mermaid
flowchart LR
    A([ASSIGNED]) --> B([ACCEPTED]) --> C([EN_ROUTE]) --> D([ON_SCENE]) --> E([COMPLETED])
    A -. decline .-> X([DECLINED → re-dispatch])
```

### 4. Inventory Transaction Safety

```mermaid
flowchart TD
    S["POST /api/inventory/transactions"] --> V{"Type?"}
    V -- "INTAKE" --> I["quantity += n"]
    V -- "CONSUMPTION" --> C{"stock − n ≥ 0 ?"}
    C -- "No" --> E["❌ 400 Rejected<br/>zero-negative-stock guard"]
    C -- "Yes" --> U["quantity −= n"]
    I --> L["Write InventoryTransaction"]
    U --> L
    L --> A["Write AuditLog"]
    A --> LS{"Below low-stock threshold?"}
    LS -- "Yes" --> N["🔔 Low-stock notification"]
    LS -- "No" --> OK["✅ Done"]
    N --> OK
```

### 5. Offline-First Sync

```mermaid
flowchart LR
    F["Citizen fills form"] --> D["Auto-save draft<br/>(LocalStorage)"]
    D --> SUB{"Online?"}
    SUB -- Yes --> POST["POST with Idempotency-Key"]
    SUB -- No --> QUEUE["Queue report locally"]
    QUEUE --> EV["'online' event / retry timer"]
    EV --> POST
    POST --> SRV{"Key seen before?"}
    SRV -- Yes --> DUP["Return existing incident (no duplicate)"]
    SRV -- No --> CREATE["Create incident + triage"]
```

---

## 🗃️ Data Model (ER Diagram)

```mermaid
erDiagram
    USER ||--o| CITIZENPROFILE : has
    USER ||--o{ INCIDENT : reports
    USER ||--o{ AUDITLOG : performs
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ MISSINGPERSONCASE : files

    RESCUETEAM ||--o{ MISSION : executes
    INCIDENT ||--o{ MISSION : "dispatched as"
    INCIDENT ||--o{ INCIDENTATTACHMENT : has
    INCIDENT ||--o{ INCIDENTSTATUSHISTORY : tracks
    INCIDENT ||--o{ AIRECOMMENDATION : "triaged by"
    MISSION ||--o{ MISSIONUPDATE : logs

    SHELTER ||--o{ SHELTEROCCUPANCYRECORD : records
    SHELTER ||--o{ SHELTERREGISTRATION : hosts

    INVENTORYITEM ||--o{ INVENTORYTRANSACTION : "moves via"

    MISSINGPERSONCASE ||--o{ MISSINGPERSONUPDATE : "lead updates"

    USER {
        string id PK
        string email
        string passwordHash
        string role
    }
    INCIDENT {
        string id PK
        string category
        string priority
        string status
        float latitude
        float longitude
        int trappedCount
        int injuredCount
    }
    RESCUETEAM {
        string id PK
        string callSign
        string capabilities
        string status
        float currentLat
        float currentLng
    }
    MISSION {
        string id PK
        string status
    }
    SHELTER {
        string id PK
        int capacity
        int occupancy
    }
    INVENTORYITEM {
        string id PK
        string name
        int quantity
    }
    HAZARDALERT {
        string id PK
        string severity
    }
    ROADBLOCKAGEREPORT {
        string id PK
        float latitude
        float longitude
    }
    AUDITLOG {
        string id PK
        string action
        string actorId
    }
```

> `HazardAlert` and `RoadBlockageReport` are standalone geospatial entities consumed by the map layer. The diagram shows primary relationships; see `backend/prisma/schema.prisma` for the full field list.

---

## 🚀 Live Demo Accounts & Roles

Click any role pill in the **top simulation bar**, or sign in manually:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Command Center (Admin)** | `commander@displaceos.org` | `EmergencyPass2026!` | EOC dashboard, AI triage overrides, fleet dispatch, alerts, audit logs |
| **Rescue Team Leader** | `team.alpha@displaceos.org` | `EmergencyPass2026!` | Missions, accept/decline, status stepper, live GPS telemetry |
| **Shelter Manager** | `shelter.metro@displaceos.org` | `EmergencyPass2026!` | Capacity sliders, supply rations, family check-in/out |
| **Medical Responder** | `medic.sarah@displaceos.org` | `EmergencyPass2026!` | Trauma triage, ALS coordination, hospital referrals |
| **Affected Citizen** | `citizen.rahul@gmail.com` | `EmergencyPass2026!` | Guided SOS, geolocation capture, request tracking, missing persons |

> ⚠️ **Demo credentials only.** Remove the demo-login endpoint, rotate `JWT_SECRET`, and re-seed with unique passwords before any real deployment.

### Role-Based Access Matrix

| Capability | Command | Rescue | Shelter | Medical | Citizen |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Report incident | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verify / override priority | ✅ | – | – | – | – |
| Dispatch squads | ✅ | – | – | – | – |
| Accept / complete missions | – | ✅ | – | – | – |
| Manage shelter capacity | ✅ | – | ✅ | – | – |
| Manage inventory | ✅ | – | ✅ (own supplies) | – | – |
| Issue alerts | ✅ | – | – | – | – |
| View audit logs | ✅ | – | – | – | – |
| Missing persons (report) | ✅ | – | ✅ | – | ✅ |
| Find shelters / view alerts | ✅ | ✅ | ✅ | ✅ | ✅ |

> The matrix reflects intended design; enforcement lives in `backend/src/middleware/auth.ts` and each route.

---

## ⚙️ Core Modules

```mermaid
mindmap
  root((DisplaceOS))
    Command
      Executive Dashboard
      Disaster Map
      Smart Dispatch
      Alerts Center
      Analytics
      Audit Logs
    Field
      Responder Portal
      Team Tracking
      Equipment Checklist
      Mission History
    Care
      Shelter Management
      Relief Inventory
      Missing Persons
    Citizen
      Guided SOS
      Request Tracking
      Shelter Finder
      Alerts
    Platform
      Offline Queue
      EN / Hindi
      WebSocket Telemetry
      Simulation Controller
```

| # | Module | Description |
| :-: | :--- | :--- |
| 1 | **Executive Command Dashboard** | KPIs computed from DB records, severity & category charts, operational feeds |
| 2 | **Disaster Intelligence Map** | Leaflet GIS with clusters, severity indicators, hazard perimeters, road cuts, shelters, route estimates |
| 3 | **Emergency Incident Reporting** | Guided report, GPS capture, entrapment counters, vulnerability tags, drafts, offline sync |
| 4 | **AI Emergency Triage** | P0–P3 with confidence, identified risks, and recommended actions |
| 5 | **Smart Rescue Dispatch** | Haversine distance, capability match, workload balancing → ranked squads |
| 6 | **Responder Portal** | Mission acceptance, status stepper, victim assistance logs |
| 7 | **Shelter Management** | Capacity, occupancy %, supplies (water, food, medical, power), rosters |
| 8 | **Relief Inventory & Logistics** | Multi-depot stock, transaction history, zero-negative guard, low-stock alerts |
| 9 | **Missing Persons & Reunification** | Privacy-conscious reporting, authorized lead updates, search roster |
| 10 | **Alerts & Early-Warning Center** | Hazard bulletins, advisories, mandatory evacuation orders |
| 11 | **Risk & Impact Analytics** | Operational debriefs, response-time distributions, one-click CSV export |
| 12 | **Road Accessibility & Routing** | Log impassable roads, estimate emergency routes |
| 13 | **Accessibility & Multilingual UI** | English/Hindi toggle, high-contrast readability, WCAG 2.2 AA principles |
| 14 | **Low-Network & Offline-First** | LocalStorage drafts & queue with automatic sync |
| 15 | **Real-Time Telemetry** | WebSocket broadcasting of incidents, dispatches, status changes |
| 16 | **System Audit Logs** | Immutable log of sensitive actions with officer identifiers |
| 17 | **Simulation Controller** | Surge incidents, move GPS, consume supplies, close roads |
| + | **Thermal Recon & 4K Command Center** | Thermal reconnaissance portal and large-display command view |

---

## 🧠 AI Triage Engine

The deterministic engine (`backend/src/services/aiTriage.ts`) scores each report, then maps score and hard rules to a priority.

```mermaid
flowchart TD
    IN["Incident input<br/>category · description · affected · injured · trapped · needs"] --> SC["Compute risk score"]
    SC --> F1["Trapped > 0 → +45"]
    SC --> F2["Injured > 0 → +35"]
    SC --> F3["Critical keywords → +25<br/>(drowning, buried, gas leak…)"]
    SC --> F4["Vulnerability keywords → +15<br/>(infant, elderly, wheelchair…)"]
    SC --> F5["Affected ≥ 20 → +30 · ≥ 5 → +15"]
    SC --> F6["Category: collapse/landslide +25 · fire +20 · flood +15"]
    F1 & F2 & F3 & F4 & F5 & F6 --> D{"Decision"}
    D -- "score ≥ 60 OR trapped > 0 OR severe injury" --> P0["🔴 P0 · Immediate life threat"]
    D -- "score ≥ 35 OR injured > 0" --> P1["🟠 P1 · Urgent"]
    D -- "score ≥ 15 OR food/water OR evacuation" --> P2["🟡 P2 · Essential"]
    D -- "otherwise" --> P3["🟢 P3 · Non-urgent support"]
    P0 & P1 & P2 & P3 --> OUT["Result: priority · explanation · risks · actions · confidence · missing info"]
    OUT --> HUM["👤 Human verifies or overrides (audited)"]
```

| Priority | Meaning | Target response |
| :-: | :--- | :--- |
| 🔴 **P0** | Immediate life threat | Dispatch without queue delay |
| 🟠 **P1** | Urgent | Assign within ~20 minutes |
| 🟡 **P2** | Essential | Scheduled evacuation / relief logistics |
| 🟢 **P3** | Non-urgent | Monitor / community support |

---

## 🚒 Smart Dispatch Engine

`backend/src/services/dispatchEngine.ts` ranks every rescue team against an incident.

```mermaid
flowchart LR
    A["Incident"] --> B["For each team"]
    B --> C["Base score 50"]
    C --> D["Status weight<br/>AVAILABLE +30 · ON_SCENE +5 · RESTING/UNAVAILABLE −40"]
    D --> E["Haversine distance<br/>ETA @ 35 km/h"]
    E --> F["Proximity bonus<br/>&lt; 5 km +25 · &lt; 15 km +15"]
    F --> G["Capability match<br/>water · collapse · ALS · fire…"]
    G --> H["Workload penalty<br/>active missions"]
    H --> I["Match score 0–100 + reasons"]
    I --> J["Ranked list → dispatcher decides"]
```

**Distance:** Haversine great-circle distance, with `R = 6371 km`.

```
a = sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)
d = 2R · atan2(√a, √(1−a))
```

---

## 🔐 Security & Privacy

| Area | Implementation |
| :--- | :--- |
| Authentication | JWT bearer tokens; passwords hashed with `bcryptjs` |
| Authorization | Role-based access control via auth middleware |
| Input validation | `zod` schemas on request payloads |
| PII protection | Phone numbers and indoor coordinates redacted for unauthorized viewers |
| Accountability | `AuditLog` records actor, action, and target for sensitive operations |
| Idempotency | Client-generated keys prevent duplicate offline submissions |
| Data integrity | Transactional inventory updates; negative stock blocked |

### Production Hardening Checklist

- [ ] Replace `JWT_SECRET` with a strong secret from a secrets manager
- [ ] Restrict CORS to your real frontend origin (the code currently allows `*` for demo convenience; `CORS_ORIGIN` is defined in env)
- [ ] Disable / remove `POST /api/auth/demo-login` and simulation endpoints
- [ ] Re-seed with unique credentials; remove demo accounts
- [ ] Serve behind HTTPS/WSS (reverse proxy such as Nginx or Caddy)
- [ ] Add rate limiting and security headers (`express-rate-limit`, `helmet`)
- [ ] Move from SQLite to PostgreSQL and enable backups
- [ ] Authenticate WebSocket connections and scope broadcasts by role
- [ ] Add monitoring and structured logging

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6, TanStack Query, Leaflet & React-Leaflet, Recharts |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, SQLite (PostgreSQL-compatible), `ws`, Zod, JWT, bcryptjs |
| **Realtime** | WebSocket server at `/ws` |
| **Testing** | Vitest + Supertest |
| **Tooling** | `concurrently`, `ts-node`, Prisma CLI |

---

## 📂 Project Structure

```
DisplaceOS/
├── package.json                 # Root scripts: setup, dev, build, test
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Data model (20 models)
│   │   └── seed.ts              # Rich disaster demo data
│   └── src/
│       ├── index.ts             # Express app + WebSocket server (/ws)
│       ├── config.ts            # Environment configuration
│       ├── prisma.ts            # Prisma client singleton
│       ├── middleware/
│       │   └── auth.ts          # JWT + RBAC
│       ├── routes/              # auth · incidents · missions · teams · shelters
│       │                        # inventory · missingPersons · alerts · map
│       │                        # analytics · audit · simulation
│       ├── services/
│       │   ├── aiTriage.ts          # Deterministic triage rules
│       │   ├── dispatchEngine.ts    # Haversine + capability scoring
│       │   ├── notificationService.ts  # WS broadcast + notifications
│       │   ├── auditLogger.ts       # Audit trail writer
│       │   └── simulationEngine.ts  # Demo scenario generator
│       └── tests/               # triage.test.ts · integration.test.ts
└── frontend/
    ├── public/images/           # Hero, thermal and card imagery
    └── src/
        ├── App.tsx              # Router + role guards
        ├── components/          # TopCommandBar · LeftSidebar · LeafletMap
        │                        # IncidentDetailDrawer · SimulationBanner · StatusBadge
        ├── context/             # AuthContext · LanguageContext · SimulationContext
        ├── i18n/translations.ts # English / Hindi strings
        ├── services/            # api.ts · offlineQueue.ts
        ├── types/index.ts
        └── pages/
            ├── public/          # Landing · Login · Features · Safety · About · Resources
            ├── command/         # Dashboard · Map · Incidents · Dispatch · Teams
            │                    # Shelters · Inventory · Alerts · Analytics · Audit
            │                    # ThermalRecon · 4K Command Center
            ├── responder/       # Dashboard · Missions · History · Team Status · Checklist
            ├── shelter/         # Dashboard · Registrations · Capacity · Supplies
            └── citizen/         # Dashboard · Report · My Requests · Shelters
                                 # Missing Persons · Alerts
```

---

## 💻 Local Setup & Quickstart

### Prerequisites

- Node.js **v18+** (tested on v24)
- npm **v9+**

### 1. Install & seed

```bash
# From the project root
npm run setup
```

This installs backend dependencies, generates the Prisma client, pushes the schema to SQLite, seeds demo data, and installs frontend dependencies.

### 2. Configure environment

```bash
cd backend
cp .env.example .env   # skip if backend/.env already exists
```

### 3. Run development servers

```bash
npm run dev
```

| Service | URL |
| :--- | :--- |
| 🖥️ Frontend Command Center | http://localhost:5173 |
| ⚙️ Backend REST API | http://localhost:5000/api/health |
| 📡 WebSocket Telemetry | `ws://localhost:5000/ws` |

### 4. Test & build

```bash
npm test          # backend unit + integration tests
npm run build     # production bundles (backend + frontend)
```

### Reset the demo database

```bash
cd backend
npm run prisma:push -- --force-reset
npm run prisma:seed
```

### Troubleshooting

| Problem | Fix |
| :--- | :--- |
| `EADDRINUSE :5000` | Change `PORT` in `backend/.env` and update the frontend API base URL |
| Blank map tiles | Check internet access to OpenStreetMap/CartoDB tile servers |
| Prisma client errors | Run `cd backend && npm run prisma:generate` |
| Empty dashboards | Re-run `npm run prisma:seed` in `backend/` |
| CORS errors | Make sure the frontend runs on `http://localhost:5173` |

---

## 🔧 Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Backend HTTP/WebSocket port |
| `NODE_ENV` | `development` | Runtime mode |
| `DATABASE_URL` | `file:./dev.db` | Prisma datasource (swap for PostgreSQL URL in production) |
| `JWT_SECRET` | *(demo value)* | **Change in production** |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
| `AI_PROVIDER` | `rule_engine` | Triage provider; the deterministic engine is always the safety baseline |

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api` · Auth: `Authorization: Bearer <JWT>`

### Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/auth/login` | Authenticate and receive JWT |
| POST | `/auth/demo-login` | One-click evaluation login for any role |

### Incidents
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/incidents` | List incidents (filter by category, priority, status) |
| POST | `/incidents` | Report incident with automatic triage |
| POST | `/incidents/:id/verify` | Verify community report (EOC) |
| POST | `/incidents/:id/override-priority` | Human priority override (audited) |
| POST | `/incidents/:id/assign` | Dispatch rescue squad |

### Map & Teams
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/map/all-layers` | Incidents, shelters, teams, hazards, road cuts in one payload |
| GET | `/map/route-estimate` | Distance, waypoints, ETA |
| GET | `/teams` | Fleet tracking and availability |

### Missions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/missions` | Responder mission queue |
| POST | `/missions/:id/accept` | Squad accepts mission |
| POST | `/missions/:id/complete` | Complete mission with victim count |

### Shelters & Inventory
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/shelters` | Directory and live occupancy |
| POST | `/shelters/:id/check-in` | Family arrival check-in |
| GET | `/inventory` | Depot stock |
| POST | `/inventory/transactions` | Record consumption or intake |

### Alerts, Analytics & Audit
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/alerts` | Hazard early-warning notices |
| GET | `/analytics/overview` | KPIs computed from DB |
| GET | `/analytics/export-csv` | Operational summary CSV |
| GET | `/audit` | Immutable compliance log |
| — | `/missing-persons` | Missing person cases and lead updates |

### Simulation (evaluators only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/simulation/spike` | Trigger incident volume surge |
| POST | `/simulation/move-teams` | Advance responder GPS |
| POST | `/simulation/consume-supplies` | Deduct depot stock |
| POST | `/simulation/road-closure` | Trigger impassable road |

### Example: Report an incident

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "FLOOD",
    "title": "Family stranded on rooftop",
    "description": "Rising water, elderly woman and two children on roof",
    "affectedPeople": 4,
    "injuredCount": 0,
    "trappedCount": 4,
    "requiredAssistance": "Boat rescue",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

Expected: the incident is created with `recommendedPriority: "P0"` (entrapment), plus identified risks and suggested actions.

---

## 📡 WebSocket Telemetry

Connect to `ws://localhost:5000/ws` (optionally with user and role identifiers so the server can target messages).

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as WS Server
    B->>S: connect /ws
    S-->>B: CONNECTED (welcome)
    loop heartbeat
        B->>S: PING
        S-->>B: PONG {timestamp}
    end
    Note over S,B: Server pushes on domain events
    S-->>B: incident created / updated
    S-->>B: mission assigned / status changed
    S-->>B: alert broadcast
```

---

## 🧪 Testing

```bash
npm test
```

| Suite | Coverage |
| :--- | :--- |
| `triage.test.ts` | P0–P3 classification rules, escalation guarantees |
| `integration.test.ts` | API flows, geospatial distance, inventory integrity, shelter constraints |

---

## 🎮 Simulation Guide for Evaluators

Use the sticky **top simulation bar**:

1. **Switch roles** with the role pills to see each persona's view.
2. **Spike incidents** (+3) → watch the dashboard, map, and WebSocket feed update live.
3. **Dispatch** a P0 incident → inspect ranked squads and the reasoning.
4. **Move teams** → see responder GPS advance on the map.
5. **Consume supplies** → trigger low-stock alerts and check the transaction log.
6. **Close a road** → observe route estimates adapt.
7. Open **Audit Logs** as Commander to verify every action was recorded.

---

## 🗺️ Roadmap

```mermaid
timeline
    title DisplaceOS Roadmap
    section Now
        Hackathon MVP : 17 core modules : Rule-based triage : Offline queue : Live simulation
    section Next
        Production hardening : PostgreSQL + migrations : Authenticated WebSockets : Rate limiting & helmet
        Smarter AI : Pluggable LLM triage with rule-engine fallback : Multilingual NLP intake
    section Later
        Field expansion : PWA with background sync : SMS / USSD reporting : Satellite & drone imagery feeds
        Interoperability : CAP alert standard : Government & NGO API integrations : Predictive risk modelling
```

---

## 🤝 Contributing

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Make changes and add tests where relevant
3. Run `npm test` and `npm run build`
4. Open a pull request describing the change and its operational impact

Please never commit real personal data, credentials, or production secrets.

---

## 📄 License & Attribution

DisplaceOS is open-source software built for humanitarian disaster management.
Map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors and © [CARTO](https://carto.com/attributions) under their open attribution standards.

<div align="center">

**Built to save time. Built to save lives. 🚨**

</div>
