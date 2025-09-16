// Test simple endpoint
import dotenv from 'dotenv'
dotenv.config()

const XANO_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

async function testSimple() {
  const url = `${XANO_BASE}/test`
  
  try {
    console.log('🧪 Testing simple endpoint...')
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    })
    
    console.log(`Status: ${response.status}`)
    const result = await response.json()
    console.log('✅ Result:', JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n🎉 Basic Xano connection working!')
      
      // Now test with organizations table
      console.log('\n🔍 Testing organizations table...')
      await testOrganizations()
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function testOrganizations() {
  // Test AI plan with tenant_id 1
  const url = `${XANO_BASE}/ai/plan`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ tenant_id: 1 })
    })
    
    console.log(`AI Plan Status: ${response.status}`)
    const result = await response.json()
    console.log('AI Plan Result:', JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error('❌ AI Plan Error:', error.message)
  }
}

testSimple()
