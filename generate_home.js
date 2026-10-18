const fs = require('fs');
const { urlMap, getHeader, getBottomDock, getFooter, replaceImageUrls } = require('./layout_helpers.js');

// Process Home (index.html)
function buildHome() {
  let raw = fs.readFileSync('stitch_raw_home.html', 'utf8');
  raw = replaceImageUrls(raw);

  // Extract <main> inner content
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = mainMatch ? mainMatch[1] : '';

  // Remove the old inline script from inside main
  mainContent = mainContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Upgrade the Interactive Auth Card to support Supabase Auth
  const oldAuthCardRegex = /<!-- Interactive Auth Card[\s\S]*?<\/section>/i;
  const newAuthCard = `<!-- Interactive Auth Card & Authenticated Main Dashboard -->
<section class="w-full scroll-mt-24" id="auth-section">
  <!-- GUEST PANEL (Shown when visitor is not logged in) -->
  <div id="home-guest-panel" class="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-md border border-outline-variant/30">
    
    <!-- Redirect Notice (Triggered when unauthenticated user tries to visit protected page) -->
    <div id="home-auth-redirect-banner" class="hidden mb-5 p-4 rounded-2xl bg-secondary-container/10 border border-secondary-container/30 text-on-surface flex items-start gap-3">
      <span class="material-symbols-outlined text-secondary-container text-[22px] shrink-0 mt-0.5">lock</span>
      <div class="flex flex-col gap-0.5">
        <span class="font-bold text-xs text-secondary-container">Authentication Required</span>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          Access to enterprise Branches, Updates feed, and Leadership suite is reserved for verified members. Please sign in or create an account to unlock full access.
        </p>
      </div>
    </div>

    <!-- Tabs Segmented Control -->
    <div class="grid grid-cols-2 p-1.5 rounded-2xl bg-surface-container mb-5">
      <button class="py-2.5 rounded-xl font-label-md text-label-md transition-all text-on-surface bg-surface-container-lowest shadow-sm flex items-center justify-center gap-1.5 font-semibold" id="tab-btn-signin" type="button">
        <span class="material-symbols-outlined text-[18px]">lock_open</span>
        <span>Sign In</span>
      </button>
      <button class="py-2.5 rounded-xl font-label-md text-label-md transition-all text-on-surface-variant flex items-center justify-center gap-1.5 font-medium" id="tab-btn-signup" type="button">
        <span class="material-symbols-outlined text-[18px]">person_add</span>
        <span>Create Account</span>
      </button>
    </div>

    <div id="home-auth-feedback" class="hidden text-xs p-3 rounded-xl mb-4"></div>

    <!-- Sign In Tab Form -->
    <form id="home-signin-form" class="space-y-4">
      <div class="flex flex-col text-left">
        <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 ml-0.5 font-medium">Corporate Email</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">mail</span>
          <input required id="home-signin-email" class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="name@ziproo-network.io" type="email"/>
        </div>
      </div>
      <div class="flex flex-col text-left">
        <div class="flex justify-between items-center mb-1 ml-0.5">
          <label class="font-label-sm text-label-sm text-on-surface-variant font-medium">Access Password</label>
          <a class="font-label-sm text-label-sm text-secondary hover:underline" href="javascript:void(0)" id="home-forgot-pwd">Forgot?</a>
        </div>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">key</span>
          <input required id="home-signin-password" class="w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="••••••••••••" type="password"/>
          <button aria-label="Toggle password view" class="absolute right-3 text-outline hover:text-on-surface flex items-center justify-center p-1" id="toggle-pwd-btn" type="button">
            <span class="material-symbols-outlined text-[20px]" id="toggle-pwd-icon">visibility</span>
          </button>
        </div>
      </div>
      <button id="home-btn-signin" class="w-full h-12 mt-2 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg shadow-[0_8px_20px_-2px_rgba(253,88,53,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-semibold" type="submit">
        <span>Sign In to Ziproo</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>

      <div class="relative py-2 flex items-center justify-center">
        <div class="w-full bg-surface-container-high h-[1px]"></div>
        <span class="absolute px-3 bg-surface-container-lowest font-label-sm text-[11px] text-outline uppercase tracking-wider">or rapid test</span>
      </div>

      <button type="button" id="home-btn-demo" class="w-full h-11 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-[0.98] transition-all font-medium">
        <span class="material-symbols-outlined text-[18px] text-primary">quick_reference</span>
        <span>Fill Demo Member Credentials</span>
      </button>
    </form>

    <!-- Sign Up Tab Form (Hidden initially) -->
    <form id="home-signup-form" class="space-y-4 hidden">
      <div class="flex flex-col text-left">
        <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 ml-0.5 font-medium">Full Legal Name</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">badge</span>
          <input required id="home-signup-name" class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="Sarah Jenkins" type="text"/>
        </div>
      </div>
      <div class="flex flex-col text-left">
        <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 ml-0.5 font-medium">Corporate Email</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">alternate_email</span>
          <input required id="home-signup-email" class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="sarah@corp.com" type="email"/>
        </div>
      </div>
      <div class="flex flex-col text-left">
        <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 ml-0.5 font-medium">Master Password</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">password</span>
          <input required id="home-signup-password" class="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline-variant" placeholder="Min. 8 characters" type="password"/>
        </div>
      </div>
      <button id="home-btn-signup" class="w-full h-12 mt-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-semibold" type="submit">
        <span>Create Enterprise Account</span>
        <span class="material-symbols-outlined text-[18px]">verified</span>
      </button>
    </form>
  </div>

  <!-- AUTHENTICATED MAIN DASHBOARD (Dynamically shown when Supabase user is logged in) -->
  <div id="home-loggedin-panel" class="hidden w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-md border border-outline-variant/30 flex-col">
    <!-- Session Card with Cleared Badge & Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary font-bold flex items-center justify-center shadow-md">
          <span class="material-symbols-outlined text-[26px]">verified_user</span>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-xs text-outline font-medium">Enterprise Session:</span>
            <span class="user-display-name font-bold text-on-surface text-base">User</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-label-sm text-[10px] font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Cleared
            </span>
          </div>
          <span class="user-display-email text-xs text-outline font-mono">user@example.com</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" data-action="open-supabase-config" class="hidden px-3.5 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-emerald-600">database</span>
          <span>Supabase Config</span>
        </button>
        <button type="button" data-action="supabase-signout" class="px-3.5 py-2 rounded-xl bg-error/10 text-error hover:bg-error/20 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</section>`;

  if (oldAuthCardRegex.test(mainContent)) {
    mainContent = mainContent.replace(oldAuthCardRegex, newAuthCard);
  }

  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Ziproo Corporate - Sovereign Identity & Enterprise Architecture</title>
  <meta name="description" content="Pioneering next-generation identity solutions, enterprise architectures, and bespoke brand platforms since 2026."/>
  <link rel="canonical" href="https://ziproo.vercel.app/"/>
  <meta property="og:url" content="https://ziproo.vercel.app/"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="Ziproo Corporate - Sovereign Identity & Enterprise Architecture"/>
  <meta property="og:description" content="Pioneering next-generation identity solutions, enterprise architectures, and bespoke brand platforms since 2026."/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:url" content="https://ziproo.vercel.app/"/>
  
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
  ${getHeader('home', 'Ziproo - Home')}

  <main class="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pb-16 bg-surface">
    <div class="max-w-3xl mx-auto w-full px-4 sm:px-6 space-y-6 pt-4">
      ${mainContent}
    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('home')}

  <!-- Project Creation Modal (Admin Mode) -->
  <div id="newProjectModal" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Deploy New Project</h3>
        </div>
        <button onclick="Ziproo.closeModal('newProjectModal')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="newProjectForm" class="space-y-4" onsubmit="handleNewProject(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Project Name</label>
          <input required id="newProjectName" type="text" placeholder="e.g. Helix Zero-Knowledge Vault" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Architecture Category</label>
          <select id="newProjectCategory" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
            <option>Decentralized Identity (DID)</option>
            <option>Biometric Key Engine</option>
            <option>Enterprise Cryptographic Vault</option>
            <option>Hardware Handshake Bridge</option>
          </select>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Description</label>
          <textarea required id="newProjectDesc" rows="3" placeholder="Core specs and infrastructure capabilities..." class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('newProjectModal')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Publish to Registry</button>
        </div>
      </form>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/social-config.js"></script>
  <script src="js/app.js"></script>
  <script src="js/supabase-client.js"></script>
  <script>
    // Home-specific interactions
    (function() {
      // Auth Tabs Switcher
      const tabSignIn = document.getElementById('tab-btn-signin');
      const tabSignUp = document.getElementById('tab-btn-signup');
      const panelSignIn = document.getElementById('home-signin-form');
      const panelSignUp = document.getElementById('home-signup-form');
      const authFeedback = document.getElementById('home-auth-feedback');

      if (tabSignIn && tabSignUp) {
        tabSignIn.addEventListener('click', () => {
          tabSignIn.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-semibold');
          tabSignIn.classList.remove('text-on-surface-variant', 'font-medium');
          tabSignUp.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-semibold');
          tabSignUp.classList.add('text-on-surface-variant', 'font-medium');

          panelSignIn?.classList.remove('hidden');
          panelSignUp?.classList.add('hidden');
        });

        tabSignUp.addEventListener('click', () => {
          tabSignUp.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-semibold');
          tabSignUp.classList.remove('text-on-surface-variant', 'font-medium');
          tabSignIn.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-semibold');
          tabSignIn.classList.add('text-on-surface-variant', 'font-medium');

          panelSignUp?.classList.remove('hidden');
          panelSignIn?.classList.add('hidden');
        });
      }

      // Password Toggle
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');
      const pwdInput = document.getElementById('home-signin-password');
      const togglePwdIcon = document.getElementById('toggle-pwd-icon');

      if (togglePwdBtn && pwdInput && togglePwdIcon) {
        togglePwdBtn.addEventListener('click', () => {
          const isPassword = pwdInput.type === 'password';
          pwdInput.type = isPassword ? 'text' : 'password';
          togglePwdIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
        });
      }

      // Forgot password helper
      document.getElementById('home-forgot-pwd')?.addEventListener('click', async () => {
        const email = document.getElementById('home-signin-email')?.value.trim();
        if (!email) {
          showFeedback('Please enter your email above first.', true);
          return;
        }
        showFeedback('Sending password reset instructions via Supabase...', false);
        const res = await ZiprooAuth.resetPassword(email);
        if (res.error) {
          showFeedback(res.error.message, true);
        } else {
          showFeedback('Password reset link dispatched to your email!', false);
        }
      });

      function showFeedback(msg, isError) {
        if (!authFeedback) return;
        authFeedback.textContent = msg;
        authFeedback.className = isError
          ? 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
          : 'text-xs p-3 rounded-xl mb-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20';
        authFeedback.classList.remove('hidden');
      }

      // Home Sign In Handler
      panelSignIn?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('home-signin-email')?.value.trim();
        const password = document.getElementById('home-signin-password')?.value;
        const btn = document.getElementById('home-btn-signin');
        const orig = btn ? btn.innerHTML : 'Sign In';

        if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Authenticating with Supabase...</span>';

        const res = await ZiprooAuth.signIn({ email, password });
        if (res.error) {
          showFeedback(res.error.message || 'Authentication failed. Please verify credentials.', true);
          if (btn) btn.innerHTML = orig;
        } else {
          showFeedback('✨ Authenticated successfully with Supabase!', false);
          Ziproo.showToast('Welcome to Ziproo Enterprise Network', 'verified');
        }
      });

      // Home Sign Up Handler
      panelSignUp?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('home-signup-name')?.value.trim();
        const email = document.getElementById('home-signup-email')?.value.trim();
        const password = document.getElementById('home-signup-password')?.value;
        const btn = document.getElementById('home-btn-signup');
        const orig = btn ? btn.innerHTML : 'Create Account';

        if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Registering with Supabase...</span>';

        const res = await ZiprooAuth.signUp({ email, password, fullName });
        if (res.error) {
          showFeedback(res.error.message || 'Registration failed.', true);
          if (btn) btn.innerHTML = orig;
        } else {
          showFeedback('🎉 Account registered! Check your email to confirm if project requires email verification.', false);
          Ziproo.showToast('Identity provisioned successfully on Supabase', 'how_to_reg');
        }
      });

      // Demo login button
      document.getElementById('home-btn-demo')?.addEventListener('click', () => {
        const emailEl = document.getElementById('home-signin-email');
        const pwdEl = document.getElementById('home-signin-password');
        if (emailEl) emailEl.value = 'alex.vance@ziproo-network.io';
        if (pwdEl) pwdEl.value = 'ZiprooDemo2026!';
        Ziproo.showToast('Demo credentials prefilled. Click "Sign In to Ziproo" to continue.', 'info');
      });

      // Admin toggle in banner
      const adminToggleBtn = document.getElementById('admin-mode-toggle');
      if (adminToggleBtn) {
        adminToggleBtn.setAttribute('data-action', 'toggle-admin');
      }

      // Add Project Modal Trigger
      const addProjectBtn = document.getElementById('btn-add-project');
      if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
          const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
          if (!isAdmin) {
            Ziproo.showToast('Please enable Admin Preview to add new projects', 'lock');
            return;
          }
          Ziproo.openModal('newProjectModal');
        });
      }

      // Contact Form Simulated Dispatch
      const contactForm = document.getElementById('contact-form');
      const contactToast = document.getElementById('contact-toast');
      const contactSubmitLabel = document.getElementById('contact-submit-label');
      const btnSubmit = document.getElementById('btn-submit-contact');

      if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (btnSubmit) btnSubmit.disabled = true;
          if (contactSubmitLabel) contactSubmitLabel.textContent = 'Transmitting...';

          setTimeout(() => {
            if (contactToast) contactToast.classList.remove('hidden');
            if (contactSubmitLabel) contactSubmitLabel.textContent = 'Dispatched Successfully';
            btnSubmit?.classList.add('bg-emerald-600');
            btnSubmit?.classList.remove('bg-primary');
            Ziproo.showToast('Message routed to Ziproo Executive Operations', 'mark_email_read');

            setTimeout(() => {
              if (contactToast) contactToast.classList.add('hidden');
              if (contactSubmitLabel) contactSubmitLabel.textContent = 'Send Message';
              btnSubmit?.classList.remove('bg-emerald-600');
              btnSubmit?.classList.add('bg-primary');
              if (btnSubmit) btnSubmit.disabled = false;
              contactForm.reset();
            }, 3500);
          }, 600);
        });
      }

      // Star Rating Interaction
      const starButtons = document.querySelectorAll('.star-btn');
      const feedbackSubmit = document.getElementById('feedback-submit-btn');
      const feedbackAck = document.getElementById('feedback-acknowledgement');
      const feedbackText = document.getElementById('feedback-text');
      let selectedRating = 0;

      starButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedRating = parseInt(btn.getAttribute('data-val') || '0', 10);
          starButtons.forEach(innerBtn => {
            const val = parseInt(innerBtn.getAttribute('data-val') || '0', 10);
            const icon = innerBtn.querySelector('.material-symbols-outlined');
            if (val <= selectedRating) {
              innerBtn.classList.add('text-secondary-container');
              innerBtn.classList.remove('text-outline-variant');
              if (icon) icon.style.fontVariationSettings = "'FILL' 1";
            } else {
              innerBtn.classList.remove('text-secondary-container');
              innerBtn.classList.add('text-outline-variant');
              if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
          });
        });
      });

      if (feedbackSubmit && feedbackAck) {
        feedbackSubmit.addEventListener('click', () => {
          if (selectedRating === 0 && (!feedbackText || !feedbackText.value.trim())) {
            feedbackAck.textContent = 'Please tap a star rating above!';
            feedbackAck.classList.remove('hidden');
            return;
          }
          feedbackAck.textContent = '✨ Thank you for powering our continuous iteration!';
          feedbackAck.classList.remove('hidden');
          Ziproo.showToast('Feedback submitted! Thank you.', 'stars');
          if (feedbackText) feedbackText.value = '';
          setTimeout(() => {
            feedbackAck.classList.add('hidden');
          }, 4000);
        });
      }
    })();

    function handleNewProject(e) {
      e.preventDefault();
      const name = document.getElementById('newProjectName').value;
      Ziproo.closeModal('newProjectModal');
      Ziproo.showToast(\`Project "\${name}" published successfully!\`, 'verified');
      e.target.reset();
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('index.html', page);
  console.log('Built index.html successfully!');
}

buildHome();
