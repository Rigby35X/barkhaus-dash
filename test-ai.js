// Test script for AI functionality
// Run with: node test-ai.js

import OpenAI from 'openai'
import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simple AI call function
async function testAICall(prompt, schema) {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('No content returned')

    const parsed = JSON.parse(content)
    const validated = schema.parse(parsed)
    return validated
  } catch (error) {
    throw new Error(`AI call failed: ${error.message}`)
  }
}

// Test schemas
const TestSchema = z.object({
  message: z.string(),
  success: z.boolean(),
})

const HeroTestSchema = z.object({
  type: z.literal('hero'),
  heading: z.string(),
  subheading: z.string().optional(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
})

async function runTests() {
  console.log('🧪 Starting AI Tests...\n')

  // Test 1: Basic AI Connection
  console.log('Test 1: Basic AI Connection')
  try {
    const result = await testAICall(
      'Return a JSON object with a "message" field containing "Hello World" and a "success" field set to true.',
      TestSchema
    )
    console.log('✅ AI Connection: PASS')
    console.log('Result:', result)
  } catch (error) {
    console.log('❌ AI Connection: FAIL -', error.message)
  }
  console.log('')

  // Test 2: Hero Section Generation
  console.log('Test 2: Hero Section Generation')
  try {
    const heroPrompt = `You are a UX copywriter. Generate structured JSON for a "hero" section of an animal rescue website.
Tone: warm, trustworthy, action-oriented, 7–9th grade reading level.

BRAND BRIEF:
{"name": "Happy Paws Rescue", "mission": "Saving lives, one paw at a time", "location": "San Francisco, CA"}

Return JSON with:
- type: "hero"
- heading: string (max 90 chars)
- subheading: string (optional)
- primaryCta: object with label and href (optional)`

    const heroResult = await testAICall(heroPrompt, HeroTestSchema)
    console.log('✅ Hero Generation: PASS')
    console.log('Generated Hero:', JSON.stringify(heroResult, null, 2))
  } catch (error) {
    console.log('❌ Hero Generation: FAIL -', error.message)
  }
  console.log('')

  console.log('🧪 AI Tests Complete!')
}

// Check environment
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable not set')
  console.log('Please set your OpenAI API key:')
  console.log('export OPENAI_API_KEY="your-key-here"')
  process.exit(1)
}

if (!process.env.OPENAI_MODEL) {
  console.log('ℹ️ OPENAI_MODEL not set, using default: gpt-4o-mini')
  process.env.OPENAI_MODEL = 'gpt-4o-mini'
}

runTests().catch(console.error)
