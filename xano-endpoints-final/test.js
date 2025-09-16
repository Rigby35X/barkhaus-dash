// GET /test - Simple test endpoint
return {
  success: true,
  message: "Xano endpoint working",
  timestamp: new Date().toISOString(),
  environment: {
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    openAIModel: process.env.OPENAI_MODEL || 'not-set'
  }
}
