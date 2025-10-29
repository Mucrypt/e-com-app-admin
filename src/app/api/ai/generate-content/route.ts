import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { readFileSync } from 'fs'

// Types for better error handling
interface AIGenerationRequest {
  prompt: string
  type?: 'description' | 'title' | 'tags' | 'summary'
  context?: string
}

interface AIGenerationResponse {
  content: string
  metadata?: {
    model: string
    tokens_used?: number
    generation_time_ms: number
  }
}

interface ErrorResponse {
  error: string
  code?: string
  details?: string
  trace_id?: string
}

// Enhanced function to securely read API key from file or environment
function getOpenAIApiKey(): string | null {
  try {
    // Try to read from Docker secret file first (production)
    if (process.env.OPENAI_API_KEY_FILE) {
      const key = readFileSync(process.env.OPENAI_API_KEY_FILE, 'utf8').trim()
      if (key && key.length > 0) {
        return key
      }
    }

    // Fallback to environment variable (development)
    const envKey = process.env.OPENAI_API_KEY
    return envKey && envKey.length > 0 ? envKey : null
  } catch (error) {
    console.warn(
      'Failed to read OpenAI API key from file, falling back to env var:',
      error
    )
    return process.env.OPENAI_API_KEY || null
  }
}

// Initialize OpenAI client with enhanced configuration
function getOpenAIClient(): OpenAI {
  const apiKey = getOpenAIApiKey()

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured')
  }

  return new OpenAI({
    apiKey: apiKey,
    timeout: 30000, // 30 second timeout
    maxRetries: 2,
  })
}

// Generate system prompt based on content type
function getSystemPrompt(type: string, context?: string): string {
  const basePrompt =
    'You are a professional e-commerce content assistant. Generate high-quality, engaging content that drives sales and provides value to customers.'

  const typePrompts = {
    description:
      'Generate compelling product descriptions that highlight key features, benefits, and use cases. Focus on what makes the product unique and valuable to customers.',
    title:
      'Create catchy, SEO-friendly product titles that are descriptive yet concise. Include key features or benefits that would attract buyers.',
    tags: 'Generate relevant product tags and keywords for SEO and categorization. Include both specific and general terms customers might search for.',
    summary:
      'Create brief, impactful product summaries that capture the essence and main selling points in just a few sentences.',
  }

  const specificPrompt =
    typePrompts[type as keyof typeof typePrompts] || typePrompts.description
  const contextPrompt = context ? `\n\nAdditional context: ${context}` : ''

  return `${basePrompt}\n\n${specificPrompt}${contextPrompt}`
}

// Main POST handler for AI content generation
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const traceId = `ai-gen-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`

  try {
    // Validate API key availability
    const apiKey = getOpenAIApiKey()
    if (!apiKey) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'OpenAI API key is not configured',
          code: 'MISSING_API_KEY',
          trace_id: traceId,
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    let body: AIGenerationRequest
    try {
      body = await request.json()
    } catch (err) {
      console.warn(`[${traceId}] Invalid JSON in request body:`, err)
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
          trace_id: traceId,
        },
        { status: 400 }
      )
    }

    const { prompt, type = 'description', context } = body

    // Validate required fields
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Prompt is required and cannot be empty',
          code: 'MISSING_PROMPT',
          trace_id: traceId,
        },
        { status: 400 }
      )
    }

    // Validate prompt length (reasonable limits)
    if (prompt.length > 2000) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Prompt is too long (max 2000 characters)',
          code: 'PROMPT_TOO_LONG',
          trace_id: traceId,
        },
        { status: 400 }
      )
    }

    // Initialize OpenAI client
    const openai = getOpenAIClient()
    const model = process.env.AI_MODEL || 'gpt-3.5-turbo'

    // Configure generation parameters based on type
    const maxTokens =
      {
        title: 50,
        tags: 100,
        summary: 150,
        description: 250,
      }[type] || 200

    // Generate content with OpenAI
    console.log(`[${traceId}] Generating ${type} content with model ${model}`)

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(type, context),
        },
        {
          role: 'user',
          content: prompt.trim(),
        },
      ],
      max_tokens: maxTokens,
      temperature: type === 'title' ? 0.8 : 0.7, // Slightly higher creativity for titles
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const content = completion.choices[0]?.message?.content?.trim()

    if (!content) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Failed to generate content - empty response from AI',
          code: 'EMPTY_AI_RESPONSE',
          trace_id: traceId,
        },
        { status: 500 }
      )
    }

    const generationTime = Date.now() - startTime
    console.log(
      `[${traceId}] Content generated successfully in ${generationTime}ms`
    )

    // Return successful response with metadata
    return NextResponse.json<AIGenerationResponse>({
      content,
      metadata: {
        model: model,
        tokens_used: completion.usage?.total_tokens,
        generation_time_ms: generationTime,
      },
    })
  } catch (error: unknown) {
    const generationTime = Date.now() - startTime
    console.error(
      `[${traceId}] AI content generation error (${generationTime}ms):`,
      error
    )

    // Handle different types of errors
    let errorMessage = 'Failed to generate content'
    let errorCode = 'GENERATION_ERROR'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Handle specific OpenAI errors
      if (error.message.includes('API key')) {
        errorCode = 'INVALID_API_KEY'
        statusCode = 401
      } else if (error.message.includes('rate limit')) {
        errorCode = 'RATE_LIMIT_EXCEEDED'
        statusCode = 429
      } else if (error.message.includes('timeout')) {
        errorCode = 'REQUEST_TIMEOUT'
        statusCode = 408
      }
    }

    return NextResponse.json<ErrorResponse>(
      {
        error: errorMessage,
        code: errorCode,
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.stack
            : undefined,
        trace_id: traceId,
      },
      { status: statusCode }
    )
  }
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
  try {
    const hasApiKey = !!getOpenAIApiKey()
    const model = process.env.AI_MODEL || 'gpt-3.5-turbo'

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      openai_configured: hasApiKey,
      model: model,
      supported_types: ['description', 'title', 'tags', 'summary'],
      limits: {
        max_prompt_length: 2000,
        timeout_seconds: 30,
      },
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
