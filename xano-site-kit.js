/*
  Xano Site Integration Kit (HTML-first)
  - Drop this file into your HTML template and include via <script src="/xano-site-kit.js" defer></script>
  - Annotate sections with data-xano attributes to auto-mount components.

  CONFIG expects your Xano API group bases (not endpoints). Each component hits /orgs/{orgId}/... under the matching group.

  Example HTML usage:
    <body data-org-id="3">
      <header data-xano="header"></header>
      <main>
        <section data-xano="hero" data-page-slug="home"></section>
        <section data-xano="animals-list"></section>
      </main>
      <footer data-xano="footer"></footer>
      <script src="/xano-site-kit.js" defer></script>
    </body>
*/
(function(){
  // -------------------------
  // 1) CONFIG
  // -------------------------
  const CONFIG = {
    // Group bases (no trailing slash). Replace with your real group URLs.
    groups: {
      animals: "https://x8ki-letl-twmt.n7.xano.io/api:Od874PbA",
      page_sections: "https://x8ki-letl-twmt.n7.xano.io/api:9udBpP-x",
      pages: "https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM",
      services: "https://x8ki-letl-twmt.n7.xano.io/api:kPow7KJL",
      design: "https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239",
      site_config: "https://x8ki-letl-twmt.n7.xano.io/api:1vOYCkyt",
    },
    defaults: {
      orgId: 3, // fallback for testing; overridden by <body data-org-id>
      animalsPageSlug: "available-animals",
      homeSlug: "home",
    },
  };

  // -------------------------
  // 2) UTILITIES
  // -------------------------
  function qs(name){ return new URLSearchParams(location.search).get(name); }
  function resolveOrgId(){
    const fromBody = parseInt(document.body?.dataset?.orgId||"",10);
    const fromQS = parseInt(qs("orgId")||"",10);
    return [fromBody, fromQS, CONFIG.defaults.orgId].find(n=>Number.isInteger(n)&&n>0);
  }
  async function fetchJSON(url){
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const ct = (res.headers.get("content-type")||"").toLowerCase();
    if (!ct.includes("application/json")) {
      const preview = (await res.text()).slice(0,160);
      throw new Error(`Expected JSON from ${url}; got ${ct}. Preview: ${preview}`);
    }
    return res.json();
  }
  function bySel(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // Image URL normalizer (handles relative/file-like paths)
  function normalizeImage(raw){
    if (!raw || typeof raw !== 'string') return '';
    if (raw.startsWith('//')) return 'https:'+raw;
    if (/^https?:\/\//i.test(raw)) return raw.replace(/^http:\/\//i,'https://');
    if (raw.startsWith('/')) return raw; // assume absolute already
    return '/' + raw.replace(/^\/+/, '');
  }

  // -------------------------
  // 3) BRAND / DESIGN SETTINGS
  // -------------------------
  async function applyBrand(orgId){
    try {
      const base = CONFIG.groups.design;
      const u = `${base}/orgs/${orgId}/design_settings`;
      const s = await fetchJSON(u);
      const root = document.documentElement.style;
      if (s.primary) root.setProperty('--brand-primary', s.primary);
      if (s.secondary) root.setProperty('--brand-secondary', s.secondary);
      if (s.text) root.setProperty('--brand-text', s.text);
      if (s.bg) root.setProperty('--brand-bg', s.bg);
      if (s.font_heading){
        ensureGoogleFont(s.font_heading);
        root.setProperty('--brand-font-heading', s.font_heading);
      }
      if (s.font_body){
        ensureGoogleFont(s.font_body);
        root.setProperty('--brand-font-body', s.font_body);
      }
      // Expose logo & nav/footer links to other components
      window.__XANO_BRAND__ = {
        logo_url: s.logo_url || '',
        navLinks: s.navLinks || [],
        footerLinks: s.footerLinks || [],
        donationLink: s.donationLink || s.donate_url || '',
      };
    } catch(e){ console.warn('Brand apply failed:', e.message); }
  }

  function ensureGoogleFont(family){
    const id = `gf-${family.replace(/\s+/g,'-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);
  }

  // -------------------------
  // 4) COMPONENTS
  // -------------------------
  async function mountHeader(el, orgId){
    await applyBrand(orgId);
    const brand = window.__XANO_BRAND__ || {};
    const logo = brand.logo_url ? `<img src="${brand.logo_url}" alt="Logo" style="height:40px">` : '';
    const nav = (brand.navLinks||[]).map(l=>`<a href="${l.url}">${l.label}</a>`).join('');
    el.innerHTML = `
      <div class="xh-wrap">
        <a class="xh-logo" href="/">${logo}</a>
        <nav class="xh-nav">${nav}</nav>
      </div>`;
  }

  async function mountFooter(el, orgId){
    await applyBrand(orgId);
    const brand = window.__XANO_BRAND__ || {};
    const links = (brand.footerLinks||[]).map(l=>`<a href="${l.url}">${l.label}</a>`).join(' • ');
    el.innerHTML = `
      <div class="xf-wrap">
        <div class="xf-links">${links}</div>
        <div class="xf-copy">© ${new Date().getFullYear()}</div>
      </div>`;
  }

  async function mountAnimalsList(el, orgId){
    const base = CONFIG.groups.animals;
    const u = `${base}/orgs/${orgId}/animals`;
    const list = await fetchJSON(u);
    if (!Array.isArray(list) || list.length===0){ el.innerHTML = '<p>No animals right now.</p>'; return; }
    el.innerHTML = `
      <div class="xa-grid">
        ${list.map(a=>{
          const img = normalizeImage(a.image_url||'');
          return `
            <article class="xa-card" data-id="${a.id}">
              <a href="/animals/${encodeURIComponent(String(a.id))}?orgId=${orgId}">
                <img class="xa-img" src="${img}" alt="${a.name||''}" loading="lazy">
                <div class="xa-body">
                  <h3 class="xa-name">${a.name||'Unnamed'}</h3>
                  <div class="xa-meta">${a.breed||''}${a.status?` • ${a.status}`:''}</div>
                </div>
              </a>
            </article>`;
        }).join('')}
      </div>`;
  }

  async function mountAnimalDetail(el, orgId){
    const id = el.dataset.animalId || qs('animalId') || location.pathname.split('/').filter(Boolean).pop();
    if (!id){ el.innerHTML = '<p>Missing animal id.</p>'; return; }
    const base = CONFIG.groups.animals;
    const u = `${base}/orgs/${orgId}/animals/${encodeURIComponent(id)}`;
    const a = await fetchJSON(u);
    if (!a || !a.id){ el.innerHTML = '<p>Animal not found.</p>'; return; }
    const img = normalizeImage(a.image_url||'');
    el.innerHTML = `
      <article class="xad">
        <div class="xad-media"><img src="${img}" alt="${a.name||''}"></div>
        <div class="xad-content">
          <h1 class="xad-name">${a.name||''}</h1>
          <div class="xad-meta">${a.breed||''}${a.age?` • ${a.age}`:''}${a.status?` • ${a.status}`:''}</div>
          ${a.description?`<p class="xad-desc">${a.description}</p>`:''}
          ${a.description_long?`<div class="xad-long">${a.description_long}</div>`:''}
          <a class="btn" href="/applications?type=adoption&animalId=${encodeURIComponent(String(a.id))}&orgId=${orgId}">Apply to Adopt</a>
        </div>
      </article>`;
  }

  async function mountServices(el, orgId){
    const base = CONFIG.groups.services;
    const u = `${base}/orgs/${orgId}/services`;
    const list = await fetchJSON(u);
    if (!Array.isArray(list) || list.length===0){ el.innerHTML = '<p>No services configured.</p>'; return; }
    el.innerHTML = `
      <div class="xs-grid">
        ${list.map(s=>`
          <article class="xs-card">
            <h3>${s.title||''}</h3>
            <p>${s.description||''}</p>
          </article>`).join('')}
      </div>`;
  }

  async function mountPageSections(el, orgId, slug){
    const base = CONFIG.groups.page_sections;
    const u = `${base}/orgs/${orgId}/page_sections?slug=${encodeURIComponent(slug||CONFIG.defaults.homeSlug)}`;
    const sections = await fetchJSON(u);
    if (!Array.isArray(sections) || !sections.length){ el.innerHTML=''; return; }
    sections.sort((a,b)=> (a.order??0)-(b.order??0));
    el.innerHTML = sections.map(renderSection).join('');
  }

  function renderSection(s){
    const t = s.section_type;
    const c = s.content_json || {};
    if (t === 'hero') {
      return `
        <section class="sec-hero" style="${c.backgroundImage?`background-image:url('${c.backgroundImage}');`:''}">
          <div class="wrap">
            <h1>${c.title||''}</h1>
            ${c.subtitle?`<p>${c.subtitle}</p>`:''}
            ${c.ctaText?`<a class="btn" href="${c.ctaLink||'#'}">${c.ctaText}</a>`:''}
          </div>
        </section>`;
    }
    if (t === 'about') {
      return `
        <section class="sec-about"><div class="wrap">
          <h2>${c.heading||'About Us'}</h2>
          ${c.image?`<img class="about-img" src="${c.image}" alt="">`:''}
          <p>${c.body||''}</p>
        </div></section>`;
    }
    if (t === 'available_animals') {
      // placeholder container; actual list mounts separately if you add data-xano="animals-list"
      return `
        <section class="sec-available"><div class="wrap">
          <h2>${c.title||'Available Animals'}</h2>
          ${c.subtitle?`<p>${c.subtitle}</p>`:''}
          <div data-xano="animals-list"></div>
        </div></section>`;
    }
    if (t === 'contact') {
      return `
        <section class="sec-contact"><div class="wrap">
          <h2>${c.title||'Contact Us'}</h2>
          ${c.address?`<p>${c.address}</p>`:''}
          ${c.phone?`<p>${c.phone}</p>`:''}
          ${c.email?`<p><a href="mailto:${c.email}">${c.email}</a></p>`:''}
        </div></section>`;
    }
    // Add more: services, donate, footer, etc.
    return '';
  }

  async function mountApplications(el, orgId){
    // Simple router: show three buttons or embed forms. If your Xano has endpoints, wire here.
    const brand = window.__XANO_BRAND__||{};
    el.innerHTML = `
      <div class="xa-apps">
        <a class="btn" href="/applications/adoption?orgId=${orgId}">Adoption Application</a>
        <a class="btn" href="/applications/foster?orgId=${orgId}">Foster Application</a>
        <a class="btn" href="/applications/volunteer?orgId=${orgId}">Volunteer Application</a>
        ${brand.donationLink?`<a class="btn" href="${brand.donationLink}">Donate</a>`:''}
      </div>`;
  }

  async function mountDonate(el, orgId){
    await applyBrand(orgId);
    const brand = window.__XANO_BRAND__||{};
    if (brand.donationLink) {
      el.innerHTML = `<a class="btn" href="${brand.donationLink}">Donate Now</a>`;
    } else {
      el.innerHTML = `<p>Donation link not configured.</p>`;
    }
  }

  // -------------------------
  // 5) AUTO-MOUNTER
  // -------------------------
  async function boot(){
    const orgId = resolveOrgId();
    // Basic CSS vars to ensure theme works even without design_settings
    const root = document.documentElement.style;
    if (!getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'))
      root.setProperty('--brand-primary', '#ff6a3e');

    const tasks = [];
    bySel('[data-xano="header"]').forEach(el=> tasks.push(mountHeader(el, orgId)));
    bySel('[data-xano="footer"]').forEach(el=> tasks.push(mountFooter(el, orgId)));
    bySel('[data-xano="animals-list"]').forEach(el=> tasks.push(mountAnimalsList(el, orgId)));
    bySel('[data-xano="animal-detail"]').forEach(el=> tasks.push(mountAnimalDetail(el, orgId)));
    bySel('[data-xano="services"]').forEach(el=> tasks.push(mountServices(el, orgId)));
    bySel('[data-xano="applications"]').forEach(el=> tasks.push(mountApplications(el, orgId)));
    bySel('[data-xano="donate"]').forEach(el=> tasks.push(mountDonate(el, orgId)));
    bySel('[data-xano="hero"]').forEach(el=> tasks.push(mountPageSections(el, orgId, el.dataset.pageSlug||CONFIG.defaults.homeSlug)));
    await Promise.allSettled(tasks);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
