// Simple debug endpoint - just return basic info
// Create this as GET /simple-debug in Xano

try {
  // Test basic response
  return response.json({
    success: true,
    message: "Debug endpoint working",
    timestamp: new Date().toISOString(),
    environment: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      openAIModel: process.env.OPENAI_MODEL || 'not-set'
    }
  })
  
} catch (error) {
  return response.json({
    success: false,
    error: error.message
  })
}
