// GET /analytics?tenant_id= - Get analytics data for a tenant
const tenant_id = request.query.tenant_id

if (!tenant_id) {
  return {
    error: 'tenant_id is required'
  }
}

try {
  // Get page views (last 30 days)
  const pageViewsResult = await xano.db.query(`
    SELECT COUNT(*) as count
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND event_type = 'page_view'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `, [tenant_id])

  // Get unique visitors (last 30 days)
  const uniqueVisitorsResult = await xano.db.query(`
    SELECT COUNT(DISTINCT ip_address) as count
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND event_type = 'page_view'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `, [tenant_id])

  // Get adoption inquiries (last 30 days)
  const adoptionInquiriesResult = await xano.db.query(`
    SELECT COUNT(*) as count
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND event_type = 'adoption_inquiry'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `, [tenant_id])

  // Get average session duration (last 30 days)
  const avgSessionResult = await xano.db.query(`
    SELECT AVG(CAST(JSON_EXTRACT(event_data, '$.duration') AS UNSIGNED)) as avg_duration
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND event_type = 'time_on_page'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `, [tenant_id])

  // Get top pages (last 30 days)
  const topPagesResult = await xano.db.query(`
    SELECT 
      JSON_EXTRACT(event_data, '$.page_path') as page_path,
      COUNT(*) as views
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND event_type = 'page_view'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  `, [tenant_id])

  // Get recent activity (last 7 days)
  const recentActivityResult = await xano.db.query(`
    SELECT 
      event_type,
      JSON_EXTRACT(event_data, '$.page_path') as page_path,
      created_at
    FROM analytics_events 
    WHERE tenant_id = ? 
    AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY created_at DESC
    LIMIT 20
  `, [tenant_id])

  return {
    page_views: pageViewsResult[0]?.count || 0,
    unique_visitors: uniqueVisitorsResult[0]?.count || 0,
    adoption_inquiries: adoptionInquiriesResult[0]?.count || 0,
    avg_session_duration: Math.round(avgSessionResult[0]?.avg_duration || 0),
    bounce_rate: 0, // Calculate if needed
    top_pages: topPagesResult || [],
    recent_activity: recentActivityResult || []
  }

} catch (error) {
  return {
    error: 'Failed to fetch analytics',
    details: error.message
  }
}
