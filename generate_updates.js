const fs = require('fs');
const { urlMap, getHeader, getBottomDock, getFooter, replaceImageUrls } = require('./layout_helpers.js');

function buildUpdates() {
  let raw = fs.readFileSync('stitch_raw_about.html', 'utf8');
  raw = replaceImageUrls(raw);

  // Extract <main> inner content
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = mainMatch ? mainMatch[1] : '';

  // Remove the old inline script from inside main if it is at the end of main
  mainContent = mainContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>About & Daily Updates - Ziproo Enterprise Architecture</title>
  <meta name="description" content="Archival ledger, sovereign foundation, and daily protocol intelligence feed from Ziproo executive engineering."/>
  
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
  ${getHeader('updates', 'Ziproo - Updates')}

  <main class="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pb-16 bg-surface">
    <div class="max-w-3xl mx-auto w-full px-4 sm:px-6 space-y-6 pt-4">
      ${mainContent}
    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('updates')}

  <!-- Post Update Modal (Admin) -->
  <div id="postUpdateModal" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
          <h3 class="font-headline-sm text-primary font-bold">Publish Protocol Dispatch</h3>
        </div>
        <button onclick="Ziproo.closeModal('postUpdateModal')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form id="newDispatchForm" class="space-y-4" onsubmit="handleNewDispatch(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Headline / Protocol Title</label>
          <input required id="dispatchTitle" type="text" placeholder="e.g. Release 2.5: Quantum Key Derivation Live" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Category Badge</label>
          <input required id="dispatchCategory" type="text" placeholder="SECURITY AUDIT • CORE SYSTEM" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Dispatch Body</label>
          <textarea required id="dispatchContent" rows="3" placeholder="Detailed technical narrative or executive update..." class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('postUpdateModal')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Broadcast Update</button>
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
    (function() {
      // Connect Post Update trigger
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Post Update')) {
          btn.addEventListener('click', () => {
            const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
            if (!isAdmin) {
              Ziproo.showToast('Visitor access is read-only. Switch to Admin mode to continue.', 'lock');
              return;
            }
            Ziproo.openModal('postUpdateModal');
          });
        }
      });

      // Connect Edit Vision & Edit Mission
      document.querySelectorAll('.admin-action-btn').forEach(btn => {
        if (btn.textContent.includes('Edit Vision') || btn.textContent.includes('Edit Mission')) {
          btn.addEventListener('click', () => {
            const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
            if (!isAdmin) {
              Ziproo.showToast('Visitor access is read-only. Switch to Admin mode to modify.', 'lock');
              return;
            }
            const field = btn.textContent.includes('Vision') ? 'Vision' : 'Mission';
            const current = btn.closest('div').parentElement.querySelector('p')?.textContent.trim();
            const newVal = prompt(\`Edit Ziproo \${field}:\`, current);
            if (newVal) {
              const p = btn.closest('div').parentElement.querySelector('p');
              if (p) p.textContent = newVal;
              Ziproo.showToast(\`\${field} updated on chain!\`, 'verified');
            }
          });
        }
      });

      // Item Menu options
      document.querySelectorAll('.admin-item-menu').forEach(menuBtn => {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const parent = menuBtn.closest('.relative');
          const dropdown = parent ? parent.querySelector('.menu-dropdown') : null;
          
          document.querySelectorAll('.menu-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.add('hidden');
          });

          if (dropdown) {
            dropdown.classList.toggle('hidden');
          }
        });
      });

      document.addEventListener('click', () => {
        document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.add('hidden'));
      });
    })();

    function handleNewDispatch(e) {
      e.preventDefault();
      const title = document.getElementById('dispatchTitle').value;
      Ziproo.closeModal('postUpdateModal');
      Ziproo.showToast(\`Dispatch "\${title}" broadcasted successfully!\`, 'podcasts');
      e.target.reset();
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('updates.html', page);
  console.log('Built updates.html successfully!');
}

buildUpdates();
