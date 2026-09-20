# ⚡ VoltMaster Pro — Electrical Engineering PWA & AI Consultant

[![Status: Independent Project](https://img.shields.io/badge/Status-Independent%20Project-blue.svg)](https://github.com/alessandrooliveirape-prog/voltmaster)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Offline%20First-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Google Gemini](https://img.shields.io/badge/Gemini%20AI-Engineering%20Consultant-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

> **Live Application Demo:** [https://voltmaster-livid.vercel.app](https://voltmaster-livid.vercel.app)

**VoltMaster Pro** is a Progressive Web App (PWA) designed for electrical engineers, technicians, and field contractors. It bundles field calculation engines, technical regulatory compliance tools (IEC 60364, NEC, NBR 5410), offline-first storage, multilingual support, and an AI Technical Consultant powered by Google Gemini.

---

## 🌟 Core Features

### 1. 🧮 Precision Engineering Calculators
* **Solar Photovoltaic Sizing:** Calculate panel quantity (Wp), required array power (kWp), inverter rating, roof area, and payback analysis based on daily Peak Sun Hours (PSH / HSP).
* **Electric Motors & Starting Systems:** Compute full load current ($I_n$), inrush starting current ($I_p$), cable cross-section, contactor rating, and choose between Direct-on-Line, Star-Delta, and Soft-Starters.
* **Voltage Drop Calculator:** Compute single-phase and three-phase voltage drops across copper and aluminum conductors with custom power factor and distance parameters.
* **Conduit Fill Calculator:** Calculate raceway capacity limits per international standards to prevent overheating and cable jamming.
* **Breaker & Overcurrent Protection Sizing:** Size thermal-magnetic circuit breakers according to continuous and non-continuous load ratings.
* **Ohm's Law & Power Triangle:** Rapid multi-variable calculations for real (kW), reactive (kVAR), and apparent (kVA) power.
* **Power Factor Correction:** Determine capacitor bank requirements to achieve target efficiency and eliminate utility penalty tariffs.

### 2. 🤖 Gemini 2.5 AI Electrical Consultant
* Real-time technical consultation fine-tuned for electrical safety protocols (NR-10, OSHA) and standards compliance (NBR 5410, IEC 60364, NEC).
* In-app API Key settings modal with secure browser storage (`localStorage`) and model selection (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`).
* One-click technical prompt chips for instant regulatory questions and calculation verification.
* Deterministic low-temperature reasoning (`temperature: 0.3`) for mathematically grounded recommendations.
* Multi-context switching: Regulatory Standards (`norm`), Safety Protocols (`safety`), or Practical Field Advice (`general`).

### 3. 🌐 100% Offline-First (PWA) & Zero CDN Dependencies
* **Self-Contained Tailwind CSS v4:** Zero reliance on external runtime CDNs; builds and runs completely offline.
* **Native Multilingual:** Full interface and AI response localization in **English**, **Portuguese (PT-BR)**, and **Spanish (ES)**.
* **Offline Service Worker (`sw.js`):** Cache critical calculation engines for remote fieldwork where cellular connectivity is unavailable.
* **Installable App:** Direct homescreen installation across iOS, Android, macOS, and Windows with zero app store friction.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | React 19 + TypeScript | High-performance reactive UI with strict type safety |
| **Build & Bundler** | Vite 6 | Sub-second HMR and optimized production bundle |
| **Styling** | Modern Tailwind CSS | Sleek industrial dark mode with responsive tactile inputs |
| **Offline Engine** | Service Worker API + Web Manifest | Full offline calculation availability |
| **GenAI Engine** | Google GenAI SDK (`@google/genai`) | Gemini AI reasoning engine for code and field diagnostics |
| **Hosting** | Vercel | Global edge CDN delivery |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* **Node.js** 18+ and **npm**
* A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey) (optional for offline calculator usage)

### 1. Clone the Repository
```bash
git clone https://github.com/alessandrooliveirape-prog/voltmaster.git
cd voltmaster
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Install Dependencies & Launch
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔒 Security & Privacy Notice
* **Client-Side Privacy:** All engineering calculations are executed locally in the browser. No client project blueprints or dimensions are transmitted to external servers.
* **Secure Environment:** API keys are never bundled or exposed in production builds without explicit environment injection. Never commit `.env` or `.env.local` files to version control.

---

## 👤 Author & Status
* **Author:** [Alessandro Oliveira](https://github.com/alessandrooliveirape-prog)
* **Status:** Independent Project
* **License:** [MIT License](LICENSE)
