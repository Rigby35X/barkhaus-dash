// POST /analytics/event - Log an analytics event
const { tenant_id, event_type, page_path, user_agent, referrer, timestamp, ip_address, duration, element } = request.body

if (!tenant_id || !event_type) {
  return {
    success: false,
    error: 'tenant_id and event_type are required'
  }
}

try {
  // Build event data JSON
  const eventData = {
    page_path: page_path || null,
    user_agent: user_agent || null,
    referrer: referrer || null,
    duration: duration || null,
    element: element || null
  }

  // Remove null values
  Object.keys(eventData).forEach(key => {
    if (eventData[key] === null) {
      delete eventData[key]
    }
  })

  // Insert analytics event
  const insertResult = await xano.db.query(`
    INSERT INTO analytics_events (
      tenant_id, 
      event_type, 
      event_data, 
      ip_address,
      created_at
    ) VALUES (?, ?, ?, ?, ?)
  `, [
    tenant_id,
    event_type,
    JSON.stringify(eventData),
    ip_address || 'unknown',
    timestamp || new Date().toISOString()
  ])

  return {
    success: true,
    event_id: insertResult.insertId
  }

} catch (error) {
  return {
    success: false,
    error: 'Failed to log analytics event',
    details: error.message
  }
}
