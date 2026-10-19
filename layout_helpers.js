const fs = require('fs');
const path = require('path');

const urlMap = JSON.parse(fs.readFileSync('url_mapping.json', 'utf8'));

// Universal Navigation links config (5 primary pages as requested)
const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/home', route: '/home', file: 'home.html', icon: 'home' },
  { id: 'branches', label: 'Branches', href: '/branches', route: '/branches', file: 'branches.html', icon: 'store' },
  { id: 'updates', label: 'Updates', href: '/updates', route: '/updates', file: 'updates.html', icon: 'description' },
  { id: 'leadership', label: 'Leadership', href: '/leadership', route: '/leadership', file: 'leaders.html', icon: 'corporate_fare' },
  { id: 'connect', label: 'Connect', href: '/connect', route: '/connect', file: 'portal.html', icon: 'share' }
];

function getHeader(activeId, pageTitle) {
  const normalizedActiveId = activeId === 'leaders' ? 'leadership' : activeId;
  const desktopLinks = NAV_ITEMS.map(item => {
    const isActive = item.id === normalizedActiveId;
    return `
      <a href="${item.href}" data-route="${item.route}" data-tab="${item.id}" class="nav-tab text-label-md font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
        isActive
          ? 'text-secondary font-semibold bg-secondary/10'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
      }">
        <span class="material-symbols-outlined text-[18px]">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  return `
    <header class="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 transition-colors">
      <div class="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-6">
        <!-- Brand Identity: Logo & Enterprise Architecture moved left with ample spacing -->
        <a href="/home" data-route="/home" class="flex items-center gap-3 group shrink-0 mr-4 md:mr-8" title="Ziproo Corporate - Home">
          <img alt="Ziproo Official Logo" class="h-8 w-auto object-contain transition-transform group-hover:scale-105" src="${urlMap[Object.keys(urlMap)[0]] || 'assets/ziproo_logo.png'}"/>
          <div class="flex flex-col text-left">
            <span class="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-bold">Ziproo</span>
            <span class="font-tagline-display text-[9px] text-secondary tracking-widest uppercase leading-none mt-0.5">Enterprise Architecture</span>
          </div>
        </a>

        <!-- Desktop Navigation Bar (5 Primary Tabs: Home, Branches, Updates, Leadership, Connect + Admin Console) -->
        <nav class="hidden md:flex items-center gap-1 bg-surface-container-low/70 px-2.5 py-1 rounded-2xl border border-outline-variant/20 shadow-inner ml-2 md:ml-4" id="main-nav-links">
          ${desktopLinks}
          <a href="/admin" data-route="/admin" id="nav-desktop-admin" class="hidden nav-tab text-label-md font-medium px-3.5 py-2 rounded-xl transition-all items-center gap-1.5 text-secondary font-bold bg-secondary-container/10">
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>Console</span>
          </a>
        </nav>

        <!-- Right Controls -->
        <div class="flex items-center gap-2">
          <!-- Visitor / Admin Mode Switcher (Hidden per user request) -->
          <button aria-label="Toggle Mode" data-action="toggle-admin" class="hidden role-indicator-badge min-h-[38px] px-3 rounded-full bg-surface-container-high text-on-surface-variant items-center gap-1.5 text-label-sm font-label-sm transition-all hover:bg-surface-container-highest active:scale-95 shadow-sm" type="button" title="Click to toggle Admin / Visitor mode">
            <span class="role-ping w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span class="role-text font-semibold">Visitor</span>
          </button>

          <!-- Supabase Config Trigger Button (Hidden per user request) -->
          <button aria-label="Supabase Configuration" data-action="open-supabase-config" class="hidden min-w-[38px] min-h-[38px] items-center justify-center rounded-xl bg-surface-container-high/60 text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-emerald-600 active:scale-90" type="button" title="Supabase Backend Settings & Admin Provisioning">
            <span class="material-symbols-outlined text-[19px]">database</span>
          </button>

          <!-- Theme Dark/Light Toggle -->
          <button aria-label="Toggle Theme" data-action="toggle-theme" class="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-surface-container-high/60 text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-on-surface active:scale-90" type="button" title="Toggle Dark/Light Mode">
            <span class="material-symbols-outlined text-[20px]">dark_mode</span>
          </button>

          <!-- Dynamic Header Auth Slot -->
          <div id="header-auth-slot" class="flex items-center ml-0.5">
            <a href="/" data-route="/" id="btn-header-signin" class="hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[12px] font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all" title="Sign In">
              <span class="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </a>
            
            <div id="header-user-badge" class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface text-xs font-semibold">
                <span id="header-user-avatar" class="w-5 h-5 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center text-[10px] font-bold">U</span>
                <span id="header-user-name" class="max-w-[100px] truncate text-xs">Member</span>
              </div>
              <button type="button" data-action="logout" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-error/15 hover:text-error text-xs font-semibold transition-all" title="Sign Out">
                <span class="material-symbols-outlined text-[16px]">logout</span>
                <span class="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          <!-- Mobile Hamburger Drawer Button -->
          <button aria-label="Open Navigation Menu" data-action="open-menu" class="md:hidden min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-surface-container-high/60 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface" type="button">
            <span class="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Slide-out Drawer -->
    <div id="drawer-backdrop" class="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden transition-opacity duration-300"></div>
    <div id="mobile-drawer" class="fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between transform translate-x-full transition-transform duration-300 ease-in-out border-l border-outline-variant/30">
      <div class="flex flex-col gap-6 overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-outline-variant/30">
          <a href="/home" data-route="/home" class="flex items-center gap-2">
            <img alt="Ziproo Logo" class="h-7 w-auto object-contain" src="${urlMap[Object.keys(urlMap)[0]] || 'assets/ziproo_logo.png'}"/>
            <span class="font-headline-sm text-primary font-bold">Ziproo</span>
          </a>
          <button data-action="close-menu" aria-label="Close menu" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Dynamic Mobile Auth Slot -->
        <div id="drawer-auth-slot" class="w-full">
          <a href="/" data-route="/" id="drawer-signin-btn" class="hidden w-full mb-2 py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center gap-2 text-label-sm font-semibold shadow-sm">
            <span class="material-symbols-outlined text-[18px]">login</span>
            <span>Sign In / Create Account</span>
          </a>
          <div id="drawer-user-info" class="flex flex-col gap-2 p-3 rounded-2xl bg-surface-container-low mb-2 border border-outline-variant/30">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span id="drawer-user-avatar" class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-bold text-xs">U</span>
                <div class="flex flex-col">
                  <span id="drawer-user-name" class="text-xs font-bold text-on-surface">Member</span>
                  <span id="drawer-user-email" class="text-[10px] text-outline font-mono">user@ziproo.com</span>
                </div>
              </div>
            </div>
            <button type="button" data-action="logout" class="w-full mt-1 py-1.5 px-3 rounded-xl bg-error/10 text-error hover:bg-error/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <span class="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <nav class="flex flex-col gap-1.5">
          ${NAV_ITEMS.map(item => `
            <a href="${item.href}" data-route="${item.route}" data-tab="${item.id}" class="drawer-nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-md font-medium transition-colors ${
              item.id === normalizedActiveId
                ? 'bg-secondary/10 text-secondary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }">
              <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
          <a href="/projects" data-route="/projects" data-tab="projects" class="drawer-nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-md font-medium transition-colors ${
            activeId === 'projects'
              ? 'bg-secondary/10 text-secondary font-bold'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }">
            <span class="material-symbols-outlined text-[20px]">folder_special</span>
            <span>Our Projects</span>
          </a>
          <a href="/admin" id="drawer-admin-link" data-route="/admin" class="hidden drawer-nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-body-md font-bold text-secondary bg-secondary/10 transition-colors">
            <span class="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span>Admin Console</span>
          </a>
        </nav>
      </div>

      <div class="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <button data-action="toggle-admin" class="hidden w-full py-2.5 px-4 rounded-xl bg-surface-container-high text-on-surface items-center justify-center gap-2 text-label-sm font-semibold">
          <span class="admin-status-dot w-2 h-2 rounded-full bg-secondary-container"></span>
          <span class="admin-toggle-label">Toggle Admin Mode</span>
        </button>
        <div class="text-[11px] text-center text-outline">
          Ziproo Enterprise Architecture © 2026
        </div>
      </div>
    </div>
  `;
}

function getBottomDock(activeId) {
  // Completely removed per user request so header navigation options are not repeated at the bottom of the page
  return '';
}

function getFooter(activeId) {
  return `
    <footer class="mt-auto border-t border-outline-variant/30 bg-surface-container-lowest/50 text-on-surface-variant py-10 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div class="flex flex-col items-center md:items-start gap-1">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-primary font-bold">Ziproo</span>
            <span class="text-label-sm px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold">Enterprise Hub</span>
          </div>
          <p class="font-body-sm text-[12px] text-outline max-w-sm">Next-generation identity protocols, sovereign enterprise infrastructure, and global community.</p>
        </div>
        
        <!-- Footer Links (Header navigation options removed from bottom per request) -->
        <div class="flex items-center gap-4 sm:gap-6 font-label-sm text-label-sm flex-wrap justify-center">
          <a href="/projects" data-route="/projects" data-tab="projects" class="footer-nav-tab hover:text-primary transition-colors ${activeId === 'projects' ? 'text-secondary font-bold' : ''}">Our Projects</a>
          <a href="javascript:void(0)" data-action="logout" id="footer-auth-link" class="hover:text-primary transition-colors">Logout</a>
        </div>

        <!-- Social Media Icons (Working External Links) -->
        <div class="flex items-center gap-3 text-on-surface-variant">
          <a href="https://youtube.com/@ziproo" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:text-red-600 hover:bg-surface-container-high transition-colors" title="YouTube Official Channel">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://linkedin.com/company/ziproo" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:text-blue-600 hover:bg-surface-container-high transition-colors" title="LinkedIn Official Company">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="https://x.com/ziproo" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:text-primary hover:bg-surface-container-high transition-colors" title="X (Twitter) Official Channel">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://wa.me/14155552671" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:text-emerald-600 hover:bg-surface-container-high transition-colors" title="WhatsApp Direct Line">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </a>
          <a href="https://instagram.com/ziproo" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:text-pink-600 hover:bg-surface-container-high transition-colors" title="Instagram Official">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  `;
}

// Global Modals (Add Project, Add Branch, Add Update, Edit Leader, Edit Social Links)
function getGlobalModals() {
  return `
  <!-- Modal: Add Project -->
  <div id="modal-add-project" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Deploy New Project</h3>
        </div>
        <button onclick="Ziproo.closeModal('modal-add-project')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="form-add-project" class="space-y-4" onsubmit="Ziproo.handleAddProject(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Project Name</label>
          <input required id="modal-project-name" type="text" placeholder="e.g. Helix Zero-Knowledge Vault" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Architecture Category</label>
          <select id="modal-project-category" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
            <option>Decentralized Identity (DID)</option>
            <option>Biometric Key Engine</option>
            <option>Enterprise Cryptographic Vault</option>
            <option>Hardware Handshake Bridge</option>
          </select>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Description</label>
          <textarea required id="modal-project-desc" rows="3" placeholder="Core specs and infrastructure capabilities..." class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('modal-add-project')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Publish to Registry</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Add Branch -->
  <div id="modal-add-branch" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Add Global Branch</h3>
        </div>
        <button onclick="Ziproo.closeModal('modal-add-branch')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="form-add-branch" class="space-y-4" onsubmit="Ziproo.handleAddBranch(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Facility / Hub Name</label>
          <input required id="modal-branch-name" type="text" placeholder="e.g. Ziproo Tokyo Innovation Hub" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Region</label>
            <select id="modal-branch-region" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="apac">Asia-Pacific</option>
              <option value="latam">Latin America</option>
            </select>
          </div>
          <div>
            <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Facility Type</label>
            <select id="modal-branch-type" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
              <option>Global HQ</option>
              <option>Innovation Lab</option>
              <option>Regional Hub</option>
              <option>Secure Data Vault</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Address & City</label>
          <input required id="modal-branch-address" type="text" placeholder="e.g. Roppongi Hills Mori Tower, Tokyo" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('modal-add-branch')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Provision Facility</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Add Update -->
  <div id="modal-add-update" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Post Daily Protocol Dispatch</h3>
        </div>
        <button onclick="Ziproo.closeModal('modal-add-update')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="form-add-update" class="space-y-4" onsubmit="Ziproo.handleAddUpdate(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Update Headline</label>
          <input required id="modal-update-title" type="text" placeholder="e.g. Ziproo V2.5 Quantum Protocol Launch" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Category / Tag</label>
          <select id="modal-update-category" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
            <option>Protocol Release</option>
            <option>Security Advisory</option>
            <option>Partnership</option>
            <option>Infrastructure Scaling</option>
          </select>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Dispatch Content</label>
          <textarea required id="modal-update-content" rows="3" placeholder="Enter verified protocol announcement and executive summary..." class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('modal-add-update')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Broadcast Update</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Edit Member (Leadership) -->
  <div id="modal-edit-leader" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 id="modal-leader-header" class="font-headline-sm text-primary font-bold">Edit Executive Profile</h3>
        </div>
        <button onclick="Ziproo.closeModal('modal-edit-leader')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="form-edit-leader" class="space-y-4" onsubmit="Ziproo.handleEditLeader(event)">
        <input type="hidden" id="modal-leader-id"/>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Executive Full Name</label>
          <input required id="modal-leader-name" type="text" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Executive Title / Role</label>
          <input required id="modal-leader-role" type="text" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Executive Biography</label>
          <textarea required id="modal-leader-bio" rows="3" class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Credentials & Affiliations</label>
          <input required id="modal-leader-credentials" type="text" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('modal-edit-leader')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Edit Social Links -->
  <div id="modal-edit-social" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Edit Social Media Links</h3>
        </div>
        <button onclick="Ziproo.closeModal('modal-edit-social')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="form-edit-social" class="space-y-3" onsubmit="Ziproo.handleEditSocial(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">YouTube URL</label>
          <input id="modal-social-youtube" type="url" value="https://youtube.com/@ziproo" class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none text-xs font-mono"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">LinkedIn URL</label>
          <input id="modal-social-linkedin" type="url" value="https://linkedin.com/company/ziproo" class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none text-xs font-mono"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Twitter / X URL</label>
          <input id="modal-social-twitter" type="url" value="https://x.com/ziproo" class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none text-xs font-mono"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">WhatsApp URL</label>
          <input id="modal-social-whatsapp" type="url" value="https://wa.me/14155552671" class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none text-xs font-mono"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Instagram URL</label>
          <input id="modal-social-instagram" type="url" value="https://instagram.com/ziproo" class="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none text-xs font-mono"/>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('modal-edit-social')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Update Links</button>
        </div>
      </form>
    </div>
  </div>
  `;
}

module.exports = {
  NAV_ITEMS,
  urlMap,
  getHeader,
  getBottomDock,
  getFooter,
  getGlobalModals,
  replaceImageUrls: (html) => {
    let res = html;
    for (const [remote, local] of Object.entries(urlMap)) {
      res = res.split(remote).join(local);
    }
    return res;
  }
};
