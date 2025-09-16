// Test debug endpoint
import dotenv from 'dotenv'
dotenv.config()

const XANO_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:nS8IsiFR'
const AUTH_TOKEN = process.env.XANO_AUTH_TOKEN

async function testDebug() {
  const url = `${XANO_BASE}/debug-tables`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    })
    
    const result = await response.json()
    console.log('🔍 Debug Results:')
    console.log(JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message)
  }
}

testDebug()
