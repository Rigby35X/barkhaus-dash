// POST /ai/all - Generate complete site structure and content
const { tenant_id } = request.body

if (!tenant_id) {
  return {
    success: false,
    error: 'tenant_id required'
  }
}

try {
  // Step 1: Generate plan
  const planResponse = await fetch(`${request.protocol}://${request.get('host')}/api/ai/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.get('Authorization')
    },
    body: JSON.stringify({ tenant_id })
  })
  
  const planResult = await planResponse.json()
  
  if (!planResult.success) {
    return {
      success: false,
      error: 'Plan generation failed',
      details: planResult.error
    }
  }
  
  // Step 2: Generate copy
  const copyResponse = await fetch(`${request.protocol}://${request.get('host')}/api/ai/copy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.get('Authorization')
    },
    body: JSON.stringify({ tenant_id })
  })
  
  const copyResult = await copyResponse.json()
  
  if (!copyResult.success) {
    return {
      success: false,
      error: 'Copy generation failed',
      details: copyResult.error
    }
  }
  
  return {
    success: true,
    plan: planResult.plan,
    pages_created: planResult.pages_created,
    sections_processed: copyResult.total_processed,
    sections_updated: copyResult.total_updated,
    summary: {
      total_pages: planResult.pages_created,
      total_sections: copyResult.total_processed,
      success_rate: `${Math.round((copyResult.total_updated / copyResult.total_processed) * 100)}%`
    }
  }
  
} catch (error) {
  return {
    success: false,
    error: 'AI generation pipeline failed',
    details: error.message
  }
}
