"use client"

// Small client helper to forward the localStorage token to our Next.js API routes.
// It sends the token as "x-xano-token" header so server routes can forward it to Xano.
export function withXanoAuth(init?: RequestInit): RequestInit {
  try {
    const token = localStorage.getItem("xano_auth_token") || ""
    const headers: HeadersInit = {
      ...(init?.headers || {}),
    }
    if (token) {
      headers["x-xano-token"] = token
    }
    return { ...init, headers }
  } catch {
    return init || {}
  }
}

// Optional: persist the token into an HTTP-only cookie via our API
export async function persistXanoTokenToCookie() {
  try {
    const token = localStorage.getItem("xano_auth_token")
    if (!token) return
    await fetch("/api/auth/xano-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
  } catch {
    // ignore
  }
}
