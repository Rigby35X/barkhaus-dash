// POST /ai/all
// Orchestrates plan then copy generation

const { tenant_id } = request.body

if (!tenant_id) {
  return response.status(400).json({ error: 'tenant_id required' })
}

try {
  // Step 1: Generate plan
  console.log('Step 1: Generating site plan...')
  
  const planResponse = await fetch(`${request.protocol}://${request.get('host')}/api/ai/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.get('Authorization') // Pass through auth
    },
    body: JSON.stringify({ tenant_id })
  })
  
  if (!planResponse.ok) {
    const planError = await planResponse.text()
    throw new Error(`Plan generation failed: ${planError}`)
  }
  
  const planResult = await planResponse.json()
  
  if (!planResult.success) {
    throw new Error(`Plan generation failed: ${planResult.error}`)
  }
  
  console.log(`Plan generated: ${planResult.created_pages.length} pages created`)
  
  // Step 2: Generate copy for all sections
  console.log('Step 2: Generating section copy...')
  
  const copyResponse = await fetch(`${request.protocol}://${request.get('host')}/api/ai/copy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.get('Authorization') // Pass through auth
    },
    body: JSON.stringify({ tenant_id })
  })
  
  if (!copyResponse.ok) {
    const copyError = await copyResponse.text()
    throw new Error(`Copy generation failed: ${copyError}`)
  }
  
  const copyResult = await copyResponse.json()
  
  if (!copyResult.success) {
    throw new Error(`Copy generation failed: ${copyResult.error}`)
  }
  
  console.log(`Copy generated: ${copyResult.total_updated}/${copyResult.total_processed} sections updated`)
  
  // Step 3: Check for any failures
  const failedSections = copyResult.total_processed - copyResult.total_updated
  
  if (failedSections > 0) {
    console.warn(`Warning: ${failedSections} sections failed to generate`)
  }
  
  // Step 4: Return comprehensive result
  return response.json({
    success: true,
    plan: planResult.plan,
    pages_created: planResult.created_pages.length,
    sections_processed: copyResult.total_processed,
    sections_updated: copyResult.total_updated,
    sections_failed: failedSections,
    updated_sections: copyResult.updated_sections,
    summary: {
      total_pages: planResult.created_pages.length,
      total_sections: copyResult.total_processed,
      success_rate: `${Math.round((copyResult.total_updated / copyResult.total_processed) * 100)}%`
    }
  })
  
} catch (error) {
  console.error('AI All error:', error)
  
  // Try to provide helpful error context
  let errorContext = 'Unknown error during AI generation'
  
  if (error.message.includes('Plan generation')) {
    errorContext = 'Failed during site planning phase'
  } else if (error.message.includes('Copy generation')) {
    errorContext = 'Failed during content generation phase'
  }
  
  return response.status(500).json({ 
    error: 'AI generation pipeline failed',
    context: errorContext,
    details: error.message 
  })
}
