# 🏗️ Local Labour Connect

> A platform connecting **daily-wage labourers** with **local contractors** — built with Next.js, PostgreSQL, Prisma & NextAuth.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Diagram](#component-diagram)
- [Tech Stack](#tech-stack)
- [Core Modules](#core-modules)
- [Database Schema](#database-schema)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [RBAC — Role-Based Access Control](#rbac--role-based-access-control)
- [Data Flow Diagrams](#data-flow-diagrams)
  - [Registration & Login](#1-registration--login)
  - [Job Posting (Contractor)](#2-job-posting-contractor-only)
  - [Applying to a Job (Labour)](#3-applying-to-a-job-labour-only)
  - [Application Management (Contractor)](#4-application-management-contractor)
- [Route Map & Middleware](#route-map--middleware)
- [Search & Filter (MVP)](#search--filter-requirements-mvp)
- [Phase 2 — Planned Services](#phase-2--planned-services)
- [Getting Started](#getting-started)

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client ["🖥️ Client (Browser / Mobile Web)"]
        U["User: Labour / Contractor / Admin"]
    end

    subgraph NextServer ["⚙️ Next.js Server (App Router)"]
        SC["Server Components\n(data fetching)"]
        SA["Server Actions /\nRoute Handlers\n(mutations)"]
        MW["Middleware\n(RBAC gate)"]
        AUTH["NextAuth\n(JWT sessions)"]
    end

    subgraph DataLayer ["💾 Data Layer"]
        PRISMA["Prisma ORM"]
        DB[("PostgreSQL\n(Supabase)")]
    end

    subgraph Phase2 ["🔮 Phase 2 Services"]
        SMS["SMS / OTP Provider"]
        MAPS["Maps API"]
        NOTIF["Notification Provider"]
    end

    U -->|HTTP / HTTPS| MW
    MW -->|allowed| SC
    MW -->|allowed| SA
    SC --> PRISMA
    SA --> AUTH
    SA --> PRISMA
    AUTH --> DB
    PRISMA --> DB
    SA -.->|future| SMS
    SA -.->|future| MAPS
    SA -.->|future| NOTIF
```

---

## Component Diagram

Detailed logical view of how each layer communicates:

```mermaid
flowchart LR
    U["👤 User\n(Labour / Contractor / Admin)"] --> UI["Next.js App Router UI\n(/app)"]

    UI --> MW["Middleware\n(middleware.js)\nRBAC route protection"]
    UI --> SA["Server Actions /\nRoute Handlers\n(/app/api)"]

    SA --> AUTH["NextAuth\n(/lib/auth.js)\nJWT · Credentials"]
    SA --> ZOD["Zod Validation\n(input schemas)"]
    SA --> PRISMA["Prisma ORM\n(/lib/prisma.js)"]

    PRISMA --> DB[("PostgreSQL\n(Supabase)")]
    AUTH --> DB

    subgraph UI_Components ["🧩 Components (/components)"]
        NAV["Navbar"]
        FOOT["Footer"]
        CARDS["UI Cards / Buttons"]
        SP["SessionProvider"]
    end

    UI --> UI_Components
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **React** | React | 19.2.3 |
| **Auth** | NextAuth (Credentials) | 4.x |
| **ORM** | Prisma Client | 7.x |
| **Database** | PostgreSQL (Supabase) | — |
| **Styling** | Tailwind CSS | 4.x |
| **Icons** | Lucide React | 0.563 |
| **Password hashing** | bcryptjs | 2.x |

---

## Core Modules

```mermaid
graph TD
    subgraph Auth_Module ["🔐 Auth Module"]
        A1["/lib/auth.js\nNextAuth config · Credentials provider"]
        A2["JWT callbacks — injects id, role, phone, city"]
        A3["ROLE_DASHBOARDS map"]
    end

    subgraph Data_Access ["💾 Data Access"]
        D1["/lib/prisma.js\nPrisma client singleton"]
        D2["/prisma/schema.prisma\nModels · Enums · Relations"]
    end

    subgraph Middleware_Module ["🛡️ Middleware"]
        M1["middleware.js\nRBAC route guard"]
        M2["PUBLIC_PATHS · AUTH_PATHS"]
        M3["getRequiredRole()"]
    end

    subgraph UI_Module ["🎨 UI Components"]
        C1["Navbar.js"]
        C2["Footer.js"]
        C3["SessionProvider.js"]
        C4["/components/ui/*\nButtons · Cards · Inputs"]
    end

    subgraph App_Routes ["📂 App Routes"]
        R1["/(auth) — login · signup"]
        R2["/(public) — landing · jobs"]
        R3["/dashboard/labour"]
        R4["/dashboard/contractor"]
        R5["/admin"]
        R6["/api/auth/[...nextauth]"]
    end

    App_Routes --> Middleware_Module
    App_Routes --> Auth_Module
    App_Routes --> Data_Access
    App_Routes --> UI_Module
```

### Module boundaries

| Module | Path | Responsibility |
|---|---|---|
| **Auth** | `/lib/auth.js` | Session, role extraction, route protection helpers |
| **Data Access** | `/lib/prisma.js` | Prisma client singleton (connection pooling) |
| **Schema** | `/prisma/schema.prisma` | All models, enums, relations, constraints |
| **Middleware** | `/middleware.js` | Edge-level RBAC before page render |
| **UI Components** | `/components/*` | Reusable Navbar, Footer, cards, language toggle |
| **App Routes** | `/app/*` | Pages (Server Components) & API routes |

---

## Database Schema

### Enums

```mermaid
classDiagram
    class Role {
        <<enumeration>>
        LABOUR
        CONTRACTOR
        ADMIN
    }
    class JobStatus {
        <<enumeration>>
        OPEN
        CLOSED
    }
    class ApplicationStatus {
        <<enumeration>>
        PENDING
        ACCEPTED
        REJECTED
    }
```

### Models overview

| Model | Key Fields | Constraints |
|---|---|---|
| **User** | `id` (UUID), `name`, `phone`, `role`, `city`, `password?`, `banned` | `phone` UNIQUE |
| **LabourProfile** | `id`, `userId`, `skill`, `experience`, `rating`, `verified` | `userId` UNIQUE (1:1) |
| **ContractorProfile** | `id`, `userId`, `companyName`, `rating`, `verified` | `userId` UNIQUE (1:1) |
| **Job** | `id`, `contractorId`, `title`, `description`, `skillRequired`, `city`, `wage`, `status` | FK → `User` |
| **Application** | `id`, `jobId`, `labourId`, `status` | `@@unique([jobId, labourId])` |

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        string id PK "UUID"
        string name
        string phone UK "unique"
        enum role "LABOUR | CONTRACTOR | ADMIN"
        string city
        string password "hashed, optional"
        boolean banned "default false"
        datetime createdAt
    }

    LABOUR_PROFILE {
        string id PK "UUID"
        string userId FK, UK "unique — 1:1"
        string skill
        int experience "years"
        float rating "default 0"
        boolean verified "default false"
    }

    CONTRACTOR_PROFILE {
        string id PK "UUID"
        string userId FK, UK "unique — 1:1"
        string companyName
        float rating "default 0"
        boolean verified "default false"
    }

    JOB {
        string id PK "UUID"
        string contractorId FK
        string title
        string description
        string skillRequired
        string city
        int wage
        enum status "OPEN | CLOSED"
        datetime createdAt
    }

    APPLICATION {
        string id PK "UUID"
        string jobId FK
        string labourId FK
        enum status "PENDING | ACCEPTED | REJECTED"
    }

    USER ||--o| LABOUR_PROFILE : "has (if LABOUR)"
    USER ||--o| CONTRACTOR_PROFILE : "has (if CONTRACTOR)"
    USER ||--o{ JOB : "posts (as CONTRACTOR)"
    USER ||--o{ APPLICATION : "submits (as LABOUR)"
    JOB ||--o{ APPLICATION : "receives"
```

---

## RBAC — Role-Based Access Control

> **Important**: RBAC is enforced **both** in middleware (UX) **and** on the server (real security).

### Permission matrix

```mermaid
graph LR
    subgraph LABOUR_ROLE ["👷 LABOUR"]
        L1["✅ Create / update own labour profile"]
        L2["✅ View all open jobs"]
        L3["✅ Apply to open jobs"]
        L4["✅ Track own applications"]
        L5["❌ Post jobs"]
        L6["❌ Accept/reject applications"]
    end

    subgraph CONTRACTOR_ROLE ["🏢 CONTRACTOR"]
        C1["✅ Create / update company profile"]
        C2["✅ Create / close their jobs"]
        C3["✅ View applicants on their jobs"]
        C4["✅ Accept / reject applications"]
        C5["❌ Apply to jobs"]
    end

    subgraph ADMIN_ROLE ["🛡️ ADMIN"]
        A1["✅ View all users / jobs / applications"]
        A2["✅ Verify profiles"]
        A3["✅ Ban users"]
        A4["✅ Remove jobs / users"]
    end
```

### Enforcement layers

```mermaid
sequenceDiagram
    participant B as Browser
    participant MW as Middleware (Edge)
    participant SA as Server Action
    participant DB as Database

    B->>MW: Request /dashboard/contractor/post-job
    MW->>MW: Extract JWT → check role
    alt role != CONTRACTOR
        MW-->>B: 302 Redirect to own dashboard
    else role == CONTRACTOR
        MW->>SA: Allow through
        SA->>SA: Re-validate session.role == CONTRACTOR
        SA->>DB: INSERT Job
        SA-->>B: 200 Success
    end
```

### Route protection map

| Route Pattern | Required Role | Enforced By |
|---|---|---|
| `/`, `/jobs`, `/login`, `/register` | Public | — |
| `/dashboard/labour/*` | `LABOUR` | Middleware + Server |
| `/dashboard/contractor/*` | `CONTRACTOR` | Middleware + Server |
| `/admin/*` | `ADMIN` | Middleware + Server |
| `/api/auth/*` | Public | NextAuth |

---

## Data Flow Diagrams

### 1. Registration & Login

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Signup Page
    participant SA as Server Action
    participant PRISMA as Prisma
    participant DB as PostgreSQL
    participant AUTH as NextAuth

    U->>UI: Fill form (phone, name, role, city, password)
    UI->>SA: Submit registration
    SA->>SA: Validate with Zod
    SA->>SA: Hash password (bcryptjs)
    SA->>PRISMA: prisma.user.create(...)
    PRISMA->>DB: INSERT INTO User
    DB-->>PRISMA: User record
    PRISMA-->>SA: Created user
    SA-->>UI: Redirect to /login

    Note over U, AUTH: Login Flow
    U->>UI: Enter phone + password
    UI->>AUTH: signIn("credentials", {...})
    AUTH->>PRISMA: prisma.user.findUnique({phone})
    PRISMA->>DB: SELECT * FROM User
    DB-->>PRISMA: User row
    PRISMA-->>AUTH: User object
    AUTH->>AUTH: bcrypt.compare(password, hash)
    AUTH->>AUTH: Create JWT (id, role, phone, city)
    AUTH-->>UI: Session cookie set
    UI-->>U: Redirect to role-specific dashboard
```

### 2. Job Posting (CONTRACTOR only)

```mermaid
sequenceDiagram
    actor C as Contractor
    participant UI as Post Job Form
    participant MW as Middleware
    participant SA as Server Action
    participant DB as PostgreSQL

    C->>UI: Navigate to /dashboard/contractor/post-job
    UI->>MW: Request page
    MW->>MW: JWT role == CONTRACTOR ✅
    MW-->>UI: Allow

    C->>UI: Fill job form (title, description, skill, city, wage)
    UI->>SA: Submit job data
    SA->>SA: Validate session → role == CONTRACTOR
    SA->>SA: Validate input (Zod)
    SA->>DB: INSERT Job (status = OPEN, contractorId = session.user.id)
    DB-->>SA: Job created
    SA-->>UI: Success → redirect to job list
```

### 3. Applying to a Job (LABOUR only)

```mermaid
sequenceDiagram
    actor L as Labour
    participant UI as Job Detail Page
    participant MW as Middleware
    participant SA as Server Action
    participant DB as PostgreSQL

    L->>UI: Navigate to /jobs/:id
    L->>UI: Click "Apply"

    UI->>SA: Apply request (jobId)
    SA->>SA: Validate session → role == LABOUR
    SA->>DB: SELECT Job WHERE id = jobId AND status = OPEN
    DB-->>SA: Job found (OPEN) ✅
    SA->>DB: SELECT Application WHERE jobId AND labourId
    DB-->>SA: No existing application ✅

    SA->>DB: INSERT Application (status = PENDING)
    DB-->>SA: Application created
    SA-->>UI: "Application submitted!"
    UI-->>L: Show confirmation
```

### 4. Application Management (CONTRACTOR)

```mermaid
sequenceDiagram
    actor C as Contractor
    participant UI as Applicants Page
    participant SA as Server Action
    participant DB as PostgreSQL

    C->>UI: View applicants for Job #123
    UI->>SA: Fetch applications (jobId)
    SA->>SA: Verify session.user owns Job #123
    SA->>DB: SELECT Applications WHERE jobId = 123
    DB-->>SA: List of applications
    SA-->>UI: Render applicant cards

    C->>UI: Click "Accept" on applicant
    UI->>SA: Update application (id, status=ACCEPTED)
    SA->>SA: Verify ownership again
    SA->>DB: UPDATE Application SET status = ACCEPTED
    DB-->>SA: Updated
    SA-->>UI: Refresh list
```

---

## Route Map & Middleware

### Application route structure

```mermaid
graph TD
    subgraph Public ["🌐 Public Routes"]
        ROOT["/\n(Landing Page)"]
        JOBS["/jobs\n(Browse Jobs)"]
        LOGIN["/login"]
        SIGNUP["/signup"]
        REGISTER["/register"]
    end

    subgraph Auth_API ["🔑 Auth API"]
        AUTHAPI["/api/auth/[...nextauth]\n(NextAuth handlers)"]
    end

    subgraph Labour_Dashboard ["👷 Labour Dashboard"]
        LD["/dashboard/labour\n(Overview)"]
        LD_PROFILE["/dashboard/labour/profile"]
        LD_APPS["/dashboard/labour/applications"]
    end

    subgraph Contractor_Dashboard ["🏢 Contractor Dashboard"]
        CD["/dashboard/contractor\n(Overview)"]
        CD_JOBS["/dashboard/contractor/jobs"]
        CD_POST["/dashboard/contractor/post-job"]
    end

    subgraph Admin_Panel ["🛡️ Admin Panel"]
        AD["/admin\n(Dashboard)"]
        AD_USERS["/admin/users"]
        AD_JOBS["/admin/jobs"]
    end

    ROOT --> LOGIN
    ROOT --> SIGNUP
    ROOT --> JOBS
    LOGIN --> LD
    LOGIN --> CD
    LOGIN --> AD
```

### Middleware flow

```mermaid
flowchart TD
    REQ["Incoming Request"] --> IS_PUBLIC{"Is public path?\n/, /login, /register,\n/jobs, /signup, /api/auth"}

    IS_PUBLIC -->|Yes| IS_AUTH_PAGE{"Is auth page?\n/login, /register, /signup"}
    IS_AUTH_PAGE -->|Yes| HAS_TOKEN{"Has valid JWT?"}
    HAS_TOKEN -->|Yes| REDIRECT_DASH["Redirect → role dashboard"]
    HAS_TOKEN -->|No| ALLOW1["Allow through ✅"]
    IS_AUTH_PAGE -->|No| ALLOW1

    IS_PUBLIC -->|No| GET_ROLE["getRequiredRole(pathname)"]
    GET_ROLE --> HAS_ROLE{"Required role found?"}
    HAS_ROLE -->|No| ALLOW2["Allow through ✅"]
    HAS_ROLE -->|Yes| CHECK_JWT{"JWT token exists?"}
    CHECK_JWT -->|No| LOGIN_REDIRECT["Redirect → /login\n(with callbackUrl)"]
    CHECK_JWT -->|Yes| ROLE_MATCH{"token.role matches\nrequired role?"}
    ROLE_MATCH -->|Yes| ALLOW3["Allow through ✅"]
    ROLE_MATCH -->|No| ROLE_REDIRECT["Redirect → own\nrole dashboard"]
```

---

## Search & Filter Requirements (MVP)

The jobs listing page (`/jobs`) supports the following filters:

| Filter | Type | Description |
|---|---|---|
| **City** | Dropdown / text | Filter jobs by location |
| **Skill required** | Dropdown / text | Match `skillRequired` field |
| **Wage range** | Range slider / min-max | Filter by `wage` (min ≤ wage ≤ max) |
| **Title search** | Text input | Case-insensitive `LIKE` search on `title` |
| **Pagination** | Cursor / offset | Page through results (default 10 per page) |

### Filter query flow

```mermaid
flowchart LR
    UI["Filter UI\n(city, skill, wage, title)"] --> SA["Server Action /\nRoute Handler"]
    SA --> PRISMA["Prisma Query\n(where + orderBy + skip/take)"]
    PRISMA --> DB[("PostgreSQL")]
    DB --> PRISMA
    PRISMA --> SA
    SA --> UI
```

### Example Prisma query structure

```javascript
const jobs = await prisma.job.findMany({
  where: {
    status: "OPEN",
    ...(city    && { city: { contains: city, mode: "insensitive" } }),
    ...(skill   && { skillRequired: { contains: skill, mode: "insensitive" } }),
    ...(title   && { title: { contains: title, mode: "insensitive" } }),
    ...(minWage && { wage: { gte: parseInt(minWage) } }),
    ...(maxWage && { wage: { lte: parseInt(maxWage) } }),
  },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * PAGE_SIZE,
  take: PAGE_SIZE,
});
```

---

## Phase 2 — Planned Services

```mermaid
graph TB
    subgraph Current ["✅ Phase 1 (Current)"]
        A["NextAuth\n(Credentials)"]
        B["Prisma + PostgreSQL"]
        C["Server Actions"]
        D["Middleware RBAC"]
    end

    subgraph Future ["🔮 Phase 2 (Planned)"]
        E["📱 SMS / OTP Provider\n(Twilio / MSG91)"]
        F["🗺️ Maps API\n(Google Maps / Mapbox)"]
        G["🔔 Notification Provider\n(Push / Email)"]
        H["📄 Document Upload\n(Aadhaar verification)"]
        I["🌐 Multi-language\n(Hindi / Regional)"]
        J["⭐ Rating & Review\nSystem"]
    end

    A -.-> E
    B -.-> F
    C -.-> G
    C -.-> H
    D -.-> I
    B -.-> J
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (or Supabase project)
- npm / yarn / pnpm

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd local-labour-connect

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, etc.

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate dev

# 6. (Optional) Seed the database
node prisma/seed.js

# 7. Start development server
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |

---

## Project Structure

```
local-labour-connect/
├── app/
│   ├── (auth)/              # Login & signup pages
│   ├── (public)/            # Public landing & job listings
│   ├── admin/               # Admin panel (ADMIN only)
│   ├── api/                 # NextAuth API route
│   ├── dashboard/           # Role-specific dashboards
│   │   ├── labour/          # Labour dashboard pages
│   │   └── contractor/      # Contractor dashboard pages
│   ├── globals.css
│   └── layout.js            # Root layout
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── SessionProvider.js
│   └── ui/                  # Reusable UI primitives
├── lib/
│   ├── auth.js              # NextAuth configuration
│   ├── prisma.js            # Prisma client singleton
│   └── utils.js             # Utility helpers
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration history
│   └── seed.js              # Database seeder
├── middleware.js             # RBAC route protection
├── package.json
└── next.config.mjs
```

---

<p align="center">
  Built with ❤️ for connecting local labourers with opportunities
</p>