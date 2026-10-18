/**
 * Ziproo Corporate Architecture - Interactive Prototype Runtime
 * Senior Full-Stack & UI/UX Interaction Engine
 */

(function () {
  'use strict';

  // State keys
  const THEME_KEY = 'ziproo_theme';
  const ADMIN_KEY = 'ziproo_admin_mode';
  const USER_KEY = 'ziproo_user';
  const REGISTERED_USERS_KEY = 'ziproo_registered_users';

  // Demo Credentials
  const DEMO_CREDENTIALS = {
    admin: {
      email: 'admin@ziproo.com',
      password: 'Admin@123',
      role: 'Admin',
      name: 'Admin Administrator'
    },
    visitor: {
      email: 'user@ziproo.com',
      password: 'User@123',
      role: 'Visitor',
      name: 'Verified Visitor'
    }
  };

  // --- Theme Management (Dark / Light) ---
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;

    applyTheme(isDark);

    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentlyDark = document.documentElement.classList.contains('dark');
        applyTheme(!currentlyDark);
      });
    });
  }

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined') || btn;
      if (icon) {
        icon.textContent = isDark ? 'light_mode' : 'dark_mode';
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }

  // --- Current User & Admin State ---
  function getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  function isAdminMode() {
    const user = getCurrentUser();
    if (user && user.role === 'Admin') return true;
    return localStorage.getItem(ADMIN_KEY) === 'true';
  }

  function applyAdminMode(isAdmin) {
    localStorage.setItem(ADMIN_KEY, isAdmin ? 'true' : 'false');

    // Update toggles and pill text
    document.querySelectorAll('[data-action="toggle-admin"]').forEach(btn => {
      const label = btn.querySelector('.admin-toggle-label');
      const dot = btn.querySelector('.admin-status-dot');
      if (label) {
        label.textContent = isAdmin ? 'Exit Admin' : 'Enable Admin';
      }
      if (dot) {
        dot.className = `w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-secondary-container animate-pulse' : 'bg-outline'}`;
      }
      btn.classList.toggle('bg-secondary-container', isAdmin);
      btn.classList.toggle('bg-primary', !isAdmin);
      btn.classList.toggle('text-on-secondary', isAdmin);
      btn.classList.toggle('text-on-primary', !isAdmin);
    });

    // Update Header Role Badges
    document.querySelectorAll('.role-indicator-badge').forEach(badge => {
      const text = badge.querySelector('.role-text');
      const ping = badge.querySelector('.role-ping');
      if (text) {
        text.textContent = isAdmin ? 'Admin' : 'Visitor';
      }
      if (ping) {
        ping.className = `w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-secondary-container'} animate-pulse`;
      }
    });

    // Toggle Admin-only controls & badges
    document.querySelectorAll('.admin-only-badge, .admin-only').forEach(el => {
      if (isAdmin) {
        el.classList.remove('hidden');
        el.classList.add('flex');
      } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
      }
    });

    // Enable / disable admin action buttons
    document.querySelectorAll('.admin-action-btn').forEach(btn => {
      if (isAdmin) {
        btn.classList.remove('opacity-60', 'pointer-events-none');
        btn.removeAttribute('disabled');
      }
    });

    // Reveal desktop Admin Dashboard link in navbar
    const adminNavLink = document.getElementById('nav-desktop-admin');
    if (adminNavLink) {
      if (isAdmin) {
        adminNavLink.classList.remove('hidden');
        adminNavLink.classList.add('inline-flex');
      } else {
        adminNavLink.classList.add('hidden');
        adminNavLink.classList.remove('inline-flex');
      }
    }

    const drawerAdminLink = document.getElementById('drawer-admin-link');
    if (drawerAdminLink) {
      if (isAdmin) {
        drawerAdminLink.classList.remove('hidden');
      } else {
        drawerAdminLink.classList.add('hidden');
      }
    }
  }

  // --- Universal Navigation & Auth State Sync ---
  function syncAuthUI() {
    const user = getCurrentUser();
    const isAdmin = isAdminMode();

    applyAdminMode(isAdmin);

    const desktopSignIn = document.getElementById('nav-desktop-signin');
    const headerSignInBtn = document.getElementById('btn-header-signin');
    const headerUserBadge = document.getElementById('header-user-badge');
    const headerUserAvatar = document.getElementById('header-user-avatar');
    const headerUserName = document.getElementById('header-user-name');

    const drawerSignInBtn = document.getElementById('drawer-signin-btn');
    const drawerUserInfo = document.getElementById('drawer-user-info');
    const drawerUserAvatar = document.getElementById('drawer-user-avatar');
    const drawerUserName = document.getElementById('drawer-user-name');
    const drawerUserEmail = document.getElementById('drawer-user-email');

    const dockAuthLink = document.getElementById('dock-auth-link');
    const dockAuthIcon = document.getElementById('dock-auth-icon');
    const dockAuthLabel = document.getElementById('dock-auth-label');

    const footerAuthLink = document.getElementById('footer-auth-link');

    const homeGuestPanel = document.getElementById('home-guest-panel');
    const homeLoggedInPanel = document.getElementById('home-loggedin-panel');

    if (user) {
      // User is LOGGED IN (Admin or Visitor)
      if (desktopSignIn) desktopSignIn.classList.add('hidden');
      if (headerSignInBtn) headerSignInBtn.classList.add('hidden');
      if (headerUserBadge) {
        headerUserBadge.classList.remove('hidden');
        headerUserBadge.classList.add('flex');
      }
      if (headerUserAvatar) headerUserAvatar.textContent = (user.name || user.role || 'U').charAt(0).toUpperCase();
      if (headerUserName) headerUserName.textContent = user.role === 'Admin' ? 'Admin' : (user.name || 'Visitor');

      if (drawerSignInBtn) drawerSignInBtn.classList.add('hidden');
      if (drawerUserInfo) {
        drawerUserInfo.classList.remove('hidden');
        drawerUserInfo.classList.add('flex');
      }
      if (drawerUserAvatar) drawerUserAvatar.textContent = (user.name || user.role || 'U').charAt(0).toUpperCase();
      if (drawerUserName) drawerUserName.textContent = user.name || (user.role === 'Admin' ? 'Admin' : 'Visitor');
      if (drawerUserEmail) drawerUserEmail.textContent = user.email || '';

      if (dockAuthLink) {
        dockAuthLink.href = 'javascript:void(0)';
        dockAuthLink.setAttribute('data-action', 'logout');
        if (dockAuthIcon) dockAuthIcon.textContent = 'logout';
        if (dockAuthLabel) dockAuthLabel.textContent = 'Logout';
      }

      if (footerAuthLink) {
        if (user.role === 'Admin') {
          footerAuthLink.textContent = 'Admin Dashboard';
          footerAuthLink.href = 'admin.html';
        } else {
          footerAuthLink.textContent = 'Logout';
          footerAuthLink.href = 'javascript:void(0)';
          footerAuthLink.setAttribute('data-action', 'logout');
        }
      }

      // Home page session banner & unlocked sections
      if (homeGuestPanel) homeGuestPanel.classList.add('hidden');
      if (homeLoggedInPanel) {
        homeLoggedInPanel.classList.remove('hidden');
        homeLoggedInPanel.classList.add('flex');
        document.querySelectorAll('.user-display-name').forEach(el => el.textContent = user.name || (user.role === 'Admin' ? 'Admin' : 'Visitor'));
        document.querySelectorAll('.user-display-email').forEach(el => el.textContent = user.email || '');
      }
    } else {
      // User is LOGGED OUT
      if (desktopSignIn) desktopSignIn.classList.remove('hidden');
      if (headerSignInBtn) headerSignInBtn.classList.remove('hidden');
      if (headerUserBadge) {
        headerUserBadge.classList.add('hidden');
        headerUserBadge.classList.remove('flex');
      }

      if (drawerSignInBtn) drawerSignInBtn.classList.remove('hidden');
      if (drawerUserInfo) {
        drawerUserInfo.classList.add('hidden');
        drawerUserInfo.classList.remove('flex');
      }

      if (dockAuthLink) {
        dockAuthLink.href = 'auth.html';
        dockAuthLink.removeAttribute('data-action');
        if (dockAuthIcon) dockAuthIcon.textContent = 'login';
        if (dockAuthLabel) dockAuthLabel.textContent = 'Sign In';
      }

      if (footerAuthLink) {
        footerAuthLink.textContent = 'Sign In';
        footerAuthLink.href = 'auth.html';
        footerAuthLink.removeAttribute('data-action');
      }

      if (homeGuestPanel) homeGuestPanel.classList.remove('hidden');
      if (homeLoggedInPanel) {
        homeLoggedInPanel.classList.add('hidden');
        homeLoggedInPanel.classList.remove('flex');
      }
    }
  }

  // --- Auth Verification Logic ---
  function validateSignIn(email, password) {
    if (!email || !password || !email.trim() || !password.trim()) {
      return { valid: false, error: 'Email and password required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: 'Enter a valid email' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check Admin demo credentials
    if (cleanEmail === DEMO_CREDENTIALS.admin.email.toLowerCase() && password === DEMO_CREDENTIALS.admin.password) {
      return { valid: true, user: DEMO_CREDENTIALS.admin, isAdmin: true, target: 'admin.html' };
    }

    // Check Visitor demo credentials
    if (cleanEmail === DEMO_CREDENTIALS.visitor.email.toLowerCase() && password === DEMO_CREDENTIALS.visitor.password) {
      return { valid: true, user: DEMO_CREDENTIALS.visitor, isAdmin: false, target: 'index.html' };
    }

    // Check custom registered users from localStorage
    try {
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const found = registered.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (found) {
        return {
          valid: true,
          user: { role: 'Visitor', email: found.email, name: found.name || 'Registered Visitor' },
          isAdmin: false,
          target: 'index.html'
        };
      }
    } catch (e) {}

    return { valid: false, error: 'Incorrect email or password' };
  }

  function executeSignIn(email, password, feedbackEl) {
    const result = validateSignIn(email, password);

    if (!result.valid) {
      if (feedbackEl) {
        feedbackEl.textContent = result.error;
        feedbackEl.className = 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium block';
        feedbackEl.classList.remove('hidden');
      }
      return false;
    }

    // Success
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    localStorage.setItem(ADMIN_KEY, result.isAdmin ? 'true' : 'false');

    if (feedbackEl) {
      feedbackEl.textContent = result.isAdmin
        ? 'Admin credentials verified. Initializing Operations Console...'
        : 'Welcome back! Unlocking Ziproo Enterprise Gateway...';
      feedbackEl.className = 'text-xs p-3 rounded-xl mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium block';
      feedbackEl.classList.remove('hidden');
    }

    showToast(
      result.isAdmin ? 'Admin session authorized. Edit mode ON.' : 'Logged in successfully',
      result.isAdmin ? 'admin_panel_settings' : 'verified_user'
    );

    setTimeout(() => {
      window.location.href = result.target;
    }, 450);

    return true;
  }

  function executeSignUp(name, email, password, feedbackEl) {
    if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
      if (feedbackEl) {
        feedbackEl.textContent = 'Email and password required';
        feedbackEl.className = 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium block';
        feedbackEl.classList.remove('hidden');
      }
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      if (feedbackEl) {
        feedbackEl.textContent = 'Enter a valid email';
        feedbackEl.className = 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium block';
        feedbackEl.classList.remove('hidden');
      }
      return false;
    }

    // Save registered user
    try {
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      registered.push({ name: name.trim(), email: email.trim().toLowerCase(), password: password.trim() });
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    } catch (e) {}

    const newUser = { role: 'Visitor', email: email.trim().toLowerCase(), name: name.trim() };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(ADMIN_KEY, 'false');

    if (feedbackEl) {
      feedbackEl.textContent = 'Account created successfully! Redirecting to Home...';
      feedbackEl.className = 'text-xs p-3 rounded-xl mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium block';
      feedbackEl.classList.remove('hidden');
    }

    showToast('Account provisioned! Welcome to Ziproo.', 'how_to_reg');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 450);

    return true;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(ADMIN_KEY, 'false');
    showToast('Logged out successfully', 'logout');
    syncAuthUI();
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 350);
  }

  // --- Mobile Drawer Menu ---
  function initDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const openBtns = document.querySelectorAll('[data-action="open-menu"]');
    const closeBtns = document.querySelectorAll('[data-action="close-menu"]');

    function open() {
      if (!drawer) return;
      drawer.classList.remove('translate-x-full');
      backdrop?.classList.remove('hidden');
      backdrop?.classList.add('opacity-100');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      if (!drawer) return;
      drawer.classList.add('translate-x-full');
      backdrop?.classList.remove('opacity-100');
      backdrop?.classList.add('hidden');
      document.body.style.overflow = '';
    }

    openBtns.forEach(b => b.addEventListener('click', open));
    closeBtns.forEach(b => b.addEventListener('click', close));
    backdrop?.addEventListener('click', close);
  }

  // --- Universal Toast Notification ---
  let toastTimer = null;
  function showToast(message, icon = 'info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-primary text-on-primary shadow-2xl transition-all duration-300 pointer-events-none opacity-0 translate-y-6 max-w-sm w-[90%] border border-surface-container-high/40';
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-secondary-container flex-shrink-0" id="global-toast-icon"></span>
        <span class="font-body-sm text-[13px] leading-snug flex-1 font-medium" id="global-toast-msg"></span>
      `;
      document.body.appendChild(toast);
    }

    const iconEl = toast.querySelector('#global-toast-icon');
    const msgEl = toast.querySelector('#global-toast-msg');
    if (iconEl) iconEl.textContent = icon;
    if (msgEl) msgEl.textContent = message;

    clearTimeout(toastTimer);
    toast.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
    }, 3500);
  }

  // --- Global Modals Management ---
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  function openEditLeaderModal(id, name, role, bio, credentials) {
    const modal = document.getElementById('modal-edit-leader');
    if (!modal) return;
    const idInput = document.getElementById('modal-leader-id');
    const nameInput = document.getElementById('modal-leader-name');
    const roleInput = document.getElementById('modal-leader-role');
    const bioInput = document.getElementById('modal-leader-bio');
    const credInput = document.getElementById('modal-leader-credentials');
    const headerEl = document.getElementById('modal-leader-header');

    if (idInput) idInput.value = id || '';
    if (nameInput) nameInput.value = name || '';
    if (roleInput) roleInput.value = role || '';
    if (bioInput) bioInput.value = bio || '';
    if (credInput) credInput.value = credentials || '';
    if (headerEl) headerEl.textContent = name ? `Edit ${name.split(' ')[0]}'s Profile` : 'Edit Executive Profile';

    openModal('modal-edit-leader');
  }

  // Modal Submit Handlers
  function handleAddProject(e) {
    e.preventDefault();
    const name = document.getElementById('modal-project-name')?.value || 'Project';
    closeModal('modal-add-project');
    showToast(`Project "${name}" added successfully!`, 'verified');
    e.target.reset();
  }

  function handleAddBranch(e) {
    e.preventDefault();
    const name = document.getElementById('modal-branch-name')?.value || 'Branch';
    closeModal('modal-add-branch');
    showToast(`Branch "${name}" added successfully!`, 'store');
    e.target.reset();
  }

  function handleAddUpdate(e) {
    e.preventDefault();
    const title = document.getElementById('modal-update-title')?.value || 'Update';
    closeModal('modal-add-update');
    showToast(`Update "${title}" posted successfully!`, 'feed');
    e.target.reset();
  }

  function handleEditLeader(e) {
    e.preventDefault();
    const name = document.getElementById('modal-leader-name')?.value || 'Executive';
    const role = document.getElementById('modal-leader-role')?.value || '';
    const bio = document.getElementById('modal-leader-bio')?.value || '';
    const cred = document.getElementById('modal-leader-credentials')?.value || '';
    const id = document.getElementById('modal-leader-id')?.value;

    closeModal('modal-edit-leader');
    showToast(`Profile for ${name} updated successfully!`, 'verified');

    // Update in-page card if present
    if (id) {
      const card = document.getElementById(id);
      if (card) {
        const nameEl = card.querySelector('.leader-card-name');
        const roleEl = card.querySelector('.leader-card-role');
        const bioEl = card.querySelector('.leader-card-bio');
        const credEl = card.querySelector('.leader-card-creds');
        if (nameEl) nameEl.textContent = name;
        if (roleEl) roleEl.textContent = role;
        if (bioEl) bioEl.textContent = bio;
        if (credEl) credEl.textContent = cred;
      }
    }
  }

  function handleEditSocial(e) {
    e.preventDefault();
    closeModal('modal-edit-social');
    showToast('Social media links updated successfully!', 'share');
  }

  // --- Client-Side Routing Engine ---
  const ROUTE_MAP = {
    '/': { file: 'index.html', id: 'home', title: 'Ziproo Corporate - Sovereign Identity & Enterprise Architecture' },
    '/index.html': { file: 'index.html', id: 'home', title: 'Ziproo Corporate - Sovereign Identity & Enterprise Architecture' },
    '/branches': { file: 'branches.html', id: 'branches', title: 'Global Branches & Locations - Ziproo Enterprise Architecture' },
    '/branches.html': { file: 'branches.html', id: 'branches', title: 'Global Branches & Locations - Ziproo Enterprise Architecture' },
    '/updates': { file: 'updates.html', id: 'updates', title: 'About & Daily Updates - Ziproo Enterprise Architecture' },
    '/updates.html': { file: 'updates.html', id: 'updates', title: 'About & Daily Updates - Ziproo Enterprise Architecture' },
    '/leadership': { file: 'leaders.html', id: 'leadership', title: 'Executive Leadership - Ziproo Enterprise Architecture' },
    '/leaders': { file: 'leaders.html', id: 'leadership', title: 'Executive Leadership - Ziproo Enterprise Architecture' },
    '/leaders.html': { file: 'leaders.html', id: 'leadership', title: 'Executive Leadership - Ziproo Enterprise Architecture' },
    '/connect': { file: 'portal.html', id: 'connect', title: 'Connect with ZIPROO - Official Social Media & Community Gateway' },
    '/portal': { file: 'portal.html', id: 'connect', title: 'Connect with ZIPROO - Official Social Media & Community Gateway' },
    '/portal.html': { file: 'portal.html', id: 'connect', title: 'Connect with ZIPROO - Official Social Media & Community Gateway' },
    '/projects': { file: 'projects.html', id: 'projects', title: 'Portfolio & Deployments - Ziproo Enterprise Architecture' },
    '/projects.html': { file: 'projects.html', id: 'projects', title: 'Portfolio & Deployments - Ziproo Enterprise Architecture' }
  };

  const pageCache = {};

  function normalizeRoute(path) {
    if (!path) return '/';
    let clean = path.split('?')[0].split('#')[0];
    if (clean === '' || clean === '/home') return '/';
    if (clean === '/leaders') return '/leadership';
    if (clean === '/portal') return '/connect';
    return clean;
  }

  function getActiveRouteId(pathname) {
    const clean = normalizeRoute(pathname);
    return (ROUTE_MAP[clean] || ROUTE_MAP['/']).id;
  }

  function updateActiveNavTabs(activeTabId) {
    const normalized = activeTabId === 'leaders' ? 'leadership' : activeTabId;
    
    // 1. Top Navbar Pills
    document.querySelectorAll('.nav-tab[data-tab]').forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const isActive = tabId === normalized;
      if (isActive) {
        tab.className = 'nav-tab text-label-md font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 text-secondary font-semibold bg-secondary/10';
      } else {
        tab.className = 'nav-tab text-label-md font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container';
      }
    });

    // 2. Mobile Drawer Items
    document.querySelectorAll('.drawer-nav-tab[data-tab]').forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const isActive = tabId === normalized;
      if (isActive) {
        tab.classList.add('bg-secondary/10', 'text-secondary', 'font-bold');
        tab.classList.remove('text-on-surface-variant', 'hover:bg-surface-container', 'hover:text-on-surface');
      } else {
        tab.classList.remove('bg-secondary/10', 'text-secondary', 'font-bold');
        tab.classList.add('text-on-surface-variant', 'hover:bg-surface-container', 'hover:text-on-surface');
      }
    });

    // 3. Bottom Dock Items
    document.querySelectorAll('.dock-nav-tab[data-tab]').forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const isActive = tabId === normalized;
      if (isActive) {
        tab.classList.add('text-secondary', 'font-semibold');
        tab.classList.remove('text-on-surface-variant', 'hover:text-on-surface');
      } else {
        tab.classList.remove('text-secondary', 'font-semibold');
        tab.classList.add('text-on-surface-variant', 'hover:text-on-surface');
      }
    });

    // 4. Footer Links
    document.querySelectorAll('.footer-nav-tab[data-tab]').forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const isActive = tabId === normalized;
      if (isActive) {
        tab.classList.add('text-secondary', 'font-bold');
        tab.classList.remove('text-on-surface-variant');
      } else {
        tab.classList.remove('text-secondary', 'font-bold');
        tab.classList.add('text-on-surface-variant');
      }
    });
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.add('translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('hidden');
    }
    document.body.style.overflow = '';
  }

  async function navigateTo(path, push = true) {
    const cleanRoute = normalizeRoute(path);
    const routeConfig = ROUTE_MAP[cleanRoute] || ROUTE_MAP['/'];

    if (push && window.location.pathname !== cleanRoute) {
      window.history.pushState({ route: cleanRoute }, '', cleanRoute);
    }

    updateActiveNavTabs(routeConfig.id);
    closeMobileDrawer();

    let cached = pageCache[routeConfig.file];
    if (!cached) {
      try {
        const resp = await fetch(routeConfig.file);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('main')?.innerHTML || '';
        const title = doc.querySelector('title')?.textContent || routeConfig.title;
        cached = { title, mainHtml: mainContent };
        pageCache[routeConfig.file] = cached;
      } catch (err) {
        console.warn('Router fetch fallback:', err);
        window.location.href = routeConfig.file;
        return;
      }
    }

    const mainEl = document.querySelector('main');
    if (mainEl && cached.mainHtml) {
      mainEl.style.transition = 'opacity 0.1s ease-out';
      mainEl.style.opacity = '0';
      setTimeout(() => {
        mainEl.innerHTML = cached.mainHtml;
        document.title = cached.title;
        mainEl.style.opacity = '1';
        window.scrollTo({ top: 0, behavior: 'instant' });
        initPageInteractions(routeConfig.id);
        syncAuthUI();
        applyAdminMode(isAdminMode());
      }, 100);
    }
  }

  // Page-specific interaction engines
  function initHomeInteractions() {
    // 1. Auth Tabs Switcher
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

    // 2. Demo credentials prefill button
    document.getElementById('home-btn-demo')?.addEventListener('click', () => {
      const emailEl = document.getElementById('home-signin-email');
      const pwdEl = document.getElementById('home-signin-password');
      if (emailEl) emailEl.value = 'alex.vance@ziproo-network.io';
      if (pwdEl) pwdEl.value = 'ZiprooDemo2026!';
      showToast('Demo credentials prefilled. Click "Sign In to Ziproo".', 'info');
    });

    // 3. Forms
    panelSignIn?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('home-signin-email')?.value.trim();
      const password = document.getElementById('home-signin-password')?.value;
      const btn = document.getElementById('home-btn-signin');
      const orig = btn ? btn.innerHTML : 'Sign In';

      if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Authenticating with Supabase...</span>';

      if (window.ZiprooAuth) {
        const res = await window.ZiprooAuth.signIn({ email, password });
        if (res.error) {
          if (authFeedback) {
            authFeedback.textContent = res.error.message || 'Authentication failed.';
            authFeedback.className = 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20';
            authFeedback.classList.remove('hidden');
          }
          if (btn) btn.innerHTML = orig;
        } else {
          showToast('Welcome to Ziproo Enterprise Network', 'verified');
          syncAuthUI();
        }
      }
    });

    panelSignUp?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('home-signup-name')?.value.trim();
      const email = document.getElementById('home-signup-email')?.value.trim();
      const password = document.getElementById('home-signup-password')?.value;
      const btn = document.getElementById('home-btn-signup');
      const orig = btn ? btn.innerHTML : 'Create Account';

      if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Registering with Supabase...</span>';

      if (window.ZiprooAuth) {
        const res = await window.ZiprooAuth.signUp({ email, password, fullName });
        if (res.error) {
          if (authFeedback) {
            authFeedback.textContent = res.error.message || 'Registration failed.';
            authFeedback.className = 'text-xs p-3 rounded-xl mb-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20';
            authFeedback.classList.remove('hidden');
          }
          if (btn) btn.innerHTML = orig;
        } else {
          showToast('Account registered successfully on Supabase', 'how_to_reg');
          syncAuthUI();
        }
      }
    });

    // 4. Project creation trigger
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      if (!isAdminMode()) {
        showToast('Please enable Admin Preview to add new projects', 'lock');
        return;
      }
      openModal('newProjectModal');
    });

    document.getElementById('admin-mode-toggle')?.setAttribute('data-action', 'toggle-admin');
  }

  function initBranchesInteractions() {
    const filterButtons = document.querySelectorAll('.filter-chip');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary', 'active-filter');
          b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
        });
        btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
        btn.classList.add('bg-primary', 'text-on-primary', 'active-filter');

        const filter = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.branch-card');
        cards.forEach(card => {
          const region = card.getAttribute('data-region');
          if (filter === 'all' || region === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    const toggleBtn = document.getElementById('toggleDemoEmpty');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const emptyState = document.getElementById('emptyStateContainer');
        const branchesWrap = document.getElementById('branchesWrapper');
        const isShowingEmpty = emptyState && !emptyState.classList.contains('hidden');
        if (isShowingEmpty) {
          emptyState?.classList.add('hidden');
          emptyState?.classList.remove('flex');
          branchesWrap?.classList.remove('hidden');
        } else {
          branchesWrap?.classList.add('hidden');
          emptyState?.classList.remove('hidden');
          emptyState?.classList.add('flex');
        }
      });
    }
  }

  function initUpdatesInteractions() {
    // Updates live feed interactions
  }

  function initLeadershipInteractions() {
    // Leadership modals and profiles
  }

  function initConnectInteractions() {
    const container = document.getElementById('social-cards-container');
    if (container && window.ZIPROO_SOCIAL_CONFIG && window.ZIPROO_SOCIAL_CONFIG.platforms) {
      const platforms = window.ZIPROO_SOCIAL_CONFIG.platforms;
      container.innerHTML = platforms.map(function(p) {
        return '<article class="group relative flex flex-col justify-between bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-xl hover:border-secondary-container/40 transition-all duration-300">' +
          '<div>' +
            '<div class="flex items-start justify-between mb-4">' +
              '<div class="w-12 h-12 rounded-2xl flex items-center justify-center ' + p.accentBg + ' transition-transform group-hover:scale-105 shadow-xs">' +
                p.iconSvg +
              '</div>' +
              '<span class="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-container font-medium text-outline">' +
                p.handle +
              '</span>' +
            '</div>' +
            '<h3 class="font-headline-sm text-lg font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">' +
              p.name +
            '</h3>' +
            '<p class="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">' +
              p.description +
            '</p>' +
          '</div>' +
          '<div class="pt-2 border-t border-outline-variant/20 flex items-center justify-between">' +
            '<span class="text-[11px] font-medium text-outline flex items-center gap-1">' +
              '<span class="material-symbols-outlined text-[14px] text-emerald-500">verified</span>' +
              'Official Link' +
            '</span>' +
            '<a href="' + p.url + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 ' + p.btnClass + '">' +
              '<span>' + p.btnText + '</span>' +
              '<span class="material-symbols-outlined text-[15px]">arrow_outward</span>' +
            '</a>' +
          '</div>' +
        '</article>';
      }).join('');
    }
  }

  function initPageInteractions(pageId) {
    if (pageId === 'home') {
      initHomeInteractions();
    } else if (pageId === 'branches') {
      initBranchesInteractions();
    } else if (pageId === 'updates') {
      initUpdatesInteractions();
    } else if (pageId === 'leadership') {
      initLeadershipInteractions();
    } else if (pageId === 'connect') {
      initConnectInteractions();
    }
    initPasswordToggles();
  }

  // --- Password Visibility Toggles ---
  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle="password"], #toggle-pwd-btn, .toggle-pwd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const container = btn.closest('.relative') || btn.parentElement;
        const input = container ? container.querySelector('input[type="password"], input[type="text"]') : null;
        const icon = btn.querySelector('.material-symbols-outlined') || btn;

        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          if (icon && icon.classList.contains('material-symbols-outlined')) {
            icon.textContent = isPassword ? 'visibility_off' : 'visibility';
          }
        }
      });
    });
  }

  // --- Initialize Universal Listeners ---
  function initUniversalInteractions() {
    // 1. Admin mode toggles
    document.querySelectorAll('[data-action="toggle-admin"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = isAdminMode();
        applyAdminMode(!cur);
        showToast(
          !cur ? 'Elevated to Enterprise Admin Preview (Edit mode ON)' : 'Reverted to Standard Visitor Mode',
          !cur ? 'admin_panel_settings' : 'verified_user'
        );
      });
    });

    // 2. Supabase Config Trigger
    document.querySelectorAll('[data-action="open-supabase-config"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.ZiprooAuth && typeof window.ZiprooAuth.openConfigModal === 'function') {
          window.ZiprooAuth.openConfigModal();
        }
      });
    });

    // 3. Universal Logout action
    document.querySelectorAll('[data-action="logout"], [data-action="supabase-signout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });

    // 4. Modal close on backdrop or ESC
    document.querySelectorAll('.modal-dialog-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hidden');
          backdrop.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-dialog-backdrop:not(.hidden)').forEach(m => {
          m.classList.add('hidden');
          m.classList.remove('flex');
          document.body.style.overflow = '';
        });
      }
    });

    // 5. Intercept internal navigation for SPA transitions
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');
      const isAction = link.hasAttribute('data-action');

      if (!href || isAction || target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Hash scroll handling on Home
      if (href === '#auth-section' || href === '/#auth-section' || href === 'index.html#auth-section') {
        e.preventDefault();
        const currentRoute = getActiveRouteId(window.location.pathname);
        if (currentRoute !== 'home') {
          navigateTo('/').then(() => {
            setTimeout(() => {
              document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          });
        } else {
          document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // Check if it's an internal route
      const cleanHref = href.split('?')[0].split('#')[0];
      if (ROUTE_MAP[cleanHref]) {
        e.preventDefault();
        navigateTo(cleanHref);
      }
    });

    // 6. Listen to Popstate for browser Back & Forward buttons
    window.addEventListener('popstate', () => {
      navigateTo(window.location.pathname, false);
    });
  }

  // Expose Ziproo APIs to global scope
  window.Ziproo = {
    showToast,
    applyTheme,
    applyAdminMode,
    syncAuthUI,
    openModal,
    closeModal,
    navigateTo,
    openEditLeaderModal,
    handleAddProject,
    handleAddBranch,
    handleAddUpdate,
    handleEditLeader,
    handleEditSocial,
    executeSignIn,
    executeSignUp,
    logout,
    getCurrentUser,
    DEMO_CREDENTIALS
  };

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDrawer();
    initPasswordToggles();
    syncAuthUI();
    initUniversalInteractions();

    // Cache initial main content and sync active navbar tabs
    const initialPath = window.location.pathname || '/';
    const cleanInitial = normalizeRoute(initialPath);
    const activeRoute = ROUTE_MAP[cleanInitial] || ROUTE_MAP['/'];
    
    const initialMain = document.querySelector('main')?.innerHTML;
    if (initialMain) {
      pageCache[activeRoute.file] = {
        title: document.title,
        mainHtml: initialMain
      };
    }

    updateActiveNavTabs(activeRoute.id);
    initPageInteractions(activeRoute.id);
  });
})();

