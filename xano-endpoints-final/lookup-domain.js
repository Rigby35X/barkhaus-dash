// GET /lookup-domain?host=
// Maps custom domain to organization subdomain

const host = request.query.host

if (!host) {
  return {
    error: 'Host parameter required'
  }
}

try {
  const results = await xano.db.query(`
    SELECT subdomain 
    FROM organizations
    WHERE custom_domain = ? AND is_active = true
    LIMIT 1
  `, [host])
  
  if (!results || results.length === 0) {
    return {
      error: 'Domain not found',
      host: host
    }
  }
  
  return {
    slug: results[0].subdomain
  }
  
} catch (error) {
  return {
    error: 'Internal server error',
    details: error.message,
    host: host
  }
}
