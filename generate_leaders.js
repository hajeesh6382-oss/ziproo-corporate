const fs = require('fs');
const { urlMap, getHeader, getBottomDock, getFooter, replaceImageUrls } = require('./layout_helpers.js');

function buildLeaders() {
  let raw = fs.readFileSync('stitch_raw_leaders.html', 'utf8');
  raw = replaceImageUrls(raw);

  // Extract <main> inner content
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = mainMatch ? mainMatch[1] : '';

  // Remove the old inline script from inside main if it is at the end of main
  mainContent = mainContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Tag edit buttons as admin-only for read-only visitor access
  mainContent = mainContent.replace(/<button aria-label="Edit ([^"]+)" class="min-w-\[36px\]/g, '<button aria-label="Edit $1" class="admin-only hidden min-w-[36px]');
  mainContent = mainContent.replace(/<button class="min-h-\[40px\] px-space-sm bg-primary/g, '<button class="admin-only hidden min-h-[40px] px-space-sm bg-primary');

  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Executive Leadership - Ziproo Enterprise Architecture</title>
  <meta name="description" content="Meet the visionaries, cryptographers, and system engineers forging the future of digital identity at Ziproo."/>
  
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
  ${getHeader('leaders', 'Ziproo - Leaders')}

  <main class="flex-1 flex flex-col relative w-full pt-16 pb-28 md:pb-16 bg-surface">
    <div class="max-w-3xl mx-auto w-full px-4 sm:px-6 space-y-6 pt-4">
      ${mainContent}
    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('leaders')}

  <!-- Direct Message Modal -->
  <div id="contactLeaderModal" class="modal-dialog-backdrop fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="modal-enter w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-[22px]">mail</span>
          <h3 class="font-headline-sm text-primary font-bold" id="contactLeaderTitle">Executive Direct Line</h3>
        </div>
        <button onclick="Ziproo.closeModal('contactLeaderModal')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <form class="space-y-4" onsubmit="handleDirectContact(event)">
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Your Name & Title</label>
          <input required type="text" placeholder="Dr. Jennifer Cole, VP SecOps" class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none"/>
        </div>
        <div>
          <label class="block font-label-sm text-on-surface-variant mb-1 font-medium">Encrypted Direct Message</label>
          <textarea required rows="3" placeholder="Confidential inquiry regarding identity governance or advisory..." class="w-full p-3.5 rounded-xl bg-surface-container-low text-on-surface focus:ring-2 focus:ring-secondary outline-none resize-none"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="Ziproo.closeModal('contactLeaderModal')" class="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary font-label-md font-bold shadow-md hover:bg-secondary">Transmit Direct</button>
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
    let activeLeaderCard = null;

    function openAdminModal(name, role, bio, credentials) {
      const isAdmin = localStorage.getItem('ziproo_admin_mode') === 'true';
      if (!isAdmin) {
        Ziproo.showToast('Please enable Admin Preview to edit executive records', 'lock');
        return;
      }

      document.getElementById('modalLeaderTitle').textContent = 'Edit ' + name.split(' ')[0];
      document.getElementById('modalLeaderName').value = name;
      document.getElementById('modalLeaderRole').value = role;
      document.getElementById('modalLeaderCredentials').value = credentials;
      document.getElementById('modalLeaderBio').value = bio;
      
      // Store card reference
      document.querySelectorAll('article').forEach(card => {
        if (card.querySelector('h3')?.textContent.trim() === name) {
          activeLeaderCard = card;
        }
      });

      const modal = document.getElementById('adminEditModal');
      modal?.classList.remove('hidden');
      modal?.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeAdminModal() {
      const modal = document.getElementById('adminEditModal');
      modal?.classList.add('hidden');
      modal?.classList.remove('flex');
      document.body.style.overflow = '';
    }

    function saveExecutive(e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span><span>Updating...</span>';
      
      const newName = document.getElementById('modalLeaderName').value;
      const newRole = document.getElementById('modalLeaderRole').value;
      const newBio = document.getElementById('modalLeaderBio').value;
      const newCreds = document.getElementById('modalLeaderCredentials').value;

      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">done</span><span>Saved!</span>';
        
        if (activeLeaderCard) {
          const h3 = activeLeaderCard.querySelector('h3');
          const roleP = activeLeaderCard.querySelector('p.font-label-sm');
          const bioP = activeLeaderCard.querySelector('p.font-body-sm');
          const credSpan = activeLeaderCard.querySelector('span.font-medium');
          if (h3) h3.textContent = newName;
          if (roleP) roleP.textContent = newRole;
          if (bioP) bioP.textContent = newBio;
          if (credSpan) credSpan.textContent = newCreds;
        }

        Ziproo.showToast(\`Profile for \${newName} updated and verified!\`, 'verified');

        setTimeout(() => {
          btn.innerHTML = originalText;
          closeAdminModal();
        }, 600);
      }, 700);
    }

    // Direct contact modal trigger
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('button[aria-label="Executive Direct Contact"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const card = btn.closest('article');
          const leaderName = card?.querySelector('h3')?.textContent.trim() || 'Executive';
          const titleEl = document.getElementById('contactLeaderTitle');
          if (titleEl) titleEl.textContent = \`Contact \${leaderName}\`;
          Ziproo.openModal('contactLeaderModal');
        });
      });

      // Quick panel upload simulation
      const simulateUploadBtn = document.getElementById('simulateUploadBtn');
      if (simulateUploadBtn) {
        simulateUploadBtn.addEventListener('click', function() {
          const badge = document.getElementById('uploadStatusBadge');
          this.classList.add('opacity-75');
          this.disabled = true;
          Ziproo.showToast('Connecting to decentralized identity asset vault...', 'cloud_sync');
          setTimeout(() => {
            badge?.classList.remove('hidden');
            badge?.classList.add('flex');
            this.classList.remove('opacity-75');
            this.disabled = false;
            Ziproo.showToast('Asset Vault synchronized with ledger', 'verified');
            setTimeout(() => {
              badge?.classList.add('hidden');
              badge?.classList.remove('flex');
            }, 4000);
          }, 900);
        });
      }
    });

    function handleDirectContact(e) {
      e.preventDefault();
      Ziproo.closeModal('contactLeaderModal');
      Ziproo.showToast('Secure executive transmission queued and dispatched.', 'mark_email_read');
      e.target.reset();
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('leaders.html', page);
  console.log('Built leaders.html successfully!');
}

buildLeaders();
