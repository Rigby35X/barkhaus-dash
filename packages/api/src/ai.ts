import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface JsonSchemaCallOptions {
  schema: z.ZodSchema
  promptParts: string[]
  model?: string
  maxRetries?: number
}

export async function jsonSchemaCall<T>({
  schema,
  promptParts,
  model = process.env.OPENAI_MODEL || 'gpt-4o-mini',
  maxRetries = 2,
}: JsonSchemaCallOptions): Promise<T> {
  const prompt = promptParts.join('\n\n')
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 AI Call (attempt ${attempt + 1}/${maxRetries + 1}):`, {
        model,
        promptLength: prompt.length,
      })

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_object',
        },
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content returned from AI')
      }

      console.log('🤖 AI Response length:', content.length)

      // Parse JSON
      let parsed: unknown
      try {
        parsed = JSON.parse(content)
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError)
        if (attempt === maxRetries) {
          throw new Error(`Failed to parse JSON after ${maxRetries + 1} attempts: ${parseError}`)
        }
        // Add repair instruction for next attempt
        promptParts.push(
          `PREVIOUS ATTEMPT FAILED: Invalid JSON format. Error: ${parseError}. Please return valid JSON only.`
        )
        continue
      }

      // Validate against schema
      try {
        const validated = schema.parse(parsed)
        console.log('✅ AI Response validated successfully')
        return validated as T
      } catch (validationError) {
        console.error('❌ Schema Validation Error:', validationError)
        if (attempt === maxRetries) {
          throw new Error(`Schema validation failed after ${maxRetries + 1} attempts: ${validationError}`)
        }
        // Add repair instruction for next attempt
        promptParts.push(
          `PREVIOUS ATTEMPT FAILED: Schema validation error. Error: ${validationError}. Please fix the JSON structure to match the required schema exactly.`
        )
        continue
      }
    } catch (error) {
      console.error(`❌ AI Call Error (attempt ${attempt + 1}):`, error)
      if (attempt === maxRetries) {
        throw new Error(`AI call failed after ${maxRetries + 1} attempts: ${error}`)
      }
      // Add generic retry instruction
      promptParts.push(
        `PREVIOUS ATTEMPT FAILED: ${error}. Please try again with valid JSON.`
      )
    }
  }

  throw new Error('Unexpected error in AI call loop')
}

// Utility to convert Zod schema to JSON Schema for prompt inclusion
export function zodToJsonSchema(schema: z.ZodSchema): object {
  // This is a simplified version - you might want to use zod-to-json-schema library
  // For now, we'll create basic schemas manually in the prompts
  return {
    type: 'object',
    description: 'Generated from Zod schema',
  }
}

// Test function for development
export async function testAIConnection(): Promise<boolean> {
  try {
    const testSchema = z.object({
      message: z.string(),
      success: z.boolean(),
    })

    const result = await jsonSchemaCall({
      schema: testSchema,
      promptParts: [
        'Return a JSON object with a "message" field containing "Hello World" and a "success" field set to true.',
      ],
    })

    return result.success === true
  } catch (error) {
    console.error('❌ AI Test Failed:', error)
    return false
  }
}
