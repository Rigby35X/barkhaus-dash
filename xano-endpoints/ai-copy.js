// POST /ai/copy
// Generates content for empty sections using AI

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

  // 2. Fetch site content
  const contentQuery = await xano.db.query(`
    SELECT * FROM site_content WHERE tenant_id = ? LIMIT 1
  `, [tenant_id])

  const content = contentQuery[0] || {}

  // 3. Build brand brief for AI
  const brandBrief = {
    name: org.organization_name || org.name,
    mission: content.mission_statement || 'Helping animals find loving homes',
    location: org.address || 'Location not specified',
    contact: {
      email: content.email || org.email || 'info@example.org',
      phone: content.phone || org.phone || '(555) 123-4567',
      address: content.address_line1 || org.address || 'Address not provided'
    },
    ein: org.tax_id || '00-0000000'
  }

  // 4. Find empty sections (content_json is empty or null)
  const emptySectionsQuery = await xano.db.query(`
    SELECT * FROM page_sections
    WHERE tenant_id = ?
    AND (content_json IS NULL OR content_json = '{}' OR content_json = '')
    AND is_enabled = true
    ORDER BY sort_order
  `, [tenant_id])
  
  if (emptySectionsQuery.length === 0) {
    return response.json({
      success: true,
      message: 'No empty sections found',
      updated_sections: []
    })
  }
  
  const updatedSections = []
  
  // 4. Generate content for each empty section
  for (const section of emptySectionsQuery) {
    try {
      // Get section-specific schema
      const sectionSchemas = {
        header: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["header"] },
            links: {
              type: "array",
              maxItems: 7,
              items: {
                type: "object",
                properties: {
                  label: { type: "string", maxLength: 30 },
                  href: { type: "string" }
                },
                required: ["label", "href"]
              }
            },
            showDonate: { type: "boolean" }
          },
          required: ["type", "links", "showDonate"]
        },
        hero: {
          type: "object", 
          properties: {
            type: { type: "string", enum: ["hero"] },
            heading: { type: "string", maxLength: 90 },
            subheading: { type: "string", maxLength: 180 },
            primaryCta: {
              type: "object",
              properties: {
                label: { type: "string", maxLength: 25 },
                href: { type: "string" }
              }
            }
          },
          required: ["type", "heading"]
        },
        about: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["about"] },
            heading: { type: "string", maxLength: 80 },
            body: { type: "string", maxLength: 600 }
          },
          required: ["type", "heading", "body"]
        },
        contact: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["contact"] },
            heading: { type: "string", maxLength: 80 },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            address: { type: "string" }
          },
          required: ["type", "heading", "email", "phone", "address"]
        },
        footer: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["footer"] },
            ein: { type: "string" },
            links: {
              type: "array",
              maxItems: 6,
              items: {
                type: "object",
                properties: {
                  label: { type: "string", maxLength: 30 },
                  href: { type: "string" }
                },
                required: ["label", "href"]
              }
            }
          },
          required: ["type", "ein", "links"]
        }
      }
      
      const schema = sectionSchemas[section.section_name]
      if (!schema) {
        console.log(`Skipping unknown section type: ${section.section_name}`)
        continue
      }
      
      // Call OpenAI for this section
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
            content: `You are a UX copywriter. Generate structured JSON for a "${section.section_name}" section of an animal rescue website.
Tone: warm, trustworthy, action-oriented, 7–9th grade reading level.
Do not include HTML tags.

BRAND BRIEF:
${JSON.stringify(brandBrief)}

JSON SCHEMA (return MUST match exactly):
${JSON.stringify(schema, null, 2)}`
          }],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      })
      
      if (!openaiResponse.ok) {
        console.error(`OpenAI API error for section ${section.id}: ${openaiResponse.status}`)
        continue
      }
      
      const aiResult = await openaiResponse.json()
      const content = aiResult.choices[0]?.message?.content
      
      if (!content) {
        console.error(`No content returned for section ${section.id}`)
        continue
      }
      
      const sectionData = JSON.parse(content)
      
      // Update section in database
      await xano.db.query(`
        UPDATE page_sections
        SET content_json = ?
        WHERE id = ?
      `, [JSON.stringify(sectionData), section.id])

      updatedSections.push({
        id: section.id,
        type: section.section_name,
        section_name: section.section_name,
        data: sectionData
      })
      
    } catch (sectionError) {
      console.error(`Error processing section ${section.id}:`, sectionError)
      // Continue with other sections
    }
  }
  
  return response.json({
    success: true,
    updated_sections: updatedSections,
    total_processed: emptySectionsQuery.length,
    total_updated: updatedSections.length
  })
  
} catch (error) {
  console.error('AI Copy error:', error)
  return response.status(500).json({ 
    error: 'AI copy generation failed',
    details: error.message 
  })
}
