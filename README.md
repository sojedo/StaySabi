# StaySabi — AI Short‑Let Finder (Nigeria)

A lightweight prototype that helps renters **discover reliable short‑let apartments in Nigeria** using a natural‑language “smart search”, **local reliability signals** (power hours/day, internet Mbps), and **host verification** cues. Results include an explainable **Match %** and “Why this matched” so users can trust what they see.

> This README is assignment‑ready and maps directly to your brief (problem/solution, where AI was used, setup, API, tests, CI, demo flow, and submission checklist).

---

## ✨ Key Features
- 🤖 **Smart Search (NL → filters + ranking):** Query like _“2‑bed in Lekki under 80k with WiFi and generator.”_
- 🇳🇬 **Nigeria‑aware heuristics:** Power reliability, internet speed, verified host bump.
- 🔍 **Explainable results:** Match score + reasons (city/area/price/amenities/reliability).
- 🧪 **Tests:** Jest smoke tests for core endpoints.
- 🔄 **CI:** GitHub Actions workflow to install & test on push/PR.
- 🧰 **Simple stack:** Node.js (Express) + Bootstrap + vanilla JS, demo data in `listings.json`.

---

## 🧩 Problem Statement
Short‑let discovery in Nigeria is **fragmented** (WhatsApp, Instagram, agents). **Trust is low**, pricing can be opaque, and conventional filters **ignore local realities** like power reliability and internet speed. Renters waste time; hosts struggle to reach the right guests.

## ✅ Solution Overview
**StaySabi** offers one simple, explainable search built for Nigeria. Users type what they want in **plain English**; the system parses intent into filters, applies **reliability signals**, and **ranks** listings with transparent reasons.

---

## 🧠 Where AI Is Used
- **Scaffolding & acceleration:** UI layout, API endpoints, docs, tests, and CI were **AI‑assisted** to speed up delivery.
- **LLM‑ready stubs:** The simple parser can be replaced by an LLM to:
  - Improve **NL parsing** (entities, budgets, amenity detection).
  - Generate **listing summaries**.
  - Flag **fraud/outliers** (e.g., anomalous pricing, duplicate images).

> For the assignment, this demonstrates **Effective Use of AI** in development: UI generation, backend scaffolding, documentation, testing, and CI.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (Node 20 recommended)
- Git (optional, for version control)

### Installation
```bash
# clone your repo (example)
git clone https://github.com/<you>/staysabi.git
cd staysabi

# install dependencies
npm install
```

### Run the app
```bash
npm run dev   # http://localhost:3000 with auto‑reload (nodemon)
# or
npm start     # http://localhost:3000 without auto‑reload
```

Open **http://localhost:3000** and try queries like:
- `2-bed in Lekki under 80k with wifi and generator`
- `budget room in Yaba with wifi`
- `3 bed in Wuse between 70k and 100k with parking`

> **Windows / PowerShell note:** If you see “running scripts is disabled”, run:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` then retry your npm command.

---

## 🗂️ Project Structure
```
.
├─ public/               # static frontend (served by Express)
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ listings.json         # demo listings data
├─ server.js             # Express server + smart search endpoint
├─ tests/
│  └─ api.test.js        # Jest API smoke tests
├─ .github/workflows/
│  └─ ci.yml             # GitHub Actions CI (node install + tests)
├─ API_DOCS.md           # REST endpoints and examples
├─ SLIDES.md             # slide outline for your presentation
├─ DEMO_SCRIPT.md        # 3–4 minute demo walkthrough
└─ README.md
```

---

## 🔌 API Overview (Prototype)

**Base URL:** `http://localhost:3000`

| Method | Path            | Description                                  |
|-------:|-----------------|----------------------------------------------|
| GET    | `/api/health`   | Health check `{ "ok": true }`                |
| GET    | `/api/listings` | Returns all demo listings                    |
| GET    | `/api/search`   | NL search (`?text=...`) with parsed details  |
| POST   | `/api/booking`  | Mock booking; echoes your posted JSON        |

### Example: Natural‑language search
```
GET /api/search?text=2-bed in Lekki under 80k with wifi and generator
```
**Response (abridged)**
```json
{
  "query": "2-bed in Lekki under 80k with wifi and generator",
  "parsed": {
    "city": "lagos",
    "area": "lekki",
    "minPrice": null,
    "maxPrice": 80000,
    "bedrooms": 2,
    "amenities": ["wifi","generator"]
  },
  "total": 3,
  "results": [
    { "listing": { /* ... */ }, "score": 87, "reasons": ["City matches Lagos","Price ≤ ₦80,000","Reliable power"] }
  ]
}
```

See **`API_DOCS.md`** for full request/response examples.

---

## 🧪 Testing
```bash
npm test
```
Runs Supertest-based checks for `/api/health`, `/api/listings`, and `/api/search`.

---

## 🔄 Continuous Integration
GitHub Actions workflow at `.github/workflows/ci.yml`:
- Checks out your repo
- Uses Node 20
- Installs dependencies
- Runs `npm test`

---

## 🖼️ Screenshots (add yours)
Add PNGs/JPGs (e.g., to a `docs/` folder) and reference them here:
- Landing page with search bar
- Results grid with **Match %** and “Why this matched”
- Mock booking alert (JSON echo)

---

## 📽️ Demo Video (3–4 minutes)
Use **`DEMO_SCRIPT.md`** to record a concise walkthrough:
1) Hook → Problem → Solution  
2) Live search & results explanation  
3) Where AI helped in the build  
4) Roadmap & close

Tools: Awesome Screenshot, Loom, OBS, or Zoom.

---

## 📦 Deployment (optional)
Any Node host works. Typical steps:
1. Set Node version (18/20) on your platform.  
2. Install dependencies: `npm ci` (or `npm install`).  
3. Start command: `npm start`.  
4. Expose port **3000** (or set `PORT`).

> Free tiers: Render, Railway, Fly.io, or a simple VPS (NGINX reverse proxy).

---

## 🧾 Submission Checklist (for the assignment)
- [ ] **Slides/PDF** (paste `SLIDES.md` into slides; export)  
- [ ] **GitHub repo link** (this project)  
- [ ] **Demo video** (3–4 minutes)  
- [ ] **Extra resources** (API docs, screenshots, etc.)

**Grading focus:** Creativity & Impact • Effective AI Use • Technical Execution • Documentation & Presentation.

---

## 🛣️ Roadmap
- LLM‑powered NL parsing (entities, budgets, dates)
- Listing summarization & risk/outlier detection
- KYC + payments (Paystack/Flutterwave)
- Saved searches & alerts (WhatsApp/Email)
- Admin dashboard for curation & takedowns
- Map view & geo ranking
- Caching and SSR for speed

---

## 🤝 Contributing
PRs welcome! Open an issue to discuss major changes.

---

## 📝 License
MIT — for prototype/educational use.
