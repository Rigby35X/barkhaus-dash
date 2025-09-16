// Test Xano API connection from the browser
import { fetchSiteData, generateAISite, fetchAnalytics } from './src/api/xano.ts'

async function testXanoConnection() {
  console.log('🧪 Testing Xano API connection...')
  
  // Test 1: Fetch site data
  console.log('\n1. Testing fetchSiteData...')
  try {
    const result = await fetchSiteData('happy-paws')
    console.log('✅ fetchSiteData result:', result)
  } catch (error) {
    console.log('❌ fetchSiteData error:', error)
  }
  
  // Test 2: Generate AI site
  console.log('\n2. Testing generateAISite...')
  try {
    const result = await generateAISite(1)
    console.log('✅ generateAISite result:', result)
  } catch (error) {
    console.log('❌ generateAISite error:', error)
  }
  
  // Test 3: Fetch analytics
  console.log('\n3. Testing fetchAnalytics...')
  try {
    const result = await fetchAnalytics(1)
    console.log('✅ fetchAnalytics result:', result)
  } catch (error) {
    console.log('❌ fetchAnalytics error:', error)
  }
}

// Run tests
testXanoConnection()
