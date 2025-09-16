// GET /render-payload?slug=&path=
// Returns all data needed to render a public site page

const slug = request.query.slug || ''
const path = request.query.path || '/'

try {
  // 1. Find organization by subdomain
  const orgResults = await xano.db.query(`
    SELECT * FROM organizations 
    WHERE subdomain = ? AND is_active = true
    LIMIT 1
  `, [slug])
  
  if (!orgResults || orgResults.length === 0) {
    return {
      error: 'Organization not found',
      slug: slug
    }
  }
  
  const organization = orgResults[0]
  const tenantId = organization.tenant_id
  
  // 2. Get design settings
  const designResults = await xano.db.query(`
    SELECT * FROM design_settings 
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])
  
  const design = designResults[0] || {
    template_name: 'classic',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    background_color: '#FFFFFF',
    font_color: '#1F2937',
    heading_font_family: 'Inter',
    body_font_family: 'Inter'
  }
  
  // 3. Get site content
  const contentResults = await xano.db.query(`
    SELECT * FROM site_content 
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])
  
  const site_content = contentResults[0] || {}
  
  // 4. Get site config
  const configResults = await xano.db.query(`
    SELECT * FROM site_config 
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])
  
  const site_config = configResults[0] || {}
  
  // 5. Get the page
  const pageResults = await xano.db.query(`
    SELECT * FROM pages 
    WHERE tenant_id = ? AND path = ? AND status = 'published'
    LIMIT 1
  `, [tenantId, path])
  
  if (!pageResults || pageResults.length === 0) {
    return {
      error: 'Page not found',
      path: path,
      tenant_id: tenantId
    }
  }
  
  const page = pageResults[0]
  
  // 6. Get sections
  const sectionsResults = await xano.db.query(`
    SELECT * FROM page_sections 
    WHERE tenant_id = ? AND is_enabled = true
    ORDER BY sort_order ASC
  `, [tenantId])
  
  const sections = (sectionsResults || []).map(section => ({
    ...section,
    data: section.content_json ? JSON.parse(section.content_json) : {},
    type: section.section_name
  }))
  
  // 7. Get animals if needed
  let animals = []
  const hasAnimalsSection = sections.some(s => s.section_name === 'grid-animals')
  
  if (hasAnimalsSection) {
    const animalsResults = await xano.db.query(`
      SELECT * FROM dogs 
      WHERE tenant_id = ? AND status = 'Available'
      ORDER BY created_at DESC
      LIMIT 24
    `, [tenantId])
    
    animals = animalsResults || []
  }
  
  // 8. Get services
  const servicesResults = await xano.db.query(`
    SELECT * FROM services 
    WHERE tenant_id = ? AND is_active = true
    ORDER BY sort_order ASC
  `, [tenantId])
  
  const services = servicesResults || []
  
  return {
    design,
    page: {
      ...page,
      sections
    },
    animals,
    services,
    site_content,
    site_config,
    organization: {
      name: organization.organization_name || organization.name,
      slug: organization.subdomain,
      logo_url: design.logo_url,
      tenant_id: tenantId
    }
  }
  
} catch (error) {
  return {
    error: 'Internal server error',
    details: error.message,
    slug: slug,
    path: path
  }
}
