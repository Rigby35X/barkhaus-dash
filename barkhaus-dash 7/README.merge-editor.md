
# Barkhaus Dash ⟷ Inline Editor Merge Kit

This kit gives you a **concrete migration path** to run the inline website editor *inside* the Barkhaus dashboard (Vite + React), pulling the logged-in user's tenant data from Xano and saving back through your existing APIs.

## What you'll do

1) **Create an `editor` feature module** inside the Vite app.
2) **Port the Next.js-only bits** (server actions, `next/image`, `Link`) to plain React.
3) **Mount the editor** at `/editor` (router page) or as a full-screen modal from anywhere in the dash.
4) **Unify auth**: sign a short-lived **Edit JWT** in the dash and pass it to the editor. The editor uses that token to call your Vite `/api/*` proxies → Xano.
5) **Wire CRUD** for `design_settings`, `live_site_content`, `pages`, `templates` and **Publish**.

---

## Folder wiring (Vite)

```
src/
  editor/
    components/        # migrated from inline-editor/components
    hooks/             # migrated from inline-editor/hooks
    lib/               # migrated from inline-editor/lib (strip Next deps)
    EditorShell.tsx    # wrapper: loads tenant data, renders InlineCanvas + Sidebar
    api.ts             # typed API client -> your Vite /api proxy
    state.ts           # Zustand store for editor
  pages/
    EditorPage.tsx     # route component to mount <EditorShell/>
  services/
    auth.ts            # sign/verify edit JWT via `jose`
    xanoProxy.ts       # helpers for talking to Vite server proxy
  router.tsx           # add /editor route
```

---

## Install deps (in barkhaus-dash)

```bash
npm i jose zod axios zustand qs
```

*(You already have many of these, adjust accordingly.)*

---

## 1) Add a Vite dev/server proxy for Xano

**vite.config.ts**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // prevent CORS in dev; change targets to your Xano bases
      '/api/xano/auth': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:XqEb_TVK', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/auth/, '') },
      '/api/xano/live': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/live/, '') },
      '/api/xano/design': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:0BQDG239', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/design/, '') },
      '/api/xano/pages': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:mlssTgVM', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/pages/, '') },
      '/api/xano/templates': { target: 'https://x8ki-letl-twmt.n7.xano.io/api:cz-ZpYmR', changeOrigin: true, rewrite: p => p.replace(/^\/api\/xano\/templates/, '') },
    }
  }
})
```

In production (Vercel/Netlify), add a tiny Node/Edge proxy or call Xano directly from the serverless functions.

---

## 2) Sign a short-lived **Edit JWT** (dash → editor)

**src/services/auth.ts**
```ts
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(import.meta.env.VITE_EDIT_JWT_SECRET)

export type EditClaims = {
  sub: string      // userId
  tid: string      // tenantId
  role: 'admin'|'editor'|'viewer'
}

export async function signEditToken(claims: EditClaims) {
  return await new SignJWT(claims as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(SECRET)
}

export async function verifyEditToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload as unknown as EditClaims
}
```

Expose an endpoint to mint tokens when user hits “Edit Site”.

**src/server/routes/editor.ts (express-style if you have a dev server)**

If you don’t have a custom server, you can inline this logic in a client action that calls your auth provider and just hands the claims to `signEditToken` in the browser (not ideal). Prefer a server Function/Action.

---

## 3) API client used by the editor

**src/editor/api.ts**
```ts
import axios from 'axios'

export async function getDesignSettings(tenantSlug: string) {
  const { data } = await axios.get(`/api/xano/design/design_settings?tenant_slug=${tenantSlug}`)
  return data
}

export async function getLiveSite(tenantId: number) {
  const { data } = await axios.get(`/api/xano/live/live_site_content?tenant_id=${tenantId}`)
  return data
}

export async function getPages(tenantId: number) {
  const { data } = await axios.get(`/api/xano/pages/pages?tenant_id=${tenantId}`)
  return data
}

export async function savePage(payload: any) {
  const { data } = await axios.post(`/api/xano/pages/pages`, payload)
  return data
}

export async function publish(payload: { pageSlug?: string, tenant_id: number }) {
  const { data } = await axios.post(`/api/xano/live/publish`, payload)
  return data // { success: true }
}
```

---

## 4) Editor Shell (hosted inside dash)

**src/editor/EditorShell.tsx**
```tsx
import React, { useEffect, useMemo, useState } from 'react'
import { getDesignSettings, getLiveSite, getPages, savePage, publish } from './api'
import { useTenant } from '@/contexts/TenantContext' // you already have this in dash
import InlineCanvas from './components/InlineCanvas'  // ported from inline editor
import Sidebar from './components/Sidebar'            // ported from inline editor

export default function EditorShell() {
  const { currentTenant } = useTenant()
  const [loading, setLoading] = useState(true)
  const [design, setDesign] = useState<any>(null)
  const [live, setLive] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function run() {
      if (!currentTenant) return
      setLoading(true)
      const [d, l, p] = await Promise.all([
        getDesignSettings(currentTenant.slug),
        getLiveSite(currentTenant.id),
        getPages(currentTenant.id)
      ])
      if (!mounted) return
      setDesign(d)
      setLive(l)
      setPages(p)
      setLoading(false)
    }
    run()
    return () => { mounted = false }
  }, [currentTenant])

  if (!currentTenant) return <div className="p-8">No tenant selected.</div>
  if (loading) return <div className="p-8">Loading editor…</div>

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar
        design={design}
        pages={pages}
        onSave={async (payload) => { await savePage(payload) }}
        onPublish={async (pageSlug?: string) => { await publish({ pageSlug, tenant_id: currentTenant.id }) }}
      />
      <InlineCanvas
        tenant={currentTenant}
        design={design}
        live={live}
      />
    </div>
  )
}
```

> **Porting note:** Replace any `next/image` with plain `<img>` and any `next/link` with `react-router-dom`'s `<Link>`.

---

## 5) Route to mount the editor

**src/pages/EditorPage.tsx** (or your existing router page)
```tsx
import React from 'react'
import EditorShell from '@/editor/EditorShell'

export default function EditorPage() {
  return <EditorShell />
}
```

Wire into your router at `/editor` and add a “Edit Site” button in your dash pointing there.

---

## 6) Port Inline Editor components

From the inline-editor zip, move **`components/`**, **`hooks/`**, **`lib/`** into `src/editor/…` and fix imports:

- Remove Next-only utilities (server actions, headers, `cache()`).
- Convert any `use server` functions into calls to `src/editor/api.ts`.
- Replace `next-themes` ThemeProvider with your dash's existing theme. If you want to keep it, mount a single `ThemeProvider` at the dash root so both app + editor share tokens.

---

## 7) Unified Publish flow

In Xano, expose: `Accepts { pageSlug?: string, tenant_id } → { success: true }`.
In the dash, call `publish({ pageSlug, tenant_id })` from the Sidebar's Publish button.

---

## 8) Permissions

Use your existing `useTenant()` + user session to decide who can enter `/editor`. Optionally, require an **Edit JWT**; store it in memory and send as `Authorization: Bearer <token>` on editor API calls, then verify in your proxy/edge functions.

---

## 9) Migration checklist

- [ ] Add Vite proxy for Xano bases
- [ ] Add `src/services/auth.ts` (jose) and set `VITE_EDIT_JWT_SECRET`
- [ ] Create `src/editor/` module and copy components/hooks/lib from inline editor
- [ ] Replace Next imports with React Router & `<img>`
- [ ] Implement `src/editor/api.ts` methods to hit your Xano groups
- [ ] Mount route `/editor` and surface “Edit Site” CTA
- [ ] Smoke-test: load tenant data, edit content, save, publish

---

## Troubleshooting

- **"Cannot find module 'jsonwebtoken'"** → You don't need `jsonwebtoken`; you're already using **`jose`**. Remove `jsonwebtoken` and its types, use the `auth.ts` above.
- **CORS in dev** → ensure the Vite `server.proxy` entries match your Xano bases.
- **Fonts/colors not applying** → confirm `design_settings` values are injected into CSS variables at the canvas root; re-run your CSS-in-JS or Tailwind theme mapping.
- **Empty pages/regions** → confirm the tenant_id/slug being sent matches what Xano expects and that your seed data exists.

---

## Notes

This kit is intentionally minimal but production-friendly: isolate the editor as a feature module, avoid iframe, share state and theme with the dash, and use a single auth/session source.
