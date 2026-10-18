# Ziproo Corporate - Sovereign Identity & Enterprise Architecture

A production-grade corporate website and community gateway powered by Supabase.

---

## 🚀 Quick Start

The website runs on a zero-dependency local Node server, or can be served statically.

```bash
npm run dev
# or: node server.js
```
Then visit: **`http://localhost:3000`**

---

## 🌐 Site Structure & Access Control

| Page | Route | Access | Description |
|---|---|---|---|
| **Home** | `/` (`index.html`) | **Public** | Brand landing page, live telemetry stats, unified Supabase Sign In / Create Account interface, deployed projects showcase, and authenticated Main Dashboard. |
| **Social & Community Portal** | `/portal` (`portal.html`) | **Public** | Dedicated social media gateway featuring YouTube, Instagram, LinkedIn, X (Twitter), and WhatsApp official channels with verified security dispatches. |
| **Global Branches** | `/branches` (`branches.html`) | 🔒 **Members Only** | Interactive telemetry radar world map with clickable pins, regional filters, and facility operational toggles. Protected by route guards. |
| **Daily Updates** | `/updates` (`updates.html`) | 🔒 **Members Only** | Foundation Vision & Mission, cryptographic sync ledger, live protocol intelligence feed, and dispatch updates. Protected by route guards. |
| **Executive Leadership** | `/leaders` (`leaders.html`) | 🔒 **Members Only** | Executive suite profiles (Elena Rostova CEO, Marcus Vance COO, Dr. Aris Thorne Chief Cryptographer), encrypted messaging, and vault upload. Protected by route guards. |

---

## 🔐 Authentication & Navigation Architecture

- **Single Shared Authentication**: The Home page (`index.html#auth-section`) serves as the single centralized Sign In and Sign Up interface for the entire website. All duplicate authentication cards were removed from the Portal.
- **Dynamic Navigation Guard**:
  - Unauthenticated visitors only see public routes (`Home`, `Portal`) in the navigation bar, drawer, and bottom dock.
  - Protected routes (`Branches`, `Updates`, `Leaders`) are hidden from navigation until successful login.
  - Direct attempts to navigate to protected pages will automatically redirect visitors to `index.html?auth=required#auth-section` with an informative banner.
- **Post-Login Dashboard**: Authenticated users unlock the Enterprise Main Dashboard on Home and full navigation access across all partitions.
- **Configurable Social Channels**: Stored in [`js/social-config.js`](file:///c:/Users/N.A.Hajeesh/Downloads/main%20website/js/social-config.js) with clearly identified placeholders ready for official production URLs.
