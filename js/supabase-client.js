/**
 * Ziproo Corporate Architecture - Supabase Client & Prototype Auth Bridge
 * Connects demo prototype authentication with optional Supabase backend.
 */

(function () {
  'use strict';

  // Storage keys
  const STORAGE_URL_KEY = 'ziproo_supabase_url';
  const STORAGE_KEY_KEY = 'ziproo_supabase_anon_key';

  const DEFAULT_CONFIG = {
    url: 'https://placeholder-project.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  };

  let supabaseClient = null;
  let currentUser = null;
  let currentSession = null;
  const authListeners = [];

  function getConfig() {
    const storedUrl = localStorage.getItem(STORAGE_URL_KEY);
    const storedKey = localStorage.getItem(STORAGE_KEY_KEY);
    const serverUrl = window.__ZIPROO_SERVER_CONFIG?.url;
    const serverKey = window.__ZIPROO_SERVER_CONFIG?.anonKey;

    const url = (storedUrl && storedUrl.trim()) || (serverUrl && serverUrl.trim()) || DEFAULT_CONFIG.url;
    const anonKey = (storedKey && storedKey.trim()) || (serverKey && serverKey.trim()) || DEFAULT_CONFIG.anonKey;
    const isCustomized = (storedUrl && storedKey) || (serverUrl && serverKey && serverUrl !== DEFAULT_CONFIG.url);

    return { url, anonKey, isCustomized: !!isCustomized };
  }

  function loadSupabaseSDK(callback) {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      callback();
      return;
    }
    const existing = document.querySelector('script[src*="supabase-js"]');
    if (existing) {
      existing.addEventListener('load', callback);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.crossOrigin = 'anonymous';
    script.onload = () => callback();
    script.onerror = () => callback();
    document.head.appendChild(script);
  }

  // Route protection disabled for interactive prototype: all navbar links are accessible
  function isCurrentPageProtected() {
    return false;
  }

  function enforceRouteGuard() {
    // No-op in prototype mode: all 5 pages plus admin/projects are freely navigable
  }

  function initClient() {
    const { url, anonKey, isCustomized } = getConfig();

    if (isCustomized && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(url, anonKey, {
          auth: { persistSession: true, autoRefreshToken: true }
        });
      } catch (err) {
        console.warn('Optional Supabase client init warning:', err);
      }
    }
  }

  // Sign In implementation supporting demo credentials & validation
  async function signIn({ email, password }) {
    if (window.Ziproo && typeof window.Ziproo.executeSignIn === 'function') {
      const feedbackEl = document.getElementById('home-auth-feedback') || document.getElementById('signin-msg-box');
      const success = window.Ziproo.executeSignIn(email, password, feedbackEl);
      if (!success) {
        return { error: { message: feedbackEl?.textContent || 'Incorrect email or password' } };
      }
      return { data: { user: window.Ziproo.getCurrentUser() }, error: null };
    }
    return { error: { message: 'Auth engine ready' } };
  }

  // Sign Up implementation
  async function signUp({ email, password, fullName, phone }) {
    if (window.Ziproo && typeof window.Ziproo.executeSignUp === 'function') {
      const feedbackEl = document.getElementById('home-auth-feedback') || document.getElementById('signin-msg-box');
      const success = window.Ziproo.executeSignUp(fullName, email, password, feedbackEl);
      if (!success) {
        return { error: { message: feedbackEl?.textContent || 'Registration failed' } };
      }
      return { data: { user: window.Ziproo.getCurrentUser() }, error: null };
    }
    return { error: { message: 'Registration engine ready' } };
  }

  async function signOut() {
    if (window.Ziproo && typeof window.Ziproo.logout === 'function') {
      window.Ziproo.logout();
    }
  }

  async function resetPassword(email) {
    if (!email || !email.trim()) {
      return { error: { message: 'Enter a valid email' } };
    }
    return { data: { message: 'Password reset dispatch initiated' }, error: null };
  }

  function syncAuthUI() {
    if (window.Ziproo && typeof window.Ziproo.syncAuthUI === 'function') {
      window.Ziproo.syncAuthUI();
    }
  }

  function openConfigModal() {
    let modal = document.getElementById('supabase-config-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'supabase-config-modal';
      modal.className = 'modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4';
      
      const config = getConfig();
      
      modal.innerHTML = `
        <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">database</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-on-surface">Supabase & Admin Console</h3>
                <p class="text-[11px] text-on-surface-variant">Backend settings and enterprise user provisioning</p>
              </div>
            </div>
            <button onclick="document.getElementById('supabase-config-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Section 1: Supabase Configuration -->
          <div class="space-y-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
            <div class="flex items-center justify-between">
              <span class="font-tagline-display text-[10px] text-secondary tracking-widest uppercase font-bold">Connection Settings</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${config.isCustomized ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-container text-outline'}">
                ${config.isCustomized ? 'Live Connected' : 'Prototype Mode'}
              </span>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-on-surface-variant mb-1">Project URL</label>
              <input id="cfg-supabase-url" type="text" value="${config.url || ''}" placeholder="https://your-project.supabase.co" class="w-full h-10 px-3 rounded-xl bg-surface-container-lowest text-xs font-mono text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-emerald-500 outline-none"/>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-on-surface-variant mb-1">Anon / Public API Key</label>
              <input id="cfg-supabase-key" type="password" value="${config.anonKey || ''}" placeholder="eyJhbGciOiJIUzI1NiIsIn..." class="w-full h-10 px-3 rounded-xl bg-surface-container-lowest text-xs font-mono text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-emerald-500 outline-none"/>
            </div>
            <div class="flex justify-end pt-1">
              <button type="button" id="btn-save-supabase-config" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">save</span>
                <span>Save Config</span>
              </button>
            </div>
          </div>

          <!-- Section 2: Admin Provisioning Management -->
          <div class="space-y-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
            <div class="flex items-center justify-between">
              <span class="font-tagline-display text-[10px] text-secondary tracking-widest uppercase font-bold">Create New Admin</span>
              <span class="material-symbols-outlined text-secondary text-[16px]">admin_panel_settings</span>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Provision other administrators with elevated enterprise privileges (full add, edit, and delete permissions).
            </p>
            <form id="form-provision-admin" class="space-y-2.5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-medium text-on-surface-variant mb-1">Admin Full Name</label>
                  <input required id="new-admin-name" type="text" placeholder="e.g. Jordan Hayes" class="w-full h-9 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-secondary outline-none"/>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-on-surface-variant mb-1">Admin Email</label>
                  <input required id="new-admin-email" type="email" placeholder="jordan@ziproo.com" class="w-full h-9 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-secondary outline-none"/>
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-on-surface-variant mb-1">Admin Password</label>
                <input required id="new-admin-password" type="password" placeholder="Min. 8 characters" class="w-full h-9 px-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:ring-2 focus:ring-secondary outline-none"/>
              </div>
              <div class="flex justify-end pt-1">
                <button type="submit" class="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary text-xs font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Grant Admin Clearance</span>
                </button>
              </div>
            </form>
            <div id="provision-feedback" class="hidden text-xs p-2.5 rounded-xl font-medium"></div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <button type="button" onclick="document.getElementById('supabase-config-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors">
              Close Console
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Event handlers inside modal
      document.getElementById('btn-save-supabase-config')?.addEventListener('click', () => {
        const url = document.getElementById('cfg-supabase-url')?.value.trim();
        const key = document.getElementById('cfg-supabase-key')?.value.trim();
        if (url) localStorage.setItem(STORAGE_URL_KEY, url);
        if (key) localStorage.setItem(STORAGE_KEY_KEY, key);
        initClient();
        if (window.Ziproo?.showToast) window.Ziproo.showToast('Supabase configuration saved!', 'database');
      });

      document.getElementById('form-provision-admin')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-admin-name')?.value.trim();
        const email = document.getElementById('new-admin-email')?.value.trim().toLowerCase();
        const password = document.getElementById('new-admin-password')?.value;
        const feedback = document.getElementById('provision-feedback');

        if (!name || !email || !password) return;

        try {
          const registered = JSON.parse(localStorage.getItem('ziproo_registered_users') || '[]');
          const idx = registered.findIndex(u => u.email === email);
          if (idx !== -1) {
            registered[idx] = { name, email, password, role: 'Admin' };
          } else {
            registered.push({ name, email, password, role: 'Admin' });
          }
          localStorage.setItem('ziproo_registered_users', JSON.stringify(registered));

          if (feedback) {
            feedback.textContent = `✓ Admin clearance granted to ${name} (${email}). They can now sign in with full enterprise rights.`;
            feedback.className = 'text-xs p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 block';
            feedback.classList.remove('hidden');
          }

          if (window.Ziproo?.showToast) {
            window.Ziproo.showToast(`Admin account created for ${name}`, 'admin_panel_settings');
          }
          e.target.reset();
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function boot() {
    initClient();
    syncAuthUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ZiprooAuth = {
    signUp,
    signIn,
    signOut,
    resetPassword,
    getUser: () => window.Ziproo?.getCurrentUser() || currentUser,
    getSession: () => currentSession,
    getClient: () => supabaseClient,
    getConfig,
    openConfigModal,
    syncAuthUI,
    isCurrentPageProtected,
    enforceRouteGuard,
    onAuthStateChange: (cb) => authListeners.push(cb)
  };
})();
