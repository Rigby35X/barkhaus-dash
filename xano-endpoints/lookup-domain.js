// GET /lookup-domain?host=
// Maps custom domain to organization subdomain

const host = request.query.host

if (!host) {
  return response.status(400).json({ error: 'Host parameter required' })
}

try {
  // Look up domain mapping in org_data
  const domainQuery = await xano.db.query(`
    SELECT subdomain
    FROM org_data
    WHERE custom_domain = ? AND is_active = true
    LIMIT 1
  `, [host])

  if (domainQuery.length === 0) {
    return response.status(404).json({ error: 'Domain not found' })
  }

  return response.json({
    slug: domainQuery[0].subdomain
  })

} catch (error) {
  console.error('Domain lookup error:', error)
  return response.status(500).json({
    error: 'Internal server error',
    details: error.message
  })
}
