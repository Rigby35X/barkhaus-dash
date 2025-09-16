// POST /publish-site - Publish or unpublish all pages for a tenant
const { tenant_id, status } = request.body

if (!tenant_id || !status) {
  return {
    success: false,
    error: 'tenant_id and status are required'
  }
}

if (!['published', 'draft'].includes(status)) {
  return {
    success: false,
    error: 'status must be "published" or "draft"'
  }
}

try {
  // Update all pages for this tenant
  const updateResult = await xano.db.query(`
    UPDATE pages 
    SET status = ?
    WHERE tenant_id = ?
  `, [status, tenant_id])

  // Update organization active status
  await xano.db.query(`
    UPDATE organizations 
    SET is_active = ?
    WHERE tenant_id = ?
  `, [status === 'published', tenant_id])

  return {
    success: true,
    message: `Site ${status} successfully`,
    pages_updated: updateResult.affectedRows || 0,
    status: status
  }

} catch (error) {
  return {
    success: false,
    error: 'Failed to update site status',
    details: error.message
  }
}
