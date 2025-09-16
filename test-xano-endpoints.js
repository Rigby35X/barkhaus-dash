// Test script for Xano AI endpoints
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
    } else {
      console.log('❌ Error:', response.status, typeof result === 'string' ? result : JSON.stringify(result, null, 2))
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message)
  }
  
  console.log('')
}

async function runTests() {
  console.log('🧪 Testing Xano AI Endpoints...\n')

  // Test 0: Basic connectivity - test any existing endpoint
  console.log('Test 0: Basic Connectivity')
  await testEndpoint('GET', '/render-payload?slug=test&path=/')

  // Test with organization_id = 1 (adjust as needed)
  const ORG_ID = 1

  // Test 1: AI Plan Generation
  console.log('Test 1: AI Plan Generation')
  await testEndpoint('POST', '/ai/plan', { organization_id: ORG_ID })

  // Test 2: AI Copy Generation
  console.log('Test 2: AI Copy Generation')
  await testEndpoint('POST', '/ai/copy', { organization_id: ORG_ID })

  console.log('🧪 Xano Tests Complete!')
}

if (!AUTH_TOKEN) {
  console.error('❌ XANO_AUTH_TOKEN not found in .env file')
  process.exit(1)
}

runTests().catch(console.error)
