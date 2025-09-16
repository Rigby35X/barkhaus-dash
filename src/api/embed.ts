// API endpoints for embed token management
import { signEmbedToken, verifyEmbedToken, type EmbedPayload } from '../lib/embedToken';

// Create embed token endpoint
export async function createEmbedTokenAPI(request: {
  org_id: string;
  tenant_id: string;
  filters?: EmbedPayload['filters'];
  ttl?: number;
}) {
  const { org_id, tenant_id, filters, ttl = 3600 } = request;

  if (!org_id || !tenant_id) {
    throw new Error('org_id and tenant_id are required');
  }

  // Limit TTL to max 24 hours for security
  const maxTTL = 24 * 60 * 60; // 24 hours
  const safeTTL = Math.min(Number(ttl) || 3600, maxTTL);

  try {
    const token = await signEmbedToken(
      { org_id, tenant_id, filters },
      safeTTL
    );

    return {
      success: true,
      token,
      expires_in: safeTTL,
      expires_at: new Date(Date.now() + safeTTL * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error creating embed token:', error);
    throw new Error('Failed to create embed token');
  }
}

// Verify embed token endpoint
export async function verifyEmbedTokenAPI(token: string) {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const payload = await verifyEmbedToken(token);
    return {
      success: true,
      payload
    };
  } catch (error) {
    console.error('Error verifying embed token:', error);
    throw new Error('Invalid or expired token');
  }
}

// Express-style route handlers for your existing API structure
export const embedRoutes = {
  // POST /api/embed/create-token
  createToken: async (req: any, res: any) => {
    try {
      const result = await createEmbedTokenAPI(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },

  // POST /api/embed/verify
  verify: async (req: any, res: any) => {
    try {
      const { token } = req.body;
      const result = await verifyEmbedTokenAPI(token);
      res.json(result);
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid token' 
      });
    }
  }
};

export default embedRoutes;
