
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
  return data
}
