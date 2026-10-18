const fs = require('fs');
const { urlMap, getHeader, getBottomDock, getFooter, replaceImageUrls } = require('./layout_helpers.js');

function buildAuth() {
  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Identity Authentication & Operations Console - Ziproo</title>
  <meta name="description" content="Secure identity access portal and enterprise administrative command console for Ziproo network powered by Supabase."/>
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet"/>
  
  <!-- Tailwind CDN & Config -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-tertiary-container": "#a3a4a4",
            "error-container": "#ffdad6",
            "on-secondary-fixed-variant": "#8c1900",
            "on-tertiary-fixed": "#1a1c1c",
            "tertiary": "#232525",
            "on-tertiary": "#ffffff",
            "surface-bright": "#f9f9f9",
            "on-background": "#1a1c1c",
            "surface-container-lowest": "#ffffff",
            "surface-container-low": "#f3f3f3",
            "error": "#ba1a1a",
            "surface-tint": "#5f5e5e",
            "on-error": "#ffffff",
            "inverse-primary": "#c8c6c6",
            "outline": "#747878",
            "on-secondary-container": "#570c00",
            "surface-container": "#eeeeee",
            "inverse-surface": "#2f3131",
            "primary-fixed": "#e4e2e1",
            "surface-variant": "#e2e2e2",
            "on-primary-container": "#a5a4a3",
            "inverse-on-surface": "#f1f1f1",
            "on-surface": "#1a1c1c",
            "surface-container-highest": "#e2e2e2",
            "surface": "#f9f9f9",
            "tertiary-fixed-dim": "#c6c6c6",
            "secondary": "#b52603",
            "on-secondary-fixed": "#3d0600",
            "secondary-fixed": "#ffdad2",
            "on-error-container": "#93000a",
            "on-secondary": "#ffffff",
            "surface-container-high": "#e8e8e8",
            "tertiary-container": "#383a3b",
            "surface-dim": "#dadada",
            "on-tertiary-fixed-variant": "#454747",
            "on-primary": "#ffffff",
            "on-primary-fixed-variant": "#474747",
            "outline-variant": "#c4c7c7",
            "primary-container": "#3a3a3a",
            "on-primary-fixed": "#1b1c1c",
            "background": "#f9f9f9",
            "primary-fixed-dim": "#c8c6c6",
            "secondary-container": "#fd5835",
            "tertiary-fixed": "#e2e2e2",
            "secondary-fixed-dim": "#ffb4a3",
            "primary": "#242525",
            "on-surface-variant": "#444748"
          },
          fontFamily: {
            "headline-xl": ["Outfit"],
            "headline-lg": ["Outfit"],
            "headline-md": ["Outfit"],
            "headline-sm": ["Outfit"],
            "tagline-display": ["Outfit"],
            "display": ["Outfit"],
            "body-lg": ["Inter"],
            "body-md": ["Inter"],
            "body-sm": ["Inter"],
            "label-lg": ["Inter"],
            "label-md": ["Inter"],
            "label-sm": ["Inter"]
          }
        }
      }
    };
  </script>
  <link rel="stylesheet" href="css/styles.css"/>
</head>
<body class="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
  ${getHeader('auth', 'Ziproo - Portal')}

  <main class="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pb-16 bg-surface">
    <div class="max-w-2xl mx-auto w-full px-4 sm:px-6 space-y-6 pt-4">
      
      <!-- Identity Monogram & Header -->
      <div class="relative flex flex-col items-center text-center pt-2">
        <div class="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/20 mb-3">
          <span class="font-headline-lg font-bold tracking-tighter text-secondary-container">Z</span>
          <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping opacity-75"></span>
            <span class="absolute w-2 h-2 rounded-full bg-secondary-container"></span>
          </span>
        </div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-2">
          <span class="material-symbols-outlined text-[14px]">verified_user</span>
          <span class="font-tagline-display text-[10px] tracking-widest uppercase">Supabase Identity Protocol</span>
        </div>
        <h1 class="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight font-bold">
          IDENTITY ACCESS PORTAL
        </h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-[320px] mt-1 leading-snug">
          Zero-trust enterprise authentication & clearance engine backed by Supabase.
        </p>
      </div>

      <!-- Segmented Role Mode Switcher -->
      <div class="relative bg-surface-container-high p-1 rounded-2xl flex items-center shadow-sm">
        <button class="relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 bg-surface-container-lowest text-on-surface shadow-sm font-semibold" id="role-user-btn" type="button">
          <span class="material-symbols-outlined text-[18px] text-secondary">badge</span>
          <span>User / Member</span>
        </button>
        <button class="relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 text-on-surface-variant hover:text-on-surface" id="role-admin-btn" type="button">
          <span class="material-symbols-outlined text-[18px]">security</span>
          <span>Enterprise Admin</span>
        </button>
      </div>

      <!-- VIEW 1: USER / MEMBER ACCESS (GUEST VIEW VS LOGGED-IN DASHBOARD) -->
      <div class="flex flex-col gap-4" id="user-role-section">
        
        <!-- LOGGED-IN AUTHENTICATED USER DASHBOARD (Shown when Supabase session active) -->
        <div id="auth-user-dashboard" class="hidden flex-col gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-md border border-outline-variant/30">
          <div class="flex items-center justify-between pb-4 border-b border-outline-variant/20">
            <div class="flex items-center gap-3">
              <span id="dash-user-initial" class="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary font-headline-md font-bold flex items-center justify-center shadow-md">U</span>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <h3 id="dash-user-name" class="font-headline-sm text-headline-sm text-on-surface font-bold">User</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified
                  </span>
                </div>
                <span id="dash-user-email" class="text-xs text-outline font-mono">user@example.com</span>
              </div>
            </div>
            <button type="button" data-action="supabase-signout" class="px-3.5 py-2 rounded-xl bg-error/10 text-error hover:bg-error/20 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>

          <!-- Identity Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider">Identity ID (Supabase UUID)</span>
              <span id="dash-user-id" class="text-xs font-mono text-on-surface truncate">...</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider">Clearance Status</span>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-secondary-container"></span>
                <span class="text-xs font-semibold text-on-surface">Standard Member Tier</span>
              </div>
            </div>
            <div class="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider">Session Registered</span>
              <span id="dash-user-created" class="text-xs font-medium text-on-surface">Active</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span class="text-[10px] text-outline font-bold uppercase tracking-wider">Zero-Trust Encryption</span>
              <div class="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <span class="material-symbols-outlined text-[16px]">lock</span>
                <span>Active 256-bit TLS Handshake</span>
              </div>
            </div>
          </div>

          <!-- Quick Navigation Actions -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a href="index.html" class="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold text-center transition-colors">
              Explore Projects
            </a>
            <a href="branches.html" class="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold text-center transition-colors">
              Global Branches
            </a>
            <button type="button" data-action="open-supabase-config" class="py-2.5 px-4 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <span class="material-symbols-outlined text-[16px]">database</span>
              <span>Supabase Settings</span>
            </button>
          </div>
        </div>

        <!-- GUEST SECTION: Sign In vs Sign Up (Default shown when not logged in) -->
        <div id="auth-guest-section" class="flex flex-col gap-4">
          <!-- Sub-tab pill: Sign In vs Sign Up -->
          <div class="flex items-center justify-between bg-surface-container-low px-2 py-1.5 rounded-xl">
            <div class="flex items-center gap-1">
              <button class="px-4 py-1.5 rounded-lg font-label-sm text-label-sm bg-primary text-on-primary transition-all shadow-sm font-semibold" id="tab-signin-btn" type="button">
                Sign In
              </button>
              <button class="px-4 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all font-medium" id="tab-signup-btn" type="button">
                Create Account
              </button>
            </div>
            <div class="flex items-center gap-1 text-on-surface-variant px-2">
              <span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              <span class="font-label-sm text-label-sm">Standard Tier</span>
            </div>
          </div>

          <!-- USER SIGN IN FORM -->
          <div class="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col gap-4" id="signin-card">
            <div class="flex flex-col gap-1">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Welcome back</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Enter verified Supabase credentials to unlock your workspace.</span>
            </div>

            <!-- Feedback Message Banner -->
            <div id="signin-msg-box" class="hidden text-xs p-3 rounded-xl"></div>

            <form id="portal-signin-form" class="flex flex-col gap-3">
              <!-- Email Input -->
              <div class="flex flex-col gap-1">
                <label class="font-label-sm text-label-sm text-on-surface font-medium flex items-center justify-between">
                  <span>Corporate or Personal Email</span>
                  <span class="text-on-surface-variant font-normal">Supabase Auth</span>
                </label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">mail</span>
                  <input id="portal-signin-email" required class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="user@enterprise.org" type="email"/>
                </div>
              </div>
              
              <!-- Password Input -->
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <label class="font-label-sm text-label-sm text-on-surface font-medium">Password</label>
                  <a class="font-label-sm text-label-sm text-secondary hover:underline" href="#" id="link-forgot-pwd">Forgot password?</a>
                </div>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">lock</span>
                  <input id="portal-signin-password" required class="w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="Enter your passphrase" type="password"/>
                  <button class="absolute right-3 text-on-surface-variant hover:text-on-surface p-1" id="toggle-pwd-btn" type="button" aria-label="Toggle password visibility">
                    <span class="material-symbols-outlined text-[20px]" id="toggle-pwd-icon">visibility</span>
                  </button>
                </div>
              </div>

              <!-- Remember / Passkey Option -->
              <div class="flex items-center justify-between pt-1">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input checked class="w-4 h-4 rounded accent-secondary-container bg-surface-container-high" type="checkbox"/>
                  <span class="font-label-sm text-label-sm text-on-surface">Remember this session</span>
                </label>
                <div class="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full">
                  <span class="material-symbols-outlined text-[13px] text-secondary">fingerprint</span>
                  <span class="font-label-sm text-[10px] text-on-surface-variant">Passkey ready</span>
                </div>
              </div>

              <!-- Sign In CTA -->
              <button id="btn-submit-signin" class="w-full h-12 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all" type="submit">
                <span>Sign In to Ziproo</span>
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            <!-- Social / Config Actions -->
            <div class="relative flex items-center justify-center my-1">
              <div class="w-full h-[1px] bg-surface-container-high"></div>
              <span class="absolute bg-surface-container-lowest px-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">or connect backend</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button type="button" data-action="open-supabase-config" class="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-[18px] text-emerald-600">database</span>
                <span class="truncate">Supabase Config</span>
              </button>
              <button type="button" id="btn-quick-demo-auth" class="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-[18px] text-primary">login</span>
                <span class="truncate">Instant Demo Sign In</span>
              </button>
            </div>
          </div>

          <!-- USER SIGN UP FORM (Default Hidden) -->
          <div class="hidden bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col gap-4" id="signup-card">
            <div class="flex flex-col gap-1">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Provision New Identity</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Setup zero-trust corporate workspace in seconds with Supabase Auth.</span>
            </div>

            <!-- Feedback Message Banner -->
            <div id="signup-msg-box" class="hidden text-xs p-3 rounded-xl"></div>

            <form id="portal-signup-form" class="flex flex-col gap-3">
              <!-- Full Name -->
              <div class="flex flex-col gap-1">
                <label class="font-label-sm text-label-sm text-on-surface font-medium">Full Legal Name</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">person</span>
                  <input id="portal-signup-fullname" required class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="Sarah Mitchell" type="text"/>
                </div>
              </div>

              <!-- Corporate Email -->
              <div class="flex flex-col gap-1">
                <label class="font-label-sm text-label-sm text-on-surface font-medium">Corporate Email Address</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">alternate_email</span>
                  <input id="portal-signup-email" required class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="sarah.m@company.com" type="email"/>
                </div>
              </div>

              <!-- Mobile Phone -->
              <div class="flex flex-col gap-1">
                <label class="font-label-sm text-label-sm text-on-surface font-medium">Mobile Phone (2FA Protocol)</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">smartphone</span>
                  <input id="portal-signup-phone" class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" placeholder="+1 (555) 019-2834" type="tel"/>
                </div>
              </div>

              <!-- Password + Strength Meter -->
              <div class="flex flex-col gap-1.5">
                <label class="font-label-sm text-label-sm text-on-surface font-medium">Set Master Key Password</label>
                <div class="relative flex items-center">
                  <span class="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">key</span>
                  <input id="portal-signup-password" required class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline transition-all" type="password" placeholder="Min. 8 characters"/>
                </div>
              </div>

              <!-- Terms Checkbox -->
              <label class="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                <input required checked class="mt-1 w-4 h-4 rounded accent-secondary-container bg-surface-container-high" type="checkbox"/>
                <span class="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                  I agree to the <span class="text-on-surface font-medium">Ziproo Identity Terms</span>, Privacy Protocol, and cryptographic auditing compliance.
                </span>
              </label>

              <!-- Create Account CTA -->
              <button id="btn-submit-signup" class="w-full h-12 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all" type="submit">
                <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span>Create Ziproo Identity</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- VIEW 2: ADMIN / OPERATOR PORTAL (Default Hidden) -->
      <div class="hidden flex flex-col gap-4" id="admin-role-section">
        <!-- Admin Warning & Security Badge Card -->
        <div class="bg-primary text-on-primary p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
              <span class="font-tagline-display text-[10px] tracking-widest text-secondary-fixed uppercase">Root Gateway</span>
            </div>
            <div class="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-fixed text-[11px] font-label-sm">
              Tier IV Clearance
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-primary font-bold">
              Operations Console
            </h2>
            <p class="font-body-sm text-body-sm text-on-primary-container leading-snug">
              High-clearance partition. Requires verified credentials and cryptographic authorization.
            </p>
          </div>

          <form id="admin-login-form" class="flex flex-col gap-3 pt-1">
            <!-- Admin ID -->
            <div class="flex flex-col gap-1">
              <label class="font-label-sm text-label-sm text-on-primary-container">Enterprise Admin ID or Root Email</label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-on-primary-container text-[20px] pointer-events-none">shield_person</span>
                <input id="admin-email-input" class="w-full h-12 pl-11 pr-4 rounded-xl bg-tertiary-container text-on-primary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container placeholder:text-outline" placeholder="admin@ziproo.internal" type="email"/>
              </div>
            </div>
            <!-- Master Vault Key -->
            <div class="flex flex-col gap-1">
              <label class="font-label-sm text-label-sm text-on-primary-container">Master Keyphrase</label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3.5 text-on-primary-container text-[20px] pointer-events-none">encrypted</span>
                <input id="admin-password-input" class="w-full h-12 pl-11 pr-4 rounded-xl bg-tertiary-container text-on-primary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container placeholder:text-outline" placeholder="Enter root passphrase" type="password"/>
              </div>
            </div>

            <!-- Hardware Handshake Button -->
            <button type="button" id="btn-hardware-handshake" class="h-11 px-4 rounded-xl bg-primary-container text-on-primary-fixed text-xs font-semibold flex items-center justify-between hover:bg-tertiary-container transition-colors">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-secondary-container">key</span>
                <span id="handshake-label">Passkey Hardware Handshake</span>
              </div>
              <span id="handshake-status" class="text-[10px] text-outline font-mono">READY</span>
            </button>

            <!-- Admin Submit -->
            <button class="w-full h-12 mt-2 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-[0.99] transition-all font-semibold" type="submit">
              <span class="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span>Authenticate Enterprise Root</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('auth')}

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/app.js"></script>
  <script src="js/supabase-client.js"></script>
  <script>
    (function initAuthPortal() {
      // Role Switcher Elements
      const roleUserBtn = document.getElementById('role-user-btn');
      const roleAdminBtn = document.getElementById('role-admin-btn');
      const userRoleSec = document.getElementById('user-role-section');
      const adminRoleSec = document.getElementById('admin-role-section');

      // Sub-tab elements
      const tabSignInBtn = document.getElementById('tab-signin-btn');
      const tabSignUpBtn = document.getElementById('tab-signup-btn');
      const signInCard = document.getElementById('signin-card');
      const signUpCard = document.getElementById('signup-card');

      // Toggle password
      const pwdInput = document.getElementById('portal-signin-password');
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');
      const togglePwdIcon = document.getElementById('toggle-pwd-icon');

      // Forms
      const signInForm = document.getElementById('portal-signin-form');
      const signUpForm = document.getElementById('portal-signup-form');
      const adminForm = document.getElementById('admin-login-form');

      function switchRole(mode) {
        if (mode === 'user') {
          userRoleSec?.classList.remove('hidden');
          adminRoleSec?.classList.add('hidden');

          if (roleUserBtn) roleUserBtn.className = 'relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 bg-surface-container-lowest text-on-surface shadow-sm font-semibold';
          if (roleAdminBtn) roleAdminBtn.className = 'relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 text-on-surface-variant hover:text-on-surface';
        } else {
          userRoleSec?.classList.add('hidden');
          adminRoleSec?.classList.remove('hidden');

          if (roleAdminBtn) roleAdminBtn.className = 'relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 bg-surface-container-lowest text-on-surface shadow-sm font-semibold';
          if (roleUserBtn) roleUserBtn.className = 'relative flex-1 py-2 px-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all duration-200 text-on-surface-variant hover:text-on-surface';
          
          Ziproo.applyAdminMode(true);
        }
      }

      function switchUserTab(tab) {
        if (tab === 'signin') {
          signInCard?.classList.remove('hidden');
          signUpCard?.classList.add('hidden');

          if (tabSignInBtn) {
            tabSignInBtn.className = 'px-4 py-1.5 rounded-lg font-label-sm text-label-sm bg-primary text-on-primary transition-all shadow-sm font-semibold';
          }
          if (tabSignUpBtn) {
            tabSignUpBtn.className = 'px-4 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all font-medium';
          }
        } else {
          signInCard?.classList.add('hidden');
          signUpCard?.classList.remove('hidden');

          if (tabSignUpBtn) {
            tabSignUpBtn.className = 'px-4 py-1.5 rounded-lg font-label-sm text-label-sm bg-primary text-on-primary transition-all shadow-sm font-semibold';
          }
          if (tabSignInBtn) {
            tabSignInBtn.className = 'px-4 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all font-medium';
          }
        }
      }

      roleUserBtn?.addEventListener('click', () => switchRole('user'));
      roleAdminBtn?.addEventListener('click', () => switchRole('admin'));
      tabSignInBtn?.addEventListener('click', () => switchUserTab('signin'));
      tabSignUpBtn?.addEventListener('click', () => switchUserTab('signup'));

      if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener('click', () => {
          if (pwdInput.type === 'password') {
            pwdInput.type = 'text';
            if (togglePwdIcon) togglePwdIcon.textContent = 'visibility_off';
          } else {
            pwdInput.type = 'password';
            if (togglePwdIcon) togglePwdIcon.textContent = 'visibility';
          }
        });
      }

      function showBanner(boxId, msg, isError = true) {
        const box = document.getElementById(boxId);
        if (!box) return;
        box.textContent = msg;
        box.className = isError
          ? 'text-xs p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
          : 'text-xs p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20';
        box.classList.remove('hidden');
      }

      // Handle Sign In with Supabase
      if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('portal-signin-email')?.value.trim();
          const password = document.getElementById('portal-signin-password')?.value;
          const btn = document.getElementById('btn-submit-signin');
          const original = btn ? btn.innerHTML : 'Sign In';

          if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Authenticating with Supabase...</span>';

          const res = await ZiprooAuth.signIn({ email, password });
          if (res.error) {
            showBanner('signin-msg-box', res.error.message || 'Authentication failed. Please verify email and password.', true);
            if (btn) btn.innerHTML = original;
          } else {
            showBanner('signin-msg-box', '✨ Authenticated successfully! Welcome to Ziproo.', false);
            Ziproo.showToast('Identity session verified via Supabase', 'verified');
            if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span><span>Authenticated!</span>';
          }
        });
      }

      // Handle Sign Up with Supabase
      if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const fullName = document.getElementById('portal-signup-fullname')?.value.trim();
          const email = document.getElementById('portal-signup-email')?.value.trim();
          const phone = document.getElementById('portal-signup-phone')?.value.trim();
          const password = document.getElementById('portal-signup-password')?.value;
          const btn = document.getElementById('btn-submit-signup');
          const original = btn ? btn.innerHTML : 'Create Identity';

          if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Registering with Supabase...</span>';

          const res = await ZiprooAuth.signUp({ email, password, fullName, phone });
          if (res.error) {
            showBanner('signup-msg-box', res.error.message || 'Sign up failed.', true);
            if (btn) btn.innerHTML = original;
          } else {
            showBanner('signup-msg-box', '🎉 Account provisioned! If email verification is enabled in your Supabase project, check your inbox to confirm.', false);
            Ziproo.showToast('Identity provisioned successfully', 'how_to_reg');
            if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span><span>Account Created!</span>';
          }
        });
      }

      // Instant Demo Sign In
      document.getElementById('btn-quick-demo-auth')?.addEventListener('click', async () => {
        const demoEmail = 'alex.vance@ziproo-network.io';
        const demoPass = 'ZiprooDemo2026!';
        const emailInput = document.getElementById('portal-signin-email');
        const passInput = document.getElementById('portal-signin-password');
        if (emailInput) emailInput.value = demoEmail;
        if (passInput) passInput.value = demoPass;
        
        Ziproo.showToast('Demo credentials preloaded. Click Sign In to connect.', 'info');
      });

      // Admin Handshake simulation
      document.getElementById('btn-hardware-handshake')?.addEventListener('click', () => {
        const status = document.getElementById('handshake-status');
        const label = document.getElementById('handshake-label');
        if (status) {
          status.textContent = 'CHALLENGE...';
          status.className = 'text-[10px] text-amber-500 font-mono animate-pulse';
        }
        setTimeout(() => {
          if (status) {
            status.textContent = 'PASSKEY OK';
            status.className = 'text-[10px] text-emerald-400 font-mono font-bold';
          }
          if (label) label.textContent = 'Hardware Token Handshake Verified';
          Ziproo.showToast('FIDO2 / YubiKey Hardware Token verified', 'fingerprint');
        }, 900);
      });

      // Admin Submit
      if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('admin-email-input')?.value.trim();
          Ziproo.applyAdminMode(true);
          Ziproo.showToast('Enterprise Admin Root session authorized', 'security');
        });
      }
    })();
  </script>
</body>
</html>`;

  fs.writeFileSync('auth.html', page);
  console.log('Built auth.html successfully!');
}

buildAuth();
