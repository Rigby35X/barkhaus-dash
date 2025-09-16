// Complete system test
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
    const result = await response.json()
    
    if (response.ok && result && typeof result === 'object') {
      console.log('✅ Success')
      if (result.success !== undefined) {
        console.log(`   Success: ${result.success}`)
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
      if (result.pages_created) {
        console.log(`   Pages Created: ${result.pages_created}`)
      }
      if (result.sections_updated) {
        console.log(`   Sections Updated: ${result.sections_updated}`)
      }
      return result
    } else {
      console.log('❌ Failed:', response.status, result)
      return null
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
    return null
  }
}

async function runCompleteTest() {
  console.log('🚀 Testing Complete AI System...\n')
  
  // Test 1: Basic connectivity
  console.log('=== Test 1: Basic Connectivity ===')
  const testResult = await testEndpoint('GET', '/test')
  
  if (!testResult || !testResult.success) {
    console.log('❌ Basic test failed. Check Xano endpoints.')
    return
  }
  
  console.log('✅ Basic connectivity working\n')
  
  // Test 2: AI Plan Generation
  console.log('=== Test 2: AI Plan Generation ===')
  const planResult = await testEndpoint('POST', '/ai/plan', { tenant_id: 1 })
  
  if (!planResult || !planResult.success) {
    console.log('❌ AI Plan failed. Trying tenant_id 2...')
    const planResult2 = await testEndpoint('POST', '/ai/plan', { tenant_id: 2 })
    
    if (!planResult2 || !planResult2.success) {
      console.log('❌ AI Plan failed for multiple tenant_ids')
      return
    }
  }
  
  console.log('✅ AI Plan generation working\n')
  
  // Test 3: AI Copy Generation
  console.log('=== Test 3: AI Copy Generation ===')
  const copyResult = await testEndpoint('POST', '/ai/copy', { tenant_id: 1 })
  
  if (copyResult && copyResult.success) {
    console.log('✅ AI Copy generation working\n')
  } else {
    console.log('⚠️ AI Copy may need sections to exist first\n')
  }
  
  // Test 4: Complete AI Pipeline
  console.log('=== Test 4: Complete AI Pipeline ===')
  const allResult = await testEndpoint('POST', '/ai/all', { tenant_id: 3 })
  
  if (allResult && allResult.success) {
    console.log('✅ Complete AI pipeline working')
    console.log(`   Summary: ${JSON.stringify(allResult.summary, null, 2)}`)
  } else {
    console.log('⚠️ Complete pipeline needs debugging')
  }
  
  console.log('\n🎉 System Test Complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Update your Xano endpoints with the fixed code')
  console.log('2. Test with your actual tenant_ids')
  console.log('3. Move to Next.js SSR system')
}

if (!AUTH_TOKEN) {
  console.error('❌ XANO_AUTH_TOKEN not found')
  process.exit(1)
}

runCompleteTest().catch(console.error)
