// Revance · site-wide slide-out navigation
// Auto-wires to any .nav-avatar click, injects full-height panel with large-font links.
(function () {
  const NAV = [
    { label: 'Dashboard',    href: 'index.html' },
    { label: 'Rewards',      href: 'rewards.html' },
    { label: 'Products',     href: 'purchase.html' },
    { label: 'Experience',   href: 'experience.html' },
    { label: 'The Numbers',  href: 'numbers.html' },
    { label: 'Check In',     href: 'checkin.html' },
  ];

  const css = `
    .rm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;transition:background .4s ease;z-index:99;}
    .rm-backdrop.open{background:rgba(0,0,0,.45);pointer-events:auto;}
    .rm-menu{
      position:fixed;top:0;right:0;
      width:min(560px,100vw);height:100vh;
      background:#fff;
      padding:72px 56px 32px;
      display:flex;flex-direction:column;gap:40px;
      transform:translateX(100%);
      transition:transform .65s cubic-bezier(.16,1,.3,1);
      z-index:101;
      overflow-y:auto;
      font-family:'Poppins',-apple-system,BlinkMacSystemFont,sans-serif;
      color:#111;
    }
    .rm-menu.open{transform:translateX(0);}
    .rm-close{
      position:absolute;top:22px;right:22px;
      width:40px;height:40px;
      background:none;border:none;cursor:pointer;
      display:grid;place-items:center;
      color:#111;
    }
    .rm-close svg{width:22px;height:22px;stroke:currentColor;}
    .rm-close:hover{background:#f5f5f5;}

    .rm-header{
      display:flex;align-items:center;gap:14px;
      padding-bottom:24px;
      border-bottom:1px solid #eaeaea;
    }
    .rm-avatar{
      width:44px;height:44px;
      background:linear-gradient(135deg,#FFB088,#FF7A9C);
      flex-shrink:0;
    }
    .rm-name{font-size:15px;font-weight:600;color:#111;letter-spacing:-.2px;}
    .rm-org{font-size:12px;font-weight:400;color:#707070;margin-top:2px;}

    .rm-nav{display:flex;flex-direction:column;gap:0;}
    .rm-nav a{
      font-size:clamp(38px,5vw,56px);
      font-weight:200;
      letter-spacing:-2px;
      color:#111;
      text-decoration:none;
      line-height:1.1;
      padding:10px 0;
      transition:transform .3s cubic-bezier(.16,1,.3,1),color .25s ease;
      display:inline-block;
    }
    .rm-nav a:hover{transform:translateX(10px);color:#b88547;}
    .rm-nav a.active{
      font-family:'Playfair Display',Georgia,serif;
      font-style:italic;
      font-weight:400;
    }

    .rm-foot{
      margin-top:auto;
      padding-top:28px;
      border-top:1px solid #eaeaea;
      display:flex;flex-direction:column;gap:12px;
    }
    .rm-foot a{
      font-size:13px;font-weight:500;color:#666;text-decoration:none;
      letter-spacing:.2px;
      transition:color .2s ease;
    }
    .rm-foot a:hover{color:#111;}
    .rm-foot .sign-out{color:#b88547;}

    .nav-avatar{cursor:pointer;}

    @media (max-width:640px){
      .rm-menu{padding:64px 28px 28px;gap:28px;}
      .rm-nav a{font-size:36px;padding:6px 0;}
    }

    @media (prefers-reduced-motion:reduce){
      .rm-menu{transition:none;}
      .rm-nav a{transition:none;}
    }
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Identify current page (so we can set .active)
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Build nav links
  const navLinks = NAV.map(item => {
    const active = item.href.toLowerCase() === currentPage ? ' class="active"' : '';
    return `<a href="${item.href}"${active}>${item.label}</a>`;
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
      <div class="rm-foot">
        <a href="#">Account Settings</a>
        <a href="#">Help &amp; Support</a>
        <a href="#" class="sign-out">Sign Out</a>
      </div>
    </aside>
  `;

  // Inject into body when DOM is ready
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

    // Wire up ALL avatar elements (works across every page's nav)
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
