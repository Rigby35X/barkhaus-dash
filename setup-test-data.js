// Script to create test data in Xano
import dotenv from 'dotenv'
dotenv.config()

const XANO_GROUPS = {
  primary: "https://x8ki-letl-twmt.n7.xano.io/api:wPrzs4Mr",
  live_site: "https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR",
}

const AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

async function xanoRequest(group, method, path, data = null) {
  const url = `${XANO_GROUPS[group]}${path}`
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  }
  
  if (data && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(data)
  }
  
  console.log(`🌐 ${method} ${group}${path}`)
  
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Success:', JSON.stringify(result, null, 2))
      return result
    } else {
      console.log('❌ Error:', response.status, JSON.stringify(result, null, 2))
      return null
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message)
    return null
  }
}

async function setupTestData() {
  console.log('🏗️ Setting up test data in Xano...\n')
  
  // 1. Create test organization
  console.log('Step 1: Creating test organization')
  const orgData = {
    organization_name: "Happy Paws Rescue",
    name: "Happy Paws Rescue",
    email: "info@happypaws.org",
    phone: "(555) 123-4567",
    address: "123 Rescue Lane, San Francisco, CA 94102",
    tenant_id: 1, // Use tenant_id 1 for testing
    orgId: "happy-paws-001",
    website: "https://happypaws.org",
    tax_id: "12-3456789",
    subdomain: "happy-paws",
    custom_domain: "",
    is_active: true
  }

  const org = await xanoRequest('primary', 'POST', '/org_data', orgData)

  if (!org) {
    console.log('❌ Failed to create organization. Using tenant_id 1 for testing.')
  } else {
    console.log(`✅ Created organization with ID: ${org.id}`)
  }

  const tenantId = 1 // Use fixed tenant_id for testing
  console.log(`Using tenant_id: ${tenantId}\n`)

  // 2. Create design settings
  console.log('Step 2: Creating design settings')
  const designData = {
    tenant_id: tenantId,
    template_name: "classic",
    primary_color: "#3B82F6",
    secondary_color: "#1E40AF",
    background_color: "#FFFFFF",
    font_color: "#1F2937",
    heading_font_family: "Inter",
    body_font_family: "Inter",
    accent_color: "#F59E0B"
  }

  await xanoRequest('primary', 'POST', '/design_settings', designData)

  // 3. Create site content
  console.log('Step 3: Creating site content')
  const contentData = {
    tenant_id: tenantId,
    site_name: "Happy Paws Rescue",
    tagline: "Saving lives, one paw at a time",
    phone: "(555) 123-4567",
    email: "info@happypaws.org",
    mission_statement: "Saving lives, one paw at a time",
    address_line1: "123 Rescue Lane",
    address_line2: "San Francisco, CA 94102"
  }

  await xanoRequest('primary', 'POST', '/site_content', contentData)

  // 4. Create site config
  console.log('Step 4: Creating site config')
  const configData = {
    tenant_id: tenantId,
    site_name: "Happy Paws Rescue",
    mission_statement: "Saving lives, one paw at a time",
    primary_color: "#3B82F6"
  }

  await xanoRequest('primary', 'POST', '/site_config', configData)

  // 5. Test the AI plan generation
  console.log('Step 5: Testing AI plan generation')
  const planResult = await xanoRequest('live_site', 'POST', '/ai/plan', { tenant_id: tenantId })

  if (planResult && planResult.success) {
    console.log(`✅ AI Plan generated: ${planResult.pages_created} pages created`)

    // 6. Test AI copy generation
    console.log('Step 6: Testing AI copy generation')
    const copyResult = await xanoRequest('live_site', 'POST', '/ai/copy', { tenant_id: tenantId })

    if (copyResult && copyResult.success) {
      console.log(`✅ AI Copy generated: ${copyResult.sections_updated} sections updated`)
    }
  }

  // 7. Test render payload
  console.log('Step 7: Testing render payload')
  await xanoRequest('live_site', 'GET', '/render-payload?slug=happy-paws&path=/')

  console.log('\n🎉 Test data setup complete!')
  console.log(`\n🔗 Test your site with tenant_id ${tenantId}`)
}

if (!AUTH_TOKEN) {
  console.error('❌ XANO_AUTH_TOKEN not found in .env file')
  process.exit(1)
}

setupTestData().catch(console.error)
