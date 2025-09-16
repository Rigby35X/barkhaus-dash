// POST /ai/copy - Generate content for empty sections
const { tenant_id } = request.body

if (!tenant_id) {
  return {
    success: false,
    error: 'tenant_id required'
  }
}

try {
  // 1. Get organization data
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
  
  // 2. Build brand brief
  const brandBrief = {
    name: org.organization_name || org.name || 'Animal Rescue',
    mission: 'Helping animals find loving homes',
    location: org.address || 'Location not specified',
    contact: {
      email: org.email || 'info@rescue.org',
      phone: org.phone || '(555) 123-4567',
      address: org.address || 'Address not provided'
    },
    ein: org.tax_id || '00-0000000'
  }
  
  // 3. Find empty sections
  const sectionsResults = await xano.db.query(`
    SELECT * FROM page_sections
    WHERE tenant_id = ? 
    AND (content_json IS NULL OR content_json = '{}' OR content_json = '')
    AND is_enabled = true
    ORDER BY sort_order
    LIMIT 10
  `, [tenant_id])
  
  if (!sectionsResults || sectionsResults.length === 0) {
    return {
      success: true,
      message: 'No empty sections found',
      updated_sections: []
    }
  }
  
  const updatedSections = []
  
  // 4. Generate content for each section
  for (const section of sectionsResults) {
    try {
      let sectionContent = {}
      
      // Generate content based on section type
      switch (section.section_name) {
        case 'hero':
          sectionContent = {
            type: 'hero',
            heading: `Welcome to ${brandBrief.name}`,
            subheading: `${brandBrief.mission}. Find your perfect companion today.`,
            primaryCta: {
              label: 'View Available Pets',
              href: '/pets'
            }
          }
          break
          
        case 'about':
          sectionContent = {
            type: 'about',
            heading: 'About Our Mission',
            body: `${brandBrief.name} is dedicated to ${brandBrief.mission.toLowerCase()}. We provide shelter, medical care, and love to abandoned animals while finding them perfect forever homes. Every animal deserves a second chance at happiness.`
          }
          break
          
        case 'contact':
          sectionContent = {
            type: 'contact',
            heading: 'Get In Touch',
            email: brandBrief.contact.email,
            phone: brandBrief.contact.phone,
            address: brandBrief.contact.address
          }
          break
          
        case 'footer':
          sectionContent = {
            type: 'footer',
            ein: brandBrief.ein,
            links: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' }
            ],
            socials: []
          }
          break
          
        case 'header':
          sectionContent = {
            type: 'header',
            links: [
              { label: 'Home', href: '/' },
              { label: 'Available Pets', href: '/pets' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' }
            ],
            showDonate: true
          }
          break
          
        case 'grid-animals':
          sectionContent = {
            type: 'grid-animals',
            heading: 'Available Pets',
            showFilters: true,
            maxItems: 12
          }
          break
          
        case 'value-props':
          sectionContent = {
            type: 'value-props',
            heading: 'Why Choose Us',
            items: [
              {
                title: 'Loving Care',
                description: 'Every animal receives individual attention and medical care'
              },
              {
                title: 'Perfect Matches',
                description: 'We help you find the perfect companion for your family'
              },
              {
                title: 'Ongoing Support',
                description: 'We provide support throughout the adoption process'
              }
            ]
          }
          break
          
        case 'testimonials':
          sectionContent = {
            type: 'testimonials',
            heading: 'Happy Families',
            items: [
              {
                quote: 'We found our perfect companion through this amazing rescue!',
                author: 'Sarah M.'
              },
              {
                quote: 'The staff was so helpful in finding the right pet for our family.',
                author: 'Mike D.'
              }
            ]
          }
          break
          
        case 'cta':
          sectionContent = {
            type: 'cta',
            heading: 'Ready to Adopt?',
            body: 'Browse our available pets and find your new best friend today.',
            cta: {
              label: 'View Available Pets',
              href: '/pets'
            }
          }
          break
          
        case 'faq':
          sectionContent = {
            type: 'faq',
            heading: 'Frequently Asked Questions',
            items: [
              {
                q: 'What is the adoption process?',
                a: 'Our adoption process includes an application, meet and greet, and home visit to ensure the best match.'
              },
              {
                q: 'What are the adoption fees?',
                a: 'Adoption fees vary by animal and help cover medical care, vaccinations, and spaying/neutering.'
              }
            ]
          }
          break
          
        default:
          continue // Skip unknown section types
      }
      
      // Update section in database
      await xano.db.query(`
        UPDATE page_sections 
        SET content_json = ?
        WHERE id = ?
      `, [JSON.stringify(sectionContent), section.id])
      
      updatedSections.push({
        id: section.id,
        section_name: section.section_name,
        data: sectionContent
      })
      
    } catch (sectionError) {
      // Continue with other sections if one fails
      continue
    }
  }
  
  return {
    success: true,
    updated_sections: updatedSections,
    total_processed: sectionsResults.length,
    total_updated: updatedSections.length
  }
  
} catch (error) {
  return {
    success: false,
    error: 'AI copy generation failed',
    details: error.message
  }
}
