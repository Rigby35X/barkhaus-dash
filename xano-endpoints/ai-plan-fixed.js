// POST /ai/plan - FIXED VERSION
// Generates site structure using AI

const { tenant_id } = request.body

if (!tenant_id) {
  return response.status(400).json({ error: 'tenant_id required' })
}

try {
  console.log('🤖 AI Plan starting for tenant_id:', tenant_id)
  
  // 1. Fetch organization data from 'organizations' table
  const orgQuery = await xano.db.query(`
    SELECT * FROM organizations WHERE tenant_id = ? LIMIT 1
  `, [tenant_id])
  
  console.log('Organization query result:', orgQuery)
  
  if (orgQuery.length === 0) {
    return response.status(404).json({ error: 'Organization not found for tenant_id: ' + tenant_id })
  }
  
  const org = orgQuery[0]
  console.log('Found organization:', org.organization_name || org.name)
  
  // 2. Build organization summary for AI
  const orgSummary = {
    name: org.organization_name || org.name,
    mission: 'Helping animals find loving homes',
    location: org.address || 'Location not specified',
    goals: ['Find homes for animals', 'Educate about pet care', 'Build community'],
    donateUrl: '/donate'
  }
  
  console.log('Organization summary for AI:', orgSummary)
  
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
        content: `You are a website information architect. Given the ORGANIZATION BRIEF, return ONLY JSON that matches the provided JSON Schema.

Rules:
- Pages must be for an animal rescue site.
- Use only these section types: ["header","hero","value-props","about","grid-animals","testimonials","cta","faq","contact","footer"].
- Max 6 sections per page.
- The home page MUST include "grid-animals".
- No prose, no markdown, no comments outside JSON.

ORGANIZATION BRIEF:
${JSON.stringify(orgSummary)}

JSON SCHEMA:
{
  "type": "object",
  "properties": {
    "pages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "key": {"type": "string"},
          "title": {"type": "string"},
          "path": {"type": "string"},
          "sections": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["header", "hero", "value-props", "about", "grid-animals", "testimonials", "cta", "faq", "contact", "footer"]
            }
          }
        },
        "required": ["key", "title", "path", "sections"],
        "additionalProperties": false
      }
    }
  },
  "required": ["pages"],
  "additionalProperties": false
}`
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  })
  
  console.log('OpenAI response status:', openaiResponse.status)
  
  if (!openaiResponse.ok) {
    throw new Error(`OpenAI API error: ${openaiResponse.status}`)
  }
  
  const aiResult = await openaiResponse.json()
  const content = aiResult.choices[0]?.message?.content
  
  if (!content) {
    throw new Error('No content returned from AI')
  }
  
  console.log('AI generated content length:', content.length)
  const planData = JSON.parse(content)
  console.log('AI plan data:', planData)
  
  // 4. Create pages and sections in database
  const createdPages = []
  
  for (const pageData of planData.pages) {
    console.log('Creating page:', pageData.title)
    
    // Insert page
    const pageInsert = await xano.db.query(`
      INSERT INTO pages (tenant_id, \`key\`, title, path, status, sort_order)
      VALUES (?, ?, ?, ?, 'draft', ?)
    `, [tenant_id, pageData.key, pageData.title, pageData.path, createdPages.length])
    
    const pageId = pageInsert.insertId
    console.log('Created page with ID:', pageId)
    
    // Insert empty sections
    for (let i = 0; i < pageData.sections.length; i++) {
      console.log('Creating section:', pageData.sections[i])
      await xano.db.query(`
        INSERT INTO page_sections (tenant_id, section_name, sort_order, content_json, is_enabled)
        VALUES (?, ?, ?, '{}', true)
      `, [tenant_id, pageData.sections[i], i])
    }
    
    createdPages.push({
      id: pageId,
      ...pageData
    })
  }
  
  console.log('✅ AI Plan completed successfully')
  
  return response.json({
    success: true,
    plan: planData,
    created_pages: createdPages,
    organization: org.organization_name || org.name
  })
  
} catch (error) {
  console.error('❌ AI Plan error:', error)
  return response.status(500).json({ 
    error: 'AI planning failed',
    details: error.message,
    tenant_id: tenant_id
  })
}
