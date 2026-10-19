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
    if (window.ZiprooAuth && typeof window.ZiprooAuth.isAdmin === 'function') {
      return window.ZiprooAuth.isAdmin();
    }
    const user = getCurrentUser();
    return !!(user && (user.role || '').toLowerCase() === 'admin');
  }

  function applyAdminMode(isAdmin) {
    if (isAdmin) {
      localStorage.setItem(ADMIN_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }

    // Hide/show admin mode toggles (completely hidden for non-admins)
    document.querySelectorAll('[data-action="toggle-admin"]').forEach(btn => {
      if (isAdmin) {
        btn.classList.remove('hidden');
        btn.style.display = '';
      } else {
        btn.classList.add('hidden');
        btn.style.setProperty('display', 'none', 'important');
      }
    });

    // Update Header Role Badges
    document.querySelectorAll('.role-indicator-badge').forEach(badge => {
      const text = badge.querySelector('.role-text');
      const ping = badge.querySelector('.role-ping');
      if (text) {
        text.textContent = isAdmin ? 'Admin' : 'User';
      }
      if (ping) {
        ping.className = `w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-secondary-container'} animate-pulse`;
      }
      if (!isAdmin) {
        badge.classList.add('hidden');
        badge.style.setProperty('display', 'none', 'important');
      } else {
        badge.classList.remove('hidden');
        badge.style.display = '';
      }
    });

    // Render all edit/add/delete controls ONLY when isAdmin is true (completely hidden from DOM flow, not merely disabled)
    const adminElementSelectors = [
      '.admin-only',
      '.admin-only-badge',
      '.admin-action-btn',
      '.admin-item-menu',
      '#btn-add-project',
      '#toggleDemoEmpty',
      '[data-action="edit"]',
      '[data-action="delete"]',
      '[data-action="add"]',
      '[data-admin-only="true"]'
    ];

    document.querySelectorAll(adminElementSelectors.join(', ')).forEach(el => {
      if (isAdmin) {
        el.classList.remove('hidden', 'opacity-60', 'pointer-events-none');
        el.style.display = '';
        el.removeAttribute('disabled');
      } else {
        el.classList.add('hidden');
        el.style.setProperty('display', 'none', 'important');
        el.setAttribute('disabled', 'true');
      }
    });

    // Reveal desktop Admin Dashboard link in navbar
    const adminNavLink = document.getElementById('nav-desktop-admin');
    if (adminNavLink) {
      if (isAdmin) {
        adminNavLink.classList.remove('hidden');
        adminNavLink.classList.add('inline-flex');
        adminNavLink.style.display = '';
      } else {
        adminNavLink.classList.add('hidden');
        adminNavLink.classList.remove('inline-flex');
        adminNavLink.style.display = 'none';
      }
    }

    const drawerAdminLink = document.getElementById('drawer-admin-link');
    if (drawerAdminLink) {
      if (isAdmin) {
        drawerAdminLink.classList.remove('hidden');
        drawerAdminLink.style.display = '';
      } else {
        drawerAdminLink.classList.add('hidden');
        drawerAdminLink.style.display = 'none';
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
        footerAuthLink.textContent = 'Logout';
        footerAuthLink.href = 'javascript:void(0)';
        footerAuthLink.setAttribute('data-action', 'logout');
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
      return { valid: true, user: DEMO_CREDENTIALS.visitor, isAdmin: false, target: 'home.html' };
    }

    // Check custom registered users from localStorage
    try {
      const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
      const found = registered.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (found) {
        return {
          valid: true,
          user: { role: found.role || 'Visitor', email: found.email, name: found.name || 'Member' },
          isAdmin: found.role === 'Admin',
          target: found.role === 'Admin' ? 'admin.html' : 'home.html'
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
      result.isAdmin ? 'Admin session authorized. Launching console.' : 'Logged in successfully',
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
      registered.push({ name: name.trim(), email: email.trim().toLowerCase(), password: password.trim(), role: 'Visitor' });
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
      window.location.href = 'home.html';
    }, 450);

    return true;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem('ziproo_admin_token');
    sessionStorage.removeItem('ziproo_admin_token');
    showToast('Logged out of Ziproo Network', 'logout');
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
    const adminModals = ['modal-add-project', 'modal-add-branch', 'modal-add-update', 'modal-edit-leader', 'modal-edit-social', 'newProjectModal', 'postUpdateModal', 'addBranchModal', 'adminModal'];
    if (adminModals.includes(id) && !isAdminMode()) {
      showToast('Access Denied: Admin clearance required.', 'lock');
      return;
    }
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
  // --- Client-Side Routing Engine ---
  const ROUTE_MAP = {
    '/': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/index.html': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/auth': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/auth.html': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/login': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/signup': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/admin-login': { file: 'index.html', id: 'auth', title: 'Ziproo - Sovereign Identity Gateway' },
    '/home': { file: 'home.html', id: 'home', title: 'Ziproo Corporate - Sovereign Identity & Enterprise Architecture' },
    '/home.html': { file: 'home.html', id: 'home', title: 'Ziproo Corporate - Sovereign Identity & Enterprise Architecture' },
    '/admin': { file: 'admin.html', id: 'admin', title: 'Operations Console & Admin Control Room - Ziproo' },
    '/admin.html': { file: 'admin.html', id: 'admin', title: 'Operations Console & Admin Control Room - Ziproo' },
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

  const BASE_PATH = window.location.pathname.startsWith('/ziproo-corporate') ? '/ziproo-corporate' : '';
  const pageCache = {};

  function normalizeRoute(path) {
    if (!path) return '/';
    let clean = path.split('?')[0].split('#')[0];
    if (clean.startsWith('/ziproo-corporate')) {
      clean = clean.replace(/^\/ziproo-corporate/, '') || '/';
    }
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
    const user = getCurrentUser();

    // Route Protection Guard
    const PROTECTED_IDS = ['home', 'branches', 'updates', 'leadership', 'connect', 'projects', 'admin'];
    if (PROTECTED_IDS.includes(routeConfig.id) && !user) {
      window.location.href = `index.html?auth=required&target=${encodeURIComponent(cleanRoute)}`;
      return;
    }

    if (routeConfig.id === 'admin' && (!user || user.role !== 'Admin')) {
      showToast('Access Denied: Administrator clearance required.', 'lock');
      window.location.href = 'home.html';
      return;
    }

    if (routeConfig.id === 'auth' && user) {
      window.location.href = user.role === 'Admin' ? 'admin.html' : 'home.html';
      return;
    }

    const targetUrl = (BASE_PATH + cleanRoute) || '/';
    if (push && window.location.pathname !== targetUrl) {
      window.history.pushState({ route: cleanRoute }, '', targetUrl);
    }

    updateActiveNavTabs(routeConfig.id);
    closeMobileDrawer();

    let cached = pageCache[routeConfig.file];
    if (!cached) {
      try {
        const fetchTarget = BASE_PATH ? `${BASE_PATH}/${routeConfig.file}` : routeConfig.file;
        const resp = await fetch(fetchTarget);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('main')?.innerHTML || '';
        const title = doc.querySelector('title')?.textContent || routeConfig.title;
        cached = { title, mainHtml: mainContent };
        pageCache[routeConfig.file] = cached;
      } catch (err) {
        console.warn('Router fetch fallback:', err);
        const fallbackTarget = BASE_PATH ? `${BASE_PATH}/${routeConfig.file}` : routeConfig.file;
        window.location.href = fallbackTarget;
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

  // --- Auth Gateway Interactions (Dedicated Authentication Screen) ---
  function initAuthGatewayInteractions() {
    const btnModeUser = document.getElementById('btn-mode-user');
    const btnModeAdmin = document.getElementById('btn-mode-admin');
    const secUserAuth = document.getElementById('section-user-auth');
    const secAdminAuth = document.getElementById('section-admin-auth');

    if (!btnModeUser || !secUserAuth) return;

    const subTabSignIn = document.getElementById('user-subtab-signin');
    const subTabSignUp = document.getElementById('user-subtab-signup');
    const cardSignIn = document.getElementById('card-user-signin');
    const cardSignUp = document.getElementById('card-user-signup');
    const cardForgot = document.getElementById('card-user-forgot');

    const globalFeedback = document.getElementById('auth-global-feedback');
    const feedbackIcon = document.getElementById('auth-feedback-icon');
    const feedbackText = document.getElementById('auth-feedback-text');

    function showFeedback(msg, type = 'error') {
      if (!globalFeedback || !feedbackText) return;
      feedbackText.textContent = msg;
      if (type === 'error') {
        globalFeedback.className = 'text-xs p-3.5 rounded-2xl font-medium border text-left flex items-start gap-2.5 bg-error-container/30 text-error border-error/30';
        if (feedbackIcon) feedbackIcon.textContent = 'error';
      } else if (type === 'success') {
        globalFeedback.className = 'text-xs p-3.5 rounded-2xl font-medium border text-left flex items-start gap-2.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
        if (feedbackIcon) feedbackIcon.textContent = 'check_circle';
      } else {
        globalFeedback.className = 'text-xs p-3.5 rounded-2xl font-medium border text-left flex items-start gap-2.5 bg-surface-container text-on-surface border-outline-variant/30';
        if (feedbackIcon) feedbackIcon.textContent = 'info';
      }
      globalFeedback.classList.remove('hidden');
    }

    function clearFeedback() {
      if (globalFeedback) globalFeedback.classList.add('hidden');
    }

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const isAuthRequired = urlParams.get('auth') === 'required';
    const targetRedirect = urlParams.get('target');

    if (isAuthRequired) {
      const notice = document.getElementById('auth-redirect-notice');
      const noticeMsg = document.getElementById('auth-redirect-msg');
      if (notice) notice.classList.remove('hidden');
      if (noticeMsg && targetRedirect) {
        noticeMsg.textContent = `Access to "${decodeURIComponent(targetRedirect)}" requires verified member credentials. Please sign in below.`;
      }
    }

    // Toggle Modes (User vs Admin)
    function setMode(mode) {
      clearFeedback();
      if (mode === 'admin') {
        btnModeAdmin?.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
        btnModeAdmin?.classList.remove('text-on-surface-variant', 'font-semibold');
        btnModeUser?.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
        btnModeUser?.classList.add('text-on-surface-variant', 'font-semibold');

        secAdminAuth?.classList.remove('hidden');
        secUserAuth?.classList.add('hidden');
      } else {
        btnModeUser?.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
        btnModeUser?.classList.remove('text-on-surface-variant', 'font-semibold');
        btnModeAdmin?.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm', 'font-bold');
        btnModeAdmin?.classList.add('text-on-surface-variant', 'font-semibold');

        secUserAuth?.classList.remove('hidden');
        secAdminAuth?.classList.add('hidden');
      }
    }

    btnModeUser?.addEventListener('click', () => setMode('user'));
    btnModeAdmin?.addEventListener('click', () => setMode('admin'));

    // Toggle User Subtabs (Sign In vs Create Account vs Forgot)
    function setUserSubtab(tab) {
      clearFeedback();
      if (tab === 'signup') {
        subTabSignUp?.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
        subTabSignUp?.classList.remove('text-on-surface-variant', 'font-semibold');
        subTabSignIn?.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
        subTabSignIn?.classList.add('text-on-surface-variant', 'font-semibold');

        cardSignUp?.classList.remove('hidden');
        cardSignIn?.classList.add('hidden');
        cardForgot?.classList.add('hidden');
      } else if (tab === 'forgot') {
        cardForgot?.classList.remove('hidden');
        cardSignIn?.classList.add('hidden');
        cardSignUp?.classList.add('hidden');
      } else {
        subTabSignIn?.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
        subTabSignIn?.classList.remove('text-on-surface-variant', 'font-semibold');
        subTabSignUp?.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'font-bold');
        subTabSignUp?.classList.add('text-on-surface-variant', 'font-semibold');

        cardSignIn?.classList.remove('hidden');
        cardSignUp?.classList.add('hidden');
        cardForgot?.classList.add('hidden');
      }
    }

    subTabSignIn?.addEventListener('click', () => setUserSubtab('signin'));
    subTabSignUp?.addEventListener('click', () => setUserSubtab('signup'));
    document.getElementById('btn-show-forgot-pwd')?.addEventListener('click', () => setUserSubtab('forgot'));
    document.getElementById('btn-back-to-signin')?.addEventListener('click', () => setUserSubtab('signin'));

    if (viewParam === 'admin' || window.location.pathname.includes('admin-login')) {
      setMode('admin');
    } else if (viewParam === 'signup' || window.location.pathname.includes('signup')) {
      setUserSubtab('signup');
    }

    // Live Password Strength Meter
    const signupPwdInput = document.getElementById('signup-password');
    const meter1 = document.getElementById('meter-bar-1');
    const meter2 = document.getElementById('meter-bar-2');
    const meter3 = document.getElementById('meter-bar-3');
    const meterText = document.getElementById('meter-text');

    if (signupPwdInput && meter1 && meter2 && meter3) {
      signupPwdInput.addEventListener('input', () => {
        const val = signupPwdInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) score++;

        meter1.className = 'h-full flex-1 rounded-full transition-colors ' + (score >= 1 ? 'bg-secondary-container' : 'bg-surface-container-highest');
        meter2.className = 'h-full flex-1 rounded-full transition-colors ' + (score >= 2 ? 'bg-secondary-container' : 'bg-surface-container-highest');
        meter3.className = 'h-full flex-1 rounded-full transition-colors ' + (score >= 3 ? 'bg-emerald-500' : 'bg-surface-container-highest');

        if (score === 0) meterText.textContent = 'Strength: Minimum 8 chars';
        else if (score === 1) meterText.textContent = 'Strength: Fair (add number & uppercase)';
        else if (score === 2) meterText.textContent = 'Strength: Good (add special symbol)';
        else meterText.textContent = 'Strength: Strong (Tier III Clearance)';
      });
    }

    // Prefill helper buttons
    document.getElementById('btn-prefill-user')?.addEventListener('click', () => {
      const emailEl = document.getElementById('signin-email');
      const pwdEl = document.getElementById('signin-password');
      if (emailEl) emailEl.value = 'user@ziproo.com';
      if (pwdEl) pwdEl.value = 'User@123';
      showToast('Demo User credentials filled: user@ziproo.com / User@123', 'auto_fix_high');
    });

    document.getElementById('btn-prefill-admin')?.addEventListener('click', () => {
      const emailEl = document.getElementById('admin-email');
      const pwdEl = document.getElementById('admin-password');
      if (emailEl) emailEl.value = 'admin@ziproo.com';
      if (pwdEl) pwdEl.value = 'Admin@123';
      showToast('Demo Admin credentials filled: admin@ziproo.com / Admin@123', 'auto_fix_high');
    });

    // Form: User Sign In
    document.getElementById('form-user-signin')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const email = document.getElementById('signin-email')?.value.trim();
      const password = document.getElementById('signin-password')?.value;
      const remember = document.getElementById('signin-remember')?.checked;
      const btn = document.getElementById('btn-user-signin-submit');
      const origText = btn ? btn.innerHTML : '';

      const errEmail = document.getElementById('err-signin-email');
      const errPwd = document.getElementById('err-signin-password');
      if (errEmail) errEmail.classList.add('hidden');
      if (errPwd) errPwd.classList.add('hidden');

      if (!email) {
        if (errEmail) { errEmail.textContent = 'Email is required'; errEmail.classList.remove('hidden'); }
        return;
      }
      if (!password) {
        if (errPwd) { errPwd.textContent = 'Password is required'; errPwd.classList.remove('hidden'); }
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Authenticating with Ziproo...</span>';
      }

      const res = await window.ZiprooAuth.signIn({ email, password, remember });

      if (res.error) {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        showFeedback(res.error.message || 'Authentication failed. Please verify credentials.', 'error');
        return;
      }

      applyAdminMode(false);
      showFeedback('Authentication verified! Redirecting to Ziproo Enterprise...', 'success');
      showToast('Welcome back! Initializing workspace...', 'verified_user');

      setTimeout(() => {
        const dest = targetRedirect ? decodeURIComponent(targetRedirect) : 'home.html';
        window.location.href = dest;
      }, 500);
    });

    // Form: User Sign Up / Registration
    document.getElementById('form-user-signup')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const fullName = document.getElementById('signup-name')?.value.trim();
      const email = document.getElementById('signup-email')?.value.trim();
      const password = document.getElementById('signup-password')?.value;
      const confirmPassword = document.getElementById('signup-confirm-password')?.value;
      const terms = document.getElementById('signup-terms')?.checked;
      const btn = document.getElementById('btn-user-signup-submit');
      const origText = btn ? btn.innerHTML : '';

      const errName = document.getElementById('err-signup-name');
      const errEmail = document.getElementById('err-signup-email');
      const errPwd = document.getElementById('err-signup-password');
      const errConfirm = document.getElementById('err-signup-confirm');
      const errTerms = document.getElementById('err-signup-terms');

      if (errName) errName.classList.add('hidden');
      if (errEmail) errEmail.classList.add('hidden');
      if (errPwd) errPwd.classList.add('hidden');
      if (errConfirm) errConfirm.classList.add('hidden');
      if (errTerms) errTerms.classList.add('hidden');

      let hasError = false;

      if (!fullName) {
        if (errName) { errName.textContent = 'Full legal name required'; errName.classList.remove('hidden'); }
        hasError = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (errEmail) { errEmail.textContent = 'Valid email address required'; errEmail.classList.remove('hidden'); }
        hasError = true;
      }
      if (!password || password.length < 8) {
        if (errPwd) { errPwd.textContent = 'Password must be at least 8 characters'; errPwd.classList.remove('hidden'); }
        hasError = true;
      }
      if (password !== confirmPassword) {
        if (errConfirm) { errConfirm.textContent = 'Passwords do not match. Please re-enter.'; errConfirm.classList.remove('hidden'); }
        hasError = true;
      }
      if (!terms) {
        if (errTerms) { errTerms.textContent = 'You must agree to the identity terms'; errTerms.classList.remove('hidden'); }
        hasError = true;
      }

      if (hasError) return;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Provisioning Sovereign Identity...</span>';
      }

      const res = await window.ZiprooAuth.signUp({
        fullName,
        email,
        password,
        confirmPassword,
        remember: true
      });

      if (res.error) {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        showFeedback(res.error.message || 'Registration failed.', 'error');
        return;
      }

      applyAdminMode(false);
      showFeedback('Identity provisioned successfully! Redirecting to Home...', 'success');
      showToast('Account created! Welcome to Ziproo.', 'how_to_reg');

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 500);
    });

    // Form: Admin Login (Server Verified)
    document.getElementById('form-admin-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const email = document.getElementById('admin-email')?.value.trim();
      const password = document.getElementById('admin-password')?.value;
      const mfaToken = document.getElementById('admin-mfa')?.value.trim();
      const btn = document.getElementById('btn-admin-login-submit');
      const origText = btn ? btn.innerHTML : '';

      const errEmail = document.getElementById('err-admin-email');
      const errPwd = document.getElementById('err-admin-password');
      if (errEmail) errEmail.classList.add('hidden');
      if (errPwd) errPwd.classList.add('hidden');

      if (!email) {
        if (errEmail) { errEmail.textContent = 'Admin ID or Email is required'; errEmail.classList.remove('hidden'); }
        return;
      }
      if (!password) {
        if (errPwd) { errPwd.textContent = 'Master Keyphrase is required'; errPwd.classList.remove('hidden'); }
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Verifying Root Clearance with Server...</span>';
      }

      const res = await window.ZiprooAuth.adminSignIn({ email, password, mfaToken });

      if (res.error) {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        showFeedback(res.error.message || 'Access Denied: Administrator clearance rejected.', 'error');
        return;
      }

      showFeedback('Admin clearance verified by server! Initializing Operations Console...', 'success');
      showToast('Admin session authorized. Launching console...', 'admin_panel_settings');

      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 500);
    });

    // Form: Forgot Password
    document.getElementById('form-forgot-password')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const email = document.getElementById('forgot-email')?.value.trim();
      const btn = document.getElementById('btn-forgot-submit');
      const origText = btn ? btn.innerHTML : '';
      const errEl = document.getElementById('err-forgot-email');
      if (errEl) errEl.classList.add('hidden');

      if (!email) {
        if (errEl) { errEl.textContent = 'Please enter your registered email'; errEl.classList.remove('hidden'); }
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Dispatching recovery...</span>';
      }

      const res = await window.ZiprooAuth.resetPassword(email);

      if (btn) { btn.disabled = false; btn.innerHTML = origText; }

      if (res.error) {
        showFeedback(res.error.message, 'error');
      } else {
        showFeedback(res.data?.message || 'Password recovery instructions dispatched to your email.', 'success');
        showToast('Recovery dispatch initiated', 'send');
      }
    });
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
    if (pageId === 'auth') {
      initAuthGatewayInteractions();
    } else if (pageId === 'home') {
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
    // 1. Admin mode toggles (Strictly restricted to verified admins)
    document.querySelectorAll('[data-action="toggle-admin"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!window.ZiprooAuth || !window.ZiprooAuth.isVerifiedAdmin()) {
          showToast('Access Denied: Administrator clearance is required.', 'lock');
          applyAdminMode(false);
          return;
        }
        const cur = isAdminMode();
        applyAdminMode(!cur);
        showToast(
          !cur ? 'Elevated to Enterprise Admin Preview' : 'Reverted to Standard Mode',
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
    initAuthGatewayInteractions();

    if (window.ZiprooAuth && typeof window.ZiprooAuth.enforceRouteGuard === 'function') {
      window.ZiprooAuth.enforceRouteGuard();
    }

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

