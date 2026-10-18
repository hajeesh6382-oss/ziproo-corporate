const fs = require('fs');
const { urlMap, getHeader, getBottomDock, getFooter, replaceImageUrls } = require('./layout_helpers.js');

function buildBranches() {
  let raw = fs.readFileSync('stitch_raw_locations.html', 'utf8');
  raw = replaceImageUrls(raw);

  // Extract <main> inner content
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = mainMatch ? mainMatch[1] : '';

  // Remove the old inline script from inside main if it is at the end of main
  mainContent = mainContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Tag admin-only controls for visitor read-only access
  mainContent = mainContent.replace(/<div class="flex items-center gap-space-sm pt-1">/g, '<div class="admin-only hidden items-center gap-space-sm pt-1">');
  mainContent = mainContent.replace(/<!-- Card Admin Actions Footer -->\s*<div class="flex items-center justify-between pt-1">/g, '<!-- Card Admin Actions Footer -->\n<div class="admin-only hidden items-center justify-between pt-1">');

  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Global Branches & Locations - Ziproo Enterprise Architecture</title>
  <meta name="description" content="Discover Ziproo's global hubs and innovation centers driving sovereign identity protocols across 4 continents."/>
  
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
  ${getHeader('branches', 'Ziproo - Branches')}

  <main class="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pb-16 bg-surface">
    <div class="max-w-3xl mx-auto w-full px-4 sm:px-6 space-y-6 pt-4">
      ${mainContent}
    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('branches')}

  <!-- Add Branch Modal -->
  <div id="addBranchModal" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Register Global Facility</h3>
        </div>
        <button onclick="Ziproo.closeModal('addBranchModal')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="newBranchForm" class="space-y-4" onsubmit="handleNewBranch(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Branch / Facility Name</label>
          <input required id="newBranchName" type="text" placeholder="e.g. Ziproo Tokyo Cryptography Center" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Region</label>
            <select id="newBranchRegion" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="apac">Asia-Pacific</option>
            </select>
          </div>
          <div>
            <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Station Type</label>
            <select id="newBranchType" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none">
              <option>R&D Security Center</option>
              <option>Operational Hub</option>
              <option>Data Embassy</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Street Address</label>
          <input required id="newBranchAddress" type="text" placeholder="100 Innovation Parkway, Suite 500" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Primary Contact</label>
          <input required id="newBranchContact" type="email" placeholder="facility@ziproo.io" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('addBranchModal')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Register Facility</button>
        </div>
      </form>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/social-config.js"></script>
  <script src="js/app.js"></script>
  <script src="js/supabase-client.js"></script>
  <script>
    if (window.ZiprooAuth) window.ZiprooAuth.enforceRouteGuard();
    function showToast(message, icon = 'check_circle') {
      Ziproo.showToast(message, icon);
    }

    // Facility toggle switch
    function toggleFacility(btn) {
      const dot = btn.querySelector('span:last-child');
      const track = btn.querySelector('span:first-child');
      const isOnline = dot.classList.contains('translate-x-4');

      if (isOnline) {
        dot.classList.remove('translate-x-4');
        dot.classList.add('translate-x-0');
        track.classList.remove('bg-secondary-container');
        track.classList.add('bg-outline-variant');
        Ziproo.showToast('Facility marked offline', 'pause_circle');
      } else {
        dot.classList.remove('translate-x-0');
        dot.classList.add('translate-x-4');
        track.classList.remove('bg-outline-variant');
        track.classList.add('bg-secondary-container');
        Ziproo.showToast('Facility operations live', 'verified');
      }
    }

    function confirmDelete(btn, name) {
      const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
      if (!isAdmin) {
        Ziproo.showToast('Admin privilege required to archive facilities', 'lock');
        return;
      }
      if (confirm(\`Are you sure you want to archive or remove \${name}?\`)) {
        const card = btn.closest('article');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.remove();
          Ziproo.showToast(\`Removed \${name}\`, 'delete');
          checkCardsRemaining();
        }, 250);
      }
    }

    function checkCardsRemaining() {
      const cards = document.querySelectorAll('.branch-card');
      const wrapper = document.getElementById('branchesWrapper');
      const empty = document.getElementById('emptyStateContainer');
      if (cards.length === 0) {
        wrapper?.classList.add('hidden');
        empty?.classList.remove('hidden');
        empty?.classList.add('flex');
      }
    }

    function focusCard(cardId) {
      const el = document.getElementById(cardId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-secondary-container');
        setTimeout(() => el.classList.remove('ring-2', 'ring-secondary-container'), 1800);
      }
    }

    const mapData = {
      sf: { title: 'San Francisco Global HQ', status: 'Active Operations • 142 Staff on Site', card: 'card-sf' },
      ldn: { title: 'London Innovation Hub', status: 'Active Operations • 86 Staff on Site', card: 'card-ldn' },
      ber: { title: 'Berlin AI Research Lab', status: 'Active Operations • 34 Researchers', card: 'card-ber' },
      sg: { title: 'Singapore APAC Logistics', status: 'Active Operations • 65 Staff on Site', card: 'card-sg' }
    };

    function selectMapPin(key) {
      const data = mapData[key];
      if (!data) return;
      const titleEl = document.getElementById('mapPopupTitle');
      const statusEl = document.getElementById('mapPopupStatus');
      const cardEl = document.getElementById('mapPopupCard');
      const btnEl = cardEl?.querySelector('button');
      
      if (titleEl) titleEl.textContent = data.title;
      if (statusEl) statusEl.textContent = data.status;
      if (btnEl) btnEl.setAttribute('onclick', \`focusCard('\${data.card}')\`);
      focusCard(data.card);
      Ziproo.showToast(\`Selected \${data.title}\`, 'pin_drop');
    }

    // Filter functionality
    document.addEventListener('DOMContentLoaded', () => {
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
          let visibleCount = 0;

          cards.forEach(card => {
            const region = card.getAttribute('data-region');
            if (filter === 'all' || region === filter) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });

          const wrapper = document.getElementById('branchesWrapper');
          const empty = document.getElementById('emptyStateContainer');
          if (visibleCount === 0) {
            wrapper?.classList.add('hidden');
            empty?.classList.remove('hidden');
            empty?.classList.add('flex');
          } else {
            wrapper?.classList.remove('hidden');
            empty?.classList.add('hidden');
            empty?.classList.remove('flex');
          }
        });
      });

      // Hook Add Branch button
      const addBranchBtn = document.querySelector('button:has(.material-symbols-outlined:contains("add_location_alt")), button:has(span:contains("Add New Branch"))') || document.querySelector('button[type="button"]:has(span:contains("Add"))');
      document.querySelectorAll('button').forEach(b => {
        if (b.textContent.includes('Add New Branch')) {
          b.addEventListener('click', () => {
            const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
            if (!isAdmin) {
              Ziproo.showToast('Please enable Admin Preview to register branches', 'lock');
              return;
            }
            Ziproo.openModal('addBranchModal');
          });
        }
      });

      // Demo Empty State Toggle
      const toggleBtn = document.getElementById('toggleDemoEmpty');
      const resetBtn = document.getElementById('resetEmptyStateBtn');
      const branchesWrap = document.getElementById('branchesWrapper');
      const emptyState = document.getElementById('emptyStateContainer');

      function toggleEmptyMode() {
        const isShowingEmpty = !emptyState?.classList.contains('hidden');
        if (isShowingEmpty) {
          emptyState?.classList.add('hidden');
          emptyState?.classList.remove('flex');
          branchesWrap?.classList.remove('hidden');
        } else {
          branchesWrap?.classList.add('hidden');
          emptyState?.classList.remove('hidden');
          emptyState?.classList.add('flex');
        }
      }

      if (toggleBtn) toggleBtn.addEventListener('click', toggleEmptyMode);
      if (resetBtn) resetBtn.addEventListener('click', toggleEmptyMode);
    });

    function handleNewBranch(e) {
      e.preventDefault();
      const name = document.getElementById('newBranchName').value;
      Ziproo.closeModal('addBranchModal');
      Ziproo.showToast(\`Branch "\${name}" successfully deployed to network!\`, 'verified');
      e.target.reset();
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('branches.html', page);
  console.log('Built branches.html successfully!');
}

buildBranches();
