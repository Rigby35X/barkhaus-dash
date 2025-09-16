// GET /render-payload?slug=&path=
// Returns all data needed to render a public site page

// Input parameters
const slug = request.query.slug || ''
const path = request.query.path || '/'

try {
  // 1. Fetch organization by subdomain/slug
  const orgQuery = await xano.db.query(`
    SELECT * FROM org_data
    WHERE subdomain = ? AND is_active = true
    LIMIT 1
  `, [slug])

  if (orgQuery.length === 0) {
    return response.status(404).json({ error: 'Organization not found' })
  }

  const organization = orgQuery[0]
  const tenantId = organization.tenant_id

  // 2. Fetch design settings
  const designQuery = await xano.db.query(`
    SELECT * FROM design_settings
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])

  const design = designQuery[0] || {
    template_name: 'classic',
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    background_color: '#FFFFFF',
    font_color: '#1F2937',
    heading_font_family: 'Inter',
    body_font_family: 'Inter'
  }

  // 3. Fetch site content (contact info, mission, etc.)
  const contentQuery = await xano.db.query(`
    SELECT * FROM site_content
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])

  const site_content = contentQuery[0] || {
    site_name: organization.organization_name,
    mission_statement: 'Helping animals find loving homes',
    phone: organization.phone,
    email: organization.email,
    address_line1: organization.address
  }

  // 4. Fetch site config
  const configQuery = await xano.db.query(`
    SELECT * FROM site_config
    WHERE tenant_id = ?
    LIMIT 1
  `, [tenantId])

  const site_config = configQuery[0] || {
    site_name: organization.organization_name,
    mission_statement: site_content.mission_statement,
    primary_color: design.primary_color
  }

  // 5. Fetch the published page matching the path
  const pageQuery = await xano.db.query(`
    SELECT * FROM pages
    WHERE tenant_id = ? AND path = ? AND status = 'published'
    LIMIT 1
  `, [tenantId, path])

  if (pageQuery.length === 0) {
    return response.status(404).json({ error: 'Page not found' })
  }

  const page = pageQuery[0]

  // 6. Fetch sections for this page
  const sectionsQuery = await xano.db.query(`
    SELECT * FROM page_sections
    WHERE tenant_id = ? AND is_enabled = true
    ORDER BY sort_order ASC
  `, [tenantId])

  // Parse section content_json
  const sections = sectionsQuery.map(section => ({
    ...section,
    data: section.content_json ? JSON.parse(section.content_json) : {},
    type: section.section_name
  }))

  // 7. Fetch available animals (if page has grid-animals section)
  const hasAnimalsSection = sections.some(s => s.section_name === 'grid-animals')
  let animals = []

  if (hasAnimalsSection) {
    const animalsQuery = await xano.db.query(`
      SELECT * FROM dogs
      WHERE tenant_id = ? AND status = 'Available'
      ORDER BY created_at DESC
      LIMIT 24
    `, [tenantId])

    animals = animalsQuery || []
  }

  // 8. Fetch services
  const servicesQuery = await xano.db.query(`
    SELECT * FROM services
    WHERE tenant_id = ? AND is_active = true
    ORDER BY sort_order ASC
  `, [tenantId])

  const services = servicesQuery || []

  // Return complete render payload
  return response.json({
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
      name: organization.organization_name,
      slug: organization.subdomain,
      logo_url: design.logo_url,
      tenant_id: tenantId
    }
  })

} catch (error) {
  console.error('Render payload error:', error)
  return response.status(500).json({
    error: 'Internal server error',
    details: error.message
  })
}
