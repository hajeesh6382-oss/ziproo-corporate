# Ziproo Corporate - Sovereign Identity & Enterprise Architecture

A secure, authentication-first corporate website and zero-trust identity gateway powered by server-verified role-based access control and Supabase.

---

## 🚀 Quick Start

The website runs on a zero-dependency local Node server, or can be deployed directly to Vercel.

```bash
# Start local development server:
npm run dev

# Or build production static bundles:
npm run build
```

Then open in your browser: **`http://localhost:3000`**

---

## 🔐 Authentication-First Navigation Architecture

When a visitor opens the website (`/`), the **Access Clearance Gateway** is the first screen displayed. No navigation bar, home hero, branches, or protected content is rendered prior to authentication.

### Two Dedicated Authentication Partitions:

1. **User / Member Partition**:
   - **Sign In**: Email and password authentication with "Remember this session" option.
   - **Create Account (Sign Up)**: Full Legal Name, Corporate Email, Master Keyphrase, **Password Confirmation**, strength meter, and compliance agreement.
   - **Forgot Password**: Password reset request with zero-knowledge recovery dispatch.
   - **Destination**: On successful sign-in/up, user is redirected to the corporate Home page (`/home`).

2. **Enterprise Admin Partition (Tier IV Clearance)**:
   - **Operations Console Login**: Distinct high-security interface requiring Admin ID / Email, Master Keyphrase, and optional Hardware MFA PIN.
   - **Server-Side Verification**: Authentication is verified at the server boundary (`/api/verify-admin`). Users cannot elevate themselves to admin by modifying localStorage, cookies, or URL parameters.
   - **Destination**: On successful admin authentication, admin is redirected to the **Operations Console** (`/admin`).
   - Unauthorized accounts attempting to enter the admin dashboard receive an immediate `403 Forbidden` rejection.

---

## 🔑 Default Test Credentials

| Role | Email | Password | Access Target |
|---|---|---|---|
| **Standard User / Member** | `user@ziproo.com` | `User@123` | Redirects to Home (`/home`), unlocking full corporate pages. |
| **Enterprise Administrator** | `admin@ziproo.com` | `Admin@123` | Redirects to Operations Console (`/admin`) with full telemetry & user provisioning. |

*Quick test fill buttons are integrated directly into the login cards for rapid verification.*

---

## 🌐 Site Structure & Route Protection

| Route | File | Clearance | Description |
|---|---|---|---|
| `/` | `index.html` | **Public** | **Initial Screen**: Access Clearance Gateway (User Login, Admin Login, Sign Up, Forgot Password). |
| `/home` | `home.html` | 🔒 **Members Only** | Preserved corporate landing page: hero, sovereign architecture manifesto, live telemetry stats, and deployed projects showcase. |
| `/admin` | `admin.html` | 🛡️ **Admin Only** | Operations Console: real-time cluster telemetry, user clearance provisioning, and cryptographic security audit stream. |
| `/branches` | `branches.html` | 🔒 **Members Only** | Interactive telemetry radar world map with regional filters and facility operational toggles. |
| `/updates` | `updates.html` | 🔒 **Members Only** | Foundation Vision & Mission, cryptographic sync ledger, and dispatch updates. |
| `/leadership` | `leaders.html` | 🔒 **Members Only** | Executive suite profiles (Elena Rostova CEO, Marcus Vance COO, Dr. Aris Thorne Chief Cryptographer), encrypted messaging, and vault keys. |
| `/connect` | `portal.html` | 🔒 **Members Only** | Dedicated social media gateway featuring YouTube, Instagram, LinkedIn, X, and WhatsApp official channels. |

---

## 🛡️ Route Guards & Security Guarantees

- **Unauthenticated Redirection**: Direct access to `/home`, `/branches`, `/updates`, `/leadership`, `/connect`, or `/admin` without an active session automatically redirects to `/?auth=required&target=<route>`.
- **Admin Isolation**: Standard member accounts attempting to access `/admin` are blocked and redirected back to `/home`.
- **Authentic Session Persistence**: Page refreshes maintain user credentials without unexpected logouts or infinite redirect loops.
- **Secure Logout**: The Logout button clears session tokens and returns visitors to `/`.
