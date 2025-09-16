// Test AI endpoints with real data
import dotenv from 'dotenv'
dotenv.config()

const XANO_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

async function testEndpoint(method, path, data = null) {
  const url = `${XANO_BASE}${path}`
  
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
  
  console.log(`🌐 ${method} ${path}`)
  
  try {
    const response = await fetch(url, options)
    
    console.log(`Status: ${response.status} ${response.statusText}`)
    
    const contentType = response.headers.get('content-type')
    let result
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      result = await response.text()
    }
    
    if (response.ok) {
      console.log('✅ Success:', typeof result === 'string' ? result : JSON.stringify(result, null, 2))
      return result
    } else {
      console.log('❌ Error:', response.status, typeof result === 'string' ? result : JSON.stringify(result, null, 2))
      return null
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message)
    return null
  }
}

async function runTests() {
  console.log('🧪 Testing AI Endpoints with Real Data...\n')
  
  // Test with different tenant_ids to find one that works
  const testTenantIds = [1, 2, 3]
  
  for (const tenantId of testTenantIds) {
    console.log(`\n=== Testing with tenant_id: ${tenantId} ===`)
    
    // Test 1: AI Plan Generation
    console.log(`Test 1: AI Plan Generation (tenant_id: ${tenantId})`)
    const planResult = await testEndpoint('POST', '/ai/plan', { tenant_id: tenantId })
    
    if (planResult && planResult.success) {
      console.log(`✅ AI Plan Success! Created ${planResult.pages_created} pages`)
      
      // Test 2: AI Copy Generation
      console.log(`Test 2: AI Copy Generation (tenant_id: ${tenantId})`)
      const copyResult = await testEndpoint('POST', '/ai/copy', { tenant_id: tenantId })
      
      if (copyResult && copyResult.success) {
        console.log(`✅ AI Copy Success! Updated ${copyResult.sections_updated} sections`)
      }
      
      // Test 3: Render Payload
      console.log(`Test 3: Render Payload`)
      await testEndpoint('GET', '/render-payload?slug=test&path=/')
      
      // If we got this far, we found a working tenant_id
      console.log(`\n🎉 Found working tenant_id: ${tenantId}`)
      break
    } else {
      console.log(`❌ tenant_id ${tenantId} didn't work, trying next...`)
    }
  }
  
  console.log('\n🧪 Tests Complete!')
}

if (!AUTH_TOKEN) {
  console.error('❌ XANO_AUTH_TOKEN not found in .env file')
  process.exit(1)
}

runTests().catch(console.error)
