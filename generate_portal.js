const fs = require('fs');
const { getHeader, getBottomDock, getFooter } = require('./layout_helpers.js');

function buildPortal() {
  const page = `<!DOCTYPE html>
<html class="h-full" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Connect with ZIPROO - Official Social Media & Community Gateway</title>
  <meta name="description" content="Follow and connect with ZIPROO across our official global social media channels: YouTube, Instagram, LinkedIn, X (Twitter), and WhatsApp."/>
  
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
  ${getHeader('portal', 'Ziproo - Community & Social Portal')}

  <main class="flex-1 flex flex-col relative w-full pt-20 pb-28 md:pb-16 bg-surface">
    <div class="max-w-5xl mx-auto w-full px-4 sm:px-6 space-y-10">

      <!-- Hero Header Section -->
      <section class="flex flex-col items-center text-center pt-4 relative">
        <!-- Ambient decorative blurs -->
        <div class="absolute -top-12 -right-8 w-60 h-60 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
        <div class="absolute top-10 -left-12 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>

        <!-- Identity Emblem & Pill -->
        <div class="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-on-primary shadow-xl shadow-primary/20 mb-4 ring-4 ring-surface-container-high/60">
          <span class="font-headline-lg font-black tracking-tighter text-secondary-container">Z</span>
          <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping opacity-75"></span>
            <span class="absolute w-2 h-2 rounded-full bg-secondary-container"></span>
          </span>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/10 text-secondary mb-3 border border-secondary/20 shadow-xs">
          <span class="material-symbols-outlined text-[15px]">share</span>
          <span class="font-tagline-display text-[10px] tracking-widest uppercase font-bold">Official Broadcast & Community Network</span>
        </div>

        <h1 class="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface tracking-tight font-bold mb-3">
          Connect with <span class="text-secondary-container">ZIPROO</span>
        </h1>
        <p class="font-body-md text-on-surface-variant max-w-xl text-sm sm:text-base leading-relaxed">
          Follow our verified channels for real-time protocol telemetry, zero-knowledge architecture keynotes, executive insights, and direct engineering community discussions.
        </p>

        <!-- Live Community Status Badge -->
        <div class="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs">
          <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Channels Active</span>
          </div>
          <span class="text-outline-variant">•</span>
          <span class="text-outline">5 Official Hubs Available</span>
        </div>
      </section>

      <!-- Social Media Cards Grid (5 Official Platforms) -->
      <section class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="social-cards-container">
          <!-- Populated dynamically via js/social-config.js -->
        </div>
      </section>

      <!-- Enterprise Direct Dispatch & Community Notice -->
      <section class="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col gap-2 text-center md:text-left max-w-lg">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/10 backdrop-blur-md w-fit mx-auto md:mx-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-[10px] uppercase font-bold tracking-wider text-surface">Verified Identity Guarantee</span>
            </div>
            <h3 class="font-headline-md text-xl sm:text-2xl text-on-primary font-bold">Official Communications Verification</h3>
            <p class="font-body-sm text-xs sm:text-sm text-on-primary-container leading-relaxed">
              ZIPROO will never initiate unsolicited requests for private cryptographic keys or master passphrases on any social platform. Always verify domain authenticity through this portal.
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a href="index.html#auth-section" class="px-5 py-3 rounded-2xl bg-secondary-container text-on-secondary font-label-md font-bold text-xs shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Access Member Dashboard</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  </main>

  ${getFooter()}
  ${getBottomDock('portal')}

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/social-config.js"></script>
  <script src="js/app.js"></script>
  <script src="js/supabase-client.js"></script>
  <script>
    // Render the 5 official social cards from ZIPROO_SOCIAL_CONFIG
    (function renderSocialMediaCards() {
      const container = document.getElementById('social-cards-container');
      if (!container || !window.ZIPROO_SOCIAL_CONFIG || !window.ZIPROO_SOCIAL_CONFIG.platforms) return;

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
    })();
  </script>
</body>
</html>`;

  fs.writeFileSync('portal.html', page);
  console.log('Built portal.html successfully!');

  // Alias auth.html to portal.html so any legacy link arrives at the social portal
  fs.writeFileSync('auth.html', page);
  console.log('Updated auth.html as alias to portal.html!');
}

buildPortal();
