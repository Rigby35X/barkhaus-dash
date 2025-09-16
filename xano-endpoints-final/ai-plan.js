// POST /ai/plan - Generate site structure using AI
const { tenant_id } = request.body

if (!tenant_id) {
  return {
    success: false,
    error: 'tenant_id required'
  }
}

try {
  // 1. Fetch organization data
  const orgResults = await xano.db.query(`
    SELECT * FROM organizations WHERE tenant_id = ? LIMIT 1
  `, [tenant_id])
  
  if (!orgResults || orgResults.length === 0) {
    return {
      success: false,
      error: `No organization found for tenant_id: ${tenant_id}`
    }
  }
  
  const org = orgResults[0]
  
  // 2. Build organization summary for AI
  const orgSummary = {
    name: org.organization_name || org.name || 'Animal Rescue',
    mission: 'Helping animals find loving homes',
    location: org.address || 'Location not specified',
    goals: ['Find homes for animals', 'Educate about pet care', 'Build community'],
    donateUrl: '/donate'
  }
  
  // 3. Call OpenAI API
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `You are a website information architect. Return ONLY JSON matching this schema.

ORGANIZATION: ${JSON.stringify(orgSummary)}

Return JSON with this exact structure:
{
  "pages": [
    {
      "key": "home",
      "title": "Home", 
      "path": "/",
      "sections": ["header", "hero", "value-props", "grid-animals", "testimonials", "footer"]
    },
    {
      "key": "about",
      "title": "About Us",
      "path": "/about", 
      "sections": ["header", "hero", "about", "cta", "footer"]
    },
    {
      "key": "contact",
      "title": "Contact",
      "path": "/contact",
      "sections": ["header", "contact", "footer"]
    }
  ]
}

Use only these section types: header, hero, value-props, about, grid-animals, testimonials, cta, faq, contact, footer`
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  })
  
  if (!openaiResponse.ok) {
    return {
      success: false,
      error: `OpenAI API error: ${openaiResponse.status}`
    }
  }
  
  const aiResult = await openaiResponse.json()
  const content = aiResult.choices[0]?.message?.content
  
  if (!content) {
    return {
      success: false,
      error: 'No content returned from AI'
    }
  }
  
  const planData = JSON.parse(content)
  
  // 4. Create pages and sections in database
  const createdPages = []
  
  for (let pageIndex = 0; pageIndex < planData.pages.length; pageIndex++) {
    const pageData = planData.pages[pageIndex]
    
    // Insert page
    const pageResult = await xano.db.query(`
      INSERT INTO pages (tenant_id, \`key\`, title, path, status, sort_order)
      VALUES (?, ?, ?, ?, 'draft', ?)
    `, [tenant_id, pageData.key, pageData.title, pageData.path, pageIndex])
    
    const pageId = pageResult.insertId
    
    // Insert sections
    for (let sectionIndex = 0; sectionIndex < pageData.sections.length; sectionIndex++) {
      await xano.db.query(`
        INSERT INTO page_sections (tenant_id, section_name, sort_order, content_json, is_enabled)
        VALUES (?, ?, ?, '{}', true)
      `, [tenant_id, pageData.sections[sectionIndex], sectionIndex])
    }
    
    createdPages.push({
      id: pageId,
      ...pageData
    })
  }
  
  return {
    success: true,
    plan: planData,
    created_pages: createdPages,
    pages_created: createdPages.length,
    organization: org.organization_name || org.name
  }
  
} catch (error) {
  return {
    success: false,
    error: 'AI planning failed',
    details: error.message,
    tenant_id: tenant_id
  }
}
