// POST /ai/plan
// Generates site structure using AI

const { tenant_id } = request.body

if (!tenant_id) {
  return response.status(400).json({ error: 'tenant_id required' })
}

try {
  // 1. Fetch organization data
  const orgQuery = await xano.db.query(`
    SELECT * FROM org_data WHERE tenant_id = ? LIMIT 1
  `, [tenant_id])

  if (orgQuery.length === 0) {
    return response.status(404).json({ error: 'Organization not found' })
  }

  const org = orgQuery[0]

  // 2. Fetch site content for mission
  const contentQuery = await xano.db.query(`
    SELECT * FROM site_content WHERE tenant_id = ? LIMIT 1
  `, [tenant_id])

  const content = contentQuery[0] || {}

  // 3. Count available animals
  const animalCountQuery = await xano.db.query(`
    SELECT COUNT(*) as count FROM dogs
    WHERE tenant_id = ? AND status = 'Available'
  `, [tenant_id])

  const animalsCount = animalCountQuery[0]?.count || 0

  // 4. Build organization summary for AI
  const orgSummary = {
    name: org.organization_name || org.name,
    mission: content.mission_statement || 'Helping animals find loving homes',
    location: org.address || 'Location not specified',
    goals: ['Find homes for animals', 'Educate about pet care', 'Build community'],
    donateUrl: content.donation_link || '/donate'
  }
  
  // 4. Call OpenAI API
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
- The home page MUST include "grid-animals" if available_animal_count > 0.
- No prose, no markdown, no comments outside JSON.

ORGANIZATION BRIEF:
${JSON.stringify(orgSummary)}

Available Animals Count: ${animalsCount}

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
  
  if (!openaiResponse.ok) {
    throw new Error(`OpenAI API error: ${openaiResponse.status}`)
  }
  
  const aiResult = await openaiResponse.json()
  const content = aiResult.choices[0]?.message?.content
  
  if (!content) {
    throw new Error('No content returned from AI')
  }
  
  const planData = JSON.parse(content)
  
  // 5. Create pages and empty sections in database
  const createdPages = []

  for (const pageData of planData.pages) {
    // Insert page
    const pageInsert = await xano.db.query(`
      INSERT INTO pages (tenant_id, \`key\`, title, path, status, sort_order)
      VALUES (?, ?, ?, ?, 'draft', ?)
    `, [tenant_id, pageData.key, pageData.title, pageData.path, createdPages.length])

    const pageId = pageInsert.insertId

    // Insert empty sections
    for (let i = 0; i < pageData.sections.length; i++) {
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
  
  return response.json({
    success: true,
    plan: planData,
    created_pages: createdPages
  })
  
} catch (error) {
  console.error('AI Plan error:', error)
  return response.status(500).json({ 
    error: 'AI planning failed',
    details: error.message 
  })
}
