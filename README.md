# Lovely Professional University Student Helpdesk (Unofficial Project)

[![Python Tests](https://img.shields.io/badge/pytest-37%20passed%20(100%25)-emerald.svg)](https://docs.pytest.org)
[![Vite Build](https://img.shields.io/badge/Vite-Code--Split%20Clean-orange.svg)](https://vitejs.dev)
[![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![OWASP](https://img.shields.io/badge/Security-OWASP%20Hardened-purple.svg)](https://owasp.org)

> **MANDATORY LEGAL DISCLAIMER**  
> *This is a student-developed, unofficial helpdesk project. It is not affiliated with, endorsed by, or an official website or chatbot of Lovely Professional University. Information is compiled from publicly available sources and may not always be current. Please verify important information through official university channels ([admission.lpu.in](https://admission.lpu.in) or [lpu.in](https://www.lpu.in)).*

---

## 🌟 Architecture & Core Features

### 1. Enterprise UI/UX & Interaction Design
- **University Font Pairing**: Implemented `Imprima`, `Delius`, and `Fjalla One` fonts for distinct typographic hierarchy.
- **Sticky Filter Drawers**: Instant discipline filtering, search query caps, and active badge counts across all 44 academic programmes.
- **Micro-Interactions**: Subtle physics on cards (`hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`) and responsive skeleton screens.
- **WCAG 2.1 AA Compliance**: 4.5:1+ color contrast ratios in light/dark mode, visible focus rings, full keyboard accessibility (`Tab`, `Enter`, `Esc`), and ARIA dialog roles.

### 2. Deep Degree & Program Comparison Matrix
- Side-by-side comparative matrix covering **all 44 degree programmes**.
- Compare across:
  - Specialization & duration
  - Eligibility criteria & minimum percentages
  - Semester 1 curriculum & course credits
  - Core & elective subjects
  - Programming languages & analytical tools taught
  - Technology stack & dev tools (Docker, Git, Spring Boot, PyTorch, React, etc.)
  - AI, Machine Learning, Data Science & emerging tech topics
  - Practical labs, capstone projects, and 6-month corporate internships
  - Industry certifications & academy tie-ups (AWS, GCP, Cisco, Oracle, etc.)
  - Career opportunities & job roles
  - Higher education pathways (MS, M.Tech, MBA, etc.)
  - Base tuition fees & LPUNEST merit scholarship waivers (up to 50%)
- Interactive **"Highlight Differences"** toggle and mobile swipeable layout with edge gradient indicators.

### 3. Hostel & Living Section Overhaul
- **Pricing & Duration Clarity**: All duration labels explicitly state `Price for 10 months (Academic Session)`.
- **Live Availability Interaction**: Interactive "Check Live Availability" buttons with 600ms loading spinners and simulated real-time floor/room vacancy dialogs.
- **Free Electricity Allowance & Tariffs (Session 2026-27)**:
  - 1 BHK & 1-Seater Studio: **100 units / month** (1,000 units / session)
  - 2-Seater Studio: **70 units / month per room** (700 units / session)
  - 3-Seater Studio: **85 units / month per room** (850 units / session)
  - 4-Seater Studio: **100 units / month per room** (1,000 units / session)
  - 1-Seater Standard AC: **60 units / month** (600 units / session)
  - 2-Seater Standard AC: **50 units / month** (500 units / session)
  - 3-Seater Standard AC: **45 units / month** (450 units / session)
  - 4-Seater Standard AC: **40 units / month** (400 units / session)
  - Air-Cooled Rooms: Duct cooling included at **₹0 extra tariff**; 30 units/mo for lighting/fans.
  - Excess units billed according to PSPCL commercial residential tariff (~₹10.50/unit) via student UMS portal.

### 4. Cryptographic Email OTP Authentication & Privacy
- **6-Digit Secure OTP**: Cryptographically secure numeric OTPs (`secrets.randbelow(900000) + 100000`).
- **Rate-Limiting & Anti-Abuse**: Server-side 30-second cooldown per email, 10-minute expiration, and max 5 verification attempts.
- **RFC 7519 JWT Sessions**: Secure HS256 tokens for authenticated user sessions.
- **Complete Deletion Rights**: Users can permanently delete individual chats or clear all chat history from the backend database with confirmation dialogs.
- **Zero-Trust Role-Based Access Control (RBAC)**: Regular users cannot access administrator metrics, security event streams, or other users' conversations.

### 5. Enterprise Administrator Dashboard (`/admin`)
- Accessible only to authorized administrator roles (`@admin_required`).
- Real-time database metrics:
  - Total users, active users, new registrations
  - Chatbot volume by category
  - Failed login attempts & security exceptions
  - Server health status (uptime, database connection, sliding-window rate limiter)
- Searchable and paginated user directory with individual account deletion.
- Security audit event log table with masked emails for privacy.
- Environment-based admin provisioning (`ADMIN_PASSWORD` in `.env`, no hardcoded passwords).

### 6. OWASP Top 10 Security Hardening
- **Strict Input Sanitization**: Client-side `DOMPurify` prevents script injection attacks in markdown and chat messages.
- **Input Length Caps**: 500-character cap on chat inputs, 100-character cap on search filters to prevent buffer exhaustion.
- **Sliding-Window Rate Limiter**: 30 requests per minute per IP with standard `HTTP 429 Too Many Requests` and `Retry-After` headers.
- **Strict HTTP Security Headers**: CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **CORS Lockdown**: Restricted strictly to authorized origins; wildcard `*` with credentials forbidden.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Backend Setup
```bash
# Navigate to project root
cd "college-helpdesk"

# Create and activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Seed the authentic university database (44 programs, curriculum, knowledge base)
python backend/scripts/seed_database.py

# Run Flask backend server (port 5000)
python backend/run.py
```

### 2. Frontend Setup
```bash
# Install node packages
npm install

# Start Vite development server (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Test Suite (100% Pass Rate)

Run the full pytest suite:
```bash
.venv\Scripts\pytest backend/tests -v
```
All **37 tests** pass:
- `test_api.py`: 22 tests verifying endpoints, knowledge retrieval, and slot filling.
- `test_auth.py`: 6 tests verifying OTP generation, 30s cooldowns, attempt caps, JWT authentication, and RBAC admin protection.
- `test_security.py`: 9 tests verifying OWASP security headers, CORS lockdown, sliding-window rate limiting, and length caps.

Run frontend production build verification:
```bash
npm run build
```
Builds cleanly with code-split rollup chunks (`vendor-react`, `vendor-icons`, `vendor-charts`).

---

## ☁️ Vercel Deployment Guide

The repository is pre-configured for instant zero-configuration deployment to **Vercel** with `vercel.json` and serverless Python API handlers.

### Deploying to Vercel via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deploying via Vercel Dashboard (GitHub)
1. Push your repository to GitHub.
2. In the Vercel Dashboard, click **"Add New Project"** and import the repository.
3. Configure the following **Environment Variables** in Project Settings:
   - `SECRET_KEY`: A strong random string for JWT sessions.
   - `ADMIN_USERNAME`: `admin` (or custom).
   - `ADMIN_EMAIL`: `admissions@lpu.co.in`.
   - `ADMIN_PASSWORD`: A secure administrator password.
   - `ADMIN_EMAILS`: `admissions@lpu.co.in`.
   - `SMTP_SERVER` / `SMTP_USER` / `SMTP_PASSWORD`: (Optional) for live email delivery.
4. Click **Deploy**. Vercel will build the frontend with `@vercel/static-build` and serve the API via `api/index.py` serverless WSGI runtime.

---

## 📄 License & Attribution
Student-developed educational and advisory project. Information compiled from publicly accessible University notifications and circulars (Academic Session 2026-27).
