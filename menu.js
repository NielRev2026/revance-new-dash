// Revance · site-wide slide-out navigation
// Auto-wires to any .nav-avatar click, injects full-height panel with large-font links.
(function () {
  // ─── HOME VARIANTS ───
  const HOME_VARIANTS = {
    'colored-compact':  'index.html',
    'colored-spacious': 'index-spacious.html',
    'gold-compact':     'index-gold.html',
    'gold-spacious':    'index-gold-spacious.html',
  };
  const HOME_FILES = Object.values(HOME_VARIANTS);
  const SETTINGS_KEY = 'revanceHomeSettings';

  function readSettings() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}; } catch (e) {}
    s.palette = (s.palette === 'gold') ? 'gold' : 'colored';
    s.density = (s.density === 'spacious') ? 'spacious' : 'compact';
    return s;
  }
  function writeSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }
  function homeUrl(s) { return HOME_VARIANTS[s.palette + '-' + s.density]; }

  // Navigation items (Dashboard href is computed from settings at render time)
  const settings = readSettings();

  // ─── Apply palette to <html> so page CSS can respond ───
  function applyPalette(p) {
    document.documentElement.dataset.palette = p;
  }
  applyPalette(settings.palette);

  const NAV = [
    { label: 'Dashboard',   href: homeUrl(settings), flag: 'dashboard' },
    { label: 'Rewards',     href: 'rewards.html' },
    { label: 'Products',    href: 'purchase.html' },
    { label: 'Experience',  href: 'experience.html' },
    { label: 'Education',   href: '#' },
    { label: 'Insights',    href: 'numbers.html' },
    { label: 'Check In',    href: 'checkin.html' },
  ];

  const css = `
    .rm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;transition:background .4s ease;z-index:99;}
    .rm-backdrop.open{background:rgba(0,0,0,.45);pointer-events:auto;}
    .rm-menu{
      position:fixed;top:0;right:0;
      width:min(560px,100vw);height:100vh;
      background:#fff;
      padding:72px 56px 32px;
      display:flex;flex-direction:column;gap:32px;
      transform:translateX(100%);
      transition:transform .65s cubic-bezier(.16,1,.3,1);
      z-index:101;
      overflow-y:auto;
      font-family:'Poppins',-apple-system,BlinkMacSystemFont,sans-serif;
      color:#111;
    }
    .rm-menu.open{transform:translateX(0);}
    .rm-close{position:absolute;top:22px;right:22px;width:40px;height:40px;background:none;border:none;cursor:pointer;display:grid;place-items:center;color:#111;}
    .rm-close svg{width:22px;height:22px;stroke:currentColor;}
    .rm-close:hover{background:#f5f5f5;}

    .rm-header{display:flex;align-items:center;gap:14px;padding-bottom:20px;border-bottom:1px solid #eaeaea;}
    .rm-avatar{width:44px;height:44px;background:linear-gradient(135deg,#FFB088,#FF7A9C);flex-shrink:0;}
    .rm-name{font-size:15px;font-weight:600;color:#111;letter-spacing:-.2px;}
    .rm-org{font-size:12px;font-weight:400;color:#707070;margin-top:2px;}

    .rm-nav{display:flex;flex-direction:column;gap:0;}
    .rm-nav a{
      font-size:clamp(32px,4.4vw,48px);
      font-weight:200;
      letter-spacing:-1.8px;
      color:#111;
      text-decoration:none;
      line-height:1.1;
      padding:8px 0;
      transition:transform .3s cubic-bezier(.16,1,.3,1),color .25s ease;
      display:inline-block;
    }
    .rm-nav a:hover{transform:translateX(10px);color:#b88547;}
    .rm-nav a.active{font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:400;}

    /* ─── Settings ─── */
    .rm-settings{
      padding-top:24px;
      border-top:1px solid #eaeaea;
      display:flex;flex-direction:column;gap:14px;
    }
    .rm-settings-label{
      font-size:10px;font-weight:600;letter-spacing:2px;color:#999;
      text-transform:uppercase;
      margin-bottom:4px;
    }
    .rm-settings-row{
      display:flex;align-items:center;justify-content:space-between;gap:16px;
    }
    .rm-settings-key{
      font-size:13px;font-weight:500;color:#111;
    }
    .rm-toggle{
      display:inline-flex;gap:2px;background:#f5f5f5;padding:3px;
    }
    .rm-toggle-btn{
      padding:7px 14px;background:transparent;border:none;
      font-family:inherit;font-size:11px;font-weight:500;letter-spacing:.3px;
      color:#666;cursor:pointer;
      transition:background .2s ease,color .2s ease;
      text-transform:uppercase;
    }
    .rm-toggle-btn:hover{color:#111;}
    .rm-toggle-btn.active{background:#111;color:#fff;}

    .rm-foot{
      margin-top:auto;padding-top:24px;border-top:1px solid #eaeaea;
      display:flex;flex-direction:column;gap:12px;
    }
    .rm-foot a{
      font-size:13px;font-weight:500;color:#666;text-decoration:none;
      letter-spacing:.2px;transition:color .2s ease;
    }
    .rm-foot a:hover{color:#111;}
    .rm-foot .sign-out{color:#b88547;}

    .nav-avatar{cursor:pointer;}

    /* ─── GOLD PALETTE OVERRIDES — single champagne-gold source (tile 01) ───
       Palette:  #FFEAB0 #E8C782 #FFF3D2 #FDF3D4 #D9B977  */

    /* Nav avatars (every page) */
    [data-palette="gold"] .nav-avatar{
      background:linear-gradient(135deg,#E8C782,#D9B977)!important;
      box-shadow:0 2px 8px rgba(217,185,119,0.35)!important;
    }
    [data-palette="gold"] .rm-avatar{
      background:linear-gradient(135deg,#E8C782,#D9B977)!important;
    }

    /* Rewards page — balance card flowing gradient + progress bar */
    [data-palette="gold"] .rewards-card::before{
      background:
        radial-gradient(circle at 22% 28%, #FFEAB0 0%, transparent 52%),
        radial-gradient(circle at 78% 72%, #E8C782 0%, transparent 55%),
        radial-gradient(circle at 55% 52%, #FFF3D2 0%, transparent 48%),
        linear-gradient(135deg, #FDF3D4 0%, #D9B977 100%)!important;
      background-size:140% 140%,140% 140%,160% 160%,100% 100%!important;
    }
    [data-palette="gold"] .progress-fill{
      background:linear-gradient(90deg,#E8C782 0%,#D9B977 100%)!important;
    }
    [data-palette="gold"] .tick.current .tick-amt{color:#D9B977!important;}

    /* Purchase page — featured card gradient + product tints + promo strip dot */
    [data-palette="gold"] .featured::before{
      background:
        radial-gradient(circle at 22% 28%, #FFEAB0 0%, transparent 52%),
        radial-gradient(circle at 78% 72%, #E8C782 0%, transparent 55%),
        radial-gradient(circle at 55% 52%, #FFF3D2 0%, transparent 48%),
        linear-gradient(135deg, #FDF3D4 0%, #D9B977 100%)!important;
      background-size:140% 140%,140% 140%,160% 160%,100% 100%!important;
    }
    [data-palette="gold"] .card-img{
      background:#FDF3D4!important;
    }
    [data-palette="gold"] .rs-dot{
      background:linear-gradient(135deg,#E8C782,#D9B977)!important;
    }
    [data-palette="gold"] .rs-kick{color:#E8C782!important;}
    [data-palette="gold"] .nav-cart .dot{background:#D9B977!important;}

    /* Experience page — outro gradient word */
    [data-palette="gold"] .outro h2 em{
      background:linear-gradient(135deg,#FFEAB0,#E8C782 50%,#D9B977)!important;
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
    }

    /* Check-in page — success icon + recent-chip dot */
    [data-palette="gold"] .success-icon{
      background:linear-gradient(135deg,#E8C782,#D9B977)!important;
    }
    [data-palette="gold"] .chip-dot{background:#D9B977!important;}
    [data-palette="gold"] .input-underline::after{
      background:linear-gradient(90deg,#FFEAB0 0%,#E8C782 50%,#D9B977 100%)!important;
    }

    @media (max-width:640px){
      .rm-menu{padding:64px 28px 28px;gap:24px;}
      .rm-nav a{font-size:30px;padding:6px 0;}
      .rm-settings-row{flex-direction:column;align-items:flex-start;gap:8px;}
    }
    @media (prefers-reduced-motion:reduce){
      .rm-menu{transition:none;}
      .rm-nav a{transition:none;}
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Identify current page
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isOnHome = HOME_FILES.includes(currentPage);

  // Build nav HTML — Dashboard is "active" on any home variant
  const navLinks = NAV.map(item => {
    const isActive = item.flag === 'dashboard'
      ? isOnHome
      : item.href.toLowerCase() === currentPage;
    return `<a href="${item.href}"${isActive ? ' class="active"' : ''}${item.flag ? ` data-flag="${item.flag}"` : ''}>${item.label}</a>`;
  }).join('');

  const menuHTML = `
    <div class="rm-backdrop" id="rm-backdrop" aria-hidden="true"></div>
    <aside class="rm-menu" id="rm-menu" aria-hidden="true" role="dialog" aria-label="Navigation menu">
      <button class="rm-close" id="rm-close" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="rm-header">
        <div class="rm-avatar"></div>
        <div>
          <div class="rm-name">Dr. Jane Channel</div>
          <div class="rm-org">Platinum Aesthetics PLLC</div>
        </div>
      </div>
      <nav class="rm-nav">${navLinks}</nav>

      <div class="rm-settings">
        <p class="rm-settings-label">Dashboard Settings</p>
        <div class="rm-settings-row">
          <span class="rm-settings-key">Palette</span>
          <div class="rm-toggle" data-setting="palette">
            <button class="rm-toggle-btn" data-value="colored">Colored</button>
            <button class="rm-toggle-btn" data-value="gold">Gold</button>
          </div>
        </div>
        <div class="rm-settings-row">
          <span class="rm-settings-key">Density</span>
          <div class="rm-toggle" data-setting="density">
            <button class="rm-toggle-btn" data-value="compact">Compact</button>
            <button class="rm-toggle-btn" data-value="spacious">Spacious</button>
          </div>
        </div>
      </div>

      <div class="rm-foot">
        <a href="#">Account Settings</a>
        <a href="#">Help &amp; Support</a>
        <a href="#" class="sign-out">Sign Out</a>
      </div>
    </aside>
  `;

  function inject() {
    const host = document.createElement('div');
    host.innerHTML = menuHTML;
    while (host.firstChild) document.body.appendChild(host.firstChild);

    const menu = document.getElementById('rm-menu');
    const backdrop = document.getElementById('rm-backdrop');
    const closeBtn = document.getElementById('rm-close');

    function open() {
      menu.classList.add('open');
      backdrop.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      menu.classList.remove('open');
      backdrop.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.nav-avatar').forEach(avatar => {
      avatar.setAttribute('role', 'button');
      avatar.setAttribute('aria-label', 'Open menu');
      avatar.setAttribute('tabindex', '0');
      avatar.addEventListener('click', open);
      avatar.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });

    // ─── Wire up settings toggles ───
    const dashLink = menu.querySelector('a[data-flag="dashboard"]');

    menu.querySelectorAll('.rm-toggle').forEach(toggle => {
      const key = toggle.dataset.setting;
      toggle.querySelectorAll('.rm-toggle-btn').forEach(btn => {
        if (btn.dataset.value === settings[key]) btn.classList.add('active');
        btn.addEventListener('click', () => {
          if (btn.classList.contains('active')) return;
          settings[key] = btn.dataset.value;
          writeSettings(settings);
          toggle.querySelectorAll('.rm-toggle-btn').forEach(b =>
            b.classList.toggle('active', b === btn)
          );
          const newUrl = homeUrl(settings);
          if (dashLink) dashLink.href = newUrl;

          // Apply palette live so non-home pages recolor immediately
          if (key === 'palette') applyPalette(settings.palette);

          // If user is on a home variant, jump to the matching file.
          // (Home variants have the palette baked into their tile CSS, so
          //  we need the right file to render the tiles correctly.)
          if (isOnHome && currentPage !== newUrl.toLowerCase()) {
            location.href = newUrl;
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
