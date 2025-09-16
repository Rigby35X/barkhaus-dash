// Test script to verify API endpoints are working
import { 
  fetchOrganizations, 
  fetchAnimals, 
  fetchTemplates, 
  fetchPages,
  fetchSiteData 
} from '../api/xano'

export async function testAllEndpoints() {
  console.log('🧪 Testing all Xano API endpoints...\n')

  // Test 1: Organizations (site_config endpoint)
  console.log('1️⃣ Testing Organizations API...')
  try {
    const orgsResult = await fetchOrganizations()
    if (orgsResult.success) {
      console.log('✅ Organizations API working:', orgsResult.data)
    } else {
      console.log('❌ Organizations API failed:', orgsResult.error)
    }
  } catch (error) {
    console.log('❌ Organizations API error:', error)
  }

  // Test 2: Animals (dogs endpoint)
  console.log('\n2️⃣ Testing Animals API...')
  try {
    const animalsResult = await fetchAnimals()
    if (animalsResult.success) {
      console.log('✅ Animals API working:', animalsResult.data?.length || 0, 'animals found')
    } else {
      console.log('❌ Animals API failed:', animalsResult.error)
    }
  } catch (error) {
    console.log('❌ Animals API error:', error)
  }

  // Test 3: Templates (templates endpoint)
  console.log('\n3️⃣ Testing Templates API...')
  try {
    const templatesResult = await fetchTemplates()
    if (templatesResult.success) {
      console.log('✅ Templates API working:', templatesResult.data?.length || 0, 'templates found')
    } else {
      console.log('❌ Templates API failed:', templatesResult.error)
    }
  } catch (error) {
    console.log('❌ Templates API error:', error)
  }

  // Test 4: Pages (pages endpoint)
  console.log('\n4️⃣ Testing Pages API...')
  try {
    const pagesResult = await fetchPages(1) // Test with tenant_id 1
    if (pagesResult.success) {
      console.log('✅ Pages API working:', pagesResult.data?.length || 0, 'pages found')
    } else {
      console.log('❌ Pages API failed:', pagesResult.error)
    }
  } catch (error) {
    console.log('❌ Pages API error:', error)
  }

  // Test 5: Site Data (live_site endpoint)
  console.log('\n5️⃣ Testing Site Data API...')
  try {
    const siteResult = await fetchSiteData('happy-paws', '/')
    if (siteResult.success) {
      console.log('✅ Site Data API working:', siteResult.data)
    } else {
      console.log('❌ Site Data API failed:', siteResult.error)
    }
  } catch (error) {
    console.log('❌ Site Data API error:', error)
  }

  console.log('\n🎉 API testing complete!')
}

// Helper function to test a specific endpoint
export async function testEndpoint(endpointName: string) {
  console.log(`🧪 Testing ${endpointName} endpoint...`)
  
  switch (endpointName) {
    case 'organizations':
      return await fetchOrganizations()
    case 'animals':
      return await fetchAnimals()
    case 'templates':
      return await fetchTemplates()
    case 'pages':
      return await fetchPages(1)
    case 'site-data':
      return await fetchSiteData('happy-paws', '/')
    default:
      console.log('❌ Unknown endpoint:', endpointName)
      return { success: false, error: 'Unknown endpoint' }
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testApi = {
    testAllEndpoints,
    testEndpoint,
    fetchOrganizations,
    fetchAnimals,
    fetchTemplates,
    fetchPages,
    fetchSiteData
  }
}
