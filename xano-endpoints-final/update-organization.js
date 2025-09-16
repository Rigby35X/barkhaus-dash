// POST /update-organization - Update organization settings
const { tenant_id, custom_domain, is_active } = request.body

if (!tenant_id) {
  return {
    success: false,
    error: 'tenant_id is required'
  }
}

try {
  // Build update query dynamically
  const updates = []
  const values = []

  if (custom_domain !== undefined) {
    updates.push('custom_domain = ?')
    values.push(custom_domain)
  }

  if (is_active !== undefined) {
    updates.push('is_active = ?')
    values.push(is_active)
  }

  if (updates.length === 0) {
    return {
      success: false,
      error: 'No fields to update'
    }
  }

  values.push(tenant_id)

  const updateResult = await xano.db.query(`
    UPDATE organizations 
    SET ${updates.join(', ')}
    WHERE tenant_id = ?
  `, values)

  if (updateResult.affectedRows === 0) {
    return {
      success: false,
      error: 'Organization not found'
    }
  }

  return {
    success: true,
    message: 'Organization updated successfully',
    updated_fields: updates.length
  }

} catch (error) {
  return {
    success: false,
    error: 'Failed to update organization',
    details: error.message
  }
}
