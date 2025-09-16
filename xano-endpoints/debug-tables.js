// Debug endpoint to check table structure and data
// Create this as GET /debug-tables in Xano

try {
  console.log('🔍 Debug: Checking tables and data...')
  
  // Check org_data table
  const orgQuery = await xano.db.query(`
    SELECT * FROM org_data LIMIT 3
  `)
  console.log('org_data results:', orgQuery)
  
  // Check pages table  
  const pagesQuery = await xano.db.query(`
    SELECT * FROM pages LIMIT 3
  `)
  console.log('pages results:', pagesQuery)
  
  // Check page_sections table
  const sectionsQuery = await xano.db.query(`
    SELECT * FROM page_sections LIMIT 3
  `)
  console.log('page_sections results:', sectionsQuery)
  
  // Check design_settings table
  const designQuery = await xano.db.query(`
    SELECT * FROM design_settings LIMIT 3
  `)
  console.log('design_settings results:', designQuery)
  
  return response.json({
    success: true,
    tables: {
      org_data: orgQuery,
      pages: pagesQuery,
      page_sections: sectionsQuery,
      design_settings: designQuery
    }
  })
  
} catch (error) {
  console.error('Debug error:', error)
  return response.json({
    success: false,
    error: error.message,
    details: 'Check console logs for more details'
  })
}
